import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  HiOutlineCalendar,
  HiOutlineDownload,
  HiOutlinePencil,
  HiOutlineShare,
} from 'react-icons/hi'
import { BookmarkFilledIcon } from '@/components/icons'
import { DraggableCardBody } from '@/components/ui/draggable-card'
import { cn } from '../../utils'

function ActionButton({ label, icon: Icon, onClick, variant = 'default' }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick?.(e)
      }}
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        'inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition',
        variant === 'danger'
          ? 'text-red-600 hover:bg-red-50'
          : variant === 'primary'
            ? 'bg-[var(--dash-accent)] text-[var(--dash-on-accent)] hover:bg-[var(--dash-accent-hover)]'
            : 'border border-[var(--dash-border)] bg-[color-mix(in_srgb,var(--dash-bg)_90%,transparent)] text-[var(--dash-muted)] backdrop-blur-sm hover:bg-[var(--dash-surface)] hover:text-[var(--dash-text)]',
      )}
      aria-label={label}
      title={label}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

export default function SavedPlanCard({
  trip,
  collection,
  index = 0,
  isDragging = false,
  onShare,
  onDownload,
  onEdit,
  onRemoveBookmark,
  onNotesChange,
  onDragStart,
  onDragEnd,
}) {
  const reduce = useReducedMotion()
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesDraft, setNotesDraft] = useState(trip.notes || '')

  const saveNotes = () => {
    onNotesChange?.(trip.id, notesDraft.trim())
    setEditingNotes(false)
  }

  return (
    <motion.div
      layout
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn('mb-4 break-inside-avoid', isDragging && 'z-50')}
      data-trip-id={trip.id}
    >
      <DraggableCardBody
        snapBack
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className="!min-h-0 !w-full !rounded-2xl !bg-[var(--dash-card)] !p-0 !shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[var(--dash-border)]"
      >
        <div className="relative overflow-hidden">
          <div className="relative h-44 overflow-hidden">
            <img
              src={trip.image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <span className="absolute bottom-3 left-3 text-2xl drop-shadow-md">{trip.countryFlag}</span>
            {collection ? (
              <span
                className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm"
                style={{ backgroundColor: `${collection.color}cc` }}
              >
                {collection.name}
              </span>
            ) : null}
          </div>

          <div className="space-y-3 p-4">
            <div>
              <h3 className="text-base font-semibold tracking-tight text-[var(--dash-text)]">{trip.title}</h3>
              <p className="mt-0.5 text-sm text-[var(--dash-muted)]">{trip.destination}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-[var(--dash-text)]">{trip.budgetFormatted}</span>
              <span className="text-[#d1d5db]">·</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--dash-surface)] px-2 py-0.5 font-medium text-[var(--dash-muted)]">
                <HiOutlineCalendar className="h-3 w-3" />
                Saved {trip.createdDate}
              </span>
              <span className="rounded-full bg-[#f5f3ff] px-2 py-0.5 font-medium text-[#6d28d9]">
                {trip.travelStyle}
              </span>
            </div>

            <div className="rounded-xl bg-[var(--dash-surface)] px-3 py-2.5">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--dash-soft)]">Notes</p>
                {!editingNotes ? (
                  <button
                    type="button"
                    onClick={() => {
                      setNotesDraft(trip.notes || '')
                      setEditingNotes(true)
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="text-[10px] font-medium text-[var(--dash-muted)] hover:text-[var(--dash-text)]"
                  >
                    {trip.notes ? 'Edit' : 'Add'}
                  </button>
                ) : null}
              </div>
              <AnimatePresence mode="wait" initial={false}>
                {editingNotes ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <textarea
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      rows={3}
                      placeholder="Personal notes for this trip…"
                      className="dash-input min-h-[72px] resize-none text-xs"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={saveNotes}
                        className="rounded-lg bg-[var(--dash-accent)] px-3 py-1.5 text-[11px] font-medium text-[var(--dash-on-accent)]"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingNotes(false)}
                        className="rounded-lg px-3 py-1.5 text-[11px] font-medium text-[var(--dash-muted)]"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.p
                    key="view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs leading-relaxed text-[var(--dash-muted)]"
                  >
                    {trip.notes?.trim() || 'No notes yet — add a reminder or packing idea.'}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div
              className="flex flex-wrap gap-1.5 pt-0.5"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Link
                to={`/dashboard/trip/${trip.id}`}
                className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-[var(--dash-accent)] px-3 text-xs font-medium text-[var(--dash-on-accent)] transition hover:bg-[var(--dash-accent-hover)] sm:flex-none"
              >
                Open
              </Link>
              <ActionButton label="Share" icon={HiOutlineShare} onClick={() => onShare?.(trip)} />
              <ActionButton label="Edit" icon={HiOutlinePencil} onClick={() => onEdit?.(trip)} />
              <ActionButton
                label="Download PDF"
                icon={HiOutlineDownload}
                onClick={() => onDownload?.(trip)}
              />
              <ActionButton
                label="Remove Bookmark"
                icon={BookmarkFilledIcon}
                onClick={() => onRemoveBookmark?.(trip.id)}
                variant="danger"
              />
            </div>
          </div>
        </div>
      </DraggableCardBody>
    </motion.div>
  )
}
