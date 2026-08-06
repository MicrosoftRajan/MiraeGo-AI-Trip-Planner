import { motion } from 'framer-motion'
import {
  FiGlobe,
  FiDollarSign,
  FiRefreshCw,
  FiCoffee,
  FiBriefcase,
  FiBarChart2,
} from 'react-icons/fi'
import SectionReveal from './shared/SectionReveal'

const FEATURES = [
  {
    icon: FiGlobe,
    title: 'Worldwide Planning',
    blurb: 'From megacities to remote islands — one planner for every timezone.',
  },
  {
    icon: FiDollarSign,
    title: 'Budget Intelligence',
    blurb: 'Spend smart without sacrificing the moments that matter.',
  },
  {
    icon: FiRefreshCw,
    title: 'Currency Conversion',
    blurb: 'See every estimate in the currency you actually think in.',
  },
  {
    icon: FiCoffee,
    title: 'Restaurant Discovery',
    blurb: 'Neighborhood gems ranked for taste, vibe, and timing.',
  },
  {
    icon: FiBriefcase,
    title: 'Packing Assistant',
    blurb: 'Climate-aware packing that travels light and arrives ready.',
  },
  {
    icon: FiBarChart2,
    title: 'Travel Insights',
    blurb: 'Crowd trends, safety notes, and best visiting windows.',
  },
]

export default function Features() {
  return (
    <section
      id="features"
      className="lp-section relative"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionReveal className="mx-auto max-w-xl text-center">
          <p className="lp-section-label mb-4">Features</p>
          <h2
            id="features-heading"
            className="lp-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl md:text-[2.75rem]"
          >
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#A2AAB7]">
            Six intelligent layers that turn curiosity into a complete journey.
          </p>
        </SectionReveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <SectionReveal key={feature.title} delay={i * 0.05}>
                <motion.article
                  className="group lp-card flex h-full flex-col p-6 transition-colors duration-200 hover:bg-[#1B1F24]"
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <span
                    className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#2A2E35] bg-[#101216] text-[#B5BDCB] transition-colors group-hover:text-white"
                  >
                    <Icon size={18} aria-hidden />
                  </span>
                  <h3 className="lp-display text-[15px] font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A2AAB7]">
                    {feature.blurb}
                  </p>
                </motion.article>
              </SectionReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
