import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  THEME_STORAGE_KEY,
  applyThemeClass,
  readStoredTheme,
  resolveTheme,
} from '../utils/theme'
import { applyAccessibilityPrefs, loadSettings } from '../utils/settingsPreferences'

export const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(readStoredTheme)

  const resolved = resolveTheme(preference)

  useEffect(() => {
    const settings = loadSettings()
    applyAccessibilityPrefs(settings)
  }, [])

  useEffect(() => {
    applyThemeClass(resolved)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, preference)
    } catch {
      /* ignore */
    }
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', resolved === 'dark' ? '#0b1217' : '#0e7c7b')
    }
  }, [preference, resolved])

  useEffect(() => {
    if (preference !== 'system') return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeClass(resolveTheme('system'))
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [preference])

  const toggleTheme = useCallback(() => {
    setPreference((prev) => {
      const current = resolveTheme(prev)
      return current === 'dark' ? 'light' : 'dark'
    })
  }, [])

  const value = useMemo(
    () => ({
      preference,
      theme: resolved,
      isDark: resolved === 'dark',
      setPreference,
      toggleTheme,
    }),
    [preference, resolved, toggleTheme],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}
