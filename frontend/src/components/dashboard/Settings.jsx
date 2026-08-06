import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { UserButton, useClerk, useUser } from '@clerk/react'
import {
  HiOutlineBell,
  HiOutlineCash,
  HiOutlineDesktopComputer,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlineGlobe,
  HiOutlineKey,
  HiOutlineLockClosed,
  HiOutlineMoon,
  HiOutlineShieldCheck,
  HiOutlineSun,
  HiOutlineTrash,
  HiOutlineUserCircle,
} from 'react-icons/hi'
import { SiGithub, SiGoogle } from 'react-icons/si'
import { AiIcon } from '@/components/icons'
import { Modal } from '@/components/ui/animated-modal'
import { CURRENCY_OPTIONS, TRAVEL_STYLES } from '../../constants/dashboard'
import { useGenerationHistory } from '../../context/GenerationHistoryContext'
import { useSavedTrips } from '../../context/SavedTripsContext'
import { useThemeToggle } from '@/components/ui/skiper-ui/skiper26'
import ThemeToggle from '../common/ThemeToggle'
import useTheme from '../../hooks/useTheme'
import useTripActions from '../../hooks/useTripActions'
import useTripGenerationRedirect from '../../hooks/useTripGenerationRedirect'
import useTripStatus from '../../hooks/useTripStatus'
import {
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  applyAccessibilityPrefs,
  loadSettings,
  persistSettings,
} from '../../utils/settingsPreferences'
import { persistGenerationHistory } from '../../utils/generationHistory'
import { persistSavedTrips } from '../../utils/savedTrips'
import { cn } from '../../utils'
import DashboardMobileNav from './DashboardMobileNav'
import DashboardSidebar from './DashboardSidebar'
import FloatingShapes from './FloatingShapes'
import GenerateLoader from './GenerateLoader'
import TripFormModal from './TripFormModal'
import SettingsRow from './settings/SettingsRow'
import SettingsSection from './settings/SettingsSection'
import SettingsSegmented from './settings/SettingsSegmented'
import SettingsSwitch from './settings/SettingsSwitch'

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: HiOutlineSun },
  { value: 'dark', label: 'Dark', icon: HiOutlineMoon },
  { value: 'system', label: 'System', icon: HiOutlineDesktopComputer },
]

const FONT_OPTIONS = [
  { value: 'small', label: 'S' },
  { value: 'medium', label: 'M' },
  { value: 'large', label: 'L' },
]

const CONTRAST_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'high', label: 'High' },
]

function SelectControl({ value, onChange, children, className }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn('settings-select', className)}
    >
      {children}
    </select>
  )
}

function ValueHint({ children, className }) {
  return (
    <span className={cn('max-w-[220px] truncate text-[13px] text-[var(--dash-muted)]', className)}>
      {children}
    </span>
  )
}

export default function Settings() {
  const reduce = useReducedMotion()
  const { user } = useUser()
  const { openUserProfile, signOut } = useClerk()
  const { preference } = useTheme()
  const { setCrazyLightTheme, setCrazyDarkTheme, setCrazySystemTheme } =
    useThemeToggle({ variant: 'circle', start: 'center' })
  const { trips } = useSavedTrips()

  const handleThemeChange = useCallback(
    (value) => {
      if (value === 'light') setCrazyLightTheme()
      else if (value === 'dark') setCrazyDarkTheme()
      else setCrazySystemTheme()
    },
    [setCrazyLightTheme, setCrazyDarkTheme, setCrazySystemTheme],
  )
  const { entries, clearHistory } = useGenerationHistory()
  const { loading } = useTripStatus()
  const { generateTrip } = useTripActions()
  useTripGenerationRedirect()

  const [settings, setSettings] = useState(loadSettings)
  const [toast, setToast] = useState('')

  useEffect(() => {
    persistSettings(settings)
    applyAccessibilityPrefs(settings)
  }, [settings])

  const patch = useCallback((partial) => {
    setSettings((prev) => ({ ...prev, ...partial }))
  }, [])

  const showToast = useCallback((message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }, [])

  const displayName = user?.fullName || user?.firstName || 'Traveler'
  const email = user?.primaryEmailAddress?.emailAddress || '—'
  const avatarUrl = user?.imageUrl

  const connectedProviders = useMemo(() => {
    const accounts = user?.externalAccounts || []
    const providers = new Set(accounts.map((a) => a.provider))
    return {
      google: providers.has('google') || providers.has('oauth_google'),
      github: providers.has('github') || providers.has('oauth_github'),
    }
  }, [user])

  const currencyLabel = useMemo(() => {
    const match = CURRENCY_OPTIONS.find((c) => c.code === settings.defaultCurrency)
    return match ? `${match.symbol} ${match.code}` : settings.defaultCurrency
  }, [settings.defaultCurrency])

  const handleExportTrips = useCallback(() => {
    const payload = {
      exportedAt: new Date().toISOString(),
      trips,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gilora-trips-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Trips exported')
  }, [trips, showToast])

  const handleDeleteHistory = useCallback(() => {
    if (
      !window.confirm(
        'Delete all AI generation history? This cannot be undone.',
      )
    ) {
      return
    }
    clearHistory()
    showToast('History deleted')
  }, [clearHistory, showToast])

  const handleDeleteAccount = useCallback(async () => {
    if (
      !window.confirm(
        'Delete your account? This permanently removes your profile and local trip data.',
      )
    ) {
      return
    }
    if (
      !window.confirm(
        'Final confirmation: delete account and wipe local Gilora data?',
      )
    ) {
      return
    }
    try {
      persistSavedTrips([])
      persistGenerationHistory([])
      localStorage.removeItem('gilora-settings')
      localStorage.removeItem('gilora-plan-collections')
      if (typeof user?.delete === 'function') {
        await user.delete()
      } else {
        await signOut({ redirectUrl: '/' })
      }
    } catch {
      showToast('Could not delete account. Try again from your profile.')
      openUserProfile()
    }
  }, [user, signOut, openUserProfile, showToast])

  const handleGenerate = useCallback(
    (data) => {
      void generateTrip(data)
    },
    [generateTrip],
  )

  return (
    <Modal>
      <div className="dashboard-root settings-root relative flex min-h-dvh">
        <FloatingShapes />
        <DashboardSidebar />
        <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
          <DashboardMobileNav />
          <main className="dash-scroll flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto w-full max-w-[720px] space-y-8 pb-16">
              <motion.header
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="px-1"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--dash-soft)]">
                  Preferences
                </p>
                <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-[var(--dash-text)]">
                  Settings
                </h1>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[var(--dash-muted)]">
                  Personalize your Gilora experience — profile, appearance, and privacy.
                </p>
              </motion.header>

              {/* Profile */}
              <SettingsSection title="Profile" delay={0.04}>
                <SettingsRow
                  icon={HiOutlineUserCircle}
                  label="Avatar"
                  description="Managed by your account provider"
                  onClick={() => openUserProfile()}
                  showChevron
                >
                  <div className="overflow-hidden rounded-full ring-1 ring-[var(--dash-border)]">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt=""
                        className="h-9 w-9 object-cover"
                      />
                    ) : (
                      <UserButton
                        appearance={{ elements: { avatarBox: 'h-9 w-9' } }}
                      />
                    )}
                  </div>
                </SettingsRow>
                <SettingsRow label="Name">
                  <ValueHint>{displayName}</ValueHint>
                </SettingsRow>
                <SettingsRow label="Email">
                  <ValueHint className="truncate max-w-[200px]">{email}</ValueHint>
                </SettingsRow>
                <SettingsRow label="Country" icon={HiOutlineGlobe}>
                  <SelectControl
                    value={settings.country}
                    onChange={(v) => patch({ country: v })}
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </SelectControl>
                </SettingsRow>
                <SettingsRow label="Preferred Currency">
                  <SelectControl
                    value={settings.preferredCurrency}
                    onChange={(v) =>
                      patch({ preferredCurrency: v, defaultCurrency: v })
                    }
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.symbol} {c.code}
                      </option>
                    ))}
                  </SelectControl>
                </SettingsRow>
                <SettingsRow label="Preferred Language">
                  <SelectControl
                    value={settings.preferredLanguage}
                    onChange={(v) => patch({ preferredLanguage: v })}
                  >
                    {LANGUAGE_OPTIONS.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </SelectControl>
                </SettingsRow>
                <SettingsRow
                  label="Travel Style"
                  icon={AiIcon}
                  description="Used as the default for new trip plans"
                  last
                >
                  <SelectControl
                    value={settings.travelStyle}
                    onChange={(v) => patch({ travelStyle: v })}
                  >
                    {TRAVEL_STYLES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </SelectControl>
                </SettingsRow>
              </SettingsSection>

              {/* Theme */}
              <SettingsSection title="Theme" delay={0.08}>
                <div className="px-4 py-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[var(--dash-chip)] text-[var(--dash-text)]">
                        <HiOutlineSun className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-[15px] font-medium text-[var(--dash-text)]">Appearance</p>
                        <p className="text-[12px] text-[var(--dash-muted)]">
                          Choose how Miraego looks on this device
                        </p>
                      </div>
                    </div>
                    <ThemeToggle />
                  </div>
                  <SettingsSegmented
                    ariaLabel="Theme"
                    options={THEME_OPTIONS}
                    value={preference}
                    onChange={handleThemeChange}
                  />
                </div>
              </SettingsSection>

              {/* Notifications */}
              <SettingsSection title="Notification Settings" delay={0.12}>
                <SettingsRow
                  icon={HiOutlineBell}
                  label="Trip Reminders"
                  description="Upcoming departures and packing cues"
                >
                  <SettingsSwitch
                    label="Trip Reminders"
                    checked={settings.tripReminders}
                    onChange={(v) => patch({ tripReminders: v })}
                  />
                </SettingsRow>
                <SettingsRow
                  label="Email"
                  description="Itinerary updates and weekly digests"
                >
                  <SettingsSwitch
                    label="Email notifications"
                    checked={settings.emailNotifications}
                    onChange={(v) => patch({ emailNotifications: v })}
                  />
                </SettingsRow>
                <SettingsRow
                  label="Push Notifications"
                  description="Instant alerts on this device"
                  last
                >
                  <SettingsSwitch
                    label="Push notifications"
                    checked={settings.pushNotifications}
                    onChange={(v) => patch({ pushNotifications: v })}
                  />
                </SettingsRow>
              </SettingsSection>

              {/* Currency */}
              <SettingsSection title="Currency" delay={0.16}>
                <SettingsRow icon={HiOutlineCash} label="Default Currency">
                  <SelectControl
                    value={settings.defaultCurrency}
                    onChange={(v) => patch({ defaultCurrency: v })}
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.symbol} {c.code} — {c.name}
                      </option>
                    ))}
                  </SelectControl>
                </SettingsRow>
                <SettingsRow
                  label="Default Budget"
                  description={`Baseline for new plans · ${currencyLabel}`}
                  last
                >
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={settings.defaultBudget}
                    onChange={(e) => patch({ defaultBudget: e.target.value })}
                    className="settings-select w-[120px] text-right tabular-nums"
                  />
                </SettingsRow>
              </SettingsSection>

              {/* Accessibility */}
              <SettingsSection title="Accessibility" delay={0.2}>
                <SettingsRow
                  icon={HiOutlineEye}
                  label="Reduced Motion"
                  description="Minimize animations across the app"
                >
                  <SettingsSwitch
                    label="Reduced Motion"
                    checked={settings.reducedMotion}
                    onChange={(v) => patch({ reducedMotion: v })}
                  />
                </SettingsRow>
                <SettingsRow label="Font Size" description="Adjust reading size">
                  <div className="w-[140px]">
                    <SettingsSegmented
                      ariaLabel="Font size"
                      options={FONT_OPTIONS}
                      value={settings.fontSize}
                      onChange={(v) => patch({ fontSize: v })}
                    />
                  </div>
                </SettingsRow>
                <SettingsRow label="Contrast" last>
                  <div className="w-[160px]">
                    <SettingsSegmented
                      ariaLabel="Contrast"
                      options={CONTRAST_OPTIONS}
                      value={settings.contrast}
                      onChange={(v) => patch({ contrast: v })}
                    />
                  </div>
                </SettingsRow>
              </SettingsSection>

              {/* Data */}
              <SettingsSection title="Data" delay={0.24}>
                <SettingsRow
                  icon={HiOutlineDownload}
                  label="Export Trips"
                  description={`${trips.length} saved trip${trips.length === 1 ? '' : 's'}`}
                  onClick={handleExportTrips}
                  showChevron
                />
                <SettingsRow
                  icon={HiOutlineTrash}
                  label="Delete History"
                  description={`${entries.length} generation${entries.length === 1 ? '' : 's'}`}
                  onClick={handleDeleteHistory}
                  destructive
                  showChevron
                />
                <SettingsRow
                  icon={HiOutlineTrash}
                  label="Delete Account"
                  description="Permanently remove your Gilora account"
                  onClick={handleDeleteAccount}
                  destructive
                  showChevron
                  last
                />
              </SettingsSection>

              {/* Privacy / Connected */}
              <SettingsSection title="Privacy" delay={0.28}>
                <SettingsRow
                  icon={SiGoogle}
                  label="Google"
                  description={
                    connectedProviders.google ? 'Connected' : 'Not connected'
                  }
                  onClick={() => openUserProfile()}
                  showChevron
                >
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      connectedProviders.google ? 'bg-[#34c759]' : 'bg-[#d1d1d6]',
                    )}
                  />
                </SettingsRow>
                <SettingsRow
                  icon={SiGithub}
                  label="GitHub"
                  description={
                    connectedProviders.github ? 'Connected' : 'Not connected'
                  }
                  onClick={() => openUserProfile()}
                  showChevron
                  last
                >
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      connectedProviders.github ? 'bg-[#34c759]' : 'bg-[#d1d1d6]',
                    )}
                  />
                </SettingsRow>
              </SettingsSection>

              {/* Security */}
              <SettingsSection title="Security" delay={0.32}>
                <SettingsRow
                  icon={HiOutlineKey}
                  label="Password"
                  description="Update your sign-in password"
                  onClick={() => openUserProfile()}
                  showChevron
                />
                <SettingsRow
                  icon={HiOutlineLockClosed}
                  label="2FA"
                  description="Two-factor authentication"
                >
                  <SettingsSwitch
                    label="Two-factor authentication"
                    checked={settings.twoFactorEnabled}
                    onChange={(v) => {
                      patch({ twoFactorEnabled: v })
                      if (v) openUserProfile()
                    }}
                  />
                </SettingsRow>
                <SettingsRow
                  icon={HiOutlineShieldCheck}
                  label="Sessions"
                  description="Review devices signed into Gilora"
                  onClick={() => openUserProfile()}
                  showChevron
                  last
                />
              </SettingsSection>

              {/* Billing placeholder */}
              <SettingsSection
                title="Billing"
                description="Plans and invoices will appear here soon."
                delay={0.36}
              >
                <div className="flex flex-col items-center px-6 py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--dash-chip)] text-[var(--dash-text)]">
                    <HiOutlineCash className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-[15px] font-medium text-[var(--dash-text)]">
                    Coming soon
                  </p>
                  <p className="mt-1 max-w-xs text-[13px] leading-relaxed text-[var(--dash-muted)]">
                    You&apos;re on Gilora Free. Billing controls will unlock with
                    Pro plans.
                  </p>
                  <span className="mt-4 rounded-full bg-[var(--dash-settings-select)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--dash-muted)]">
                    Placeholder
                  </span>
                </div>
              </SettingsSection>
            </div>
          </main>
        </div>

        <GenerateLoader active={loading} />
        <TripFormModal onGenerate={handleGenerate} />

        {toast ? (
          <motion.div
            role="status"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[var(--dash-accent)] px-4 py-2.5 text-sm font-medium text-[var(--dash-on-accent)] shadow-lg"
          >
            {toast}
          </motion.div>
        ) : null}
      </div>
    </Modal>
  )
}
