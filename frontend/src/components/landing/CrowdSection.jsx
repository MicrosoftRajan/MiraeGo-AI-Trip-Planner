import { CrowdCanvas } from '@/components/ui/skiper-ui/skiper39'
import SectionReveal from './shared/SectionReveal'
import { PrimaryButton } from './shared/LandingButtons'

/**
 * Landing crowd section — Skiper39 Open Peeps canvas.
 * Light contrast band on the dark Gilora landing page.
 */
export default function CrowdSection({ onGetStarted }) {
  return (
    <section
      className="relative overflow-hidden bg-[#f4f4f5] text-[#111111]"
      aria-labelledby="crowd-heading"
    >
      <div className="relative z-10 mx-auto max-w-3xl px-5 pb-8 pt-20 text-center sm:px-8 sm:pt-24">
        <SectionReveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#71717a]">
            Travelers worldwide
          </p>
          <h2
            id="crowd-heading"
            className="lp-display mt-4 text-balance text-3xl font-bold tracking-[-0.03em] text-[#111111] sm:text-4xl md:text-5xl"
          >
            Built for every kind of traveler
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#52525b]">
            Solo explorers, families, and weekend escape artists — Gilora plans
            with you, then gets out of the way.
          </p>
          <div className="mt-8 flex justify-center">
            <PrimaryButton onClick={onGetStarted} ariaLabel="Start planning with Gilora">
              Join the crowd
            </PrimaryButton>
          </div>
        </SectionReveal>
      </div>

      <div className="relative h-[42vh] min-h-[280px] w-full sm:h-[52vh] sm:min-h-[360px]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-[#f4f4f5] to-transparent"
          aria-hidden
        />
        <CrowdCanvas
          src="/images/peeps/all-peeps.png"
          rows={15}
          cols={7}
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </section>
  )
}
