import { useEffect, useId, useRef, useState } from 'react'
import { cn, formatMoney } from '../../utils'
import Button from '../common/Button'
import IconButton from '../common/IconButton'
import Input from '../common/Input'
import Textarea from '../common/Textarea'

const STOP_TYPES = [
  'Sightseeing',
  'Food',
  'Culture',
  'Nature',
  'Walk',
  'Adventure',
  'Shopping',
  'Relaxation',
]

/**
 * Single itinerary stop — complete, edit, reorder, and delete.
 */
export default function StopCard({
  stop,
  dayId,
  index,
  total,
  currencySymbol = '¥',
  onRemoveStop,
  onMoveStop,
  onUpdateStop,
  onToggleComplete,
  animate = true,
  className = '',
  style,
}) {
  const [editing, setEditing] = useState(false)
  const formId = useId()
  const nameRef = useRef(null)

  const completed = Boolean(stop.completed)
  const canAct = Boolean(
    onRemoveStop || onMoveStop || onUpdateStop || onToggleComplete,
  )

  useEffect(() => {
    if (editing) nameRef.current?.focus()
  }, [editing])

  function handleSave(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    if (!name) return

    onUpdateStop?.(dayId, stop.id, {
      name,
      time: String(data.get('time') || stop.time).trim() || stop.time,
      type: String(data.get('type') || stop.type),
      duration: String(data.get('duration') || '').trim() || stop.duration,
      notes: String(data.get('notes') || '').trim(),
      cost: Math.max(0, Number(data.get('cost')) || 0),
    })
    setEditing(false)
  }

  function handleCancel() {
    setEditing(false)
  }

  return (
    <li
      className={cn(
        'group rounded-2xl bg-panel p-3 transition-all duration-300 sm:p-4',
        completed ? 'bg-sea/[0.08]' : 'hover:bg-panel-hover hover:shadow-soft',
        animate && 'animate-fade-up',
        className,
      )}
      style={style}
      data-completed={completed || undefined}
    >
      {editing ? (
        <form
          id={formId}
          onSubmit={handleSave}
          className="space-y-3"
          aria-label={`Edit ${stop.name}`}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              ref={nameRef}
              label="Name"
              name="name"
              defaultValue={stop.name}
              required
              containerClassName="sm:col-span-2"
            />
            <Input
              label="Time"
              name="time"
              type="time"
              defaultValue={stop.time}
              required
            />
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink-muted">Type</span>
              <select
                name="type"
                defaultValue={stop.type}
                className="w-full rounded-2xl border border-border-input bg-input px-4 py-3 text-ink shadow-soft backdrop-blur-md transition-all duration-300 hover:bg-input-hover focus:border-sea/40 focus:bg-input-focus focus:outline-none focus:ring-2 focus:ring-sea/20"
              >
                {STOP_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="Duration"
              name="duration"
              defaultValue={stop.duration}
              placeholder="e.g. 2 hrs"
            />
            <Input
              label={`Cost (${currencySymbol})`}
              name="cost"
              type="number"
              min="0"
              step="1"
              defaultValue={stop.cost}
            />
          </div>
          <Textarea
            label="Notes"
            name="notes"
            defaultValue={stop.notes}
            rows={3}
            className="!min-h-[88px]"
          />
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save activity
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-start gap-3">
          {onToggleComplete ? (
            <CompleteToggle
              checked={completed}
              label={
                completed
                  ? `Mark ${stop.name} as incomplete`
                  : `Complete ${stop.name}`
              }
              onChange={() => onToggleComplete(dayId, stop.id)}
            />
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <time
                className={cn(
                  'text-xs font-semibold uppercase tracking-wider text-sea',
                  completed && 'opacity-60',
                )}
              >
                {stop.time}
              </time>
              <span className="rounded-lg bg-mist/80 px-2 py-0.5 text-xs font-medium text-ink-muted">
                {stop.type}
              </span>
              <span className="text-xs text-ink-soft">{stop.duration}</span>
              {completed ? (
                <span className="rounded-lg bg-sea/12 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-sea">
                  Done
                </span>
              ) : null}
            </div>
            <p
              className={cn(
                'mt-1.5 font-medium text-ink',
                completed && 'text-ink-muted line-through decoration-ink/25',
              )}
            >
              {stop.name}
            </p>
            <p
              className={cn(
                'mt-1 text-sm leading-relaxed text-ink-muted',
                completed && 'opacity-70',
              )}
            >
              {stop.notes}
            </p>
            {stop.cost > 0 ? (
              <p className="mt-2 text-sm font-medium text-ink-soft">
                ~{formatMoney(stop.cost, currencySymbol)}
              </p>
            ) : (
              <p className="mt-2 text-sm font-medium text-sea/80">Free</p>
            )}
          </div>

          {canAct ? (
            <div className="flex flex-wrap items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
              {onMoveStop ? (
                <>
                  <IconButton
                    label={`Move ${stop.name} up`}
                    disabled={index === 0}
                    onClick={() => onMoveStop(dayId, stop.id, 'up')}
                  >
                    <ArrowUpIcon />
                  </IconButton>
                  <IconButton
                    label={`Move ${stop.name} down`}
                    disabled={index === total - 1}
                    onClick={() => onMoveStop(dayId, stop.id, 'down')}
                  >
                    <ArrowDownIcon />
                  </IconButton>
                </>
              ) : null}
              {onUpdateStop ? (
                <IconButton
                  label={`Edit ${stop.name}`}
                  onClick={() => setEditing(true)}
                >
                  <EditIcon />
                </IconButton>
              ) : null}
              {onRemoveStop ? (
                <Button
                  variant="danger"
                  size="sm"
                  className="!px-2.5 !py-2"
                  aria-label={`Delete ${stop.name}`}
                  onClick={() => onRemoveStop(dayId, stop.id)}
                >
                  <TrashIcon />
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </li>
  )
}

function CompleteToggle({ checked, label, onChange }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/35 focus-visible:ring-offset-1 focus-visible:ring-offset-foam',
        checked
          ? 'border-sea bg-sea text-white shadow-soft'
          : 'border-ink/15 bg-panel text-transparent hover:border-sea/40 hover:bg-panel-hover',
      )}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <path
          d="M3.5 8.5 6.5 11.5 12.5 4.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M10 15V5M10 5 6 9M10 5l4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowDownIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M10 5v10M10 15l-4-4M10 15l4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
