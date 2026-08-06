import Button from '../common/Button'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2400&q=80'

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden" aria-label="Gilora introduction">
      {/* Full-bleed visual plane */}
      <div className="absolute inset-0" aria-hidden>
        <img
          src={HERO_IMAGE}
          alt=""
          width={2400}
          height={1600}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/55 via-sea/35 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-foam via-foam/25 to-transparent" />
        <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-sea/25 blur-3xl animate-float" />
        <div
          className="absolute -right-16 bottom-40 h-80 w-80 rounded-full bg-sand/30 blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24 lg:justify-center lg:pb-20 lg:pt-24">
        <div className="max-w-2xl">
          <p className="animate-fade-up font-display text-5xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-6xl md:text-7xl lg:text-8xl">
            Gilora
          </p>
          <h1 className="animate-fade-up stagger-1 mt-5 max-w-xl text-balance text-2xl font-medium leading-snug text-white/95 sm:text-3xl md:text-4xl">
            Worldwide travel plans you can actually edit.
          </h1>
          <p className="animate-fade-up stagger-2 mt-5 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
            Pick any country, set your budget and currency — Gilora drafts stops,
            timing, and tips shaped to how you travel.
          </p>
          <div className="animate-fade-up stagger-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              size="lg"
              className="w-full shadow-lift sm:w-auto"
              onClick={() =>
                document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Plan my trip
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
