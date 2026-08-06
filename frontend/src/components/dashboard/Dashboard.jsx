import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Modal, useModal } from '@/components/ui/animated-modal'
import useTripStatus from '../../hooks/useTripStatus'
import useTripActions from '../../hooks/useTripActions'
import useTripGenerationRedirect from '../../hooks/useTripGenerationRedirect'
import { useSavedTrips } from '../../context/SavedTripsContext'
import ErrorState from '../common/ErrorState'
import DashboardHeader from './DashboardHeader'
import DashboardMobileNav from './DashboardMobileNav'
import DashboardSidebar from './DashboardSidebar'
import FloatingShapes from './FloatingShapes'
import GenerateLoader from './GenerateLoader'
import PlannerCard from './PlannerCard'
import RecentTrips from './RecentTrips'
import StatsCards from './StatsCards'
import TripCard from './TripCard'
import TripFormModal from './TripFormModal'
import { AiIcon } from '@/components/icons'

export default function Dashboard({ search, onSearchChange }) {
  const { loading, error } = useTripStatus()
  const { generateTrip, retryTrip, clearError } = useTripActions()
  const { trips, removeTrip } = useSavedTrips()
  useTripGenerationRedirect()

  const galleryTrips = useMemo(
    () =>
      [...trips]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6),
    [trips],
  )

  const handleGenerate = useCallback(
    (data) => {
      void generateTrip(data)
    },
    [generateTrip],
  )

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm('Delete this trip? This cannot be undone.')) {
        removeTrip(id)
      }
    },
    [removeTrip],
  )

  return (
    <Modal>
      <div className="dashboard-root relative flex min-h-dvh">
        <FloatingShapes />
        <DashboardSidebar />
        <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
          <DashboardMobileNav />
          <div className="flex flex-1">
            <main className="dash-scroll flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              <DashboardHeader search={search} onSearchChange={onSearchChange} />
              {error ? (
                <div className="mb-6">
                  <ErrorState
                    error={error}
                    className="py-0 sm:py-0"
                    onRetry={() => void retryTrip()}
                    onDismiss={clearError}
                  />
                </div>
              ) : null}
              <div className="space-y-10">
                <StatsCards />
                <RecentTrips search={search} />
                <TripGallery trips={galleryTrips} onDelete={handleDelete} />
              </div>
            </main>
            <aside className="hidden w-[320px] shrink-0 border-l border-[var(--dash-border)] bg-[var(--dash-surface)] p-6 xl:block">
              <PlannerCard />
            </aside>
          </div>
        </div>
        <TripFormModal onGenerate={handleGenerate} />
        <GenerateLoader active={loading} />
      </div>
    </Modal>
  )
}

function TripGallery({ trips, onDelete }) {
  const { setOpen } = useModal()

  return (
    <section aria-labelledby="trip-cards-heading">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 id="trip-cards-heading" className="text-lg font-semibold text-[var(--dash-text)]">
          Trip Gallery
        </h2>
        {trips.length > 0 ? (
          <Link
            to="/dashboard/trips"
            className="text-sm font-medium text-[var(--dash-text)] transition hover:text-[var(--dash-muted)]"
          >
            View all
          </Link>
        ) : null}
      </div>
      {trips.length === 0 ? (
        <div className="dash-card-surface px-4 py-12 text-center">
          <p className="text-sm text-[var(--dash-muted)]">
            Your generated trips will show up here.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--dash-accent)] px-4 text-sm font-medium text-[var(--dash-on-accent)] transition hover:bg-[var(--dash-accent-hover)]"
          >
            <AiIcon className="h-4 w-4" alt="" />
            Plan a trip
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {trips.map((t, i) => (
            <TripCard key={t.id} trip={t} index={i} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  )
}
