import { HiOutlineExternalLink, HiOutlineLightningBolt, HiOutlinePaperAirplane } from 'react-icons/hi'
import useTrip from '../../hooks/useTrip'
import { formatMoney, cn } from '../../utils'

const SCORE_STYLES = {
  'Best value': 'bg-[#ecfdf5] text-[#047857]',
  Fastest: 'bg-[#eff6ff] text-[#1d4ed8]',
  Recommended: 'bg-[var(--dash-accent)] text-[var(--dash-on-accent)]',
  Flexible: 'bg-[var(--dash-chip)] text-[#525252]',
}

function bookingSearchUrl(flight) {
  const q = encodeURIComponent(
    `${flight.airline} ${flight.from} to ${flight.to} ${flight.flightNumber || ''}`.trim(),
  )
  return `https://www.google.com/travel/flights?q=${q}`
}

function FlightCard({ flight }) {
  const badgeClass = SCORE_STYLES[flight.scoreLabel] || SCORE_STYLES.Flexible
  const symbol = flight.currencySymbol || '₹'

  return (
    <article className="dash-card-surface flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]',
                badgeClass,
              )}
            >
              {flight.scoreLabel || 'Option'}
            </span>
            {flight.cabin ? (
              <span className="text-[11px] font-medium text-[var(--dash-muted)]">{flight.cabin}</span>
            ) : null}
          </div>
          <h4 className="mt-2 truncate text-[15px] font-semibold text-[var(--dash-text)]">
            {flight.airline}
            {flight.flightNumber ? (
              <span className="ml-2 text-sm font-medium text-[var(--dash-muted)]">
                {flight.flightNumber}
              </span>
            ) : null}
          </h4>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold tabular-nums tracking-tight text-[var(--dash-text)]">
            {formatMoney(flight.price, symbol)}
          </p>
          <p className="text-[11px] text-[var(--dash-muted)]">{flight.currency || 'est.'}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold tabular-nums text-[var(--dash-text)]">
            {flight.departureTime || '—'}
          </p>
          <p className="mt-0.5 truncate text-xs text-[var(--dash-muted)]">{flight.from}</p>
        </div>

        <div className="flex min-w-[5.5rem] flex-col items-center gap-1 px-1">
          <p className="text-[11px] font-medium text-[var(--dash-muted)]">{flight.duration}</p>
          <div className="flex w-full items-center gap-1">
            <span className="h-px flex-1 bg-[#e5e5e5]" />
            <HiOutlinePaperAirplane className="h-3.5 w-3.5 rotate-90 text-[var(--dash-text)]" />
            <span className="h-px flex-1 bg-[#e5e5e5]" />
          </div>
          <p className="text-[11px] text-[var(--dash-muted)]">{flight.stops || '—'}</p>
        </div>

        <div className="min-w-0 flex-1 text-right">
          <p className="text-lg font-semibold tabular-nums text-[var(--dash-text)]">
            {flight.arrivalTime || '—'}
          </p>
          <p className="mt-0.5 truncate text-xs text-[var(--dash-muted)]">{flight.to}</p>
        </div>
      </div>

      {flight.bookingTip ? (
        <p className="rounded-xl bg-[var(--dash-surface)] px-3 py-2.5 text-xs leading-relaxed text-[var(--dash-muted)]">
          <span className="font-semibold text-[var(--dash-text)]">AI tip · </span>
          {flight.bookingTip}
        </p>
      ) : null}

      <a
        href={bookingSearchUrl(flight)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--dash-accent)] px-4 py-2.5 text-sm font-medium text-[var(--dash-on-accent)] transition hover:bg-[var(--dash-accent-hover)]"
      >
        Search to book
        <HiOutlineExternalLink className="h-4 w-4" />
      </a>
    </article>
  )
}

export default function FlightRecommendations() {
  const trip = useTrip()
  const flights = Array.isArray(trip?.flights) ? trip.flights : []

  if (!flights.length) return null

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
            Travel
          </p>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-semibold tracking-tight text-[var(--dash-text)] sm:text-2xl">
            <HiOutlineLightningBolt className="h-5 w-5 text-[var(--dash-text)]" />
            AI flight booking recommendations
          </h2>
          <p className="mt-1 max-w-xl text-sm text-[var(--dash-muted)]">
            Curated inbound options for {trip.destination || 'your trip'} — compare value,
            speed, and flexibility before you book.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
    </section>
  )
}
