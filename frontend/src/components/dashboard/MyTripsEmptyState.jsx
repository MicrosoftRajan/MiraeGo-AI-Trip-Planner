import { motion, useReducedMotion } from 'framer-motion'
import { AiIcon } from '@/components/icons'
import { useModal } from '@/components/ui/animated-modal'

export default function MyTripsEmptyState() {
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
        <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-violet-100/80 to-blue-100/60 blur-2xl" />
        <svg
          viewBox="0 0 200 160"
          className="relative h-40 w-52"
          aria-hidden
        >
          <defs>
            <linearGradient id="suitcase-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#111111" />
              <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>
          </defs>
          {/* Floating clouds */}
          <ellipse cx="40" cy="35" rx="22" ry="10" fill="#f3f4f6" />
          <ellipse cx="160" cy="28" rx="18" ry="8" fill="#f3f4f6" />
          {/* Globe */}
          <circle cx="100" cy="72" r="36" fill="#eff6ff" stroke="#dbeafe" strokeWidth="2" />
          <ellipse cx="100" cy="72" rx="36" ry="14" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
          <path d="M64 72 Q100 50 136 72" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
          <path d="M64 72 Q100 94 136 72" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
          <line x1="100" y1="36" x2="100" y2="108" stroke="#93c5fd" strokeWidth="1.5" />
          {/* Suitcase */}
          <rect x="72" y="108" width="56" height="38" rx="6" fill="url(#suitcase-grad)" />
          <rect x="88" y="100" width="24" height="12" rx="4" fill="#374151" />
          <circle cx="88" cy="127" r="3" fill="#6b7280" />
          <circle cx="112" cy="127" r="3" fill="#6b7280" />
          {/* Pin */}
          <path
            d="M148 58 L148 78 Q148 86 140 86 L136 86 L134 92 L130 86 L126 86 Q118 86 118 78 L118 58 Q118 50 133 50 Q148 50 148 58 Z"
            fill="#ef4444"
          />
          <circle cx="133" cy="62" r="6" fill="#fca5a5" />
          {/* Dotted path */}
          <path
            d="M30 120 Q60 100 72 120"
            fill="none"
            stroke="#d1d5db"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-[var(--dash-text)]">No trips yet.</h2>
      <p className="mt-2 max-w-sm text-sm text-[var(--dash-muted)]">
        Every itinerary you generate will appear here. Start planning your first adventure.
      </p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--dash-accent)] px-6 text-sm font-medium text-[var(--dash-on-accent)] transition hover:bg-[var(--dash-accent-hover)] hover:shadow-lg hover:shadow-black/10"
      >
        <AiIcon className="h-4 w-4" alt="" />
        Plan Your First Trip
      </button>
    </motion.div>
  )
}
