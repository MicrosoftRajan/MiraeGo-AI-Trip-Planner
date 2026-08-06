import { fetchJson } from './client'
import { apiUrl } from './config'
import { ApiError } from '../utils/errors'

/**
 * POST /api/trip — create a planned itinerary.
 *
 * @param {{
 *   destination: string,
 *   days: number,
 *   travelers: number,
 *   style: string,
 *   budgetAmount: number,
 *   currency: string,
 *   interests: string[],
 *   prompt: string,
 * }} payload
 * @param {{
 *   signal?: AbortSignal,
 *   timeoutMs?: number,
 *   retries?: number,
 *   onRetry?: (err: unknown, attempt: number, delayMs: number) => void,
 * }} [options]
 * @returns {Promise<object>} Validated trip object
 */
export async function createTrip(payload, options = {}) {
  const body = {
    destination: payload.destination,
    days: payload.days,
    travelers: payload.travelers,
    style: payload.style,
    budgetAmount: payload.budgetAmount,
    currency: payload.currency,
    interests: payload.interests,
    prompt: payload.prompt ?? '',
  }

  const data = await fetchJson(apiUrl('/api/trip'), {
    method: 'POST',
    body,
    signal: options.signal,
    timeoutMs: options.timeoutMs ?? 120_000,
    retries: options.retries ?? 1,
    onRetry: options.onRetry,
  })

  if (!data || typeof data !== 'object') {
    throw ApiError.emptyResponse()
  }

  const trip = /** @type {{ trip?: unknown }} */ (data).trip

  if (trip == null) {
    throw ApiError.emptyResponse()
  }

  if (typeof trip !== 'object' || Array.isArray(trip)) {
    throw ApiError.schema(['trip must be an object'])
  }

  if (!Array.isArray(/** @type {{ days?: unknown }} */ (trip).days)) {
    throw ApiError.schema(['trip.days must be an array'])
  }

  return trip
}
