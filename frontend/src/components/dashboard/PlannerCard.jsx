import { motion } from 'framer-motion'
import { ModalTrigger } from '@/components/ui/animated-modal'
import { AiIcon } from '@/components/icons'

export default function PlannerCard() {
  return (
      <motion.aside
        className="dash-card-surface sticky top-6 overflow-hidden p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dash-muted)]">
          AI Planner
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--dash-text)]">
          Plan Your Next Journey
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--dash-muted)]">
          Let AI create a personalized itinerary tailored to your budget, style, and interests.
        </p>

        <div className="mt-6 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)] p-4">
          <ul className="space-y-2 text-sm text-[var(--dash-muted)]">
            <li>• Smart budget analysis</li>
            <li>• Day-by-day timeline</li>
            <li>• Restaurants & packing lists</li>
          </ul>
        </div>

        <ModalTrigger className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--dash-accent)] text-base font-semibold text-[var(--dash-on-accent)] transition hover:bg-[var(--dash-accent-hover)]">
          <AiIcon className="h-5 w-5" alt="" />
          Plan a Trip
        </ModalTrigger>
      </motion.aside>
  )
}
