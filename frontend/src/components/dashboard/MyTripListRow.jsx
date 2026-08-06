import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  HiOutlineDownload,
  HiOutlineDuplicate,
  HiOutlineShare,
  HiOutlineTrash,
} from 'react-icons/hi'

const STATUS_CLASS = {
  completed: 'dash-status--completed',
  upcoming: 'dash-status--upcoming',
  saved: 'dash-status--saved',
  draft: 'dash-status--draft',
}

export default function MyTripListRow({
  trip,
  index = 0,
  onDelete,
  onDuplicate,
  onShare,
  onDownload,
}) {
  const reduce = useReducedMotion()

  return (
    <motion.tr
      className="dash-table-row border-b border-[var(--dash-border)] last:border-0"
      initial={reduce ? false : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
    >
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
            <img src={trip.image} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--dash-text)]">{trip.title}</p>
            <p className="truncate text-xs text-[var(--dash-muted)]">
              {trip.countryFlag} {trip.destination}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 font-medium text-[var(--dash-text)]">{trip.budgetFormatted}</td>
      <td className="px-4 py-3.5 text-[var(--dash-muted)]">{trip.currency}</td>
      <td className="px-4 py-3.5 text-[var(--dash-muted)]">{trip.days}</td>
      <td className="px-4 py-3.5 text-[var(--dash-muted)]">{trip.travellers}</td>
      <td className="px-4 py-3.5 text-[var(--dash-muted)]">{trip.travelStyle}</td>
      <td className="px-4 py-3.5">
        <span className={`dash-status ${STATUS_CLASS[trip.status] ?? STATUS_CLASS.draft}`}>
          {trip.status}
        </span>
      </td>
      <td className="px-4 py-3.5 text-[var(--dash-muted)]">{trip.createdDate}</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1">
          <Link
            to={`/dashboard/trip/${trip.id}`}
            className="inline-flex h-8 items-center rounded-lg border border-[var(--dash-border)] px-3 text-xs font-medium text-[var(--dash-text)] transition hover:bg-[var(--dash-surface)]"
          >
            Open
          </Link>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--dash-border)] text-[var(--dash-muted)] transition hover:bg-[var(--dash-surface)] hover:text-[var(--dash-text)]"
            aria-label="Duplicate"
            onClick={() => onDuplicate?.(trip.id)}
          >
            <HiOutlineDuplicate className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--dash-border)] text-[var(--dash-muted)] transition hover:bg-[var(--dash-surface)] hover:text-[var(--dash-text)]"
            aria-label="Share"
            onClick={() => onShare?.(trip)}
          >
            <HiOutlineShare className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--dash-border)] text-[var(--dash-muted)] transition hover:bg-[var(--dash-surface)] hover:text-[var(--dash-text)]"
            aria-label="Download PDF"
            onClick={() => onDownload?.(trip)}
          >
            <HiOutlineDownload className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--dash-border)] text-red-500 transition hover:bg-red-50"
            aria-label="Delete"
            onClick={() => onDelete?.(trip.id)}
          >
            <HiOutlineTrash className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </motion.tr>
  )
}
