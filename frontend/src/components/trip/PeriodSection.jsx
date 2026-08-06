import { cn, formatMoney } from '../../utils'
import StopCard from './StopCard'

const PERIOD_ACCENT = {
  morning: {
    badge: 'bg-sand/20 text-ink',
    dot: 'bg-sand',
    line: 'from-sand/50 to-sand/10',
  },
  afternoon: {
    badge: 'bg-sea/12 text-sea',
    dot: 'bg-sea',
    line: 'from-sea/50 to-sea/10',
  },
  evening: {
    badge: 'bg-ink/8 text-ink-muted',
    dot: 'bg-ink-muted',
    line: 'from-ink/30 to-ink/5',
  },
}

/**
 * Morning / Afternoon / Evening block within a day card.
 */
export default function PeriodSection({
  period,
  dayId,
  currencySymbol = '¥',
  onRemoveStop,
  onMoveStop,
  onUpdateStop,
  onToggleComplete,
  stopIndexOffset = 0,
  dayStopCount = 0,
  animate = false,
  className = '',
  style,
}) {
  const accent = PERIOD_ACCENT[period.id] ?? PERIOD_ACCENT.afternoon

  return (
    <section
      className={cn(
        'relative pl-1',
        animate && 'animate-slide-in-left',
        className,
      )}
      style={style}
      aria-labelledby={`period-${dayId}-${period.id}`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className={cn('h-2 w-2 rounded-full', accent.dot)}
            aria-hidden
          />
          <div>
            <h4
              id={`period-${dayId}-${period.id}`}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-ink"
            >
              {period.label}
            </h4>
            <p className="text-[11px] text-ink-soft">{period.hint}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'rounded-lg px-2 py-0.5 text-[11px] font-medium',
              accent.badge,
            )}
          >
            {period.stops.length} stop{period.stops.length === 1 ? '' : 's'}
          </span>
          {period.cost > 0 ? (
            <span className="text-xs font-medium text-ink-soft">
              ~{formatMoney(period.cost, currencySymbol)}
            </span>
          ) : null}
        </div>
      </div>

      <ul className="relative space-y-2.5 border-l border-divider pl-4 sm:pl-5">
        <span
          className={cn(
            'absolute -left-px top-0 h-full w-px bg-gradient-to-b',
            accent.line,
          )}
          aria-hidden
        />
        {period.stops.map((stop, i) => {
          const globalIndex = stopIndexOffset + i
          return (
            <StopCard
              key={stop.id}
              stop={stop}
              dayId={dayId}
              index={globalIndex}
              total={dayStopCount}
              currencySymbol={currencySymbol}
              onRemoveStop={onRemoveStop}
              onMoveStop={onMoveStop}
              onUpdateStop={onUpdateStop}
              onToggleComplete={onToggleComplete}
              animate={animate}
              style={
                animate ? { animationDelay: `${0.06 + i * 0.05}s` } : undefined
              }
            />
          )
        })}
      </ul>
    </section>
  )
}
