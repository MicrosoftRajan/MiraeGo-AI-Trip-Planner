import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  HiOutlineDownload,
  HiOutlineShare,
  HiOutlineArrowLeft,
} from 'react-icons/hi'
import { BookmarkIcon } from '@/components/icons'
import useTrip from '../../hooks/useTrip'
import useTripActions from '../../hooks/useTripActions'
import BudgetBreakdown from './BudgetBreakdown'
import FlightRecommendations from './FlightRecommendations'
import PackingList from './PackingList'
import RestaurantCard, { collectRestaurants } from './RestaurantCard'
import TravelTipsPanel from './TravelTipsPanel'
import TripTimeline from './TripTimeline'

function MapPlaceholder({ destination }) {
  return (
    <div className="dash-glass relative overflow-hidden rounded-[24px]">
      <div
        className="flex h-52 items-center justify-center sm:h-64"
        style={{
          background:
            'radial-gradient(circle at 30% 40%, rgb(124 108 255 / 0.2), transparent 50%), radial-gradient(circle at 70% 60%, rgb(61 214 198 / 0.15), transparent 45%), #0c1018',
        }}
      >
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">
            🗺️
          </div>
          <p className="dash-display text-lg font-bold text-white">
            {destination || 'Your route'}
          </p>
          <p className="mt-1 text-xs text-[var(--dash-muted)]">
            Interactive map coming soon
          </p>
        </div>
      </div>
      {/* faux grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden
      />
    </div>
  )
}

export default function TripResultView() {
  const trip = useTrip()
  const { clearTrip } = useTripActions()
  const reduce = useReducedMotion()
  const navigate = useNavigate()

  if (!trip) return null

  const restaurants = collectRestaurants(trip)
  const symbol = trip.budget?.currencySymbol ?? '¥'
  const title = trip.tripTitle || trip.title || trip.destination

  const handleShare = async () => {
    const text = `${title} — planned with Gilora`
    try {
      if (navigator.share) {
        await navigator.share({ title, text })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
      }
    } catch {
      /* user cancelled */
    }
  }

  const handleDownload = () => {
    const blob = new Blob(
      [
        `${title}\n${trip.summary || ''}\n\n`,
        ...(trip.days || []).map(
          (d) =>
            `Day ${d.day}: ${d.title || ''}\n${(d.stops || [])
              .map((s) => `  - ${s.time || ''} ${s.name || s.title || ''}`)
              .join('\n')}\n\n`,
        ),
      ],
      { type: 'text/plain' },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(title || 'gilora-trip').replace(/\s+/g, '-').toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      id="trip-result"
      className="space-y-8 pb-10"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => {
              clearTrip()
              navigate('/')
            }}
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-[var(--dash-muted)] transition hover:text-white"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            Back to dashboard
          </button>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#3dd6c6]">
            Generated trip
          </p>
          <h2 className="dash-display mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          {trip.summary ? (
            <p className="mt-2 max-w-2xl text-[var(--dash-muted)] leading-relaxed">
              {trip.summary}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--dash-soft)]">
            {trip.destination ? (
              <span className="rounded-full border border-white/10 px-2.5 py-1">
                {trip.destination}
              </span>
            ) : null}
            {trip.duration ? (
              <span className="rounded-full border border-white/10 px-2.5 py-1">
                {trip.duration}
              </span>
            ) : null}
            {trip.style ? (
              <span className="rounded-full border border-white/10 px-2.5 py-1">
                {trip.style}
              </span>
            ) : null}
            {trip.travelers ? (
              <span className="rounded-full border border-white/10 px-2.5 py-1">
                {trip.travelers} travelers
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionBtn icon={HiOutlineDownload} label="Download" onClick={handleDownload} />
          <ActionBtn icon={HiOutlineShare} label="Share" onClick={handleShare} />
          <ActionBtn
            icon={BookmarkIcon}
            label="Save Trip"
            onClick={() => {
              /* UI affordance — persistence later */
            }}
          />
        </div>
      </div>

      <MapPlaceholder destination={trip.destination} />

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
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a89bff]">
            Dining
          </p>
          <h3 className="dash-display mt-1 text-2xl font-bold text-white">
            Restaurants
          </h3>
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

function ActionBtn({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08]"
    >
      <Icon className="h-4 w-4 text-[#a89bff]" />
      {label}
    </button>
  )
}
