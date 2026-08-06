import { useTripContext } from '../context/TripContext'

/**
 * Selected day id + setter, plus the matching day object when present.
 */
export default function useSelectedDay() {
  const { trip, selectedDay, setSelectedDay } = useTripContext()
  const selected = trip?.days?.find((day) => day.id === selectedDay) ?? null

  return { selectedDay, setSelectedDay, selected }
}
