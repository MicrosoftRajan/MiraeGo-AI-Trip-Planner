import { useTripContext } from '../context/TripContext'

/** Loading flag, structured error, and active request id. */
export default function useTripStatus() {
  const { loading, error, requestId } = useTripContext()
  return { loading, error, requestId }
}
