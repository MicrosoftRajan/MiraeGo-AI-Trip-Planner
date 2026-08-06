import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  loadSavedTrips,
  normalizeTripEntry,
  persistSavedTrips,
} from '../utils/savedTrips'

const SavedTripsContext = createContext(null)

export function SavedTripsProvider({ children }) {
  const [trips, setTrips] = useState(() => loadSavedTrips())

  const sync = useCallback((next) => {
    setTrips(next)
    persistSavedTrips(next)
  }, [])

  const saveTrip = useCallback(
    (trip, options = {}) => {
      const entry = normalizeTripEntry(trip, options)
      setTrips((prev) => {
        const index = prev.findIndex((t) => t.id === entry.id)
        const next =
          index >= 0
            ? prev.map((t, i) =>
                i === index
                  ? {
                      ...entry,
                      createdAt: t.createdAt,
                      createdDate: t.createdDate,
                      notes: entry.notes || t.notes || '',
                      requestPayload:
                        entry.requestPayload ?? t.requestPayload ?? null,
                      status: options.status ?? t.status ?? entry.status,
                    }
                  : t,
              )
            : [entry, ...prev]
        persistSavedTrips(next)
        return next
      })
      return entry
    },
    [],
  )

  const removeTrip = useCallback((id) => {
    setTrips((prev) => {
      const next = prev.filter((t) => t.id !== id)
      persistSavedTrips(next)
      return next
    })
  }, [])

  const duplicateTrip = useCallback((id) => {
    let duplicate = null
    setTrips((prev) => {
      const source = prev.find((t) => t.id === id)
      if (!source) return prev
      duplicate = normalizeTripEntry(source.data, { status: 'saved' })
      const next = [duplicate, ...prev]
      persistSavedTrips(next)
      return next
    })
    return duplicate
  }, [])

  const getTrip = useCallback(
    (id) => trips.find((t) => t.id === id) ?? null,
    [trips],
  )

  const updateTripStatus = useCallback((id, status) => {
    setTrips((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, status } : t))
      persistSavedTrips(next)
      return next
    })
  }, [])

  const updateTripNotes = useCallback((id, notes) => {
    setTrips((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, notes } : t))
      persistSavedTrips(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      trips,
      saveTrip,
      removeTrip,
      duplicateTrip,
      getTrip,
      updateTripStatus,
      updateTripNotes,
    }),
    [trips, saveTrip, removeTrip, duplicateTrip, getTrip, updateTripStatus, updateTripNotes],
  )

  return (
    <SavedTripsContext.Provider value={value}>{children}</SavedTripsContext.Provider>
  )
}

export function useSavedTrips() {
  const ctx = useContext(SavedTripsContext)
  if (!ctx) {
    throw new Error('useSavedTrips must be used within SavedTripsProvider')
  }
  return ctx
}
