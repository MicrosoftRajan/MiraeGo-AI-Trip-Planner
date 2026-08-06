import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineTrash } from 'react-icons/hi'
import { cn } from '../../utils'

const STATUS_STYLES = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  upcoming: 'bg-blue-50 text-blue-700 border-blue-100',
  saved: 'bg-violet-50 text-violet-700 border-violet-100',
}

export default function TripCard({ trip, index = 0, onDelete }) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      className="dash-card-surface dash-card-lift group overflow-hidden"
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={trip.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <span
          className={cn(
            'absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
            STATUS_STYLES[trip.status] ?? STATUS_STYLES.saved,
          )}
        >
          {trip.status}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--dash-text)]">{trip.title}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--dash-muted)]">
            <span className="inline-flex items-center gap-1">
              <HiOutlineLocationMarker className="h-3.5 w-3.5" aria-hidden />
              {trip.destination}
            </span>
            <span className="inline-flex items-center gap-1">
              <HiOutlineCalendar className="h-3.5 w-3.5" aria-hidden />
              {trip.createdDate || trip.date}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="font-medium text-[var(--dash-text)]">
            {trip.budgetFormatted ?? trip.budget}
          </span>
          <span className="text-[var(--dash-muted)]">{trip.travellers} travellers</span>
        </div>

        <div className="flex gap-2 pt-1">
          <Link
            to={`/dashboard/trip/${trip.id}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-[var(--dash-accent)] text-sm font-medium text-[var(--dash-on-accent)] transition hover:bg-[var(--dash-accent-hover)]"
          >
            Open Trip
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--dash-border)] text-[var(--dash-muted)] transition hover:bg-[var(--dash-surface)] hover:text-[var(--dash-text)]"
            aria-label={`Delete ${trip.title}`}
            onClick={() => onDelete?.(trip.id)}
          >
            <HiOutlineTrash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
