import { motion, useReducedMotion } from 'framer-motion'

export default function FloatingShapes() {
  const reduce = useReducedMotion()
  if (reduce) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-[var(--dash-chip)]"
        animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-16 top-1/3 h-56 w-56 rounded-full bg-[var(--dash-surface)]"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 h-40 w-40 rounded-full bg-[var(--dash-surface)]"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
