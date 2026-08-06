import {
  ApiError,
  ERROR_CODES,
  fromApiErrorBody,
  toApiError,
} from '../utils/errors'
import { withRetry } from '../utils/retry'

const DEFAULT_TIMEOUT_MS = 90_000
const DEFAULT_RETRIES = 1

/**
 * JSON fetch with timeout, abort, empty/invalid body checks, and retry.
 *
 * @param {string} url
 * @param {{
 *   method?: string,
 *   headers?: Record<string, string>,
 *   body?: unknown,
 *   signal?: AbortSignal,
 *   timeoutMs?: number,
 *   retries?: number,
 *   retryOn?: (err: ApiError) => boolean,
 *   onRetry?: (err: unknown, attempt: number, delayMs: number) => void,
 * }} [options]
 * @returns {Promise<unknown>}
 */
export async function fetchJson(url, options = {}) {
  const {
    method = 'GET',
    headers,
    body,
    signal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = DEFAULT_RETRIES,
    retryOn = defaultShouldRetry,
    onRetry,
  } = options

  return withRetry(
    () =>
      requestOnce(url, {
        method,
        headers,
        body,
        signal,
        timeoutMs,
      }),
    {
      retries,
      signal,
      shouldRetry: (err) => {
        const apiErr = toApiError(err)
        if (apiErr.isAborted) return false
        return retryOn(apiErr)
      },
      onRetry,
      baseDelayMs: 600,
      maxDelayMs: 8_000,
    },
  )
}

/**
 * @param {string} url
 * @param {{
 *   method: string,
 *   headers?: Record<string, string>,
 *   body?: unknown,
 *   signal?: AbortSignal,
 *   timeoutMs: number,
 * }} options
 * @returns {Promise<unknown>}
 */
async function requestOnce(url, { method, headers, body, signal, timeoutMs }) {
  if (signal?.aborted) {
    throw ApiError.aborted()
  }

  const controller = new AbortController()
  let timedOut = false

  const onExternalAbort = () => controller.abort()
  signal?.addEventListener('abort', onExternalAbort)

  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    const text = await readBodyText(response)

    if (!response.ok) {
      throw mapHttpError(response.status, text)
    }

    if (!text.trim()) {
      throw ApiError.emptyResponse()
    }

    let data
    try {
      data = JSON.parse(text)
    } catch (err) {
      throw ApiError.invalidJson(err)
    }

    if (data == null) {
      throw ApiError.emptyResponse()
    }

    return data
  } catch (err) {
    if (err instanceof ApiError) throw err

    if (signal?.aborted) {
      throw ApiError.aborted()
    }

    if (timedOut) {
      throw ApiError.timeout(timeoutMs)
    }

    if (err && typeof err === 'object' && err.name === 'AbortError') {
      // Race: external abort vs timeout — prefer external when flagged
      throw signal?.aborted ? ApiError.aborted() : ApiError.timeout(timeoutMs)
    }

    throw toApiError(err)
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onExternalAbort)
  }
}

/**
 * @param {Response} response
 * @returns {Promise<string>}
 */
async function readBodyText(response) {
  try {
    return await response.text()
  } catch (err) {
    if (err && typeof err === 'object' && err.name === 'AbortError') {
      throw err
    }
    throw ApiError.network(err)
  }
}

/**
 * @param {number} status
 * @param {string} text
 * @returns {ApiError}
 */
function mapHttpError(status, text) {
  let body = null

  if (text.trim()) {
    try {
      body = JSON.parse(text)
    } catch {
      // Non-JSON error bodies still map by status
    }
  }

  const errorPayload = body?.error && typeof body.error === 'object' ? body.error : body

  if (status === 429) {
    return ApiError.rateLimited(errorPayload?.details)
  }

  if (!text.trim()) {
    return fromApiErrorBody(
      { code: status === 504 ? ERROR_CODES.TIMEOUT : ERROR_CODES.EMPTY_RESPONSE },
      status,
    )
  }

  if (errorPayload && typeof errorPayload === 'object') {
    return fromApiErrorBody(errorPayload, status)
  }

  return fromApiErrorBody({ message: text.slice(0, 200) }, status)
}

/**
 * @param {ApiError} err
 * @returns {boolean}
 */
function defaultShouldRetry(err) {
  if (err.isAborted) return false
  if (err.code === ERROR_CODES.VALIDATION_ERROR) return false
  if (err.status != null && err.status >= 400 && err.status < 500 && err.status !== 429) {
    return false
  }
  return Boolean(err.retryable)
}
