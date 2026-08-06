import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  HiOutlineCalendar,
  HiOutlineDuplicate,
  HiOutlineDownload,
  HiOutlineShare,
  HiOutlineTrash,
  HiOutlineUsers,
} from 'react-icons/hi'
import { cn } from '../../utils'

const STATUS_STYLES = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  upcoming: 'bg-blue-50 text-blue-700 border-blue-100',
  saved: 'bg-violet-50 text-violet-700 border-violet-100',
  draft: 'bg-gray-50 text-gray-600 border-gray-100',
}

function ActionButton({ label, icon: Icon, onClick, variant = 'default' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition',
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

export default function MyTripCard({
  trip,
  index = 0,
  onDelete,
  onDuplicate,
  onShare,
  onDownload,
}) {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      className="dash-card-surface dash-card-lift group relative overflow-hidden"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/dashboard/trip/${trip.id}`} className="block">
        <div className="relative h-40 overflow-hidden">
          <img
            src={trip.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
          <span
            className={cn(
              'absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm',
              STATUS_STYLES[trip.status] ?? STATUS_STYLES.saved,
            )}
          >
            {trip.status}
          </span>
          <span className="absolute bottom-3 left-3 text-2xl drop-shadow-md">{trip.countryFlag}</span>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <Link to={`/dashboard/trip/${trip.id}`} className="block">
          <h3 className="text-base font-semibold text-[var(--dash-text)] transition group-hover:text-[#333333]">
            {trip.title}
          </h3>
          <p className="mt-0.5 text-sm text-[var(--dash-muted)]">{trip.destination}</p>
        </Link>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--dash-muted)]">
          <span className="font-medium text-[var(--dash-text)]">{trip.budgetFormatted}</span>
          <span>{trip.currency}</span>
          <span>{trip.days} days</span>
          <span className="inline-flex items-center gap-1">
            <HiOutlineUsers className="h-3.5 w-3.5" />
            {trip.travellers}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[var(--dash-surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--dash-muted)]">
            {trip.travelStyle}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--dash-surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--dash-muted)]">
            <HiOutlineCalendar className="h-3 w-3" />
            {trip.createdDate}
          </span>
        </div>

        <motion.div
          className="flex flex-wrap gap-1.5 pt-1"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0.85 }}
        >
          <Link
            to={`/dashboard/trip/${trip.id}`}
            className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-[var(--dash-accent)] text-xs font-medium text-[var(--dash-on-accent)] transition hover:bg-[var(--dash-accent-hover)] sm:flex-none sm:px-4"
          >
            Open
          </Link>
          <ActionButton label="Duplicate" icon={HiOutlineDuplicate} onClick={() => onDuplicate?.(trip.id)} />
          <ActionButton label="Share" icon={HiOutlineShare} onClick={() => onShare?.(trip)} />
          <ActionButton label="PDF" icon={HiOutlineDownload} onClick={() => onDownload?.(trip)} />
          <ActionButton
            label="Delete"
            icon={HiOutlineTrash}
            onClick={() => onDelete?.(trip.id)}
            variant="danger"
          />
        </motion.div>
      </div>
    </motion.article>
  )
}
