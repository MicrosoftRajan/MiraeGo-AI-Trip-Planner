const STORAGE_KEY = 'gilora-settings'

export const DEFAULT_SETTINGS = {
  country: 'India',
  preferredCurrency: 'INR',
  preferredLanguage: 'en',
  travelStyle: 'comfort',
  tripReminders: true,
  emailNotifications: true,
  pushNotifications: false,
  defaultCurrency: 'INR',
  defaultBudget: '50000',
  reducedMotion: false,
  fontSize: 'medium',
  contrast: 'default',
  twoFactorEnabled: false,
}

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'ar', label: 'Arabic' },
  { value: 'zh', label: 'Chinese' },
]

export const COUNTRY_OPTIONS = [
  'Australia',
  'Canada',
  'Egypt',
  'France',
  'Germany',
  'India',
  'Indonesia',
  'Italy',
  'Japan',
  'Morocco',
  'Singapore',
  'South Korea',
  'Spain',
  'Switzerland',
  'Thailand',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
]

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function persistSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    /* ignore */
  }
}

export function applyAccessibilityPrefs({ reducedMotion, fontSize, contrast }) {
  const root = document.documentElement
  root.dataset.settingsMotion = reducedMotion ? 'reduce' : 'ok'
  root.dataset.settingsFont = fontSize || 'medium'
  root.dataset.settingsContrast = contrast || 'default'
}
