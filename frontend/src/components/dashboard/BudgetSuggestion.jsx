import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HiOutlineCheckCircle } from 'react-icons/hi'
import { AiIcon } from '@/components/icons'

export default function BudgetSuggestion({ analysis, onUpdateBudget, onContinue }) {
  const reduce = useReducedMotion()

  return (
    <AnimatePresence mode="wait">
      {analysis?.status === 'warn' ? (
        <motion.div
          key="warn"
          role="status"
          className="overflow-hidden rounded-xl border border-amber-200 bg-amber-50 p-4"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-3">
            <span className="text-lg" aria-hidden>
              ⚠️
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber-900">AI recommendation</p>
              <p className="mt-1 text-sm leading-relaxed text-amber-800/80">{analysis.message}</p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-amber-700/70">
                Suggested budget
              </p>
              <p className="text-2xl font-bold text-[var(--dash-text)]">{analysis.suggestedFormatted}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onUpdateBudget}
                  className="rounded-lg bg-[var(--dash-accent)] px-3.5 py-2 text-sm font-semibold text-[var(--dash-on-accent)] transition hover:bg-[var(--dash-accent-hover)]"
                >
                  Update Budget
                </button>
                <button
                  type="button"
                  onClick={onContinue}
                  className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] px-3.5 py-2 text-sm font-medium text-[var(--dash-text)] transition hover:bg-[var(--dash-surface)]"
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : analysis?.status === 'ok' ? (
        <motion.div
          key="ok"
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0 }}
        >
          <HiOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-900">
              <AiIcon className="h-3.5 w-3.5" alt="" />
              Budget looks good
            </p>
            <p className="mt-0.5 text-sm text-emerald-800/75">{analysis.message}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
