import { COUNTRIES } from '../constants/dashboard'

const STORAGE_KEY = 'gilora-saved-trips'

function createTripId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `trip-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function findCountry(destination, countryName) {
  const haystack = [destination, countryName].filter(Boolean).join(' ').toLowerCase()
  return COUNTRIES.find(
    (c) =>
      c.name.toLowerCase() === haystack ||
      c.aliases.some((a) => haystack.includes(a.toLowerCase())),
  )
}

function formatBudget(amount, symbol = '₹') {
  if (amount == null || Number.isNaN(amount)) return `${symbol}—`
  return `${symbol}${Number(amount).toLocaleString('en-IN')}`
}

function formatCreatedDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function parseDays(trip) {
  if (Array.isArray(trip.days)) return trip.days.length
  const match = String(trip.duration ?? '').match(/(\d+)/)
  return match ? Number(match[1]) : 0
}

function capitalizeStyle(style) {
  if (!style) return 'Balanced'
  return style.charAt(0).toUpperCase() + style.slice(1)
}

/** Normalize a generated trip into a storable list entry. */
export function normalizeTripEntry(
  trip,
  { id, status = 'saved', createdAt, notes, requestPayload } = {},
) {
  const tripId = id ?? trip.id ?? trip.tripId ?? createTripId()
  const countryName = trip.destinationInfo?.country ?? trip.destination ?? ''
  const country = findCountry(trip.destination, countryName)
  const budgetTotal = trip.budget?.total ?? trip.userBudget?.amount ?? 0
  const currency = trip.budget?.currency ?? trip.userBudget?.currency ?? 'INR'
  const currencySymbol =
    trip.budget?.currencySymbol ?? trip.userBudget?.currencySymbol ?? '₹'
  const created = createdAt ?? trip.createdAt ?? new Date().toISOString()

  return {
    id: tripId,
    title: trip.title ?? trip.tripTitle ?? 'Untitled Trip',
    destination: trip.destination ?? country?.name ?? 'Unknown',
    country: country?.name ?? countryName ?? trip.destination ?? 'Unknown',
    countryFlag: country?.flag ?? '🌍',
    budget: budgetTotal,
    budgetFormatted: formatBudget(budgetTotal, currencySymbol),
    currency,
    currencySymbol,
    days: parseDays(trip),
    travellers: trip.travelers ?? 1,
    travelStyle: capitalizeStyle(trip.style),
    status,
    notes: notes ?? trip.notes ?? '',
    createdAt: created,
    createdDate: formatCreatedDate(created),
    requestPayload: requestPayload ?? trip.requestPayload ?? null,
    image:
      country?.image ??
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    data: { ...trip, id: tripId, createdAt: created },
  }
}

export function loadSavedTrips() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function persistSavedTrips(trips) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
}

export { createTripId }
