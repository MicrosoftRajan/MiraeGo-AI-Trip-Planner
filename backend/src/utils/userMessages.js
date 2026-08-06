/**
 * User-facing copy — never leaks provider names, stack traces, or API payloads.
 */
export const USER_MESSAGES = Object.freeze({
  TRIP_GENERATION_FAILED:
    'We could not finish planning your trip right now. Please try again in a moment.',
  VALIDATION_FAILED:
    'Some trip details look incomplete. Please check the form and try again.',
  RATE_LIMITED:
    'We are getting a lot of requests. Please wait a few seconds and try again.',
  TIMEOUT:
    'Planning is taking longer than usual. Please try again.',
  NETWORK:
    'We could not reach our planning service. Please check your connection and try again.',
  INVALID_JSON:
    'We received an unexpected response while planning. Please try again.',
  SCHEMA_ERROR:
    'The itinerary came back incomplete. Please try generating again.',
  EMPTY_RESPONSE:
    'The planning service returned an empty response. Please try again.',
  NOT_FOUND: 'That page or endpoint was not found.',
  INTERNAL: 'Something went wrong on our side. Please try again shortly.',
})

/**
 * Maps internal error codes / HTTP status to a safe client message.
 * Technical details must stay server-side only.
 *
 * @param {{ code?: string, statusCode?: number, message?: string, isOperational?: boolean }} err
 * @returns {string}
 */
export function toUserMessage(err) {
  const code = err?.code || ''
  const status = err?.statusCode || 500

  if (code === 'VALIDATION_ERROR') {
    return USER_MESSAGES.VALIDATION_FAILED
  }

  if (
    code.includes('TIMEOUT') ||
    code === 'ETIMEDOUT' ||
    status === 504
  ) {
    return USER_MESSAGES.TIMEOUT
  }

  if (
    code.includes('RATE') ||
    code === 'RATE_LIMITED' ||
    status === 429
  ) {
    return USER_MESSAGES.RATE_LIMITED
  }

  if (
    code.includes('NETWORK') ||
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND'
  ) {
    return USER_MESSAGES.NETWORK
  }

  if (
    code === 'JSON_PARSE_ERROR' ||
    code === 'INVALID_MODEL_RESPONSE_TYPE' ||
    code.includes('JSON_PARSE')
  ) {
    return USER_MESSAGES.INVALID_JSON
  }

  if (code === 'TRIP_SCHEMA_INVALID' || code.includes('SCHEMA')) {
    return USER_MESSAGES.SCHEMA_ERROR
  }

  if (
    code.includes('EMPTY') ||
    code === 'EMPTY_MODEL_RESPONSE' ||
    code === 'EMPTY_RESPONSE'
  ) {
    return USER_MESSAGES.EMPTY_RESPONSE
  }

  if (status === 404 || code === 'NOT_FOUND') {
    return USER_MESSAGES.NOT_FOUND
  }

  if (status >= 400 && status < 500 && err?.isOperational) {
    // Client errors with operational flags (e.g. bad request) —
    // prefer a generic validation-style message, never raw err.message
    // unless it is already one of our curated USER_MESSAGES.
    const curated = Object.values(USER_MESSAGES)
    if (err.message && curated.includes(err.message)) {
      return err.message
    }
    return USER_MESSAGES.VALIDATION_FAILED
  }

  return USER_MESSAGES.TRIP_GENERATION_FAILED
}

/**
 * Whether an upstream failure is worth retrying (timeout, rate limit, parse/schema).
 * @param {unknown} err
 * @returns {boolean}
 */
export function isRetryableError(err) {
  if (!err || typeof err !== 'object') return true

  const code = /** @type {{ code?: string, statusCode?: number, name?: string }} */ (err)
    .code || ''
  const status =
    /** @type {{ statusCode?: number }} */ (err).statusCode || 0
  const name = /** @type {{ name?: string }} */ (err).name || ''

  if (name === 'AbortError' || code === 'ABORTED') return false
  if (code === 'VALIDATION_ERROR') return false
  if (code === 'MISSING_API_KEY' || code === 'SECONDARY_LLM_UNAVAILABLE') {
    return false
  }

  if (status === 400 || status === 401 || status === 403 || status === 404) {
    return false
  }

  // Retry timeouts, rate limits, network, empty/invalid JSON, schema drift
  if (
    status === 429 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    code.includes('TIMEOUT') ||
    code.includes('RATE') ||
    code.includes('NETWORK') ||
    code.includes('EMPTY') ||
    code.includes('JSON') ||
    code.includes('SCHEMA') ||
    code === 'TRIP_SCHEMA_INVALID' ||
    code === 'GEMINI_ERROR' ||
    code.endsWith('_ERROR')
  ) {
    return true
  }

  return status >= 500 || status === 0
}
