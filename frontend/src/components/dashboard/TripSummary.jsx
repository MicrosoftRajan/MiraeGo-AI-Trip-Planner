import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  HiOutlineArrowLeft,
  HiOutlineDownload,
  HiOutlinePencil,
  HiOutlineShare,
} from 'react-icons/hi'
import { BookmarkIcon, BookmarkFilledIcon } from '@/components/icons'
import { useTripFormPrefill } from '../../context/TripFormPrefillContext'
import { useSavedTrips } from '../../context/SavedTripsContext'
import useTrip from '../../hooks/useTrip'
import useTripActions from '../../hooks/useTripActions'
import { tripToRequestPayload } from '../../utils/generationHistory'
import { downloadTripPdf, shareTrip } from '../../utils/tripActions'
import BudgetBreakdown from './BudgetBreakdown'
import FlightRecommendations from './FlightRecommendations'
import PackingList from './PackingList'
import RestaurantCard, { collectRestaurants } from './RestaurantCard'
import TravelTipsPanel from './TravelTipsPanel'
import TripTimeline from './TripTimeline'

function ActionBtn({ icon: Icon, label, onClick, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
        active
          ? 'border-[var(--dash-accent)] bg-[var(--dash-accent)]/10 text-[var(--dash-text)]'
          : 'border-[var(--dash-border)] bg-[var(--dash-card)] text-[var(--dash-text)] hover:bg-[var(--dash-surface)]'
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </button>
  )
}

export default function TripSummary() {
  const { id } = useParams()
  const trip = useTrip()
  const { clearTrip, setTrip } = useTripActions()
  const { getTrip, saveTrip } = useSavedTrips()
  const { openWithForm } = useTripFormPrefill()
  const reduce = useReducedMotion()
  const navigate = useNavigate()
  const [justSaved, setJustSaved] = useState(false)

  const saved = id ? getTrip(id) : null

  useEffect(() => {
    if (!justSaved) return undefined
    const t = window.setTimeout(() => setJustSaved(false), 2000)
    return () => window.clearTimeout(t)
  }, [justSaved])

  const handleSave = useCallback(() => {
    if (!trip) return
    const entry = saveTrip(trip, {
      id: trip.id || id,
      status: 'saved',
      requestPayload: saved?.requestPayload ?? undefined,
    })
    if (trip.id !== entry.id) {
      setTrip({ ...trip, id: entry.id })
    }
    setJustSaved(true)
  }, [trip, id, saveTrip, saved?.requestPayload, setTrip])

  const handleShare = useCallback(async () => {
    if (!trip) return
    const title = trip.tripTitle || trip.title || trip.destination
    const entryForActions = saved ?? {
      id: trip.id || id,
      title,
      destination: trip.destination,
      days: Array.isArray(trip.days) ? trip.days.length : 0,
      travellers: trip.travelers ?? 1,
      budgetFormatted: '',
      data: trip,
    }
    await shareTrip(entryForActions)
  }, [trip, saved, id])

  const handleDownload = useCallback(() => {
    if (!trip) return
    const title = trip.tripTitle || trip.title || trip.destination
    const entryForActions = saved ?? {
      id: trip.id || id,
      title,
      destination: trip.destination,
      days: Array.isArray(trip.days) ? trip.days.length : 0,
      travellers: trip.travelers ?? 1,
      budgetFormatted: '',
      data: trip,
    }
    downloadTripPdf(entryForActions)
  }, [trip, saved, id])

  const handleEdit = useCallback(() => {
    if (!trip) return
    const payload = saved?.requestPayload ?? tripToRequestPayload(trip)
    if (!payload) return
    openWithForm(payload)
  }, [trip, saved?.requestPayload, openWithForm])

  if (!trip) return null

  const restaurants = collectRestaurants(trip)
  const symbol = trip.budget?.currencySymbol ?? '¥'
  const title = trip.tripTitle || trip.title || trip.destination

  return (
    <motion.div
      id="trip-result"
      className="space-y-8 pb-12"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => {
              clearTrip()
              navigate('/dashboard')
            }}
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-[var(--dash-muted)] transition hover:text-[var(--dash-text)]"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            Back to dashboard
          </button>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dash-muted)]">
            Trip summary
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--dash-text)] sm:text-4xl">
            {title}
          </h1>
          {trip.summary ? (
            <p className="mt-2 max-w-2xl text-[var(--dash-muted)] leading-relaxed">
              {trip.summary}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionBtn
            icon={HiOutlineDownload}
            label="Download PDF"
            onClick={handleDownload}
          />
          <ActionBtn icon={HiOutlineShare} label="Share Trip" onClick={handleShare} />
          <ActionBtn
            icon={justSaved ? BookmarkFilledIcon : BookmarkIcon}
            label={justSaved ? 'Saved' : 'Save Trip'}
            onClick={handleSave}
            active={justSaved}
          />
          <ActionBtn icon={HiOutlinePencil} label="Edit Trip" onClick={handleEdit} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <TripTimeline />
        <div className="space-y-6">
          <BudgetBreakdown />
          <PackingList />
        </div>
      </div>

      <FlightRecommendations />

      {restaurants.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-[var(--dash-text)]">Restaurants</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r, i) => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                currencySymbol={symbol}
                index={i}
              />
            ))}
          </div>
        </section>
      ) : null}

      <TravelTipsPanel />
    </motion.div>
  )
}
