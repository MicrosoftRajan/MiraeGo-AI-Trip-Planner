import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { GENERATION_STEPS } from '../../constants/dashboard'

/**
 * Apple Intelligence–inspired generation stage for the right panel.
 */
export default function LoadingScreen({ active = false, steps = GENERATION_STEPS }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(8)

  useEffect(() => {
    if (!active) {
      setIndex(0)
      setProgress(8)
      return undefined
    }

    const stepId = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length)
    }, 2200)

    const progId = window.setInterval(() => {
      setProgress((p) => Math.min(92, p + (reduce ? 20 : 3 + Math.random() * 6)))
    }, 400)

    return () => {
      window.clearInterval(stepId)
      window.clearInterval(progId)
    }
  }, [active, steps.length, reduce])

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden rounded-[24px] p-6"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.45 }}
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Generating your trip"
        >
          <div className="dash-border-glow absolute inset-2">
            <div className="dash-border-glow__inner relative overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    'radial-gradient(circle at 30% 20%, rgb(124 108 255 / 0.35), transparent 45%), radial-gradient(circle at 70% 80%, rgb(61 214 198 / 0.25), transparent 40%)',
                }}
                aria-hidden
              />

              <div className="relative flex h-full flex-col items-center justify-center px-6 py-10 text-center">
                <motion.div
                  className="relative mb-8 flex h-16 w-16 items-center justify-center"
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                >
                  <span className="absolute inset-0 rounded-full border border-white/10" />
                  <span className="absolute inset-1 rounded-full border border-dashed border-[#7c6cff]/50" />
                  <span className="text-2xl">✨</span>
                </motion.div>

                <p className="dash-display text-xl font-bold text-white sm:text-2xl">
                  Gilora Intelligence
                </p>
                <p className="mt-2 max-w-xs text-sm text-[var(--dash-muted)]">
                  Composing your journey with care
                </p>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={steps[index]}
                    className="mt-8 text-sm font-medium text-[#c4bcff]"
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    {steps[index]}
                  </motion.p>
                </AnimatePresence>

                <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#7c6cff] via-[#5b8cff] to-[#3dd6c6]"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
