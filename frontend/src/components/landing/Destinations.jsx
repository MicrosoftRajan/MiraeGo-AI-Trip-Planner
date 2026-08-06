import SectionReveal from './shared/SectionReveal'
import { SolidButton } from './shared/LandingButtons'

const DESTINATIONS = [
  {
    category: 'Japan',
    title: 'Tokyo',
    src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    budget: '₹1,20,000 avg.',
    season: 'Mar – May',
    highlights: ['Shibuya & Shinjuku', 'Temple trails', 'Ramen culture'],
  },
  {
    category: 'South Korea',
    title: 'Seoul',
    src: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80',
    budget: '₹95,000 avg.',
    season: 'Apr – Jun',
    highlights: ['Palace districts', 'Night markets', 'K-culture'],
  },
  {
    category: 'France',
    title: 'Paris',
    src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    budget: '₹1,50,000 avg.',
    season: 'Sep – Nov',
    highlights: ['Museum mornings', 'Café culture', 'Seine walks'],
  },
  {
    category: 'UAE',
    title: 'Dubai',
    src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    budget: '₹1,10,000 avg.',
    season: 'Nov – Mar',
    highlights: ['Desert safaris', 'Skyline views', 'Luxury dining'],
  },
  {
    category: 'Singapore',
    title: 'Singapore',
    src: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    budget: '₹85,000 avg.',
    season: 'Year-round',
    highlights: ['Garden city', 'Hawker food', 'Marina Bay'],
  },
  {
    category: 'United States',
    title: 'New York',
    src: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    budget: '₹1,80,000 avg.',
    season: 'Sep – Dec',
    highlights: ['Broadway nights', 'Central Park', 'Food scenes'],
  },
]

export default function Destinations({ onGetStarted }) {
  return (
    <section
      id="destinations"
      className="lp-section relative"
      aria-labelledby="destinations-heading"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionReveal className="mx-auto max-w-xl text-center">
          <p className="lp-section-label mb-4">Popular Destinations</p>
          <h2
            id="destinations-heading"
            className="lp-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl md:text-[2.75rem]"
          >
            Where wanderers go first
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#A2AAB7]">
            Curated options with clear budgets and best seasons.
          </p>
        </SectionReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((dest, index) => (
            <SectionReveal key={dest.title} delay={index * 0.05}>
              <article className="lp-card overflow-hidden">
                <img
                  src={dest.src}
                  alt={dest.title}
                  className="h-44 w-full object-cover sm:h-48"
                  loading="lazy"
                />
                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A2AAB7]">
                        {dest.category}
                      </p>
                      <h3 className="mt-1 lp-display text-lg font-semibold text-white">{dest.title}</h3>
                    </div>
                    <span className="rounded-md border border-[#2A2E35] bg-[#12151A] px-2 py-1 text-[11px] text-[#A2AAB7]">
                      {dest.season}
                    </span>
                  </div>
                  <p className="text-sm text-[#A2AAB7]">{dest.budget}</p>
                  <ul className="space-y-1.5">
                    {dest.highlights.map((h) => (
                      <li key={h} className="text-sm text-[#A2AAB7]">
                        - {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.15} className="mt-12 flex justify-center">
          <div className="lp-elevated w-full max-w-xl p-6 text-center">
            <p className="text-sm leading-relaxed text-[#A2AAB7]">
              Need a custom route? Share destination, budget, and trip length.
            </p>
            <div className="mt-5">
              <SolidButton onClick={onGetStarted} ariaLabel="Start planning">
                Start Planning
              </SolidButton>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
