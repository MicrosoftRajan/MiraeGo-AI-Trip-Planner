import { CURRENCY_OPTIONS, TRAVEL_STYLES } from '../constants/dashboard'
import { TRIP_FORM_INITIAL } from '../hooks/useTripForm'

const STORAGE_KEY = 'gilora-generation-history'

function createHistoryId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `gen-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function capitalizeStyle(style) {
  if (!style) return 'Balanced'
  const meta = TRAVEL_STYLES.find((s) => s.api === style || s.value === style)
  if (meta) return meta.label
  return style.charAt(0).toUpperCase() + style.slice(1)
}

function formatBudget(amount, currency = 'INR') {
  const meta = CURRENCY_OPTIONS.find((c) => c.code === currency)
  const symbol = meta?.symbol ?? '₹'
  if (amount == null || Number.isNaN(amount)) return `${symbol}—`
  return `${symbol}${Number(amount).toLocaleString('en-IN')}`
}

function formatGeneratedTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDuration(ms) {
  if (!ms || ms < 0) return '—'
  if (ms < 1000) return `${Math.round(ms)}ms`
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const rem = seconds % 60
  return rem > 0 ? `${minutes}m ${rem}s` : `${minutes}m`
}

/** Map API payload back to planner form fields for reuse. */
export function payloadToUiForm(payload) {
  if (!payload) return { ...TRIP_FORM_INITIAL }
  const meta = payload.meta || {}
  const styleMeta = TRAVEL_STYLES.find((s) => s.api === payload.style)
  return {
    destination: payload.destination ?? '',
    description: meta.description ?? '',
    budgetAmount: String(payload.budgetAmount ?? ''),
    currency: payload.currency ?? 'INR',
    days: meta.requestedDays ?? payload.days ?? 5,
    adults: meta.adults ?? payload.travelers ?? 2,
    children: meta.children ?? 0,
    infants: meta.infants ?? 0,
    style: meta.uiStyle ?? styleMeta?.value ?? 'comfort',
    interests: meta.interests ?? ['Food', 'Culture'],
    accommodation: meta.accommodation ?? 'Hotel',
    transport: meta.transport ?? 'Mixed',
  }
}

/** Build a planner API payload from a saved / generated trip when requestPayload is missing. */
export function tripToRequestPayload(trip) {
  if (!trip) return null
  const styleRaw = String(trip.style || 'balanced').toLowerCase()
  const styleMeta =
    TRAVEL_STYLES.find((s) => s.api === styleRaw || s.value === styleRaw) ??
    TRAVEL_STYLES.find((s) => s.label.toLowerCase() === styleRaw)
  const days = Array.isArray(trip.days)
    ? trip.days.length
    : Number(String(trip.duration ?? '').match(/(\d+)/)?.[1]) || 5

  return {
    destination: trip.destination || '',
    days: Math.min(21, Math.max(1, days)),
    travelers: Math.min(12, Math.max(1, Number(trip.travelers) || 2)),
    style: styleMeta?.api ?? 'balanced',
    budgetAmount: Number(trip.userBudget?.amount ?? trip.budget?.total) || 50000,
    currency: trip.userBudget?.currency || trip.budget?.currency || 'INR',
    interests: ['Culture', 'Food'],
    prompt: trip.summary || '',
    meta: {
      uiStyle: styleMeta?.value ?? 'comfort',
      interests: ['Culture', 'Food'],
      accommodation: 'Hotel',
      transport: 'Mixed',
      adults: Math.min(12, Math.max(1, Number(trip.travelers) || 2)),
      children: 0,
      infants: 0,
      requestedDays: days,
      description: '',
    },
  }
}

/** Normalize a completed generation into a history list entry. */
export function normalizeHistoryEntry({
  id,
  payload,
  status,
  tripId,
  durationMs,
  errorMessage,
  generatedAt,
}) {
  const entryId = id ?? createHistoryId()
  const created = generatedAt ?? new Date().toISOString()
  const destination = payload?.destination ?? 'Unknown'
  const budgetAmount = payload?.budgetAmount
  const currency = payload?.currency ?? 'INR'

  return {
    id: entryId,
    prompt: payload?.prompt ?? '',
    destination,
    generatedAt: created,
    generatedTime: formatGeneratedTime(created),
    budget: budgetAmount,
    budgetFormatted: formatBudget(budgetAmount, currency),
    currency,
    travelStyle: capitalizeStyle(payload?.style ?? payload?.meta?.uiStyle),
    durationMs: durationMs ?? 0,
    durationFormatted: formatDuration(durationMs),
    status,
    tripId: tripId ?? null,
    errorMessage: errorMessage ?? null,
    payload,
  }
}

export function loadGenerationHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function persistGenerationHistory(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export { createHistoryId, formatDuration, formatGeneratedTime }
