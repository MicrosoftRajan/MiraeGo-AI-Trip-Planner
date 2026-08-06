import { useMemo } from 'react'

function matchesDate(generatedAt, filter) {
  if (!filter) return true
  const created = new Date(generatedAt)
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

function sortEntries(entries, sort) {
  const list = [...entries]
  switch (sort) {
    case 'oldest':
      return list.sort((a, b) => new Date(a.generatedAt) - new Date(b.generatedAt))
    case 'duration':
      return list.sort((a, b) => b.durationMs - a.durationMs)
    case 'newest':
    default:
      return list.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))
  }
}

export function useFilteredHistory(entries, { search, filters, sort }) {
  return useMemo(() => {
    const q = search.trim().toLowerCase()

    const filtered = entries.filter((entry) => {
      if (q) {
        const haystack = [
          entry.prompt,
          entry.destination,
          entry.travelStyle,
          entry.status,
          entry.errorMessage,
        ]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }

      if (filters.destination && entry.destination !== filters.destination) return false
      if (filters.status && entry.status !== filters.status) return false
      if (!matchesDate(entry.generatedAt, filters.date)) return false

      return true
    })

    return sortEntries(filtered, sort)
  }, [entries, search, filters, sort])
}

export function useUniqueHistoryDestinations(entries) {
  return useMemo(() => {
    const set = new Set(entries.map((e) => e.destination).filter(Boolean))
    return [...set].sort()
  }, [entries])
}

/** Group entries by calendar day for timeline sections. */
export function groupEntriesByDate(entries) {
  const groups = new Map()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  for (const entry of entries) {
    const date = new Date(entry.generatedAt)
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    let label
    if (dayStart.getTime() === today.getTime()) {
      label = 'Today'
    } else if (dayStart.getTime() === yesterday.getTime()) {
      label = 'Yesterday'
    } else {
      label = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    }

    if (!groups.has(label)) {
      groups.set(label, [])
    }
    groups.get(label).push(entry)
  }

  return [...groups.entries()].map(([label, items]) => ({ label, items }))
}
