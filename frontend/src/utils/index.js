export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function formatMoney(amount, currencySymbol = '¥') {
  return `${currencySymbol}${Number(amount).toLocaleString('en-US')}`
}

export {
  PERIODS,
  timeToMinutes,
  getPeriodForTime,
  groupStopsByPeriod,
  sumStopCosts,
} from './groupStopsByPeriod'

export {
  ApiError,
  ERROR_CODES,
  ERROR_MESSAGES,
  ERROR_TITLES,
  fromApiErrorBody,
  normalizeErrorState,
  toApiError,
} from './errors'

export { backoffDelay, sleep, withRetry } from './retry'

export {
  THEME_STORAGE_KEY,
  applyThemeClass,
  getSystemTheme,
  readStoredTheme,
  resolveTheme,
} from './theme'
