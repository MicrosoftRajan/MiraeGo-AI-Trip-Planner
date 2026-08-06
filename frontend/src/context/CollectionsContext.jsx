import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  createCollection as makeCollection,
  loadCollections,
  persistCollections,
  suggestCollectionId,
} from '../utils/collections'
import { useSavedTrips } from './SavedTripsContext'

const CollectionsContext = createContext(null)

const UNCATEGORIZED_ID = 'uncategorized'

export function CollectionsProvider({ children }) {
  const { trips } = useSavedTrips()
  const [collections, setCollections] = useState(() => loadCollections())

  // Auto-place newly saved trips into a suggested collection when unassigned.
  useEffect(() => {
    if (!trips.length) return

    setCollections((prev) => {
      const assigned = new Set(prev.flatMap((c) => c.tripIds))
      const unassigned = trips.filter((t) => !assigned.has(t.id))
      if (unassigned.length === 0) return prev

      let changed = false
      const next = prev.map((c) => ({ ...c, tripIds: [...c.tripIds] }))

      for (const trip of unassigned) {
        const targetId = suggestCollectionId(trip, next)
        const target = next.find((c) => c.id === targetId)
        if (target && !target.tripIds.includes(trip.id)) {
          target.tripIds.push(trip.id)
          changed = true
        }
      }

      if (!changed) return prev
      persistCollections(next)
      return next
    })
  }, [trips])

  // Drop references to deleted trips.
  useEffect(() => {
    const alive = new Set(trips.map((t) => t.id))
    setCollections((prev) => {
      let changed = false
      const next = prev.map((c) => {
        const tripIds = c.tripIds.filter((id) => alive.has(id))
        if (tripIds.length !== c.tripIds.length) changed = true
        return { ...c, tripIds }
      })
      if (!changed) return prev
      persistCollections(next)
      return next
    })
  }, [trips])

  const createCollection = useCallback((name, color) => {
    const collection = makeCollection(name, color)
    setCollections((prev) => {
      const next = [collection, ...prev]
      persistCollections(next)
      return next
    })
    return collection
  }, [])

  const renameCollection = useCallback((id, name) => {
    setCollections((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, name: name.trim() || c.name } : c))
      persistCollections(next)
      return next
    })
  }, [])

  const deleteCollection = useCallback((id) => {
    setCollections((prev) => {
      const next = prev.filter((c) => c.id !== id)
      persistCollections(next)
      return next
    })
  }, [])

  const moveTripToCollection = useCallback((tripId, targetCollectionId) => {
    setCollections((prev) => {
      let next
      if (targetCollectionId === UNCATEGORIZED_ID) {
        next = prev.map((c) => ({
          ...c,
          tripIds: c.tripIds.filter((id) => id !== tripId),
        }))
      } else {
        next = prev.map((c) => {
          const without = c.tripIds.filter((id) => id !== tripId)
          if (c.id === targetCollectionId) {
            return { ...c, tripIds: [...without, tripId] }
          }
          return { ...c, tripIds: without }
        })
      }
      persistCollections(next)
      return next
    })
  }, [])

  const removeTripFromCollections = useCallback((tripId) => {
    setCollections((prev) => {
      const next = prev.map((c) => ({
        ...c,
        tripIds: c.tripIds.filter((id) => id !== tripId),
      }))
      persistCollections(next)
      return next
    })
  }, [])

  const getCollectionForTrip = useCallback(
    (tripId) => collections.find((c) => c.tripIds.includes(tripId)) ?? null,
    [collections],
  )

  const getTripsForCollection = useCallback(
    (collectionId) => {
      if (collectionId === 'all') return trips
      if (collectionId === UNCATEGORIZED_ID) {
        const assigned = new Set(collections.flatMap((c) => c.tripIds))
        return trips.filter((t) => !assigned.has(t.id))
      }
      const collection = collections.find((c) => c.id === collectionId)
      if (!collection) return []
      const order = new Map(collection.tripIds.map((id, i) => [id, i]))
      return trips
        .filter((t) => order.has(t.id))
        .sort((a, b) => order.get(a.id) - order.get(b.id))
    },
    [collections, trips],
  )

  const value = useMemo(
    () => ({
      collections,
      createCollection,
      renameCollection,
      deleteCollection,
      moveTripToCollection,
      removeTripFromCollections,
      getCollectionForTrip,
      getTripsForCollection,
      UNCATEGORIZED_ID,
    }),
    [
      collections,
      createCollection,
      renameCollection,
      deleteCollection,
      moveTripToCollection,
      removeTripFromCollections,
      getCollectionForTrip,
      getTripsForCollection,
    ],
  )

  return (
    <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>
  )
}

export function useCollections() {
  const ctx = useContext(CollectionsContext)
  if (!ctx) {
    throw new Error('useCollections must be used within CollectionsProvider')
  }
  return ctx
}
