import { motion, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect'
import WorldMap from '@/components/ui/world-map'
import { PrimaryButton, SecondaryButton } from './shared/LandingButtons'

const MAP_ROUTES = [
  {
    start: { lat: 28.6139, lng: 77.209, label: 'India' },
    end: { lat: 35.6762, lng: 139.6503, label: 'Japan' },
  },
  {
    start: { lat: 35.6762, lng: 139.6503, label: 'Japan' },
    end: { lat: 51.5074, lng: -0.1278, label: 'United Kingdom' },
  },
  {
    start: { lat: 51.5074, lng: -0.1278, label: 'United Kingdom' },
    end: { lat: 40.7128, lng: -74.006, label: 'United States' },
  },
  {
    start: { lat: 40.7128, lng: -74.006, label: 'United States' },
    end: { lat: -33.8688, lng: 151.2093, label: 'Australia' },
  },
]

const BADGES = ['190+ countries', 'AI-powered', 'Free to start']

export default function Hero({ onGetStarted }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden pb-24 pt-32 sm:pt-36"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <BackgroundRippleEffect />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
        <motion.h1
          id="hero-heading"
          className="lp-display text-balance text-[2.75rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-[5.25rem]"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-white">Travel planning,</span>
          <br />
          <span className="text-[#D3D8E0]">made calm and clear.</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-md text-pretty text-[15px] leading-relaxed text-[#9CA3AF] sm:text-lg"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
        >
          AI-powered worldwide travel planning. One prompt turns into a complete itinerary.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
        >
          <PrimaryButton onClick={onGetStarted} ariaLabel="Start planning your trip">
            Start Planning
          </PrimaryButton>
          <SecondaryButton href="#demo" ariaLabel="See how it works">
            See How It Works
          </SecondaryButton>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {BADGES.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/[0.08] bg-[#111214] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-[#9CA3AF]"
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 mx-auto mt-16 w-full max-w-4xl px-5 sm:mt-20 sm:px-8"
        initial={reduce ? false : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="overflow-hidden rounded-xl border border-[#21252B] bg-[#111317]">
          <WorldMap dots={MAP_ROUTES} lineColor="#6A52E0" showLabels />
        </div>
      </motion.div>
    </section>
  )
}
