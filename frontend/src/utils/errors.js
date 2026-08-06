/**
 * Shared API / trip-generation error codes and user-facing copy.
 * Keep messages friendly — never leak provider or stack details.
 */

export const ERROR_CODES = Object.freeze({
  NETWORK: 'NETWORK',
  TIMEOUT: 'TIMEOUT',
  INVALID_JSON: 'INVALID_JSON',
  SCHEMA_ERROR: 'SCHEMA_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  ABORTED: 'ABORTED',
  EMPTY_RESPONSE: 'EMPTY_RESPONSE',
  TRIP_UNAVAILABLE: 'TRIP_UNAVAILABLE',
  NOT_FOUND: 'NOT_FOUND',
  UNKNOWN: 'UNKNOWN',
})

export const ERROR_MESSAGES = Object.freeze({
  [ERROR_CODES.NETWORK]:
    'We could not reach our planning service. Please check your connection and try again.',
  [ERROR_CODES.TIMEOUT]:
    'Planning is taking longer than usual. Please try again.',
  [ERROR_CODES.INVALID_JSON]:
    'We received an unexpected response while planning. Please try again.',
  [ERROR_CODES.SCHEMA_ERROR]:
    'The itinerary came back incomplete. Please try generating again.',
  [ERROR_CODES.VALIDATION_ERROR]:
    'Some trip details look incomplete. Please check the form and try again.',
  [ERROR_CODES.RATE_LIMITED]:
    'We are getting a lot of requests. Please wait a few seconds and try again.',
  [ERROR_CODES.ABORTED]: 'Trip planning was cancelled.',
  [ERROR_CODES.EMPTY_RESPONSE]:
    'The planning service returned an empty response. Please try again.',
  [ERROR_CODES.TRIP_UNAVAILABLE]:
    'We could not finish planning your trip right now. Please try again in a moment.',
  [ERROR_CODES.NOT_FOUND]: 'That page or endpoint was not found.',
  [ERROR_CODES.UNKNOWN]: 'Something went wrong. Please try again.',
})

/** Short titles for banners / empty states. */
export const ERROR_TITLES = Object.freeze({
  [ERROR_CODES.NETWORK]: 'Connection problem',
  [ERROR_CODES.TIMEOUT]: 'Request timed out',
  [ERROR_CODES.INVALID_JSON]: 'Unexpected response',
  [ERROR_CODES.SCHEMA_ERROR]: 'Incomplete itinerary',
  [ERROR_CODES.VALIDATION_ERROR]: 'Check your details',
  [ERROR_CODES.RATE_LIMITED]: 'Too many requests',
  [ERROR_CODES.ABORTED]: 'Cancelled',
  [ERROR_CODES.EMPTY_RESPONSE]: 'Empty response',
  [ERROR_CODES.TRIP_UNAVAILABLE]: 'Planning unavailable',
  [ERROR_CODES.NOT_FOUND]: 'Not found',
  [ERROR_CODES.UNKNOWN]: 'Something went wrong',
})

const RETRYABLE = new Set([
  ERROR_CODES.NETWORK,
  ERROR_CODES.TIMEOUT,
  ERROR_CODES.INVALID_JSON,
  ERROR_CODES.SCHEMA_ERROR,
  ERROR_CODES.RATE_LIMITED,
  ERROR_CODES.EMPTY_RESPONSE,
  ERROR_CODES.TRIP_UNAVAILABLE,
  ERROR_CODES.UNKNOWN,
])

/**
 * Operational API error with stable code + retry hint for UI.
 */
export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {{
   *   code?: string,
   *   status?: number,
   *   details?: unknown,
   *   retryable?: boolean,
   *   cause?: unknown,
   * }} [options]
   */
  constructor(message, options = {}) {
    super(message, options.cause != null ? { cause: options.cause } : undefined)
    this.name = 'ApiError'
    this.code = options.code || ERROR_CODES.UNKNOWN
    this.status = options.status
    this.details = options.details
    this.retryable =
      options.retryable ?? RETRYABLE.has(this.code)
  }

  /** @returns {boolean} */
  get isAborted() {
    return this.code === ERROR_CODES.ABORTED
  }

  /** @returns {{ message: string, code: string, details?: unknown, retryable: boolean, status?: number }} */
  toJSON() {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
      retryable: this.retryable,
      status: this.status,
    }
  }

  static network(cause) {
    return new ApiError(ERROR_MESSAGES[ERROR_CODES.NETWORK], {
      code: ERROR_CODES.NETWORK,
      status: 0,
      cause,
      retryable: true,
    })
  }

  static timeout(timeoutMs) {
    return new ApiError(ERROR_MESSAGES[ERROR_CODES.TIMEOUT], {
      code: ERROR_CODES.TIMEOUT,
      status: 504,
      details: timeoutMs != null ? { timeoutMs } : undefined,
      retryable: true,
    })
  }

  static aborted() {
    return new ApiError(ERROR_MESSAGES[ERROR_CODES.ABORTED], {
      code: ERROR_CODES.ABORTED,
      status: 499,
      retryable: false,
    })
  }

  static invalidJson(cause) {
    return new ApiError(ERROR_MESSAGES[ERROR_CODES.INVALID_JSON], {
      code: ERROR_CODES.INVALID_JSON,
      status: 502,
      cause,
      retryable: true,
    })
  }

  static emptyResponse() {
    return new ApiError(ERROR_MESSAGES[ERROR_CODES.EMPTY_RESPONSE], {
      code: ERROR_CODES.EMPTY_RESPONSE,
      status: 502,
      retryable: true,
    })
  }

  static schema(details) {
    return new ApiError(ERROR_MESSAGES[ERROR_CODES.SCHEMA_ERROR], {
      code: ERROR_CODES.SCHEMA_ERROR,
      status: 502,
      details,
      retryable: true,
    })
  }

  static rateLimited(details) {
    return new ApiError(ERROR_MESSAGES[ERROR_CODES.RATE_LIMITED], {
      code: ERROR_CODES.RATE_LIMITED,
      status: 429,
      details,
      retryable: true,
    })
  }
}

/**
 * Maps backend `{ error: { message, code, details } }` + HTTP status → ApiError.
 * @param {{ message?: string, code?: string, details?: unknown } | null | undefined} body
 * @param {number} status
 * @returns {ApiError}
 */
export function fromApiErrorBody(body, status) {
  const rawCode = typeof body?.code === 'string' ? body.code : ''
  const code = mapServerCode(rawCode, status)
  const curated = ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN]
  const message =
    typeof body?.message === 'string' && body.message.trim()
      ? body.message.trim()
      : curated

  return new ApiError(message, {
    code,
    status,
    details: body?.details,
    retryable: RETRYABLE.has(code),
  })
}

/**
 * Normalizes unknown thrown values into ApiError.
 * @param {unknown} err
 * @returns {ApiError}
 */
export function toApiError(err) {
  if (err instanceof ApiError) return err

  if (err && typeof err === 'object' && 'name' in err && err.name === 'AbortError') {
    return ApiError.aborted()
  }

  if (err instanceof TypeError) {
    // fetch() typically throws TypeError on network failure
    return ApiError.network(err)
  }

  if (err instanceof Error) {
    return new ApiError(err.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN], {
      code: ERROR_CODES.UNKNOWN,
      cause: err,
      retryable: true,
    })
  }

  return new ApiError(ERROR_MESSAGES[ERROR_CODES.UNKNOWN], {
    code: ERROR_CODES.UNKNOWN,
    details: err,
    retryable: true,
  })
}

/**
 * @param {unknown} error
 * @returns {{ message: string, code: string, details?: unknown, retryable: boolean, status?: number } | null}
 */
export function normalizeErrorState(error) {
  if (error == null) return null
  if (typeof error === 'string') {
    return {
      message: error,
      code: ERROR_CODES.UNKNOWN,
      retryable: true,
    }
  }
  if (error instanceof ApiError) return error.toJSON()
  if (typeof error === 'object' && typeof error.message === 'string') {
    return {
      message: error.message,
      code: error.code || ERROR_CODES.UNKNOWN,
      details: error.details,
      retryable: error.retryable ?? RETRYABLE.has(error.code || ERROR_CODES.UNKNOWN),
      status: error.status,
    }
  }
  return {
    message: ERROR_MESSAGES[ERROR_CODES.UNKNOWN],
    code: ERROR_CODES.UNKNOWN,
    retryable: true,
  }
}

/**
 * @param {string} code
 * @param {number} status
 * @returns {string}
 */
function mapServerCode(code, status) {
  if (status === 429 || code === 'RATE_LIMITED' || code.includes('RATE')) {
    return ERROR_CODES.RATE_LIMITED
  }
  if (status === 504 || code.includes('TIMEOUT')) {
    return ERROR_CODES.TIMEOUT
  }
  if (code === 'VALIDATION_ERROR') {
    return ERROR_CODES.VALIDATION_ERROR
  }
  if (
    code === 'TRIP_SCHEMA_INVALID' ||
    code === 'SCHEMA_ERROR' ||
    code.includes('SCHEMA')
  ) {
    return ERROR_CODES.SCHEMA_ERROR
  }
  if (
    code === 'JSON_PARSE_ERROR' ||
    code === 'INVALID_JSON' ||
    code.includes('JSON_PARSE')
  ) {
    return ERROR_CODES.INVALID_JSON
  }
  if (
    code.includes('EMPTY') ||
    code === 'EMPTY_MODEL_RESPONSE' ||
    code === 'EMPTY_RESPONSE'
  ) {
    return ERROR_CODES.EMPTY_RESPONSE
  }
  if (code.includes('NETWORK') || code === 'ECONNREFUSED') {
    return ERROR_CODES.NETWORK
  }
  if (status === 404 || code === 'NOT_FOUND') {
    return ERROR_CODES.NOT_FOUND
  }
  if (code === 'TRIP_UNAVAILABLE') {
    return ERROR_CODES.TRIP_UNAVAILABLE
  }
  if (status >= 500) {
    return ERROR_CODES.TRIP_UNAVAILABLE
  }
  return ERROR_CODES.UNKNOWN
}
