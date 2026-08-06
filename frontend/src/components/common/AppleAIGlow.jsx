import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import './apple-ai-glow.css'

const DEFAULT_MESSAGES = [
  'Analyzing destination...',
  'Finding attractions...',
  'Optimizing budget...',
  'Finding restaurants...',
  'Building itinerary...',
]

const PARTICLE_SEEDS = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 37 + 11) % 92}%`,
  top: `${(i * 53 + 7) % 88}%`,
  size: 1.5 + (i % 3),
  duration: `${12 + (i % 7) * 1.5}s`,
  delay: `${(i % 8) * 0.35}s`,
  opacity: 0.12 + (i % 5) * 0.04,
}))

function AiSparkIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 2.5l1.1 6.2L19.5 12l-6.4 3.3L12 21.5l-1.1-6.2L4.5 12l6.4-3.3L12 2.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.35" fill="currentColor" opacity="0.9" />
    </svg>
  )
}

function LoadingBody({ messages, reduceMotion }) {
  const safeMessages =
    Array.isArray(messages) && messages.length > 0 ? messages : DEFAULT_MESSAGES

  const [statusIndex, setStatusIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const headline = 'Gilora AI is planning your perfect journey'

  useEffect(() => {
    if (reduceMotion) {
      setTyped(headline)
      return undefined
    }

    setTyped('')
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setTyped(headline.slice(0, i))
      if (i >= headline.length) window.clearInterval(id)
    }, 28)

    return () => window.clearInterval(id)
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return undefined

    const id = window.setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % safeMessages.length)
    }, 2600)

    return () => window.clearInterval(id)
  }, [reduceMotion, safeMessages.length])

  return (
    <div className="apple-ai-glow__content">
      <div className="apple-ai-glow__icon-wrap" aria-hidden>
        <span className="apple-ai-glow__icon-ring" />
        <AiSparkIcon className="apple-ai-glow__icon" />
      </div>

      <p className="apple-ai-glow__title" aria-live="polite">
        {typed}
        {!reduceMotion && typed.length < headline.length ? (
          <span className="apple-ai-glow__cursor" />
        ) : (
          <span className="apple-ai-glow__dots" aria-hidden>
            <span className="apple-ai-glow__dot" />
            <span className="apple-ai-glow__dot" />
            <span className="apple-ai-glow__dot" />
          </span>
        )}
      </p>

      <AnimatePresence mode="wait">
        <motion.p
          key={safeMessages[statusIndex]}
          className="apple-ai-glow__status"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {safeMessages[statusIndex]}
        </motion.p>
      </AnimatePresence>

      <div className="apple-ai-glow__progress" role="progressbar" aria-label="Planning progress">
        <div className="apple-ai-glow__progress-bar" />
      </div>

      <p className="apple-ai-glow__hint">Crafting your route</p>
    </div>
  )
}

/**
 * Premium glass-frame loading shell inspired by modern AI OS aesthetics.
 * Renders a full-page glowing border while `loading` is true.
 */
export default function AppleAIGlow({
  loading = false,
  children,
  messages = DEFAULT_MESSAGES,
  className = '',
}) {
  const reduceMotion = useReducedMotion()
  const [lockingScroll, setLockingScroll] = useState(loading)

  useEffect(() => {
    if (loading) {
      setLockingScroll(true)
      return undefined
    }

    const id = window.setTimeout(
      () => setLockingScroll(false),
      reduceMotion ? 0 : 480,
    )
    return () => window.clearTimeout(id)
  }, [loading, reduceMotion])

  useEffect(() => {
    if (!lockingScroll) return undefined

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [lockingScroll])

  const rootClass = useMemo(() => {
    const parts = ['apple-ai-glow']
    if (reduceMotion) parts.push('apple-ai-glow--reduced')
    if (className) parts.push(className)
    return parts.join(' ')
  }, [className, reduceMotion])

  return (
    <div className={rootClass}>
      <div
        className={`apple-ai-glow__children${loading ? ' apple-ai-glow__children--dimmed' : ''}`}
        aria-hidden={loading || undefined}
      >
        {children}
      </div>

      <AnimatePresence>
        {loading ? (
          <motion.div
            key="apple-ai-glow-stage"
            className="apple-ai-glow__stage"
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label="Gilora AI is planning your journey"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.992 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="apple-ai-glow__frame">
              <div className="apple-ai-glow__bloom" aria-hidden />
              <div className="apple-ai-glow__stroke" aria-hidden />
              <div className="apple-ai-glow__glass-edge" aria-hidden />
              <div className="apple-ai-glow__specular" aria-hidden />

              <div className="apple-ai-glow__panel">
                <div className="apple-ai-glow__noise" aria-hidden />
                <div className="apple-ai-glow__ambient" aria-hidden />

                {!reduceMotion ? (
                  <div className="apple-ai-glow__particles" aria-hidden>
                    {PARTICLE_SEEDS.map((p, i) => (
                      <span
                        key={i}
                        className="apple-ai-glow__particle"
                        style={{
                          left: p.left,
                          top: p.top,
                          width: p.size,
                          height: p.size,
                          '--aig-duration': p.duration,
                          '--aig-delay': p.delay,
                          '--aig-opacity': p.opacity,
                        }}
                      />
                    ))}
                  </div>
                ) : null}

                <LoadingBody messages={messages} reduceMotion={reduceMotion} />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
