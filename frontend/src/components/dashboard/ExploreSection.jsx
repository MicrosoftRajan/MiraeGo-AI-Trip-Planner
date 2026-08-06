import { useRef } from 'react'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'
import ExploreDestinationCard from './ExploreDestinationCard'

export default function ExploreSection({ title, countries, onGenerateTrip }) {
  const scrollRef = useRef(null)

  if (!countries?.length) return null

  const scroll = (direction) => {
    const el = scrollRef.current
    if (!el) return
    const amount = direction === 'left' ? -360 : 360
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section className="space-y-4" aria-label={title}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-[var(--dash-text)] sm:text-2xl">
          {title}
        </h2>
        <div className="hidden items-center gap-1 sm:flex">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--dash-border)] text-[var(--dash-muted)] transition hover:border-[#d4d4d4] hover:text-[var(--dash-text)]"
            aria-label={`Scroll ${title} left`}
          >
            <HiOutlineChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--dash-border)] text-[var(--dash-muted)] transition hover:border-[#d4d4d4] hover:text-[var(--dash-text)]"
            aria-label={`Scroll ${title} right`}
          >
            <HiOutlineChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="explore-scroll -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {countries.map((country, i) => (
          <ExploreDestinationCard
            key={country.id}
            country={country}
            index={i}
            onGenerateTrip={onGenerateTrip}
          />
        ))}
      </div>
    </section>
  )
}
