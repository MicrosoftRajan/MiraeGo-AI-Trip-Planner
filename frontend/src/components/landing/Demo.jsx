import { Skiper67 } from '@/components/ui/skiper-ui/skiper67'
import SectionReveal from './shared/SectionReveal'

const DEMO_VIDEO_SRC = 'https://skiper-ui.com/showreel/skiper-ui-showreel.mp4'

export default function Demo() {
  return (
    <section
      id="demo"
      className="lp-section relative"
      aria-labelledby="demo-heading"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionReveal className="mx-auto max-w-xl text-center">
          <p className="lp-section-label mb-4">AI Demo</p>
          <h2
            id="demo-heading"
            className="lp-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl md:text-[2.75rem]"
          >
            Watch it plan in seconds
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#A2AAB7]">
            Enter your details. Gilora builds a complete itinerary.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1} className="mt-16">
          <Skiper67 src={DEMO_VIDEO_SRC} hint="Click the video to play" />
        </SectionReveal>
      </div>
    </section>
  )
}
