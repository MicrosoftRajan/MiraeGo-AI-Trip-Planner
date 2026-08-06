import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createTrip } from '../api/trip'
import {
  ApiError,
  ERROR_CODES,
  normalizeErrorState,
  toApiError,
} from '../utils/errors'

const TripContext = createContext(null)

function createRequestId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function TripProvider({ children }) {
  const [trip, setTripState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [requestId, setRequestId] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)

  const requestIdRef = useRef(null)
  const abortRef = useRef(null)
  const lastFormRef = useRef(null)
  const [lastPayload, setLastPayload] = useState(null)

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      abortRef.current = null
      requestIdRef.current = null
    }
  }, [])

  const setTrip = useCallback((next) => {
    setTripState((prev) => (typeof next === 'function' ? next(prev) : next))
  }, [])

  const clearTrip = useCallback(() => {
    setTripState(null)
    setSelectedDay(null)
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /** Abort any in-flight request, then start a new AbortController + request id. */
  const startRequest = useCallback(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const id = createRequestId()
    requestIdRef.current = id
    setRequestId(id)
    setLoading(true)
    setError(null)
    return { id, signal: controller.signal }
  }, [])

  const isLatestRequest = useCallback((id) => id === requestIdRef.current, [])

  const finishRequest = useCallback((id, { trip: nextTrip, error: nextError } = {}) => {
    // Ignore stale responses from aborted / superseded requests.
    if (!isLatestRequest(id)) return false

    setLoading(false)

    if (nextError != null) {
      const normalized = normalizeErrorState(toApiError(nextError))
      if (normalized?.code === ERROR_CODES.ABORTED) {
        setError(null)
        return true
      }
      setError(normalized)
      return true
    }

    if (nextTrip !== undefined) {
      setTripState(nextTrip)
      setSelectedDay(nextTrip?.days?.[0]?.id ?? null)
      setError(null)
    }

    return true
  }, [isLatestRequest])

  const cancelRequest = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    requestIdRef.current = null
    setRequestId(null)
    setLoading(false)
    setError(null)
  }, [])

  const generateTrip = useCallback(
    async (form) => {
      lastFormRef.current = form
      setLastPayload(form)
      // Cancels the previous fetch via AbortController before starting anew.
      const { id, signal } = startRequest()
      setTripState(null)
      setSelectedDay(null)

      try {
        const nextTrip = await createTrip(form, {
          signal,
          onRetry: (err, attempt, delayMs) => {
            if (signal.aborted) return
            if (import.meta.env.DEV) {
              console.warn(
                `[trip] retry attempt ${attempt + 1} after ${toApiError(err).code}; waiting ${delayMs}ms`,
              )
            }
          },
        })

        // Only the latest request may update UI / scroll.
        if (signal.aborted || !isLatestRequest(id)) return id

        const ok = finishRequest(id, { trip: nextTrip })
        if (ok) {
          window.requestAnimationFrame(() => {
            const el =
              document.getElementById('trip-result') ||
              document.getElementById('timeline')
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          })
        }
      } catch (err) {
        const apiErr = toApiError(err)
        if (apiErr.isAborted || signal.aborted) {
          // Superseded by a newer Generate — do not touch UI.
          if (isLatestRequest(id)) {
            finishRequest(id, { error: ApiError.aborted() })
          }
          return id
        }
        finishRequest(id, { error: apiErr })
      }

      return id
    },
    [finishRequest, isLatestRequest, startRequest],
  )

  const retryTrip = useCallback(() => {
    if (!lastFormRef.current) return null
    return generateTrip(lastFormRef.current)
  }, [generateTrip])

  const updateDay = useCallback((dayId, patch) => {
    setTripState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        days: prev.days.map((day) =>
          day.id === dayId ? { ...day, ...patch } : day,
        ),
      }
    })
  }, [])

  const removeDay = useCallback((dayId) => {
    setTripState((prev) => {
      if (!prev) return prev
      const days = prev.days
        .filter((day) => day.id !== dayId)
        .map((day, index) => ({ ...day, day: index + 1 }))
      return { ...prev, days }
    })
    setSelectedDay((current) => (current === dayId ? null : current))
  }, [])

  const updateStop = useCallback((dayId, stopId, patch) => {
    setTripState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        days: prev.days.map((day) => {
          if (day.id !== dayId) return day
          return {
            ...day,
            stops: day.stops.map((stop) =>
              stop.id === stopId ? { ...stop, ...patch } : stop,
            ),
          }
        }),
      }
    })
  }, [])

  const toggleStopComplete = useCallback((dayId, stopId) => {
    setTripState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        days: prev.days.map((day) => {
          if (day.id !== dayId) return day
          return {
            ...day,
            stops: day.stops.map((stop) =>
              stop.id === stopId
                ? { ...stop, completed: !stop.completed }
                : stop,
            ),
          }
        }),
      }
    })
  }, [])

  const removeStop = useCallback((dayId, stopId) => {
    setTripState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        days: prev.days.map((day) =>
          day.id === dayId
            ? { ...day, stops: day.stops.filter((s) => s.id !== stopId) }
            : day,
        ),
      }
    })
  }, [])

  const moveStop = useCallback((dayId, stopId, direction) => {
    setTripState((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        days: prev.days.map((day) => {
          if (day.id !== dayId) return day
          const index = day.stops.findIndex((s) => s.id === stopId)
          if (index < 0) return day
          const target = direction === 'up' ? index - 1 : index + 1
          if (target < 0 || target >= day.stops.length) return day
          const stops = [...day.stops]
          ;[stops[index], stops[target]] = [stops[target], stops[index]]
          return { ...day, stops }
        }),
      }
    })
  }, [])

  const value = useMemo(
    () => ({
      trip,
      loading,
      error,
      requestId,
      lastPayload,
      selectedDay,
      setTrip,
      setLoading,
      setError,
      setRequestId,
      setSelectedDay,
      clearTrip,
      clearError,
      startRequest,
      finishRequest,
      cancelRequest,
      generateTrip,
      retryTrip,
      updateDay,
      removeDay,
      updateStop,
      toggleStopComplete,
      removeStop,
      moveStop,
    }),
    [
      trip,
      loading,
      error,
      requestId,
      lastPayload,
      selectedDay,
      setTrip,
      clearTrip,
      clearError,
      startRequest,
      finishRequest,
      cancelRequest,
      generateTrip,
      retryTrip,
      updateDay,
      removeDay,
      updateStop,
      toggleStopComplete,
      removeStop,
      moveStop,
    ],
  )

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTripContext() {
  const ctx = useContext(TripContext)
  if (!ctx) {
    throw new Error('Trip hooks must be used within a TripProvider')
  }
  return ctx
}
