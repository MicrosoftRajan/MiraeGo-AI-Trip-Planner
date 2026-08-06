import { motion } from 'framer-motion'
import SectionReveal from './shared/SectionReveal'

const LOGOS = [
  'Northwind',
  'Atlas Air',
  'Lumen',
  'Voyage Co',
  'Peakline',
  'Harbor AI',
]

export default function TrustedBy() {
  return (
    <section
      className="relative border-y border-white/5 bg-white/[0.02] py-14"
      aria-labelledby="trusted-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionReveal>
          <p
            id="trusted-heading"
            className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#A1A1AA]"
          >
            Trusted by modern travel teams
          </p>
        </SectionReveal>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#050816] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#050816] to-transparent" />

          <motion.div
            className="flex w-max gap-12"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            aria-hidden
          >
            {[...LOGOS, ...LOGOS].map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="flex shrink-0 items-center gap-2.5 opacity-45 transition-opacity hover:opacity-90"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-white/80">
                  {name.slice(0, 1)}
                </span>
                <span className="lp-display whitespace-nowrap text-lg font-semibold tracking-tight text-white/70">
                  {name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
