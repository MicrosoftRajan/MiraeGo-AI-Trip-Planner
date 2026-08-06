export const THEME_STORAGE_KEY = 'gilora-theme'

/** @typedef {'light' | 'dark' | 'system'} ThemePreference */

/**
 * @returns {'light' | 'dark'}
 */
export function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * @param {ThemePreference} preference
 * @returns {'light' | 'dark'}
 */
export function resolveTheme(preference) {
  if (preference === 'system') return getSystemTheme()
  return preference
}

/**
 * @returns {ThemePreference}
 */
export function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch {
    /* private browsing / blocked storage */
  }
  return 'system'
}

/**
 * @param {'light' | 'dark'} resolved
 */
export function applyThemeClass(resolved) {
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
}
