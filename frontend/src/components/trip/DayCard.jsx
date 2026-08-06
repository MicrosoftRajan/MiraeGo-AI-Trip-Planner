import { useEffect, useId, useRef, useState } from 'react'
import { cn, formatMoney, groupStopsByPeriod, sumStopCosts } from '../../utils'
import Button from '../common/Button'
import ExpandableCard, { ExpandChevron } from '../common/ExpandableCard'
import IconButton from '../common/IconButton'
import Input from '../common/Input'
import PeriodSection from './PeriodSection'

/**
 * Reusable day card — expand/collapse, edit, delete, and complete activities.
 */
export default function DayCard({
  day,
  expanded,
  onToggle,
  onUpdateDay,
  onDeleteDay,
  onRemoveStop,
  onMoveStop,
  onUpdateStop,
  onToggleComplete,
  currencySymbol = '¥',
  index = 0,
}) {
  const [editing, setEditing] = useState(false)
  const titleRef = useRef(null)
  const bodyId = useId()

  const periods = groupStopsByPeriod(day.stops)
  const estimatedCost = sumStopCosts(day.stops)
  const stopCount = day.stops.length
  const completedCount = day.stops.filter((s) => s.completed).length
  const progress =
    stopCount === 0 ? 0 : Math.round((completedCount / stopCount) * 100)

  let runningIndex = 0

  useEffect(() => {
    if (editing) titleRef.current?.focus()
  }, [editing])

  function startEdit(event) {
    event.stopPropagation()
    if (!onUpdateDay) return
    if (!expanded) onToggle?.()
    setEditing(true)
  }

  function handleDelete(event) {
    event.stopPropagation()
    if (!onDeleteDay) return
    const ok = window.confirm(
      `Delete Day ${day.day} — “${day.title}”? This cannot be undone.`,
    )
    if (ok) onDeleteDay(day.id)
  }

  function handleSaveDay(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const title = String(data.get('title') || '').trim()
    const theme = String(data.get('theme') || '').trim()
    if (!title) return
    onUpdateDay?.(day.id, { title, theme })
    setEditing(false)
  }

  const actions =
    onUpdateDay || onDeleteDay ? (
      <>
        {onUpdateDay ? (
          <IconButton
            label={editing ? `Cancel editing Day ${day.day}` : `Edit Day ${day.day}`}
            onClick={editing ? () => setEditing(false) : startEdit}
            className={cn(editing && 'bg-chip-hover text-ink')}
          >
            <EditIcon />
          </IconButton>
        ) : null}
        {onDeleteDay ? (
          <IconButton
            label={`Delete Day ${day.day}`}
            onClick={handleDelete}
            className="hover:bg-coral/10 hover:text-coral"
          >
            <TrashIcon />
          </IconButton>
        ) : null}
      </>
    ) : null

  return (
    <ExpandableCard
      expanded={expanded}
      onToggle={() => {
        if (editing) setEditing(false)
        onToggle?.()
      }}
      bodyId={bodyId}
      actions={actions}
      className="animate-fade-up"
      style={{ animationDelay: `${index * 0.09}s` }}
      bodyClassName="space-y-6 !pt-5"
      header={
        <>
          <span
            className={cn(
              'flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl text-sea transition-all duration-300',
              expanded ? 'bg-sea text-white shadow-soft scale-105' : 'bg-sea/12',
              progress === 100 && stopCount > 0 && !expanded && 'bg-sea text-white',
            )}
            aria-hidden
          >
            <span
              className={cn(
                'text-[10px] font-semibold uppercase tracking-wider',
                expanded || (progress === 100 && stopCount > 0)
                  ? 'opacity-80'
                  : 'opacity-70',
              )}
            >
              Day
            </span>
            <span className="font-display text-xl font-semibold leading-none">
              {day.day}
            </span>
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold text-ink sm:text-xl">
                  {day.title}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">{day.theme}</p>
              </div>
              <ExpandChevron
                expanded={expanded}
                className="hidden sm:flex"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-mist/80 px-2.5 py-1 text-xs font-medium text-ink-muted">
                {stopCount} stop{stopCount === 1 ? '' : 's'}
              </span>
              {stopCount > 0 ? (
                <span
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-xs font-medium',
                    progress === 100
                      ? 'bg-sea/12 text-sea'
                      : 'bg-chip text-ink-soft',
                  )}
                  aria-label={`${completedCount} of ${stopCount} activities complete`}
                >
                  {completedCount}/{stopCount} done
                </span>
              ) : null}
              {periods.map((p) => (
                <span
                  key={p.id}
                  className="rounded-lg bg-chip px-2.5 py-1 text-xs font-medium text-ink-soft"
                >
                  {p.label}
                </span>
              ))}
              <span className="w-full rounded-lg bg-sea/10 px-2.5 py-1 text-xs font-semibold text-sea sm:ml-auto sm:w-auto">
                Est. {formatMoney(estimatedCost, currencySymbol)}
              </span>
            </div>

            {stopCount > 0 ? (
              <div
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist/80"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-label={`Day ${day.day} progress`}
              >
                <div
                  className="h-full rounded-full bg-sea transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            ) : null}
          </div>

          <ExpandChevron expanded={expanded} className="sm:hidden" />
        </>
      }
    >
      {editing ? (
        <form
          onSubmit={handleSaveDay}
          className="space-y-3 rounded-2xl bg-chip p-4"
          aria-label={`Edit Day ${day.day}`}
        >
          <Input
            ref={titleRef}
            label="Day title"
            name="title"
            defaultValue={day.title}
            required
          />
          <Input
            label="Theme"
            name="theme"
            defaultValue={day.theme}
            placeholder="e.g. Temples & tea"
          />
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save day
            </Button>
          </div>
        </form>
      ) : null}

      {stopCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/10 px-4 py-8 text-center text-sm text-ink-soft">
          No stops left on this day.
        </div>
      ) : (
        <>
          {periods.map((period, periodIndex) => {
            const offset = runningIndex
            runningIndex += period.stops.length
            return (
              <PeriodSection
                key={period.id}
                period={period}
                dayId={day.id}
                currencySymbol={currencySymbol}
                onRemoveStop={onRemoveStop}
                onMoveStop={onMoveStop}
                onUpdateStop={onUpdateStop}
                onToggleComplete={onToggleComplete}
                stopIndexOffset={offset}
                dayStopCount={stopCount}
                animate={expanded}
                style={{ animationDelay: `${periodIndex * 0.08}s` }}
              />
            )
          })}

          <footer className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sea/5 px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
                Estimated cost
              </p>
              {stopCount > 0 ? (
                <p className="mt-1 text-xs text-ink-muted">
                  {completedCount} of {stopCount} activities complete
                </p>
              ) : null}
            </div>
            <p className="font-display text-lg font-semibold text-ink">
              {formatMoney(estimatedCost, currencySymbol)}
            </p>
          </footer>
        </>
      )}
    </ExpandableCard>
  )
}

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M4 13.5V16h2.5L15 7.5 12.5 5 4 13.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="m11.5 6 2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M5 6h10M8 6V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1m2 0v9a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 5 15V6h10Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
