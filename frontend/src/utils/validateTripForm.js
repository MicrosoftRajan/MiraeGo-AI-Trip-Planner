import { CURRENCY_OPTIONS, INTEREST_OPTIONS, TRAVEL_STYLES } from '../constants'

const STYLE_VALUES = new Set(TRAVEL_STYLES.map((s) => s.value))
const CURRENCY_CODES = new Set(CURRENCY_OPTIONS.map((c) => c.code))
const INTEREST_SET = new Set(INTEREST_OPTIONS)

/**
 * Client-side validation for TripForm fields.
 * @returns {{ ok: true, data: object } | { ok: false, errors: Record<string, string> }}
 */
export function validateTripForm(form) {
  const errors = {}

  const destination =
    typeof form.destination === 'string' ? form.destination.trim() : ''
  if (!destination) {
    errors.destination = 'Destination is required'
  } else if (destination.length > 120) {
    errors.destination = 'Keep destination under 120 characters'
  }

  const days = Number(form.days)
  if (!Number.isInteger(days) || days < 1 || days > 21) {
    errors.days = 'Enter between 1 and 21 days'
  }

  const budgetAmount = Number(
    typeof form.budgetAmount === 'string'
      ? form.budgetAmount.replace(/,/g, '')
      : form.budgetAmount,
  )
  if (!Number.isFinite(budgetAmount) || budgetAmount <= 0) {
    errors.budgetAmount = 'Enter a budget greater than 0'
  } else if (budgetAmount > 100_000_000) {
    errors.budgetAmount = 'That budget looks too large'
  }

  const currency =
    typeof form.currency === 'string' ? form.currency.trim().toUpperCase() : ''
  if (!CURRENCY_CODES.has(currency)) {
    errors.currency = 'Select a currency'
  }

  const style =
    typeof form.style === 'string' ? form.style.trim().toLowerCase() : ''
  if (!STYLE_VALUES.has(style)) {
    errors.style = 'Select a travel style'
  }

  const interests = Array.isArray(form.interests) ? form.interests : []
  if (interests.length === 0) {
    errors.interests = 'Pick at least one interest'
  } else {
    const invalid = interests.some((item) => !INTEREST_SET.has(item))
    if (invalid) {
      errors.interests = 'Choose from the listed interests'
    }
  }

  const travelers = Number(form.travelers) || 2
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 12) {
    errors.travelers = 'Enter between 1 and 12 travelers'
  }

  if (Object.keys(errors).length) {
    return { ok: false, errors }
  }

  const currencyMeta = CURRENCY_OPTIONS.find((c) => c.code === currency)
  const styleLabel =
    TRAVEL_STYLES.find((s) => s.value === style)?.label ?? style

  return {
    ok: true,
    data: {
      destination,
      days,
      budgetAmount,
      currency,
      style,
      interests: [...new Set(interests)],
      travelers,
      prompt: [
        `Total budget: ${currencyMeta?.symbol ?? ''}${budgetAmount.toLocaleString('en-US')} ${currency}.`,
        `Travel style: ${styleLabel}.`,
        interests.length ? `Interests: ${interests.join(', ')}.` : '',
      ]
        .filter(Boolean)
        .join(' '),
    },
  }
}
