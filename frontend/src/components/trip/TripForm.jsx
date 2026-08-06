import { useState } from 'react'
import {
  CURRENCY_OPTIONS,
  INTEREST_OPTIONS,
  TRAVEL_STYLES,
} from '../../constants'
import useTripActions from '../../hooks/useTripActions'
import useTripStatus from '../../hooks/useTripStatus'
import { cn } from '../../utils'
import { validateTripForm } from '../../utils/validateTripForm'
import Button from '../common/Button'
import GlassCard from '../common/GlassCard'
import Input from '../common/Input'

const initialForm = {
  destination: '',
  days: '4',
  budgetAmount: '80000',
  currency: 'INR',
  style: 'balanced',
  interests: ['Culture', 'Food'],
  travelers: '2',
}

export default function TripForm({ onPending, onPendingDestination }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)
  const { loading } = useTripStatus()
  const { generateTrip, cancelRequest } = useTripActions()

  const selectedCurrency =
    CURRENCY_OPTIONS.find((c) => c.code === form.currency) ?? CURRENCY_OPTIONS[0]

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (touched) {
      setErrors((prev) => {
        if (!prev[key]) return prev
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const toggleInterest = (interest) => {
    setForm((prev) => {
      const has = prev.interests.includes(interest)
      return {
        ...prev,
        interests: has
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      }
    })
    if (touched) {
      setErrors((prev) => {
        if (!prev.interests) return prev
        const next = { ...prev }
        delete next.interests
        return next
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)

    const result = validateTripForm(form)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }

    setErrors({})
    onPending?.({
      destination: result.data.destination,
      days: Number(result.data.days) || 4,
    })
    onPendingDestination?.(result.data.destination)
    generateTrip(result.data)
  }

  return (
    <section id="planner" className="scroll-mt-28 py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sea">
            Trip planner
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Tell Gilora where you&apos;re headed
          </h2>
          <p className="mt-3 text-ink-muted leading-relaxed">
            Any country worldwide — set your budget, currency, pace, and interests.
            Gilora drafts a structured itinerary you can refine.
          </p>
        </div>

        <GlassCard
          strong
          className="mx-auto mt-8 max-w-3xl animate-scale-in p-4 sm:mt-10 sm:p-6 md:p-8"
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Destination"
                name="destination"
                placeholder="City, Country"
                value={form.destination}
                onChange={(e) => update('destination', e.target.value)}
                error={errors.destination}
                autoComplete="off"
                containerClassName="sm:col-span-2"
              />
              <Input
                label="Days"
                name="days"
                type="number"
                min="1"
                max="21"
                inputMode="numeric"
                value={form.days}
                onChange={(e) => update('days', e.target.value)}
                error={errors.days}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label={`Budget (${selectedCurrency.symbol})`}
                name="budgetAmount"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                placeholder="80000"
                value={form.budgetAmount}
                onChange={(e) => update('budgetAmount', e.target.value)}
                error={errors.budgetAmount}
                containerClassName="sm:col-span-2"
              />
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink-muted">Currency</span>
                <select
                  name="currency"
                  value={form.currency}
                  onChange={(e) => update('currency', e.target.value)}
                  aria-invalid={Boolean(errors.currency)}
                  aria-describedby={errors.currency ? 'currency-error' : undefined}
                  className={cn(
                    'w-full rounded-2xl border border-border-input bg-input px-4 py-3 text-ink',
                    'shadow-soft backdrop-blur-md transition-all duration-300',
                    'hover:bg-input-hover focus:border-sea/40 focus:bg-input-focus focus:outline-none focus:ring-2 focus:ring-sea/20',
                    errors.currency &&
                      'border-coral/45 focus:border-coral/50 focus:ring-coral/20',
                  )}
                >
                  {CURRENCY_OPTIONS.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.code} ({option.symbol})
                    </option>
                  ))}
                </select>
                {errors.currency ? (
                  <span id="currency-error" className="text-sm text-coral" role="alert">
                    {errors.currency}
                  </span>
                ) : null}
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Travelers"
                name="travelers"
                type="number"
                min="1"
                max="12"
                inputMode="numeric"
                value={form.travelers}
                onChange={(e) => update('travelers', e.target.value)}
                error={errors.travelers}
              />
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-ink-muted">
                Travel style
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TRAVEL_STYLES.map((style) => {
                  const active = form.style === style.value
                  return (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => update('style', style.value)}
                      aria-pressed={active}
                      className={cn(
                        'rounded-2xl px-3 py-3 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/35',
                        active
                          ? 'bg-sea text-white shadow-soft scale-[1.02]'
                          : 'bg-chip text-ink-muted hover:bg-chip-hover hover:text-ink hover:scale-[1.01]',
                      )}
                    >
                      <span className="block text-sm font-medium">{style.label}</span>
                      <span
                        className={cn(
                          'mt-0.5 block text-xs',
                          active ? 'text-white/80' : 'text-ink-soft',
                        )}
                      >
                        {style.hint}
                      </span>
                    </button>
                  )
                })}
              </div>
              {errors.style ? (
                <p className="mt-2 text-sm text-coral" role="alert">
                  {errors.style}
                </p>
              ) : null}
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-ink-muted">
                Interests
              </legend>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const active = form.interests.includes(interest)
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      aria-pressed={active}
                      className={cn(
                        'rounded-2xl px-3.5 py-2 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/35',
                        active
                          ? 'bg-sea/15 text-sea-deep ring-1 ring-sea/30'
                          : 'bg-chip text-ink-muted hover:bg-chip-hover hover:text-ink',
                      )}
                    >
                      {interest}
                    </button>
                  )
                })}
              </div>
              {errors.interests ? (
                <p className="mt-2 text-sm text-coral" role="alert">
                  {errors.interests}
                </p>
              ) : null}
            </fieldset>

            <div className="flex flex-col gap-3 border-t border-divider pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-soft">
                {loading
                  ? 'Building your itinerary…'
                  : 'Takes a moment — sit tight while Gilora plans.'}
              </p>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                {loading ? (
                  <Button
                    type="button"
                    size="lg"
                    variant="ghost"
                    onClick={cancelRequest}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                ) : null}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto sm:min-w-[180px]"
                >
                  {loading ? 'Generate again' : 'Generate itinerary'}
                </Button>
              </div>
            </div>
          </form>
        </GlassCard>
      </div>
    </section>
  )
}
