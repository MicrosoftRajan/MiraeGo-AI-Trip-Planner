import SectionReveal from './shared/SectionReveal'
import { PrimaryButton } from './shared/LandingButtons'

const PLANS = [
  {
    name: 'Explorer',
    price: 'Free',
    period: '',
    blurb: 'For first journeys and weekend escapes.',
    features: ['3 AI trips / month', 'Basic itinerary', 'Packing checklist'],
    highlighted: false,
  },
  {
    name: 'Voyager',
    price: '$19',
    period: '/mo',
    blurb: 'For frequent travelers who refine every day.',
    features: [
      'Unlimited AI trips',
      'Budget intelligence',
      'Restaurant picks',
      'Currency conversion',
    ],
    highlighted: true,
  },
  {
    name: 'Atlas',
    price: '$49',
    period: '/mo',
    blurb: 'For teams planning at scale.',
    features: ['Everything in Voyager', 'Shared workspaces', 'API access', 'Dedicated support'],
    highlighted: false,
  },
]

export default function Pricing({ onGetStarted }) {
  return (
    <section
      id="pricing"
      className="lp-section relative"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionReveal className="mx-auto max-w-xl text-center">
          <p className="lp-section-label mb-4">Pricing</p>
          <h2
            id="pricing-heading"
            className="lp-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl md:text-[2.75rem]"
          >
            Simple plans. Infinite horizons.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#A2AAB7]">
            Start free. Upgrade when your wanderlust outgrows weekends.
          </p>
        </SectionReveal>

        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <SectionReveal key={plan.name} delay={i * 0.08}>
              <div
                className={`flex h-full flex-col p-6 sm:p-7 ${
                  plan.highlighted
                    ? 'lp-elevated border-[#6A52E0]/45'
                    : 'lp-card'
                }`}
              >
                {plan.highlighted ? (
                  <span className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-[#9F8AF2]">
                    Most popular
                  </span>
                ) : (
                  <span className="mb-4 block h-[17px]" aria-hidden />
                )}
                <h3 className="lp-display text-lg font-semibold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-[#A2AAB7]">{plan.blurb}</p>
                <p className="mt-6 flex items-baseline gap-1">
                  <span className="lp-display text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period ? (
                    <span className="text-sm text-[#A2AAB7]">{plan.period}</span>
                  ) : null}
                </p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[#A2AAB7]">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#95A0B2]" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <PrimaryButton
                  onClick={onGetStarted}
                  ariaLabel={plan.name}
                  className="mt-8 w-full !block"
                >
                  {plan.name === 'Atlas' ? 'Contact sales' : 'Get started'}
                </PrimaryButton>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
