import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HiOutlineSearch } from 'react-icons/hi'
import { Modal } from '@/components/ui/animated-modal'
import { DraggableCardContainer } from '@/components/ui/draggable-card'
import { useCollections } from '../../context/CollectionsContext'
import { useSavedTrips } from '../../context/SavedTripsContext'
import { downloadTripPdf, shareTrip } from '../../utils/tripActions'
import DashboardMobileNav from './DashboardMobileNav'
import DashboardSidebar from './DashboardSidebar'
import FloatingShapes from './FloatingShapes'
import GenerateLoader from './GenerateLoader'
import SavedPlanCard from './SavedPlanCard'
import SavedPlansCollections from './SavedPlansCollections'
import SavedPlansEmptyState from './SavedPlansEmptyState'
import TripFormModal from './TripFormModal'
import useTripActions from '../../hooks/useTripActions'
import useTripGenerationRedirect from '../../hooks/useTripGenerationRedirect'
import useTripStatus from '../../hooks/useTripStatus'

function findCollectionDropTarget(point) {
  const stack = document.elementsFromPoint(point.x, point.y)
  for (const el of stack) {
    const zone = el.closest?.('[data-collection-id]')
    if (zone) return zone.getAttribute('data-collection-id')
  }
  return null
}

export default function SavedPlans() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const { trips, removeTrip, updateTripNotes } = useSavedTrips()
  const {
    collections,
    createCollection,
    deleteCollection,
    moveTripToCollection,
    getCollectionForTrip,
    getTripsForCollection,
  } = useCollections()
  const { loading } = useTripStatus()
  const { generateTrip } = useTripActions()
  useTripGenerationRedirect()

  const [activeCollection, setActiveCollection] = useState('all')
  const [search, setSearch] = useState('')
  const [draggingTripId, setDraggingTripId] = useState(null)
  const [dropTargetId, setDropTargetId] = useState(null)
  const [toast, setToast] = useState(null)

  const tripCounts = useMemo(() => {
    const counts = {}
    for (const c of collections) counts[c.id] = c.tripIds.length
    return counts
  }, [collections])

  const uncategorizedCount = useMemo(() => {
    const assigned = new Set(collections.flatMap((c) => c.tripIds))
    return trips.filter((t) => !assigned.has(t.id)).length
  }, [collections, trips])

  const collectionTrips = getTripsForCollection(activeCollection)

  const visibleTrips = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return collectionTrips
    return collectionTrips.filter((t) =>
      [t.title, t.destination, t.country, t.travelStyle, t.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [collectionTrips, search])

  const activeMeta = useMemo(() => {
    if (activeCollection === 'all') return { name: 'All Saved', color: '#111111' }
    if (activeCollection === 'uncategorized') return { name: 'Uncategorized', color: '#9ca3af' }
    const c = collections.find((col) => col.id === activeCollection)
    return c ? { name: c.name, color: c.color } : { name: 'Saved Plans', color: '#111111' }
  }, [activeCollection, collections])

  const showToast = useCallback((message) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }, [])

  const handleRemoveBookmark = useCallback(
    (id) => {
      if (window.confirm('Remove this bookmark? The itinerary will be deleted from your saved plans.')) {
        removeTrip(id)
        showToast('Bookmark removed')
      }
    },
    [removeTrip, showToast],
  )

  const handleShare = useCallback(async (trip) => {
    await shareTrip(trip)
  }, [])

  const handleDownload = useCallback((trip) => {
    downloadTripPdf(trip)
  }, [])

  const handleEdit = useCallback(
    (trip) => {
      navigate(`/dashboard/trip/${trip.id}`)
    },
    [navigate],
  )

  const handleCreateCollection = useCallback(
    (name, color) => {
      const created = createCollection(name, color)
      setActiveCollection(created.id)
      showToast(`Created “${created.name}”`)
    },
    [createCollection, showToast],
  )

  const handleDeleteCollection = useCallback(
    (id) => {
      deleteCollection(id)
      if (activeCollection === id) setActiveCollection('all')
      showToast('Collection deleted')
    },
    [activeCollection, deleteCollection, showToast],
  )

  const handleDragStart = useCallback((tripId) => {
    setDraggingTripId(tripId)
  }, [])

  useEffect(() => {
    if (!draggingTripId) return undefined

    const onMove = (event) => {
      setDropTargetId(findCollectionDropTarget({ x: event.clientX, y: event.clientY }))
    }

    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [draggingTripId])

  const handleDragEnd = useCallback(
    (tripId) => (event, info) => {
      const point = {
        x: info?.point?.x ?? event?.clientX ?? 0,
        y: info?.point?.y ?? event?.clientY ?? 0,
      }
      const targetId = findCollectionDropTarget(point)

      setDraggingTripId(null)
      setDropTargetId(null)

      if (!targetId || targetId === 'all') return

      const current = getCollectionForTrip(tripId)
      if (current?.id === targetId) return
      if (!current && targetId === 'uncategorized') return

      moveTripToCollection(tripId, targetId)
      const dest =
        targetId === 'uncategorized'
          ? 'Uncategorized'
          : collections.find((c) => c.id === targetId)?.name ?? 'collection'
      showToast(`Moved to ${dest}`)
    },
    [collections, getCollectionForTrip, moveTripToCollection, showToast],
  )

  const handleGenerate = useCallback(
    (data) => {
      void generateTrip(data)
    },
    [generateTrip],
  )

  const isEmpty = trips.length === 0

  return (
    <Modal>
      <div className="dashboard-root relative flex min-h-dvh">
        <FloatingShapes />
        <DashboardSidebar />
        <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
          <DashboardMobileNav />
          <main className="dash-scroll flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {isEmpty ? (
              <SavedPlansEmptyState />
            ) : (
              <div className="mx-auto max-w-7xl space-y-6">
                <motion.header
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dash-soft)]">
                      Bookmarks
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--dash-text)] sm:text-3xl">
                      Saved Plans
                    </h1>
                    <p className="mt-1.5 max-w-lg text-sm text-[var(--dash-muted)]">
                      Your bookmarked itineraries, organized into collections. Drag a card onto a
                      collection to file it away.
                    </p>
                  </div>

                  <div className="relative w-full sm:max-w-xs">
                    <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dash-soft)]" />
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search saved plans…"
                      className="dash-input pl-9"
                    />
                  </div>
                </motion.header>

                <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
                  <SavedPlansCollections
                    collections={collections}
                    activeId={activeCollection}
                    onSelect={setActiveCollection}
                    tripCounts={tripCounts}
                    allCount={trips.length}
                    uncategorizedCount={uncategorizedCount}
                    onCreate={handleCreateCollection}
                    onDelete={handleDeleteCollection}
                    dropTargetId={dropTargetId}
                  />

                  <section className="min-w-0">
                    <div className="mb-4 flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: activeMeta.color }}
                      />
                      <h2 className="text-sm font-semibold text-[var(--dash-text)]">{activeMeta.name}</h2>
                      <span className="text-xs text-[var(--dash-soft)]">{visibleTrips.length} plans</span>
                      {draggingTripId ? (
                        <motion.span
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="ml-auto text-xs font-medium text-[var(--dash-muted)]"
                        >
                          Drop onto a collection →
                        </motion.span>
                      ) : null}
                    </div>

                    {visibleTrips.length === 0 ? (
                      <div className="dash-card-surface px-6 py-16 text-center">
                        <p className="text-sm text-[var(--dash-muted)]">
                          {search
                            ? 'No plans match your search.'
                            : 'This collection is empty. Drag a trip here from another collection.'}
                        </p>
                      </div>
                    ) : (
                      <DraggableCardContainer className="columns-1 gap-4 sm:columns-2 xl:columns-3">
                        <AnimatePresence mode="popLayout">
                          {visibleTrips.map((trip, i) => (
                            <SavedPlanCard
                              key={trip.id}
                              trip={trip}
                              collection={getCollectionForTrip(trip.id)}
                              index={i}
                              isDragging={draggingTripId === trip.id}
                              onShare={handleShare}
                              onDownload={handleDownload}
                              onEdit={handleEdit}
                              onRemoveBookmark={handleRemoveBookmark}
                              onNotesChange={updateTripNotes}
                              onDragStart={() => handleDragStart(trip.id)}
                              onDragEnd={handleDragEnd(trip.id)}
                            />
                          ))}
                        </AnimatePresence>
                      </DraggableCardContainer>
                    )}
                  </section>
                </div>
              </div>
            )}
          </main>
        </div>

        <AnimatePresence>
          {toast ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[var(--dash-accent)] px-4 py-2.5 text-xs font-medium text-[var(--dash-on-accent)] shadow-lg"
            >
              {toast}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <TripFormModal onGenerate={handleGenerate} />
        <GenerateLoader active={loading} />
      </div>
    </Modal>
  )
}
