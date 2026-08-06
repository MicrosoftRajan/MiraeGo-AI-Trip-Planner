import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { AiIcon } from '@/components/icons'

export default function GenerateButton({
  loading = false,
  disabled = false,
  onClick,
  type = 'submit',
  label = 'Generate AI Trip',
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 280, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 280, damping: 20, mass: 0.4 })

  const handleMove = (e) => {
    if (reduce || disabled || loading || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    x.set(dx * 0.28)
    y.set(dy * 0.28)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className="dash-generate"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
      aria-busy={loading || undefined}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Crafting…
          </>
        ) : (
          <>
            <AiIcon className="h-4 w-4" alt="" />
            {label}
          </>
        )}
      </span>
    </motion.button>
  )
}
