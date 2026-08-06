import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function CursorGlow() {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return undefined
    const el = ref.current
    if (!el) return undefined

    let raf = 0
    let targetX = 0
    let targetY = 0
    let curX = 0
    let curY = 0

    const onMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const tick = () => {
      curX += (targetX - curX) * 0.08
      curY += (targetY - curY) * 0.08
      el.style.transform = `translate3d(${curX - 200}px, ${curY - 200}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reduce])

  if (reduce) return null

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[1] hidden h-[400px] w-[400px] rounded-full opacity-25 blur-3xl md:block"
      style={{
        background:
          'radial-gradient(circle, rgb(124 58 237 / 0.2) 0%, rgb(94 234 212 / 0.06) 45%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  )
}
