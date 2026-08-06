import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HiOutlineCheckCircle } from 'react-icons/hi'
import { AiIcon } from '@/components/icons'

export default function BudgetWarning({ analysis, onUpdateBudget, onContinue }) {
  const reduce = useReducedMotion()

  return (
    <AnimatePresence mode="wait">
      {analysis?.status === 'warn' ? (
        <motion.div
          key="warn"
          role="status"
          className="overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 via-orange-400/5 to-transparent p-4"
          initial={reduce ? false : { opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-lg">
              ⚠️
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-amber-100">
                AI budget insight
              </p>
              <p className="mt-1 text-sm leading-relaxed text-amber-100/75">
                {analysis.message}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wider text-amber-200/60">
                Suggested budget
              </p>
              <p className="dash-display text-2xl font-bold text-white">
                {analysis.suggestedFormatted}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onUpdateBudget}
                  className="rounded-xl bg-white/15 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
                >
                  Update Budget
                </button>
                <button
                  type="button"
                  onClick={onContinue}
                  className="rounded-xl border border-white/15 px-3.5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
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
          className="flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <HiOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-100">
              <AiIcon className="h-3.5 w-3.5" alt="" />
              Great!
            </p>
            <p className="mt-0.5 text-sm text-emerald-100/70">{analysis.message}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
