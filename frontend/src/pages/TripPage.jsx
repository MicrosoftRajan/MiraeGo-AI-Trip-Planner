import { useCallback, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { Modal } from '@/components/ui/animated-modal'
import { useSavedTrips } from '../context/SavedTripsContext'
import { useTripContext } from '../context/TripContext'
import DashShell from '../components/dashboard/DashShell'
import DashboardMobileNav from '../components/dashboard/DashboardMobileNav'
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import FloatingShapes from '../components/dashboard/FloatingShapes'
import GenerateLoader from '../components/dashboard/GenerateLoader'
import TripFormModal from '../components/dashboard/TripFormModal'
import TripSummary from '../components/dashboard/TripSummary'
import useTripActions from '../hooks/useTripActions'
import useTripGenerationRedirect from '../hooks/useTripGenerationRedirect'
import useTripStatus from '../hooks/useTripStatus'

export default function TripPage() {
  const { id } = useParams()
  const { getTrip } = useSavedTrips()
  const { trip, setTrip } = useTripContext()
  const { generateTrip } = useTripActions()
  const { loading } = useTripStatus()
  const saved = getTrip(id)

  useTripGenerationRedirect()

  useEffect(() => {
    if (!saved || loading) return
    // Don't overwrite a freshly generated trip that is about to redirect.
    if (trip && trip.id && trip.id !== saved.id) return
    setTrip(saved.data)
  }, [id, saved, setTrip, loading, trip])

  const handleGenerate = useCallback(
    (data) => {
      void generateTrip(data)
    },
    [generateTrip],
  )

  if (!saved && !loading) {
    return <Navigate to="/dashboard/trips" replace />
  }

  return (
    <DashShell>
      <Modal>
        <div className="dashboard-root relative flex min-h-dvh">
          <FloatingShapes />
          <DashboardSidebar />
          <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
            <DashboardMobileNav />
            <main className="dash-scroll flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              {trip && !loading ? (
                <TripSummary />
              ) : (
                <div className="flex min-h-[40vh] items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--dash-border)] border-t-[var(--dash-accent)]" />
                </div>
              )}
            </main>
          </div>
          <TripFormModal onGenerate={handleGenerate} />
          <GenerateLoader active={loading} />
        </div>
      </Modal>
    </DashShell>
  )
}
