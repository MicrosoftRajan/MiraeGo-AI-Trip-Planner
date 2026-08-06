import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSavedTrips } from '../context/SavedTripsContext'
import { useTripContext } from '../context/TripContext'
import useTrip from './useTrip'
import useTripStatus from './useTripStatus'

/** After generation completes, persist the trip and navigate to its detail page. */
export default function useTripGenerationRedirect() {
  const navigate = useNavigate()
  const location = useLocation()
  const trip = useTrip()
  const { loading, setTrip, lastPayload } = useTripContext()
  const { saveTrip } = useSavedTrips()
  const handledRequest = useRef(null)

  useEffect(() => {
    // Trip detail page loads trip into context — don't re-save while viewing.
    // Fresh generations have no matching route id, so they still redirect.
    if (location.pathname.startsWith('/dashboard/trip/')) {
      const routeId = location.pathname.split('/').pop()
      if (trip.id && trip.id === routeId) return
    }
    if (!trip || loading) return

    const token = `${trip.destination}|${trip.tripTitle || trip.title}|${trip.duration}`
    if (handledRequest.current === token) return
    handledRequest.current = token

    const entry = saveTrip(trip, {
      id: trip.id,
      requestPayload: lastPayload ?? undefined,
    })

    if (trip.id !== entry.id) {
      setTrip({ ...trip, id: entry.id })
    }

    navigate(`/dashboard/trip/${entry.id}`, { replace: true })
  }, [
    trip,
    loading,
    location.pathname,
    navigate,
    saveTrip,
    lastPayload,
    setTrip,
  ])
}
