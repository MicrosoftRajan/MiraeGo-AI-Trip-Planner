/**
 * Currencies the traveler may plan in (home / budget currency).
 * Destination currency is resolved separately via destination intel.
 */
export const USER_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
]

export const USER_CURRENCY_CODES = new Set(USER_CURRENCIES.map((c) => c.code))

/**
 * @param {string} code
 * @returns {{ code: string, symbol: string, name: string } | undefined}
 */
export function getUserCurrency(code) {
  const normalized = String(code || '').trim().toUpperCase()
  return USER_CURRENCIES.find((c) => c.code === normalized)
}
