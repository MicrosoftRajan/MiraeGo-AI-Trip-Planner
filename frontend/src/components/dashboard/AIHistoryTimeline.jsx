import { motion, useReducedMotion } from 'framer-motion'
import AIHistoryCard from './AIHistoryCard'
import { groupEntriesByDate } from '../../hooks/useFilteredHistory'

export default function AIHistoryTimeline({ entries, onView, onReuse, onRegenerate, onDelete }) {
  const reduce = useReducedMotion()
  const groups = groupEntriesByDate(entries)

  return (
    <div className="space-y-10">
      {groups.map((group, groupIndex) => (
        <section key={group.label}>
          <motion.div
            className="mb-5 flex items-center gap-3"
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIndex * 0.05, duration: 0.3 }}
          >
            <h2 className="text-sm font-semibold text-[var(--dash-text)]">{group.label}</h2>
            <span className="rounded-full bg-[var(--dash-surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--dash-muted)]">
              {group.items.length}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-[#ececec] to-transparent" />
          </motion.div>

          <ol className="dash-timeline" aria-label={`Generations on ${group.label}`}>
            {group.items.map((entry, index) => (
              <li key={entry.id} className="dash-timeline-item">
                <div className="dash-timeline-marker" aria-hidden>
                  <span
                    className={
                      entry.status === 'success'
                        ? 'dash-timeline-dot dash-timeline-dot--success'
                        : 'dash-timeline-dot dash-timeline-dot--failed'
                    }
                  />
                </div>
                <AIHistoryCard
                  entry={entry}
                  index={index}
                  onView={onView}
                  onReuse={onReuse}
                  onRegenerate={onRegenerate}
                  onDelete={onDelete}
                />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
