import useSelectedDay from '../../hooks/useSelectedDay'
import useTrip from '../../hooks/useTrip'
import useTripActions from '../../hooks/useTripActions'
import { formatMoney, sumStopCosts } from '../../utils'
import GlassCard from '../common/GlassCard'
import DayCard from './DayCard'

export default function Timeline() {
  const trip = useTrip()
  const { selectedDay, setSelectedDay } = useSelectedDay()
  const {
    removeStop,
    moveStop,
    updateDay,
    removeDay,
    updateStop,
    toggleStopComplete,
  } = useTripActions()

  if (!trip) return null

  const tripStopCost = trip.days.reduce(
    (sum, day) => sum + sumStopCosts(day.stops),
    0,
  )
  const symbol = trip.budget?.currencySymbol ?? '¥'

  return (
    <section id="timeline" className="content-auto scroll-mt-28 py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sea">
              Itinerary
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {trip.title}
            </h2>
            <p className="mt-3 text-ink-muted leading-relaxed">{trip.summary}</p>
          </div>

          <GlassCard className="animate-fade-up stagger-2 flex flex-wrap gap-x-5 gap-y-3 px-4 py-3.5 text-sm sm:gap-x-6 sm:px-5 sm:py-4">
            <Meta label="Where" value={trip.destination} />
            <Meta label="Length" value={trip.duration} />
            <Meta label="Travelers" value={String(trip.travelers)} />
            <Meta label="Style" value={trip.style} />
            <Meta
              label="Activities"
              value={formatMoney(tripStopCost, symbol)}
            />
          </GlassCard>
        </div>

        <div className="relative mt-10 space-y-4">
          <div
            className="timeline-spine absolute left-[2.35rem] top-6 bottom-6 hidden w-px origin-top bg-gradient-to-b from-sea/45 via-sand/40 to-sea/15 sm:block"
            aria-hidden
          />
          {trip.days.map((day, index) => (
            <DayCard
              key={day.id}
              day={day}
              index={index}
              expanded={selectedDay === day.id}
              onToggle={() =>
                setSelectedDay((current) => (current === day.id ? null : day.id))
              }
              onUpdateDay={updateDay}
              onDeleteDay={removeDay}
              onRemoveStop={removeStop}
              onMoveStop={moveStop}
              onUpdateStop={updateStop}
              onToggleComplete={toggleStopComplete}
              currencySymbol={symbol}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function Meta({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </p>
      <p className="mt-0.5 font-medium text-ink">{value}</p>
    </div>
  )
}
