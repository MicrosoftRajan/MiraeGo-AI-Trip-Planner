import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  HiOutlineRefresh,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineDocumentDuplicate,
  HiOutlineEye,
  HiOutlineTrash,
} from 'react-icons/hi'
import { cn } from '../../utils'

const STATUS_STYLES = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  failed: 'bg-red-50 text-red-700 border-red-100',
}

function MetaField({ label, value, icon: Icon }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--dash-soft)]">
        {label}
      </p>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-[var(--dash-text)] truncate">
        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--dash-muted)]" /> : null}
        <span className="truncate">{value}</span>
      </p>
    </div>
  )
}

function ActionButton({ label, icon: Icon, onClick, variant = 'default', disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition disabled:opacity-40 disabled:pointer-events-none',
        variant === 'danger'
          ? 'text-red-600 hover:bg-red-50'
          : 'border border-[var(--dash-border)] text-[var(--dash-muted)] hover:bg-[var(--dash-surface)] hover:text-[var(--dash-text)]',
      )}
      aria-label={label}
      title={label}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

export default function AIHistoryCard({
  entry,
  index = 0,
  onView,
  onReuse,
  onRegenerate,
  onDelete,
}) {
  const reduce = useReducedMotion()
  const canView = entry.status === 'success' && entry.tripId

  return (
    <motion.article
      className="dash-timeline-card dash-card-surface group relative overflow-hidden"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#111111]/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex flex-wrap items-start justify-between gap-3 p-5">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold text-[var(--dash-text)] line-clamp-2">
            {entry.prompt || 'No prompt provided'}
          </p>
          <p className="text-sm text-[var(--dash-muted)]">
            <span className="font-medium text-[var(--dash-text)]">{entry.destination}</span>
            <span className="mx-1.5 text-[#d4d4d8]">·</span>
            {entry.generatedTime}
          </p>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
            STATUS_STYLES[entry.status] ?? STATUS_STYLES.success,
          )}
        >
          {entry.status}
        </span>
      </div>

      <div className="grid gap-4 border-t border-[#f3f4f6] px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetaField label="Budget" value={entry.budgetFormatted} icon={HiOutlineCurrencyRupee} />
        <MetaField label="Travel Style" value={entry.travelStyle} />
        <MetaField
          label="Generation Duration"
          value={entry.durationFormatted}
          icon={HiOutlineClock}
        />
        <MetaField label="Generated Time" value={entry.generatedTime} />
      </div>

      {entry.status === 'failed' && entry.errorMessage ? (
        <div className="border-t border-[#f3f4f6] px-5 py-3">
          <p className="text-xs text-red-600">{entry.errorMessage}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 border-t border-[#f3f4f6] px-5 py-3">
        {canView ? (
          <ActionButton
            label="View"
            icon={HiOutlineEye}
            onClick={() => onView?.(entry)}
          />
        ) : (
          <ActionButton label="View" icon={HiOutlineEye} onClick={() => onView?.(entry)} disabled />
        )}
        <ActionButton
          label="Reuse Prompt"
          icon={HiOutlineDocumentDuplicate}
          onClick={() => onReuse?.(entry)}
        />
        <ActionButton
          label="Generate Again"
          icon={HiOutlineRefresh}
          onClick={() => onRegenerate?.(entry)}
        />
        {canView ? (
          <Link
            to={`/dashboard/trip/${entry.tripId}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--dash-border)] px-2.5 text-xs font-medium text-[var(--dash-muted)] transition hover:bg-[var(--dash-surface)] hover:text-[var(--dash-text)] sm:hidden"
          >
            <HiOutlineEye className="h-3.5 w-3.5" />
            Open trip
          </Link>
        ) : null}
        <ActionButton
          label="Delete"
          icon={HiOutlineTrash}
          onClick={() => onDelete?.(entry)}
          variant="danger"
        />
      </div>
    </motion.article>
  )
}
