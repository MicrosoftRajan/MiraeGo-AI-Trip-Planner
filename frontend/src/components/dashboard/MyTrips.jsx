import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components/ui/animated-modal'
import { useSavedTrips } from '../../context/SavedTripsContext'
import { useFilteredTrips, useUniqueDestinations } from '../../hooks/useFilteredTrips'
import { downloadTripPdf, shareTrip } from '../../utils/tripActions'
import DashboardMobileNav from './DashboardMobileNav'
import DashboardSidebar from './DashboardSidebar'
import FloatingShapes from './FloatingShapes'
import GenerateLoader from './GenerateLoader'
import MyTripCard from './MyTripCard'
import MyTripListRow from './MyTripListRow'
import MyTripsEmptyState from './MyTripsEmptyState'
import MyTripsToolbar from './MyTripsToolbar'
import TripFormModal from './TripFormModal'
import useTripActions from '../../hooks/useTripActions'
import useTripGenerationRedirect from '../../hooks/useTripGenerationRedirect'
import useTripStatus from '../../hooks/useTripStatus'

const DEFAULT_FILTERS = {
  destination: '',
  country: '',
  travelStyle: '',
  budget: '',
  status: '',
  date: '',
}

export default function MyTrips() {
  const navigate = useNavigate()
  const { trips, removeTrip, duplicateTrip } = useSavedTrips()
  const { loading } = useTripStatus()
  const { generateTrip } = useTripActions()
  useTripGenerationRedirect()

  const [search, setSearch] = useState('')
  const [view, setView] = useState('grid')
  const [sort, setSort] = useState('newest')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const destinations = useUniqueDestinations(trips)
  const filtered = useFilteredTrips(trips, { search, filters, sort })

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm('Delete this trip? This cannot be undone.')) {
        removeTrip(id)
      }
    },
    [removeTrip],
  )

  const handleDuplicate = useCallback(
    (id) => {
      const copy = duplicateTrip(id)
      if (copy) navigate(`/dashboard/trip/${copy.id}`)
    },
    [duplicateTrip, navigate],
  )

  const handleShare = useCallback(async (trip) => {
    await shareTrip(trip)
  }, [])

  const handleDownload = useCallback((trip) => {
    downloadTripPdf(trip)
  }, [])

  const handleGenerate = useCallback(
    (data) => {
      void generateTrip(data)
    },
    [generateTrip],
  )

  const isEmpty = trips.length === 0
  const noResults = !isEmpty && filtered.length === 0

  return (
    <Modal>
      <div className="dashboard-root relative flex min-h-dvh">
        <FloatingShapes />
        <DashboardSidebar />
        <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
          <DashboardMobileNav />
          <main className="dash-scroll flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {isEmpty ? (
              <MyTripsEmptyState />
            ) : (
              <div className="space-y-6">
                <MyTripsToolbar
                  search={search}
                  onSearchChange={setSearch}
                  view={view}
                  onViewChange={setView}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  sort={sort}
                  onSortChange={setSort}
                  destinations={destinations}
                  tripCount={trips.length}
                />

                {noResults ? (
                  <div className="dash-card-surface px-6 py-16 text-center">
                    <p className="text-sm text-[var(--dash-muted)]">No trips match your filters.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('')
                        setFilters(DEFAULT_FILTERS)
                      }}
                      className="mt-4 text-sm font-medium text-[var(--dash-text)] underline underline-offset-2"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : view === 'grid' ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((trip, i) => (
                      <MyTripCard
                        key={trip.id}
                        trip={trip}
                        index={i}
                        onDelete={handleDelete}
                        onDuplicate={handleDuplicate}
                        onShare={handleShare}
                        onDownload={handleDownload}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="dash-card-surface overflow-hidden">
                    <div className="dash-scroll overflow-x-auto">
                      <table className="w-full min-w-[960px] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-[var(--dash-border)] bg-[var(--dash-surface)] text-xs font-semibold uppercase tracking-wider text-[var(--dash-muted)]">
                            <th className="px-4 py-3">Trip</th>
                            <th className="px-4 py-3">Budget</th>
                            <th className="px-4 py-3">Currency</th>
                            <th className="px-4 py-3">Days</th>
                            <th className="px-4 py-3">Travellers</th>
                            <th className="px-4 py-3">Style</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Created</th>
                            <th className="px-4 py-3" />
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((trip, i) => (
                            <MyTripListRow
                              key={trip.id}
                              trip={trip}
                              index={i}
                              onDelete={handleDelete}
                              onDuplicate={handleDuplicate}
                              onShare={handleShare}
                              onDownload={handleDownload}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
        <TripFormModal onGenerate={handleGenerate} />
        <GenerateLoader active={loading} />
      </div>
    </Modal>
  )
}
