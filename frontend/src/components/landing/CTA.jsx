import SectionReveal from './shared/SectionReveal'
import { PrimaryButton } from './shared/LandingButtons'

export default function CTA({ onGetStarted }) {
  return (
    <section className="lp-section relative" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <SectionReveal>
          <h2
            id="cta-heading"
            className="lp-display text-balance text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl md:text-5xl"
          >
            Your next adventure starts with one prompt
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[#A2AAB7]">
            Join thousands of travelers who plan less and explore more.
          </p>
          <div className="mt-10 flex justify-center">
            <PrimaryButton onClick={onGetStarted} ariaLabel="Get started with Gilora">
              Get Started — it&apos;s free
            </PrimaryButton>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
