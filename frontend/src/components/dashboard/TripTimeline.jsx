import { useMemo } from 'react'
import { Timeline } from '@/components/ui/timeline'
import useTrip from '../../hooks/useTrip'
import useTripActions from '../../hooks/useTripActions'
import { formatMoney, sumStopCosts, cn } from '../../utils'

function DayContent({ day, symbol, onToggle }) {
  const dayCost = sumStopCosts(day.stops)
  const stops = day.stops || []

  return (
    <div>
      <div className="mb-5">
        <p className="text-sm font-semibold text-[var(--dash-text)] md:text-base">
          {day.title || `Day ${day.day}`}
        </p>
        <p className="mt-1 text-xs text-[var(--dash-muted)] md:text-sm">
          {stops.length} stop{stops.length === 1 ? '' : 's'}
          {dayCost > 0 ? ` · ${formatMoney(dayCost, symbol)}` : ''}
        </p>
        {day.summary || day.description ? (
          <p className="mt-3 text-xs leading-relaxed text-[var(--dash-muted)] md:text-sm">
            {day.summary || day.description}
          </p>
        ) : null}
      </div>

      <div className="space-y-2.5">
        {stops.map((stop) => (
          <div
            key={stop.id}
            className="flex items-start gap-3 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3.5 py-3 transition hover:border-[var(--dash-input-hover-border)] hover:bg-[var(--dash-card)]"
          >
            <button
              type="button"
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold transition',
                stop.completed
                  ? 'border-[var(--dash-accent)] bg-[var(--dash-accent)] text-[var(--dash-on-accent)]'
                  : 'border-[var(--dash-border)] text-transparent hover:border-[var(--dash-accent)]',
              )}
              aria-label={stop.completed ? 'Mark incomplete' : 'Mark complete'}
              onClick={() => onToggle(day.id, stop.id)}
            >
              ✓
            </button>

            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'text-sm font-medium text-[var(--dash-text)]',
                  stop.completed && 'line-through opacity-55',
                )}
              >
                {stop.name || stop.title}
              </p>
              <p className="mt-0.5 text-xs text-[var(--dash-muted)]">
                {[stop.time, stop.period, stop.type, stop.location]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {stop.notes || stop.description ? (
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--dash-soft)]">
                  {stop.notes || stop.description}
                </p>
              ) : null}
            </div>

            {stop.cost != null && Number(stop.cost) > 0 ? (
              <span className="shrink-0 text-xs font-semibold tabular-nums text-[var(--dash-text)]">
                {formatMoney(stop.cost, symbol)}
              </span>
            ) : null}
          </div>
        ))}

        {stops.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--dash-border)] px-4 py-6 text-center text-sm text-[var(--dash-soft)]">
            No stops planned for this day yet.
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default function TripTimeline() {
  const trip = useTrip()
  const { toggleStopComplete } = useTripActions()

  const symbol = trip?.budget?.currencySymbol ?? '¥'

  const data = useMemo(() => {
    if (!trip?.days?.length) return []
    return trip.days.map((day, index) => ({
      id: day.id,
      title: `Day ${day.day ?? index + 1}`,
      content: (
        <DayContent
          day={day}
          symbol={symbol}
          onToggle={toggleStopComplete}
        />
      ),
    }))
  }, [trip?.days, symbol, toggleStopComplete])

  if (!data.length) return null

  return (
    <section className="overflow-clip rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-card)] shadow-[0_1px_2px_rgb(0_0_0_/_0.03),0_4px_14px_rgb(0_0_0_/_0.03)]">
      <div className="border-b border-[var(--dash-border)] px-5 py-4 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
          Itinerary
        </p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-[var(--dash-text)] sm:text-2xl">
          Day-by-day timeline
        </h3>
      </div>

      <Timeline
        data={data}
        description={`${trip.days.length} day${trip.days.length === 1 ? '' : 's'} planned for ${trip.tripTitle || trip.title || trip.destination || 'your trip'}`}
        className="!bg-transparent md:!px-2"
      />
    </section>
  )
}
