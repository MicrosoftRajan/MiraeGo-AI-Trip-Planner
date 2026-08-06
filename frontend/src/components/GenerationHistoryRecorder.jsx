import { useEffect, useRef } from 'react'
import { useGenerationHistory } from '../context/GenerationHistoryContext'
import { useTripContext } from '../context/TripContext'
import { normalizeTripEntry } from '../utils/savedTrips'
import { ERROR_CODES } from '../utils/errors'

/**
 * Records each AI generation attempt (success or failure) into history.
 * Mounted once at app level inside TripProvider + GenerationHistoryProvider.
 */
export default function GenerationHistoryRecorder() {
  const { addEntry } = useGenerationHistory()
  const { trip, loading, error, requestId, lastPayload } = useTripContext()

  const startTimeRef = useRef(null)
  const recordedRequestRef = useRef(null)

  useEffect(() => {
    if (loading && requestId) {
      startTimeRef.current = Date.now()
      recordedRequestRef.current = null
    }
  }, [loading, requestId])

  useEffect(() => {
    if (loading || !requestId || !lastPayload) return
    if (recordedRequestRef.current === requestId) return

    const durationMs = startTimeRef.current
      ? Date.now() - startTimeRef.current
      : 0

    if (error?.code === ERROR_CODES.ABORTED) {
      recordedRequestRef.current = requestId
      return
    }

    if (trip) {
      const tripEntry = normalizeTripEntry(trip)
      addEntry({
        payload: lastPayload,
        status: 'success',
        tripId: tripEntry.id,
        durationMs,
        generatedAt: new Date().toISOString(),
      })
      recordedRequestRef.current = requestId
      return
    }

    if (error) {
      addEntry({
        payload: lastPayload,
        status: 'failed',
        durationMs,
        errorMessage: error.message ?? 'Generation failed',
        generatedAt: new Date().toISOString(),
      })
      recordedRequestRef.current = requestId
    }
  }, [loading, trip, error, requestId, lastPayload, addEntry])

  return null
}
