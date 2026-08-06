import { AppError } from './AppError.js'

/**
 * Thrown when AI trip JSON fails the response schema.
 * Keeps invalid payloads out of the React client.
 */
export class ValidationError extends AppError {
  /**
   * @param {string} message
   * @param {string[] | Record<string, unknown>} [details]
   */
  constructor(message, details) {
    super(message, 502, {
      code: 'TRIP_SCHEMA_INVALID',
      details,
    })
    this.name = 'ValidationError'
  }
}
