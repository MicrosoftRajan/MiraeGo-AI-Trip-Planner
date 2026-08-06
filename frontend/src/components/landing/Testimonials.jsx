import SectionReveal from './shared/SectionReveal'

const QUOTES = [
  {
    name: 'Amelia Chen',
    role: 'Product designer · Singapore',
    text: 'Gilora planned our Japan honeymoon better than any agency — and we could edit every hour ourselves.',
  },
  {
    name: 'Marcus Webb',
    role: 'Founder · Berlin',
    text: 'The budget intelligence alone saved us a week of spreadsheet hell. It feels premium, but effortless.',
  },
  {
    name: 'Sofia Reyes',
    role: 'Travel writer · Mexico City',
    text: 'Restaurant slots and packing lists are eerily good — like a co-pilot who actually cares.',
  },
]

export default function Testimonials() {
  return (
    <section
      className="lp-section relative"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionReveal className="mx-auto max-w-xl text-center">
          <p className="lp-section-label mb-4">Testimonials</p>
          <h2
            id="testimonials-heading"
            className="lp-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl md:text-[2.75rem]"
          >
            Loved by curious travelers
          </h2>
        </SectionReveal>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {QUOTES.map((quote, i) => (
            <SectionReveal key={quote.name} delay={i * 0.08}>
              <blockquote className="lp-card flex h-full flex-col p-6 transition-colors hover:bg-[#1A1E23]">
                <p className="text-sm leading-relaxed text-[#A2AAB7]">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <footer className="mt-6 border-t border-[#252A31] pt-5">
                  <cite className="not-italic">
                    <span className="block text-sm font-semibold text-white">{quote.name}</span>
                    <span className="mt-0.5 block text-xs text-[#A2AAB7]">{quote.role}</span>
                  </cite>
                </footer>
              </blockquote>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
