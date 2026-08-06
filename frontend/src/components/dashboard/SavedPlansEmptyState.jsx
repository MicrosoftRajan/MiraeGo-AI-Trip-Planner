import { motion, useReducedMotion } from 'framer-motion'
import { AiIcon, BookmarkIcon } from '@/components/icons'
import { useModal } from '@/components/ui/animated-modal'

export default function SavedPlansEmptyState() {
  const reduce = useReducedMotion()
  const { setOpen } = useModal()

  return (
    <motion.div
      className="flex flex-col items-center justify-center px-6 py-20 text-center"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative mb-8">
        <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-amber-100/70 via-rose-100/50 to-sky-100/60 blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-[var(--dash-border)] bg-[var(--dash-card)] shadow-[0_12px_40px_rgb(0,0,0,0.06)]">
          <BookmarkIcon className="h-10 w-10 text-[var(--dash-text)]" />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-[var(--dash-text)]">No saved plans yet</h2>
      <p className="mt-2 max-w-sm text-sm text-[var(--dash-muted)]">
        Bookmark itineraries as you plan. Organize them into collections like Japan Trip or Dream
        Vacations — then drag between collections anytime.
      </p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--dash-accent)] px-6 text-sm font-medium text-[var(--dash-on-accent)] transition hover:bg-[var(--dash-accent-hover)] hover:shadow-lg hover:shadow-black/10"
      >
        <AiIcon className="h-4 w-4" alt="" />
        Plan a Trip to Save
      </button>
    </motion.div>
  )
}
