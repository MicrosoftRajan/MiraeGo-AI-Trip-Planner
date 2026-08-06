import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

export default function MagneticButton({
  children,
  className = '',
  onClick,
  type = 'button',
  ariaLabel,
  strength = 0.35,
  disabled = false,
  ...props
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 280, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 280, damping: 20, mass: 0.4 })

  const handleMove = (e) => {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    x.set(dx * strength)
    y.set(dy * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <span className="lp-ripple absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 opacity-0 transition-[width,height,opacity] duration-500 group-active:h-[220%] group-active:w-[220%] group-active:opacity-100" />
      </span>
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
