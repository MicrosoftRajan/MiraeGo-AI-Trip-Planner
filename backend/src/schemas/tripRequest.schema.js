import { USER_CURRENCY_CODES } from '../constants/currencies.js'

const TRAVEL_STYLES = new Set(['budget', 'balanced', 'comfort', 'luxury'])
const INTEREST_OPTIONS = new Set([
  'Culture',
  'Food',
  'Nature',
  'Nightlife',
  'Adventure',
  'Relaxation',
])

/**
 * Validates POST /api/trip body.
 *
 * Contract (Feature 1):
 * - destination, days, travelers, style, interests
 * - budgetAmount + currency (traveler's planning budget in home currency)
 * - prompt optional traveler notes
 *
 * @param {unknown} body
 * @returns {{ ok: true, data: object } | { ok: false, errors: string[] }}
 */
export function validateTripRequest(body) {
  const errors = []

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, errors: ['Request body must be a JSON object'] }
  }

  const destination =
    typeof body.destination === 'string' ? body.destination.trim() : ''
  if (!destination) {
    errors.push('destination is required')
  } else if (destination.length > 120) {
    errors.push('destination must be 120 characters or fewer')
  }

  const days = Number(body.days)
  if (!Number.isInteger(days) || days < 1 || days > 21) {
    errors.push('days must be an integer between 1 and 21')
  }

  const travelers = Number(body.travelers)
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 12) {
    errors.push('travelers must be an integer between 1 and 12')
  }

  const style = typeof body.style === 'string' ? body.style.trim().toLowerCase() : ''
  if (!TRAVEL_STYLES.has(style)) {
    errors.push(`style must be one of: ${[...TRAVEL_STYLES].join(', ')}`)
  }

  const budgetAmount = Number(body.budgetAmount)
  if (!Number.isFinite(budgetAmount) || budgetAmount <= 0) {
    errors.push('budgetAmount must be a number greater than 0')
  } else if (budgetAmount > 100_000_000) {
    errors.push('budgetAmount is unrealistically large')
  }

  const currency =
    typeof body.currency === 'string' ? body.currency.trim().toUpperCase() : ''
  if (!USER_CURRENCY_CODES.has(currency)) {
    errors.push(
      `currency must be one of: ${[...USER_CURRENCY_CODES].sort().join(', ')}`,
    )
  }

  let interests = body.interests
  if (interests === undefined || interests === null) {
    interests = []
  }
  if (!Array.isArray(interests)) {
    errors.push('interests must be an array of strings')
  } else {
    const invalid = interests.filter(
      (item) => typeof item !== 'string' || !INTEREST_OPTIONS.has(item),
    )
    if (invalid.length) {
      errors.push(
        `interests must be from: ${[...INTEREST_OPTIONS].join(', ')}`,
      )
    }
  }

  const prompt =
    typeof body.prompt === 'string' ? body.prompt.trim() : ''
  if (prompt.length > 2000) {
    errors.push('prompt must be 2000 characters or fewer')
  }

  if (errors.length) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    data: {
      destination,
      days,
      travelers,
      style,
      budgetAmount,
      currency,
      interests: [...new Set(interests)],
      prompt,
    },
  }
}
