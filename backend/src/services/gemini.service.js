import { env } from '../config/env.js'
import { AppError } from '../utils/AppError.js'

/**
 * Low-level Gemini client.
 * Calls the generateContent API, handles timeout / HTTP errors,
 * and returns the raw JSON body — no content parsing.
 *
 * @param {{
 *   contents: Array,
 *   systemInstruction?: { parts: Array<{ text: string }> },
 *   generationConfig?: Record<string, unknown>,
 *   model?: string,
 *   timeoutMs?: number,
 * }} options
 * @returns {Promise<object>} Raw Gemini GenerateContentResponse
 */
export async function generateContent({
  contents,
  systemInstruction,
  generationConfig,
  model = env.geminiModel,
  timeoutMs = env.geminiTimeoutMs,
} = {}) {
  if (!env.geminiApiKey) {
    throw new AppError('GEMINI_API_KEY is not configured', 500, {
      code: 'MISSING_API_KEY',
    })
  }

  if (!Array.isArray(contents) || contents.length === 0) {
    throw new AppError('Gemini contents are required', 500, {
      code: 'GEMINI_INVALID_REQUEST',
    })
  }

  const url = new URL(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
  )
  url.searchParams.set('key', env.geminiApiKey)

  const body = { contents }
  if (systemInstruction) body.systemInstruction = systemInstruction
  if (generationConfig) body.generationConfig = generationConfig

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new AppError(`Gemini request timed out after ${timeoutMs}ms`, 504, {
        code: 'GEMINI_TIMEOUT',
      })
    }

    throw new AppError('Failed to reach Gemini API', 502, {
      code: 'GEMINI_NETWORK_ERROR',
      details: err instanceof Error ? err.message : undefined,
    })
  } finally {
    clearTimeout(timer)
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      payload?.error?.message ||
      payload?.message ||
      `Gemini error (${response.status})`

    const statusCode = response.status === 429 ? 429 : 502
    const code = response.status === 429 ? 'RATE_LIMITED' : 'GEMINI_ERROR'

    throw new AppError(message, statusCode, {
      code,
      details: payload?.error || payload,
    })
  }

  if (!payload || typeof payload !== 'object') {
    throw new AppError('Gemini returned an invalid response body', 502, {
      code: 'GEMINI_INVALID_RESPONSE',
    })
  }

  return payload
}
