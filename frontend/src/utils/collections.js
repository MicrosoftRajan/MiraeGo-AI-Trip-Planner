const STORAGE_KEY = 'gilora-plan-collections'

export const DEFAULT_COLLECTIONS = [
  { id: 'japan-trip', name: 'Japan Trip', color: '#ef4444' },
  { id: 'europe-2027', name: 'Europe 2027', color: '#3b82f6' },
  { id: 'dream-vacations', name: 'Dream Vacations', color: '#8b5cf6' },
  { id: 'family-trips', name: 'Family Trips', color: '#10b981' },
]

function createCollectionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `col-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function seedCollections() {
  return DEFAULT_COLLECTIONS.map((c) => ({
    ...c,
    tripIds: [],
    createdAt: new Date().toISOString(),
  }))
}

export function loadCollections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedCollections()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return seedCollections()
    return parsed.map((c) => ({
      id: c.id,
      name: c.name || 'Untitled',
      color: c.color || '#6b7280',
      tripIds: Array.isArray(c.tripIds) ? c.tripIds : [],
      createdAt: c.createdAt ?? new Date().toISOString(),
    }))
  } catch {
    return seedCollections()
  }
}

export function persistCollections(collections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections))
}

export function createCollection(name, color = '#6b7280') {
  return {
    id: createCollectionId(),
    name: name.trim() || 'New Collection',
    color,
    tripIds: [],
    createdAt: new Date().toISOString(),
  }
}

/** Guess a default collection from trip destination / style for nicer first-run UX. */
export function suggestCollectionId(trip, collections) {
  const haystack = [trip.destination, trip.country, trip.title, trip.travelStyle]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  const rules = [
    { id: 'japan-trip', keywords: ['japan', 'tokyo', 'osaka', 'kyoto', 'hokkaido'] },
    { id: 'europe-2027', keywords: ['europe', 'france', 'italy', 'spain', 'paris', 'rome', 'berlin', 'london', 'amsterdam'] },
    { id: 'family-trips', keywords: ['family'] },
  ]

  for (const rule of rules) {
    if (!collections.some((c) => c.id === rule.id)) continue
    if (rule.keywords.some((k) => haystack.includes(k))) return rule.id
  }

  const dream = collections.find((c) => c.id === 'dream-vacations')
  return dream?.id ?? collections[0]?.id ?? null
}

export { createCollectionId }
