import { useTripContext } from '../context/TripContext'

/** Mutators for trip state, requests, and itinerary edits. */
export default function useTripActions() {
  const {
    setTrip,
    setLoading,
    setError,
    setRequestId,
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
  } = useTripContext()

  return {
    setTrip,
    setLoading,
    setError,
    setRequestId,
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
  }
}
