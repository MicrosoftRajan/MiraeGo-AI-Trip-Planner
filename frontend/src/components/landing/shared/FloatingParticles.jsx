import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const PARTICLE_COUNT = 12

function seed(i) {
  const x = ((i * 47) % 100) + (i % 7) * 0.3
  const y = ((i * 73) % 100) + (i % 5) * 0.4
  const size = 1 + (i % 3) * 0.5
  const duration = 14 + (i % 8) * 2
  const delay = (i % 10) * 0.5
  const opacity = 0.08 + (i % 4) * 0.04
  return { x, y, size, duration, delay, opacity }
}

export default function FloatingParticles() {
  const reduce = useReducedMotion()
  const particles = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, (_, i) => seed(i)),
    [],
  )

  if (reduce) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [p.opacity, p.opacity * 1.4, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
