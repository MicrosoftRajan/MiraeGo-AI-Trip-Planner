import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useSavedTrips } from '../../context/SavedTripsContext'
import { useModal } from '@/components/ui/animated-modal'
import { AiIcon } from '@/components/icons'

const STATUS_CLASS = {
  completed: 'dash-status--completed',
  upcoming: 'dash-status--upcoming',
  saved: 'dash-status--saved',
  draft: 'dash-status--draft',
}

export default function RecentTrips({ search = '' }) {
  const reduce = useReducedMotion()
  const { trips } = useSavedTrips()
  const { setOpen } = useModal()

  const rows = useMemo(() => {
    const sorted = [...trips].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    )
    const q = search.trim().toLowerCase()
    if (!q) return sorted.slice(0, 8)
    return sorted
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          (t.travelStyle ?? '').toLowerCase().includes(q),
      )
      .slice(0, 8)
  }, [trips, search])

  return (
    <section aria-labelledby="recent-trips-heading">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 id="recent-trips-heading" className="text-lg font-semibold text-[var(--dash-text)]">
            Recent Trips
          </h2>
          <p className="mt-0.5 text-sm text-[var(--dash-muted)]">Your latest planned journeys</p>
        </div>
        {trips.length > 0 ? (
          <Link
            to="/dashboard/trips"
            className="text-sm font-medium text-[var(--dash-text)] transition hover:text-[var(--dash-muted)]"
          >
            View all
          </Link>
        ) : null}
      </div>

      <div className="dash-card-surface overflow-hidden">
        {trips.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-sm text-[var(--dash-muted)]">No trips yet. Plan your first adventure.</p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--dash-accent)] px-4 text-sm font-medium text-[var(--dash-on-accent)] transition hover:bg-[var(--dash-accent-hover)]"
            >
              <AiIcon className="h-4 w-4" alt="" />
              Plan a trip
            </button>
          </div>
        ) : (
          <div className="dash-scroll overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--dash-border)] bg-[var(--dash-surface)] text-xs font-semibold uppercase tracking-wider text-[var(--dash-muted)]">
                  <th className="px-4 py-3">Trip Name</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Currency</th>
                  <th className="px-4 py-3">Travellers</th>
                  <th className="px-4 py-3">Travel Style</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((trip, i) => (
                  <motion.tr
                    key={trip.id}
                    className="dash-table-row border-b border-[var(--dash-border)] last:border-0"
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                  >
                    <td className="px-4 py-3.5 font-medium text-[var(--dash-text)]">{trip.title}</td>
                    <td className="px-4 py-3.5 text-[var(--dash-muted)]">{trip.destination}</td>
                    <td className="px-4 py-3.5 text-[var(--dash-text)]">
                      {trip.budgetFormatted ?? trip.budget}
                    </td>
                    <td className="px-4 py-3.5 text-[var(--dash-muted)]">{trip.currency}</td>
                    <td className="px-4 py-3.5 text-[var(--dash-muted)]">{trip.travellers}</td>
                    <td className="px-4 py-3.5 text-[var(--dash-muted)]">{trip.travelStyle}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`dash-status ${STATUS_CLASS[trip.status] ?? STATUS_CLASS.draft}`}
                      >
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[var(--dash-muted)]">{trip.createdDate}</td>
                    <td className="px-4 py-3.5">
                      <Link
                        to={`/dashboard/trip/${trip.id}`}
                        className="inline-flex h-8 items-center rounded-lg border border-[var(--dash-border)] px-3 text-xs font-medium text-[var(--dash-text)] transition hover:bg-[var(--dash-surface)]"
                      >
                        Open
                      </Link>
                    </td>
                  </motion.tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-[var(--dash-muted)]">
                      No trips match your search.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
