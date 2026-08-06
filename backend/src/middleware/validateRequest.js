import { AppError } from '../utils/AppError.js'
import { USER_MESSAGES } from '../utils/userMessages.js'
import { validateTripRequest } from '../schemas/tripRequest.schema.js'

/**
 * Validates req.body with the given schema validator and attaches
 * the sanitized result to req.validated.
 * @param {(body: unknown) => { ok: true, data: object } | { ok: false, errors: string[] }} validator
 */
export function validateRequest(validator) {
  return (req, _res, next) => {
    const result = validator(req.body)

    if (!result.ok) {
      return next(
        new AppError(USER_MESSAGES.VALIDATION_FAILED, 400, {
          code: 'VALIDATION_ERROR',
          details: result.errors,
        }),
      )
    }

    req.validated = result.data
    return next()
  }
}

export const validateTripBody = validateRequest(validateTripRequest)
