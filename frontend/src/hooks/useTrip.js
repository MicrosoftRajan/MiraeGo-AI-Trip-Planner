import { useTripContext } from '../context/TripContext'

/** Current trip itinerary (or `null` while empty / loading). */
export default function useTrip() {
  return useTripContext().trip
}
