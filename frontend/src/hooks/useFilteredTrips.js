import { useMemo } from 'react'

function matchesBudget(budget, filter) {
  if (!filter) return true
  const amount = budget ?? 0
  switch (filter) {
    case 'low':
      return amount < 50000
    case 'mid':
      return amount >= 50000 && amount < 100000
    case 'high':
      return amount >= 100000 && amount < 200000
    case 'premium':
      return amount >= 200000
    default:
      return true
  }
}

function matchesDate(createdAt, filter) {
  if (!filter) return true
  const created = new Date(createdAt)
  const now = new Date()
  switch (filter) {
    case '7d': {
      const cutoff = new Date(now)
      cutoff.setDate(cutoff.getDate() - 7)
      return created >= cutoff
    }
    case '30d': {
      const cutoff = new Date(now)
      cutoff.setDate(cutoff.getDate() - 30)
      return created >= cutoff
    }
    case '90d': {
      const cutoff = new Date(now)
      cutoff.setDate(cutoff.getDate() - 90)
      return created >= cutoff
    }
    case 'year':
      return created.getFullYear() === now.getFullYear()
    default:
      return true
  }
}

function sortTrips(trips, sort) {
  const list = [...trips]
  switch (sort) {
    case 'oldest':
      return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'budget':
      return list.sort((a, b) => b.budget - a.budget)
    case 'country':
      return list.sort((a, b) => a.country.localeCompare(b.country))
    case 'newest':
    default:
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

export function useFilteredTrips(trips, { search, filters, sort }) {
  return useMemo(() => {
    const q = search.trim().toLowerCase()

    const filtered = trips.filter((trip) => {
      if (q) {
        const haystack = [
          trip.title,
          trip.destination,
          trip.country,
          trip.travelStyle,
          trip.status,
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }

      if (filters.destination && trip.destination !== filters.destination) return false
      if (filters.country && trip.country !== filters.country) return false
      if (filters.travelStyle && trip.travelStyle !== filters.travelStyle) return false
      if (filters.status && trip.status !== filters.status) return false
      if (!matchesBudget(trip.budget, filters.budget)) return false
      if (!matchesDate(trip.createdAt, filters.date)) return false

      return true
    })

    return sortTrips(filtered, sort)
  }, [trips, search, filters, sort])
}

export function useUniqueDestinations(trips) {
  return useMemo(() => {
    const set = new Set(trips.map((t) => t.destination).filter(Boolean))
    return [...set].sort()
  }, [trips])
}
