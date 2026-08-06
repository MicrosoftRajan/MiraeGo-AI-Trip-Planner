import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import {
  ModalBody,
  ModalContent,
  useModal,
} from '@/components/ui/animated-modal'
import { Button } from '@/components/ui/button'
import { AiIcon } from '@/components/icons'
import useTripForm, { TRIP_FORM_INITIAL } from '../../hooks/useTripForm'
import { useTripFormPrefill } from '../../context/TripFormPrefillContext'
import { payloadToUiForm } from '../../utils/generationHistory'
import {
  ACCOMMODATION_OPTIONS,
  CURRENCY_OPTIONS,
  INTEREST_OPTIONS,
  PROMPT_SUGGESTIONS,
  TRANSPORT_OPTIONS,
  TRAVEL_STYLES,
} from '../../constants/dashboard'
import { cn } from '../../utils'
import BudgetSuggestion from './BudgetSuggestion'
import CountryPreview from './CountryPreview'

const TRIP_STEPS = [
  { id: 1, title: 'Destination' },
  { id: 2, title: 'Trip Details' },
  { id: 3, title: 'Preferences' },
  { id: 4, title: 'Review' },
]

function Stepper({ label, value, min = 0, max = 30, onChange }) {
  return (
    <div>
      <span className="dash-label">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--dash-border)] text-lg transition hover:bg-[var(--dash-surface)]"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <span className="min-w-[2rem] text-center text-lg font-semibold">{value}</span>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--dash-border)] text-lg transition hover:bg-[var(--dash-surface)]"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

function StepBadge({ active, complete, label, index }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition',
          complete || active
            ? 'border-[var(--dash-accent)] bg-[var(--dash-accent)] text-[var(--dash-on-accent)]'
            : 'border-[var(--dash-border)] bg-[var(--dash-card)] text-[var(--dash-muted)]',
        )}
      >
        {index}
      </div>
      <p
        className={cn(
          'truncate text-xs font-medium',
          active ? 'text-[var(--dash-text)]' : 'text-[var(--dash-muted)]',
        )}
      >
        {label}
      </p>
    </div>
  )
}

/**
 * ModalBody only mounts children when open — so pendingOpen must be handled
 * outside ModalBody, or Explore/AI History "Generate Trip" never opens the form.
 */
function OpenModalOnPrefill() {
  const { setOpen } = useModal()
  const { pendingOpen, setPendingOpen } = useTripFormPrefill()

  useEffect(() => {
    if (!pendingOpen) return
    setOpen(true)
    setPendingOpen(false)
  }, [pendingOpen, setOpen, setPendingOpen])

  return null
}

function TripFormFields({ onGenerate }) {
  const { setOpen } = useModal()
  const { prefill, prefillKey, clearPrefill } = useTripFormPrefill()
  const [step, setStep] = useState(1)

  const initialForm = prefill ? payloadToUiForm(prefill) : TRIP_FORM_INITIAL

  const {
    form,
    errors,
    country,
    suggestions,
    suggestionsOpen,
    setSuggestionsOpen,
    pendingBypass,
    setPendingBypass,
    analysis,
    destRef,
    update,
    toggleInterest,
    submit,
  } = useTripForm(initialForm)

  useEffect(() => {
    if (prefillKey > 0) {
      setStep(1)
    }
  }, [prefillKey])

  const currencyMeta =
    CURRENCY_OPTIONS.find((c) => c.code === form.currency) ?? CURRENCY_OPTIONS[0]

  const styleMeta = useMemo(
    () => TRAVEL_STYLES.find((style) => style.value === form.style),
    [form.style],
  )
  const travelerCount = (Number(form.adults) || 0) + (Number(form.children) || 0)

  const handleSubmit = (e, { force = false } = {}) => {
    const data = submit(e, {
      force,
      onValid: (payload) => {
        clearPrefill()
        setOpen(false)
        onGenerate?.(payload)
      },
    })
    return data
  }

  const nextStep = () => {
    if (step === 1 && !form.destination.trim()) {
      handleSubmit()
      return
    }
    if (step === 2) {
      const budget = Number(String(form.budgetAmount).replace(/,/g, ''))
      if (!Number.isFinite(budget) || budget <= 0 || travelerCount < 1) {
        handleSubmit()
        return
      }
    }
    if (step === 3 && form.interests.length === 0) {
      handleSubmit()
      return
    }
    setStep((prev) => Math.min(4, prev + 1))
  }

  const prevStep = () => setStep((prev) => Math.max(1, prev - 1))

  const applySuggestion = (text) => {
    const trimmed = form.description.trim()
    if (trimmed.includes(text)) return
    update('description', trimmed ? `${trimmed} ${text}` : text)
  }

  const reviewRows = [
    { label: 'Destination', value: form.destination || 'Not selected' },
    {
      label: 'Description',
      value: form.description.trim()
        ? form.description.trim().slice(0, 80) +
          (form.description.trim().length > 80 ? '…' : '')
        : 'None',
    },
    {
      label: 'Budget',
      value: `${currencyMeta.symbol}${Number(form.budgetAmount || 0).toLocaleString('en-US')} ${form.currency}`,
    },
    { label: 'Days', value: `${form.days} days` },
    { label: 'Travelers', value: `${travelerCount} travelers (+ ${form.infants} infants)` },
    { label: 'Style', value: styleMeta?.label ?? form.style },
    { label: 'Interests', value: form.interests.join(', ') || 'None' },
    { label: 'Accommodation', value: form.accommodation },
    { label: 'Transport', value: form.transport },
  ]

  return (
    <form className="space-y-5" onSubmit={(e) => handleSubmit(e)} noValidate>
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-3 sm:grid-cols-4">
        {TRIP_STEPS.map((stepItem) => (
          <StepBadge
            key={stepItem.id}
            active={step === stepItem.id}
            complete={step > stepItem.id}
            label={stepItem.title}
            index={stepItem.id}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.2 }}
          className="space-y-5"
        >
          {step === 1 ? (
            <>
              <div ref={destRef} className="relative">
                <label className="dash-label" htmlFor="trip-destination">
                  Destination
                </label>
                <input
                  id="trip-destination"
                  className="dash-input"
                  placeholder="Japan, Paris, Bali..."
                  value={form.destination}
                  autoComplete="off"
                  onChange={(e) => {
                    update('destination', e.target.value)
                    setSuggestionsOpen(true)
                  }}
                  onFocus={() => setSuggestionsOpen(true)}
                  aria-invalid={Boolean(errors.destination)}
                />
                {errors.destination ? (
                  <p className="mt-1 text-xs text-red-600">{errors.destination}</p>
                ) : null}
                <AnimatePresence>
                  {suggestionsOpen && suggestions.length > 0 ? (
                    <motion.ul
                      className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 overflow-hidden rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] shadow-lg"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                    >
                      {suggestions.map((s) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-[var(--dash-surface)]"
                            onClick={() => {
                              update('destination', s.name)
                              setSuggestionsOpen(false)
                            }}
                          >
                            <span className="text-xl">{s.flag}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium">{s.name}</span>
                              <span className="block text-xs text-[var(--dash-muted)]">
                                {s.capital} · {s.currency}
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  ) : null}
                </AnimatePresence>
              </div>
              <CountryPreview country={country} variant="light" />

              <div>
                <label className="dash-label" htmlFor="trip-description">
                  Describe your trip
                </label>
                <textarea
                  id="trip-description"
                  className="dash-input min-h-[96px] resize-y"
                  placeholder="e.g. A relaxed food-focused weekend with a few iconic temples…"
                  value={form.description}
                  maxLength={2000}
                  onChange={(e) => update('description', e.target.value)}
                  aria-invalid={Boolean(errors.description)}
                />
                {errors.description ? (
                  <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                ) : (
                  <p className="mt-1 text-xs text-[var(--dash-muted)]">
                    Optional free-form notes for the AI. Tap a suggestion to add it.
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {PROMPT_SUGGESTIONS.map((chip) => {
                    const active = form.description.includes(chip.text)
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        className={cn('dash-chip', active && 'dash-chip--active')}
                        aria-pressed={active}
                        onClick={() => applySuggestion(chip.text)}
                      >
                        {chip.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div>
                  <label className="dash-label" htmlFor="trip-budget">
                    Budget
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--dash-muted)]">
                      {currencyMeta.symbol}
                    </span>
                    <input
                      id="trip-budget"
                      className="dash-input pl-8"
                      inputMode="numeric"
                      value={form.budgetAmount}
                      onChange={(e) => update('budgetAmount', e.target.value)}
                    />
                  </div>
                  {errors.budgetAmount ? (
                    <p className="mt-1 text-xs text-red-600">{errors.budgetAmount}</p>
                  ) : null}
                </div>
                <div>
                  <label className="dash-label" htmlFor="trip-currency">
                    Currency
                  </label>
                  <select
                    id="trip-currency"
                    className="dash-input"
                    value={form.currency}
                    onChange={(e) => update('currency', e.target.value)}
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(analysis.status === 'ok' || analysis.status === 'warn') && (
                <BudgetSuggestion
                  analysis={analysis}
                  onUpdateBudget={() => {
                    if (analysis.suggested) update('budgetAmount', String(analysis.suggested))
                    setPendingBypass(false)
                  }}
                  onContinue={() => {
                    setPendingBypass(true)
                    setStep(3)
                  }}
                />
              )}

              <Stepper label="Days" value={form.days} min={1} max={30} onChange={(v) => update('days', v)} />

              <div className="grid grid-cols-3 gap-3">
                <Stepper label="Adults" value={form.adults} min={1} max={12} onChange={(v) => update('adults', v)} />
                <Stepper label="Children" value={form.children} min={0} max={8} onChange={(v) => update('children', v)} />
                <Stepper label="Infants" value={form.infants} min={0} max={4} onChange={(v) => update('infants', v)} />
              </div>
              {errors.travelers ? <p className="text-xs text-red-600">{errors.travelers}</p> : null}
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div>
                <label className="dash-label" htmlFor="trip-style">
                  Travel Style
                </label>
                <select
                  id="trip-style"
                  className="dash-input"
                  value={form.style}
                  onChange={(e) => update('style', e.target.value)}
                >
                  {TRAVEL_STYLES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <fieldset>
                <legend className="dash-label">Interests</legend>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      className={cn('dash-chip', form.interests.includes(interest) && 'dash-chip--active')}
                      aria-pressed={form.interests.includes(interest)}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {errors.interests ? <p className="mt-1 text-xs text-red-600">{errors.interests}</p> : null}
              </fieldset>

              <fieldset>
                <legend className="dash-label">Accommodation</legend>
                <div className="flex flex-wrap gap-2">
                  {ACCOMMODATION_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={cn('dash-chip', form.accommodation === opt && 'dash-chip--active')}
                      onClick={() => update('accommodation', opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="dash-label">Transportation</legend>
                <div className="flex flex-wrap gap-2">
                  {TRANSPORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={cn('dash-chip', form.transport === opt && 'dash-chip--active')}
                      onClick={() => update('transport', opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </fieldset>
            </>
          ) : null}

          {step === 4 ? (
            <div className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4">
              <h3 className="text-sm font-semibold text-[var(--dash-text)]">Review Your Trip</h3>
              <div className="mt-3 space-y-2">
                {reviewRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 border-b border-[var(--dash-border)] pb-2 text-sm last:border-none last:pb-0">
                    <span className="text-[var(--dash-muted)]">{row.label}</span>
                    <span className="text-right font-medium text-[var(--dash-text)]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1 border-[#e4e4e7]"
          onClick={prevStep}
          disabled={step === 1}
        >
          Back
        </Button>
        {step < 4 ? (
          <Button type="button" className="h-11 flex-1 bg-[var(--dash-accent)] text-[var(--dash-on-accent)] hover:bg-[var(--dash-accent-hover)]" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button type="submit" className="h-11 flex-1 gap-2 bg-[var(--dash-accent)] text-[var(--dash-on-accent)] hover:bg-[var(--dash-accent-hover)]">
            <AiIcon className="h-4 w-4" alt="" />
            Generate AI Plan
          </Button>
        )}
      </div>
      {analysis.status === 'warn' && step === 4 && !pendingBypass ? (
        <p className="text-xs text-amber-600">
          Budget seems low for this plan. Go back to Trip Details to adjust, or generate anyway.
        </p>
      ) : null}
      {analysis.status === 'warn' && step === 4 ? (
        <Button
          type="button"
          variant="ghost"
          className="h-9 w-full text-xs"
          onClick={() => {
            setPendingBypass(true)
            handleSubmit(null, { force: true })
          }}
        >
          Generate anyway with current budget
        </Button>
      ) : null}
    </form>
  )
}

export default function TripFormModal({ onGenerate }) {
  const { prefillKey } = useTripFormPrefill()

  return (
    <>
      <OpenModalOnPrefill />
      <ModalBody className="!max-h-[90vh] !max-w-2xl !border-[var(--dash-border)] !bg-[var(--dash-card)] md:!max-w-[640px]">
        <ModalContent className="!min-h-0 !flex-1 !overflow-y-auto !overscroll-contain !p-6 sm:!p-8">
          <h2 className="text-xl font-semibold text-[var(--dash-text)]">Plan your trip</h2>
          <p className="mt-1 text-sm text-[var(--dash-muted)]">
            Follow four quick steps and generate your AI itinerary.
          </p>
          <div className="mt-6">
            <TripFormFields key={prefillKey} onGenerate={onGenerate} />
          </div>
        </ModalContent>
      </ModalBody>
    </>
  )
}
