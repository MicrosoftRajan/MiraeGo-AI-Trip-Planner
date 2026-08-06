import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiIcon } from '@/components/icons'
import { Modal, useModal } from '@/components/ui/animated-modal'
import { useGenerationHistory } from '../../context/GenerationHistoryContext'
import { useTripFormPrefill } from '../../context/TripFormPrefillContext'
import {
  useFilteredHistory,
  useUniqueHistoryDestinations,
} from '../../hooks/useFilteredHistory'
import useTripActions from '../../hooks/useTripActions'
import useTripGenerationRedirect from '../../hooks/useTripGenerationRedirect'
import useTripStatus from '../../hooks/useTripStatus'
import DashboardMobileNav from './DashboardMobileNav'
import DashboardSidebar from './DashboardSidebar'
import FloatingShapes from './FloatingShapes'
import GenerateLoader from './GenerateLoader'
import AIHistorySkeleton from './AIHistorySkeleton'
import AIHistoryTimeline from './AIHistoryTimeline'
import AIHistoryToolbar from './AIHistoryToolbar'
import TripFormModal from './TripFormModal'

const DEFAULT_FILTERS = {
  destination: '',
  status: '',
  date: '',
}

export default function AIHistory() {
  const navigate = useNavigate()
  const { entries, hydrated, removeEntry } = useGenerationHistory()
  const { openWithForm } = useTripFormPrefill()
  const { setOpen } = useModal()
  const { loading } = useTripStatus()
  const { generateTrip } = useTripActions()
  useTripGenerationRedirect()

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [showSkeleton, setShowSkeleton] = useState(() => entries.length > 0)

  useEffect(() => {
    if (!hydrated || entries.length === 0) {
      setShowSkeleton(false)
      return undefined
    }
    const timer = window.setTimeout(() => setShowSkeleton(false), 320)
    return () => window.clearTimeout(timer)
  }, [hydrated, entries.length])

  const destinations = useUniqueHistoryDestinations(entries)
  const filtered = useFilteredHistory(entries, { search, filters, sort })

  const successCount = useMemo(
    () => entries.filter((e) => e.status === 'success').length,
    [entries],
  )
  const failedCount = useMemo(
    () => entries.filter((e) => e.status === 'failed').length,
    [entries],
  )

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleView = useCallback(
    (entry) => {
      if (entry.status === 'success' && entry.tripId) {
        navigate(`/dashboard/trip/${entry.tripId}`)
      }
    },
    [navigate],
  )

  const handleReuse = useCallback(
    (entry) => {
      if (entry.payload) {
        openWithForm(entry.payload)
      }
    },
    [openWithForm],
  )

  const handleRegenerate = useCallback(
    (entry) => {
      if (entry.payload) {
        void generateTrip(entry.payload)
      }
    },
    [generateTrip],
  )

  const handleDelete = useCallback(
    (entry) => {
      if (window.confirm('Delete this generation from history?')) {
        removeEntry(entry.id)
      }
    },
    [removeEntry],
  )

  const handleGenerate = useCallback(
    (data) => {
      void generateTrip(data)
    },
    [generateTrip],
  )

  const isEmpty = entries.length === 0
  const noResults = !isEmpty && filtered.length === 0

  return (
    <div className="dashboard-root relative flex min-h-dvh">
      <FloatingShapes />
      <DashboardSidebar />
      <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
        <DashboardMobileNav />
        <main className="dash-scroll flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {showSkeleton && !isEmpty ? (
            <div className="space-y-6">
              <AIHistoryToolbar
                search=""
                onSearchChange={() => {}}
                filters={DEFAULT_FILTERS}
                onFilterChange={() => {}}
                sort="newest"
                onSortChange={() => {}}
                destinations={[]}
                entryCount={entries.length}
                successCount={successCount}
                failedCount={failedCount}
              />
              <AIHistorySkeleton />
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--dash-surface)] border border-[var(--dash-border)]">
                <AiIcon className="h-7 w-7" alt="" />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-[var(--dash-text)]">No generations yet</h2>
              <p className="mt-2 max-w-sm text-sm text-[var(--dash-muted)]">
                Every AI trip you generate will appear here in a chronological timeline — prompts,
                destinations, and outcomes.
              </p>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--dash-accent)] px-5 text-sm font-medium text-[var(--dash-on-accent)] transition hover:bg-[var(--dash-accent-hover)]"
              >
                <AiIcon className="h-4 w-4" alt="" />
                Generate your first trip
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <AIHistoryToolbar
                search={search}
                onSearchChange={setSearch}
                filters={filters}
                onFilterChange={handleFilterChange}
                sort={sort}
                onSortChange={setSort}
                destinations={destinations}
                entryCount={entries.length}
                successCount={successCount}
                failedCount={failedCount}
              />

              {noResults ? (
                <div className="dash-card-surface px-6 py-16 text-center">
                  <p className="text-sm text-[var(--dash-muted)]">No generations match your filters.</p>
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
              ) : (
                <AIHistoryTimeline
                  entries={filtered}
                  onView={handleView}
                  onReuse={handleReuse}
                  onRegenerate={handleRegenerate}
                  onDelete={handleDelete}
                />
              )}
            </div>
          )}
        </main>
      </div>
      <TripFormModal onGenerate={handleGenerate} />
      <GenerateLoader active={loading} />
    </div>
  )
}

/** Wraps AI History with modal provider (required for trip form + toolbar actions). */
export function AIHistoryPageShell() {
  return (
    <Modal>
      <AIHistory />
    </Modal>
  )
}
