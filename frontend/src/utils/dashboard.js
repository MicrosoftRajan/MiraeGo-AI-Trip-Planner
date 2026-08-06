import { COUNTRIES, STYLE_BUDGET_MULT, CURRENCY_OPTIONS } from '../constants/dashboard'

/**
 * Match a free-text destination to a known country.
 * @param {string} query
 * @returns {typeof COUNTRIES[number] | null}
 */
export function matchCountry(query) {
  const q = (query || '').trim().toLowerCase()
  if (!q || q.length < 2) return null

  const exact = COUNTRIES.find(
    (c) =>
      c.name.toLowerCase() === q ||
      c.capital.toLowerCase() === q ||
      c.aliases.some((a) => a === q),
  )
  if (exact) return exact

  return (
    COUNTRIES.find(
      (c) =>
        c.name.toLowerCase().startsWith(q) ||
        c.capital.toLowerCase().startsWith(q) ||
        c.aliases.some((a) => a.startsWith(q) || q.startsWith(a)),
    ) ?? null
  )
}

/**
 * Suggest countries for autocomplete.
 * @param {string} query
 * @param {number} [limit=5]
 */
export function suggestCountries(query, limit = 5) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return COUNTRIES.slice(0, limit)

  return COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.capital.toLowerCase().includes(q) ||
      c.aliases.some((a) => a.includes(q)),
  ).slice(0, limit)
}

/**
 * Rough FX to INR for budget intelligence (approx).
 */
const TO_INR = {
  INR: 1,
  USD: 83,
  EUR: 90,
  GBP: 105,
  JPY: 0.55,
  KRW: 0.06,
  AED: 22.6,
  AUD: 54,
  CAD: 60,
  SGD: 62,
  THB: 2.3,
  CHF: 95,
}

/**
 * Analyze whether the budget fits the selected style & destination.
 * @returns {{
 *   status: 'idle' | 'ok' | 'warn',
 *   suggested: number,
 *   suggestedFormatted: string,
 *   message: string,
 *   symbol: string,
 * }}
 */
export function analyzeBudget({
  budgetAmount,
  currency = 'INR',
  style = 'comfort',
  days = 4,
  travelers = 2,
  country = null,
}) {
  const symbol =
    CURRENCY_OPTIONS.find((c) => c.code === currency)?.symbol ?? '₹'
  const amount = Number(String(budgetAmount).replace(/,/g, ''))

  if (!Number.isFinite(amount) || amount <= 0 || !days) {
    return {
      status: 'idle',
      suggested: 0,
      suggestedFormatted: '',
      message: '',
      symbol,
    }
  }

  const dailyInr = country?.avgCostPerDay ?? 10000
  const mult = STYLE_BUDGET_MULT[style] ?? 1
  const adults = Number(travelers) || 1
  const suggestedInr = Math.round(dailyInr * days * adults * mult)
  const fx = TO_INR[currency] ?? 1
  const suggested = Math.round(suggestedInr / fx / 100) * 100 || suggestedInr
  const suggestedFormatted = `${symbol}${suggested.toLocaleString('en-IN')}`

  // Soft threshold: warn if under ~75% of suggested for expensive styles
  const expensive = ['luxury', 'romantic', 'business'].includes(style)
  const ratio = amount / suggested

  if (expensive && ratio < 0.75) {
    return {
      status: 'warn',
      suggested,
      suggestedFormatted,
      message: `${TRAVEL_STYLE_LABEL(style)} travel may require approximately ${suggestedFormatted} for this destination.`,
      symbol,
    }
  }

  if (ratio < 0.55) {
    return {
      status: 'warn',
      suggested,
      suggestedFormatted,
      message: `Your budget may be tight — we recommend around ${suggestedFormatted} for a comfortable trip.`,
      symbol,
    }
  }

  return {
    status: 'ok',
    suggested,
    suggestedFormatted,
    message: 'Your budget looks perfect for this trip.',
    symbol,
  }
}

function TRAVEL_STYLE_LABEL(style) {
  const map = {
    budget: 'Budget',
    backpacker: 'Backpacker',
    comfort: 'Comfort',
    luxury: 'Luxury',
    adventure: 'Adventure',
    business: 'Business',
    family: 'Family',
    romantic: 'Romantic',
    solo: 'Solo',
  }
  return map[style] ?? 'This'
}

export function formatCompact(n) {
  if (n >= 100000) return `${(n / 100000).toFixed(n >= 1000000 ? 1 : 1)}L`.replace('.0L', 'L')
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`
  return String(n)
}
