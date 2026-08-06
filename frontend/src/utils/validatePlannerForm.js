import {
  INTEREST_API_MAP,
  TRAVEL_STYLES,
  CURRENCY_OPTIONS,
} from '../constants/dashboard'

/**
 * Validate dashboard planner form and normalize for the trip API.
 * @returns {{ ok: true, data: object } | { ok: false, errors: Record<string, string> }}
 */
export function validatePlannerForm(form) {
  const errors = {}

  const destination =
    typeof form.destination === 'string' ? form.destination.trim() : ''
  if (!destination) {
    errors.destination = 'Where are we going?'
  } else if (destination.length > 120) {
    errors.destination = 'Keep destination under 120 characters'
  }

  const days = Number(form.days)
  if (!Number.isInteger(days) || days < 1 || days > 30) {
    errors.days = 'Choose between 1 and 30 days'
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
  if (!CURRENCY_OPTIONS.some((c) => c.code === currency)) {
    errors.currency = 'Select a currency'
  }

  const styleMeta = TRAVEL_STYLES.find((s) => s.value === form.style)
  if (!styleMeta) {
    errors.style = 'Select a travel style'
  }

  const interests = Array.isArray(form.interests) ? form.interests : []
  if (interests.length === 0) {
    errors.interests = 'Pick at least one interest'
  }

  const adults = Math.max(0, Number(form.adults) || 0)
  const children = Math.max(0, Number(form.children) || 0)
  const infants = Math.max(0, Number(form.infants) || 0)
  const travelers = adults + children
  if (travelers < 1 || travelers > 12) {
    errors.travelers = 'Add between 1 and 12 travelers (adults + children)'
  }

  const description =
    typeof form.description === 'string' ? form.description.trim() : ''
  if (description.length > 2000) {
    errors.description = 'Keep your trip description under 2000 characters'
  }

  if (Object.keys(errors).length) {
    return { ok: false, errors }
  }

  const apiInterests = [
    ...new Set(
      interests
        .map((i) => INTEREST_API_MAP[i])
        .filter(Boolean),
    ),
  ]
  if (apiInterests.length === 0) {
    apiInterests.push('Culture')
  }

  const currencyMeta = CURRENCY_OPTIONS.find((c) => c.code === currency)
  const apiDays = Math.min(21, days)

  const promptParts = [
    description,
    `Total budget: ${currencyMeta?.symbol ?? ''}${budgetAmount.toLocaleString('en-US')} ${currency}.`,
    `Travel style: ${styleMeta.label}.`,
    interests.length ? `Interests: ${interests.join(', ')}.` : '',
    form.accommodation ? `Accommodation: ${form.accommodation}.` : '',
    form.transport ? `Transport: ${form.transport}.` : '',
    infants > 0 ? `Includes ${infants} infant(s).` : '',
    children > 0 ? `Includes ${children} child(ren).` : '',
    days > 21 ? `Requested ${days} days — plan condensed to ${apiDays}.` : '',
  ]

  return {
    ok: true,
    data: {
      destination,
      days: apiDays,
      budgetAmount,
      currency,
      style: styleMeta.api,
      interests: apiInterests,
      travelers: Math.min(12, travelers),
      prompt: promptParts.filter(Boolean).join(' '),
      meta: {
        uiStyle: styleMeta.value,
        interests,
        accommodation: form.accommodation,
        transport: form.transport,
        adults,
        children,
        infants,
        requestedDays: days,
        description,
      },
    },
  }
}
