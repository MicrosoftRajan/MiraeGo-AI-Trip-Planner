import { env } from '../config/env.js'
import { getUserCurrency } from '../constants/currencies.js'
import { buildTripPrompt } from '../prompts/tripPrompt.js'
import { validateTripResponse } from '../schemas/tripResponse.schema.js'
import { AppError } from '../utils/AppError.js'
import { parseJsonFromText } from '../utils/jsonParser.js'
import { withRetry } from '../utils/retry.js'
import { isRetryableError, USER_MESSAGES } from '../utils/userMessages.js'
import {
  generateChatCompletion,
  isSecondaryLlmConfigured,
} from './chatLlm.service.js'
import { generateContent } from './gemini.service.js'
import { generateLocalTrip } from './localTrip.generator.js'

/**
 * Production cascade:
 *   Gemini → retry once (exponential backoff)
 *   → Groq / OpenRouter → retry once
 *   → Local trip generator
 *   → Always return schema-valid JSON
 *
 * Technical failures stay in server logs; clients get a trip or a friendly message.
 *
 * @param {{
 *   destination: string,
 *   days: number,
 *   travelers: number,
 *   style: string,
 *   budgetAmount: number,
 *   currency: string,
 *   interests: string[],
 *   prompt: string
 * }} input
 */
export async function createTrip(input) {
  const prompt = buildTripPrompt(input)
  const failures = []

  // Tier 1 — Gemini
  if (env.geminiApiKey) {
    const gemini = await runProviderTier({
      name: 'gemini',
      input,
      generateText: () => generateViaGemini(prompt),
    })
    if (gemini.ok) {
      logSource('gemini', gemini.attempts)
      return gemini.trip
    }
    failures.push(gemini.error)
  } else {
    console.warn('[trip] Gemini skipped — GEMINI_API_KEY not configured')
  }

  // Tier 2 — Groq (preferred) or OpenRouter
  if (isSecondaryLlmConfigured()) {
    const secondary = await runProviderTier({
      name: 'secondary-llm',
      input,
      generateText: () => generateViaSecondary(prompt),
    })
    if (secondary.ok) {
      logSource('secondary-llm', secondary.attempts)
      return secondary.trip
    }
    failures.push(secondary.error)
  } else {
    console.warn('[trip] Secondary LLM skipped — set GROQ_API_KEY or OPENROUTER_API_KEY')
  }

  // Tier 3 — Local deterministic generator (always valid)
  try {
    const local = validateTripResponse(generateLocalTrip(input))
    logSource('local', 1)
    if (failures.length) {
      console.warn(
        '[trip] Fell back to local generator after LLM failures:',
        failures.map(summarizeError).join(' | '),
      )
    }
    return local
  } catch (err) {
    // Should be unreachable — local output is schema-aligned by construction.
    console.error('[trip] Local generator failed unexpectedly', err)
    throw new AppError(USER_MESSAGES.TRIP_GENERATION_FAILED, 503, {
      code: 'TRIP_UNAVAILABLE',
    })
  }
}

/**
 * Runs generate → parse → enrich → validate, with one retry and exponential backoff.
 *
 * @param {{
 *   name: string,
 *   input: object,
 *   generateText: () => Promise<string>
 * }} provider
 * @returns {Promise<
 *   | { ok: true, trip: object, attempts: number }
 *   | { ok: false, error: unknown, attempts: number }
 * >}
 */
async function runProviderTier({ name, input, generateText }) {
  let attempts = 0

  try {
    const trip = await withRetry(
      async () => {
        attempts += 1
        const text = await generateText()
        const parsed = parseJsonFromText(text)
        return validateTripResponse(enrichTripFromRequest(parsed, input))
      },
      {
        retries: env.llmRetries,
        baseDelayMs: env.llmBackoffBaseMs,
        maxDelayMs: env.llmBackoffMaxMs,
        label: name,
        shouldRetry: isRetryableError,
        onRetry: (err, attempt, delayMs) => {
          console.warn(
            `[trip] ${name} attempt ${attempt + 1} failed (${summarizeError(err)}); retrying in ${delayMs}ms`,
          )
        },
      },
    )

    return { ok: true, trip, attempts }
  } catch (error) {
    console.warn(`[trip] ${name} exhausted retries:`, summarizeError(error))
    return { ok: false, error, attempts }
  }
}

/**
 * Injects request-owned fields the model may omit (userBudget).
 * Destination intel is merged later inside validateTripResponse.
 *
 * @param {unknown} parsed
 * @param {{ budgetAmount: number, currency: string }} input
 * @returns {unknown}
 */
function enrichTripFromRequest(parsed, input) {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return parsed
  }

  const currency = getUserCurrency(input.currency) || getUserCurrency('USD')
  const existing =
    parsed.userBudget && typeof parsed.userBudget === 'object'
      ? parsed.userBudget
      : {}

  return {
    ...parsed,
    userBudget: {
      amount:
        typeof existing.amount === 'number' && existing.amount > 0
          ? existing.amount
          : input.budgetAmount,
      currency: currency.code,
      currencySymbol: currency.symbol,
    },
  }
}

/**
 * @param {{ system: string, user: string }} prompt
 * @returns {Promise<string>}
 */
async function generateViaGemini(prompt) {
  const raw = await generateContent({
    systemInstruction: {
      parts: [{ text: prompt.system }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt.user }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json',
    },
  })

  return extractGeminiText(raw)
}

/**
 * @param {{ system: string, user: string }} prompt
 * @returns {Promise<string>}
 */
async function generateViaSecondary(prompt) {
  // Prompt already requires JSON-only output; omit response_format so both
  // Groq and OpenRouter models remain compatible.
  return generateChatCompletion({
    messages: [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ],
    temperature: 0.7,
  })
}

/**
 * @param {object} payload
 * @returns {string}
 */
function extractGeminiText(payload) {
  const text = payload?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join('\n')

  if (typeof text !== 'string' || !text.trim()) {
    throw new AppError('Gemini returned an empty response', 502, {
      code: 'GEMINI_EMPTY_RESPONSE',
      details: payload,
    })
  }

  return text
}

/**
 * @param {string} source
 * @param {number} attempts
 */
function logSource(source, attempts) {
  console.info(`[trip] source=${source} attempts=${attempts}`)
}

/**
 * Compact, log-safe error summary (never sent to clients).
 * @param {unknown} err
 * @returns {string}
 */
function summarizeError(err) {
  if (!err) return 'unknown'
  if (err instanceof Error) {
    const code = /** @type {{ code?: string }} */ (err).code
    return code ? `${err.name}:${code}` : `${err.name}:${err.message}`
  }
  return String(err)
}
