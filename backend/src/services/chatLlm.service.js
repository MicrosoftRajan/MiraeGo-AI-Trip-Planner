import { env } from '../config/env.js'
import { AppError } from '../utils/AppError.js'

/**
 * OpenAI-compatible chat completions client.
 * Used for Groq and OpenRouter as the secondary cascade tier.
 *
 * @param {{
 *   messages: Array<{ role: string, content: string }>,
 *   model?: string,
 *   temperature?: number,
 *   timeoutMs?: number,
 *   responseFormat?: { type: string },
 * }} options
 * @returns {Promise<string>} Assistant message content
 */
export async function generateChatCompletion({
  messages,
  model,
  temperature = 0.7,
  timeoutMs,
  responseFormat,
} = {}) {
  const provider = resolveSecondaryProvider()
  if (!provider) {
    throw new AppError('No secondary LLM provider is configured', 500, {
      code: 'SECONDARY_LLM_UNAVAILABLE',
    })
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new AppError('Chat messages are required', 500, {
      code: 'CHAT_INVALID_REQUEST',
    })
  }

  const controller = new AbortController()
  const timer = setTimeout(
    () => controller.abort(),
    timeoutMs ?? provider.timeoutMs,
  )

  const body = {
    model: model || provider.model,
    messages,
    temperature,
  }
  if (responseFormat) body.response_format = responseFormat

  let response
  try {
    response = await fetch(provider.url, {
      method: 'POST',
      headers: provider.headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new AppError(
        `${provider.name} request timed out after ${timeoutMs ?? provider.timeoutMs}ms`,
        504,
        { code: `${provider.codePrefix}_TIMEOUT` },
      )
    }

    throw new AppError(`Failed to reach ${provider.name} API`, 502, {
      code: `${provider.codePrefix}_NETWORK_ERROR`,
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
      `${provider.name} error (${response.status})`

    const code =
      response.status === 429
        ? 'RATE_LIMITED'
        : `${provider.codePrefix}_ERROR`

    throw new AppError(message, response.status === 429 ? 429 : 502, {
      code,
      details: payload?.error || payload,
    })
  }

  const text = payload?.choices?.[0]?.message?.content
  if (typeof text !== 'string' || !text.trim()) {
    throw new AppError(`${provider.name} returned an empty response`, 502, {
      code: `${provider.codePrefix}_EMPTY_RESPONSE`,
      details: payload,
    })
  }

  return text
}

/**
 * @returns {boolean}
 */
export function isSecondaryLlmConfigured() {
  return Boolean(env.groqApiKey || env.openRouterApiKey)
}

/**
 * Prefer Groq when configured; otherwise OpenRouter.
 * @returns {{
 *   name: string,
 *   codePrefix: string,
 *   url: string,
 *   model: string,
 *   timeoutMs: number,
 *   headers: Record<string, string>,
 * } | null}
 */
function resolveSecondaryProvider() {
  if (env.groqApiKey) {
    return {
      name: 'Groq',
      codePrefix: 'GROQ',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      model: env.groqModel,
      timeoutMs: env.groqTimeoutMs,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.groqApiKey}`,
      },
    }
  }

  if (env.openRouterApiKey) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.openRouterApiKey}`,
    }
    if (env.openRouterSiteUrl) {
      headers['HTTP-Referer'] = env.openRouterSiteUrl
    }
    if (env.openRouterAppName) {
      headers['X-Title'] = env.openRouterAppName
    }

    return {
      name: 'OpenRouter',
      codePrefix: 'OPENROUTER',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      model: env.openRouterModel,
      timeoutMs: env.openRouterTimeoutMs,
      headers,
    }
  }

  return null
}
