/** @typedef {'morning' | 'afternoon' | 'evening'} PeriodId */

/** @type {ReadonlyArray<{ id: PeriodId, label: string, hint: string }>} */
export const PERIODS = [
  { id: 'morning', label: 'Morning', hint: 'Before noon' },
  { id: 'afternoon', label: 'Afternoon', hint: 'Noon to dusk' },
  { id: 'evening', label: 'Evening', hint: 'From 5pm' },
]

/**
 * Parse "HH:MM" (24h) into minutes from midnight.
 * @param {string} time
 * @returns {number}
 */
export function timeToMinutes(time) {
  if (typeof time !== 'string') return 0
  const [h, m] = time.split(':').map(Number)
  if (!Number.isFinite(h)) return 0
  return h * 60 + (Number.isFinite(m) ? m : 0)
}

/**
 * Bucket a stop into morning / afternoon / evening by start time.
 * @param {string} time
 * @returns {PeriodId}
 */
export function getPeriodForTime(time) {
  const minutes = timeToMinutes(time)
  if (minutes < 12 * 60) return 'morning'
  if (minutes < 17 * 60) return 'afternoon'
  return 'evening'
}

/**
 * Group stops into Morning / Afternoon / Evening, preserving order within each.
 * Empty periods are omitted from the result array.
 *
 * @param {Array<{ time: string, cost?: number }>} stops
 * @returns {Array<{ id: PeriodId, label: string, hint: string, stops: typeof stops, cost: number }>}
 */
export function groupStopsByPeriod(stops = []) {
  const buckets = Object.fromEntries(
    PERIODS.map((p) => [p.id, { ...p, stops: [], cost: 0 }]),
  )

  for (const stop of stops) {
    const id = getPeriodForTime(stop.time)
    buckets[id].stops.push(stop)
    buckets[id].cost += Number(stop.cost) || 0
  }

  return PERIODS.map((p) => buckets[p.id]).filter((p) => p.stops.length > 0)
}

/**
 * Sum estimated costs for a list of stops.
 * @param {Array<{ cost?: number }>} stops
 * @returns {number}
 */
export function sumStopCosts(stops = []) {
  return stops.reduce((total, stop) => total + (Number(stop.cost) || 0), 0)
}
