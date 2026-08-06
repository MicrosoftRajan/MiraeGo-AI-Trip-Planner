import { motion, useReducedMotion } from 'framer-motion'
import SectionReveal from './shared/SectionReveal'

const STEPS = [
  {
    title: 'Choose Destination',
    description: 'Drop a city, dates, and budget. Gilora listens to what shapes your trip.',
  },
  {
    title: 'AI Builds Plan',
    description: 'In seconds, get a paced itinerary with stays, meals, and cost estimates.',
  },
  {
    title: 'Enjoy Your Journey',
    description: 'Edit freely, share with friends, and take the plan offline.',
  },
]

export default function HowItWorks() {
  const reduce = useReducedMotion()

  return (
    <section
      id="how-it-works"
      className="lp-section relative"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionReveal className="mx-auto max-w-xl text-center">
          <p className="lp-section-label mb-4">How It Works</p>
          <h2
            id="how-heading"
            className="lp-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl md:text-[2.75rem]"
          >
            Three steps to wheels-up
          </h2>
        </SectionReveal>

        <div className="relative mt-20">
          {/* Animated timeline line */}
          <div className="absolute left-0 right-0 top-[28px] hidden h-px md:block" aria-hidden>
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[#6A52E0]/45 to-transparent"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left' }}
            />
          </div>

          <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, i) => (
              <SectionReveal key={step.title} delay={i * 0.12} as="li">
                <div className="relative flex flex-col items-center text-center">
                  <motion.div
                    className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#2A2E35] bg-[#14181C] text-sm font-bold text-[#B8C0CC]"
                    initial={reduce ? false : { scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                  >
                    {i + 1}
                  </motion.div>

                  {/* Mobile vertical connector */}
                  {i < STEPS.length - 1 ? (
                    <div
                      className="absolute left-1/2 top-14 h-12 w-px -translate-x-1/2 bg-[#2A2E35] md:hidden"
                      aria-hidden
                    />
                  ) : null}

                  <h3 className="lp-display text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#A2AAB7]">
                    {step.description}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
