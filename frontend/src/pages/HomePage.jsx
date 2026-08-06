import Hero from '../components/trip/Hero'
import TripForm from '../components/trip/TripForm'
import DestinationInfo from '../components/trip/DestinationInfo'
import Timeline from '../components/trip/Timeline'
import BudgetSummary from '../components/trip/BudgetSummary'
import TravelTips from '../components/trip/TravelTips'
import ErrorBoundary from '../components/common/ErrorBoundary'
import ErrorState from '../components/common/ErrorState'
import AppleAIGlow from '../components/common/AppleAIGlow'
import useTrip from '../hooks/useTrip'
import useTripActions from '../hooks/useTripActions'
import useTripStatus from '../hooks/useTripStatus'

const PLANNING_MESSAGES = [
  'Analyzing destination...',
  'Finding attractions...',
  'Optimizing budget...',
  'Finding restaurants...',
  'Building itinerary...',
]

export default function HomePage() {
  const trip = useTrip()
  const { loading, error } = useTripStatus()
  const { retryTrip, clearError } = useTripActions()

  return (
    <AppleAIGlow loading={loading} messages={PLANNING_MESSAGES}>
      <Hero />
      <TripForm />

      {!loading && error ? (
        <ErrorState
          error={error}
          onRetry={() => {
            void retryTrip()
          }}
          onDismiss={clearError}
        />
      ) : null}

      {!loading && !error && trip ? (
        <ErrorBoundary
          title="Itinerary view crashed"
          message="Something went wrong while rendering your trip. Try regenerating or reloading."
        >
          <DestinationInfo />
          <Timeline />
          <BudgetSummary />
          <TravelTips />
        </ErrorBoundary>
      ) : null}
    </AppleAIGlow>
  )
}
