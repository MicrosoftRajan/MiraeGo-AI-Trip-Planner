import { useCallback, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi'
import { Modal } from '@/components/ui/animated-modal'
import {
  COUNTRIES,
  EXPLORE_REGIONS,
  EXPLORE_SECTIONS,
} from '../../constants/dashboard'
import { suggestCountries } from '../../utils/dashboard'
import { useTripFormPrefill } from '../../context/TripFormPrefillContext'
import useTripActions from '../../hooks/useTripActions'
import useTripGenerationRedirect from '../../hooks/useTripGenerationRedirect'
import useTripStatus from '../../hooks/useTripStatus'
import { cn } from '../../utils'
import DashboardMobileNav from './DashboardMobileNav'
import DashboardSidebar from './DashboardSidebar'
import ExploreSection from './ExploreSection'
import ExploreDestinationCard from './ExploreDestinationCard'
import FloatingShapes from './FloatingShapes'
import GenerateLoader from './GenerateLoader'
import TripFormModal from './TripFormModal'

function filterCountries({ search, region }) {
  const q = search.trim().toLowerCase()
  return COUNTRIES.filter((c) => {
    if (region !== 'all' && c.region !== region) return false
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.capital.toLowerCase().includes(q) ||
      c.aliases.some((a) => a.includes(q))
    )
  })
}

function ExploreHero({ search, onSearchChange, region, onRegionChange }) {
  const reduce = useReducedMotion()
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)
  const suggestions = useMemo(
    () => (search.trim() ? suggestCountries(search, 6) : []),
    [search],
  )
  const showSuggestions = focused && suggestions.length > 0

  return (
    <motion.header
      className="relative mb-10 overflow-hidden rounded-2xl border border-[var(--dash-border)] bg-gradient-to-br from-[#fafafa] via-white to-[#f5f5f5] px-6 py-10 sm:px-10 sm:py-14"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative z-[1] mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--dash-muted)]">
          Discover your next adventure
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--dash-text)] sm:text-4xl md:text-5xl">
          Explore The World
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--dash-muted)] sm:text-base">
          Browse curated destinations with budgets, seasons, and top attractions — then generate
          your perfect AI itinerary in seconds.
        </p>

        <div className="relative mx-auto mt-8 max-w-xl">
          <HiOutlineSearch
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--dash-soft)]"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search countries, cities, regions…"
            className="explore-search-input w-full rounded-full border border-[var(--dash-border)] bg-[var(--dash-card)] py-3.5 pl-12 pr-10 text-sm text-[var(--dash-text)] shadow-sm outline-none transition-all placeholder:text-[var(--dash-soft)] focus:border-[var(--dash-accent)] focus:shadow-md"
            aria-label="Search destinations"
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('')
                inputRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--dash-soft)] transition hover:bg-[var(--dash-surface)] hover:text-[var(--dash-text)]"
              aria-label="Clear search"
            >
              <HiOutlineX className="h-4 w-4" />
            </button>
          )}

          {showSuggestions && (
            <ul
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)] py-1 shadow-lg"
              role="listbox"
            >
              {suggestions.map((c) => (
                <li key={c.id} role="option">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-[var(--dash-surface)]"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onSearchChange(c.name)
                      setFocused(false)
                    }}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span>
                      <span className="font-medium text-[var(--dash-text)]">{c.name}</span>
                      <span className="ml-2 text-[var(--dash-muted)]">{c.capital}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {EXPLORE_REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onRegionChange(r.id)}
              className={cn(
                'dash-chip',
                region === r.id && 'dash-chip--active',
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </motion.header>
  )
}

export default function Explore() {
  const { openWithForm } = useTripFormPrefill()
  const { loading } = useTripStatus()
  const { generateTrip } = useTripActions()
  useTripGenerationRedirect()

  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')

  const filtered = useMemo(
    () => filterCountries({ search, region }),
    [search, region],
  )

  const sections = useMemo(
    () =>
      EXPLORE_SECTIONS.map((section) => ({
        ...section,
        countries: filtered.filter((c) => c.categories.includes(section.id)),
      })).filter((s) => s.countries.length > 0),
    [filtered],
  )

  const handleGenerateTrip = useCallback(
    (country) => {
      openWithForm({
        destination: country.name,
        budgetAmount: String(country.avgCostPerDay * 5),
        currency: 'INR',
      })
    },
    [openWithForm],
  )

  const handleFormGenerate = useCallback(
    (data) => {
      void generateTrip(data)
    },
    [generateTrip],
  )

  const isSearching = search.trim().length > 0 || region !== 'all'
  const noResults = isSearching && filtered.length === 0

  return (
    <Modal>
      <div className="dashboard-root relative flex min-h-dvh">
        <FloatingShapes />
        <DashboardSidebar />
        <div className="relative z-[1] flex min-w-0 flex-1 flex-col">
          <DashboardMobileNav />
          <main className="dash-scroll flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <ExploreHero
              search={search}
              onSearchChange={setSearch}
              region={region}
              onRegionChange={setRegion}
            />

            {noResults ? (
              <div className="dash-card-surface px-6 py-16 text-center">
                <p className="text-sm text-[var(--dash-muted)]">No destinations match your search.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setRegion('all')
                  }}
                  className="mt-4 text-sm font-medium text-[var(--dash-text)] underline underline-offset-2"
                >
                  Clear filters
                </button>
              </div>
            ) : isSearching && filtered.length > 0 ? (
              <section className="space-y-4" aria-label="Search results">
                <h2 className="text-xl font-semibold tracking-tight text-[var(--dash-text)] sm:text-2xl">
                  {filtered.length} destination{filtered.length !== 1 ? 's' : ''} found
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((country, i) => (
                    <ExploreDestinationCard
                      key={country.id}
                      country={country}
                      index={i}
                      layout="grid"
                      onGenerateTrip={handleGenerateTrip}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <div className="space-y-12">
                {sections.map((section) => (
                  <ExploreSection
                    key={section.id}
                    title={section.label}
                    countries={section.countries}
                    onGenerateTrip={handleGenerateTrip}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
        <TripFormModal onGenerate={handleFormGenerate} />
        <GenerateLoader active={loading} />
      </div>
    </Modal>
  )
}
