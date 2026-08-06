import { env } from '../config/env.js'
import { toUserMessage, USER_MESSAGES } from '../utils/userMessages.js'

/**
 * Central error handler — keep last in the middleware chain.
 * Never exposes technical provider errors, stack traces, or raw API payloads
 * to clients. Details stay in server logs only.
 */
export function errorHandler(err, _req, res, _next) {
  const statusCode = normalizeStatus(err.statusCode)
  const isOperational = Boolean(err.isOperational)

  // Always log server-side with full context
  if (!isOperational || statusCode >= 500) {
    console.error('[error]', {
      message: err.message,
      code: err.code,
      statusCode,
      details: err.details,
      stack: err.stack,
    })
  } else if (env.nodeEnv === 'development') {
    console.warn('[error:client]', err.message, err.code || '', err.details || '')
  }

  const payload = {
    error: {
      message: toUserMessage(err),
      code: publicCode(err, statusCode, isOperational),
    },
  }

  // Field-level validation hints are safe and useful for forms.
  // Never forward LLM / network / provider payloads.
  if (err.code === 'VALIDATION_ERROR' && Array.isArray(err.details)) {
    payload.error.details = err.details
  }

  res.status(statusCode).json(payload)
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      message: USER_MESSAGES.NOT_FOUND,
      code: 'NOT_FOUND',
    },
  })
}

/**
 * @param {unknown} statusCode
 * @returns {number}
 */
function normalizeStatus(statusCode) {
  const code = Number(statusCode)
  if (!Number.isInteger(code) || code < 400 || code > 599) return 500
  return code
}

/**
 * @param {{ code?: string }} err
 * @param {number} statusCode
 * @param {boolean} isOperational
 * @returns {string}
 */
function publicCode(err, statusCode, isOperational) {
  if (err.code === 'VALIDATION_ERROR') return 'VALIDATION_ERROR'
  if (err.code === 'NOT_FOUND') return 'NOT_FOUND'
  if (err.code === 'TRIP_UNAVAILABLE') return 'TRIP_UNAVAILABLE'
  if (statusCode === 429 || err.code === 'RATE_LIMITED') return 'RATE_LIMITED'
  if (statusCode === 504 || String(err.code || '').includes('TIMEOUT')) {
    return 'TIMEOUT'
  }
  if (
    err.code === 'JSON_PARSE_ERROR' ||
    err.code === 'INVALID_MODEL_RESPONSE_TYPE'
  ) {
    return 'INVALID_JSON'
  }
  if (err.code === 'TRIP_SCHEMA_INVALID') return 'SCHEMA_ERROR'
  if (
    String(err.code || '').includes('EMPTY') ||
    err.code === 'EMPTY_MODEL_RESPONSE'
  ) {
    return 'EMPTY_RESPONSE'
  }
  if (String(err.code || '').includes('NETWORK')) return 'NETWORK'
  if (isOperational && statusCode >= 400 && statusCode < 500) {
    return err.code || 'APP_ERROR'
  }
  // Collapse remaining upstream / internal failures into a single public code
  return 'TRIP_UNAVAILABLE'
}
