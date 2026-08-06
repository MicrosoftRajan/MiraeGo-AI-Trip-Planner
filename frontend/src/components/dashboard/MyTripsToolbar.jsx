import { useMemo } from 'react'
import {
  HiOutlineSearch,
  HiOutlineViewGrid,
  HiOutlineViewList,
} from 'react-icons/hi'
import { COUNTRIES, TRAVEL_STYLES } from '../../constants/dashboard'
import { cn } from '../../utils'

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'budget', label: 'Budget' },
  { value: 'country', label: 'Country' },
]

export const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'saved', label: 'Saved' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
  { value: 'draft', label: 'Draft' },
]

export const BUDGET_OPTIONS = [
  { value: '', label: 'All Budgets' },
  { value: 'low', label: 'Under ₹50k' },
  { value: 'mid', label: '₹50k – ₹1L' },
  { value: 'high', label: '₹1L – ₹2L' },
  { value: 'premium', label: 'Over ₹2L' },
]

export const DATE_OPTIONS = [
  { value: '', label: 'All Dates' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 3 months' },
  { value: 'year', label: 'This year' },
]

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="min-w-0">
      <label className="dash-label">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="dash-input cursor-pointer py-2 text-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function MyTripsToolbar({
  search,
  onSearchChange,
  view,
  onViewChange,
  filters,
  onFilterChange,
  sort,
  onSortChange,
  destinations,
  tripCount,
}) {
  const countryOptions = useMemo(
    () => [
      { value: '', label: 'All Countries' },
      ...COUNTRIES.map((c) => ({ value: c.name, label: `${c.flag} ${c.name}` })),
    ],
    [],
  )

  const styleOptions = useMemo(
    () => [
      { value: '', label: 'All Styles' },
      ...TRAVEL_STYLES.map((s) => ({ value: s.label, label: s.label })),
    ],
    [],
  )

  const destinationOptions = useMemo(
    () => [
      { value: '', label: 'All Destinations' },
      ...destinations.map((d) => ({ value: d, label: d })),
    ],
    [destinations],
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--dash-text)]">My Trips</h1>
          <p className="mt-0.5 text-sm text-[var(--dash-muted)]">
            {tripCount} {tripCount === 1 ? 'itinerary' : 'itineraries'} saved
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="inline-flex rounded-lg border border-[var(--dash-border)] bg-[var(--dash-card)] p-1"
            role="group"
            aria-label="View mode"
          >
            <button
              type="button"
              onClick={() => onViewChange('grid')}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-md transition',
                view === 'grid'
                  ? 'bg-[var(--dash-accent)] text-[var(--dash-on-accent)]'
                  : 'text-[var(--dash-muted)] hover:bg-[var(--dash-surface)]',
              )}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
            >
              <HiOutlineViewGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewChange('list')}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-md transition',
                view === 'list'
                  ? 'bg-[var(--dash-accent)] text-[var(--dash-on-accent)]'
                  : 'text-[var(--dash-muted)] hover:bg-[var(--dash-surface)]',
              )}
              aria-label="List view"
              aria-pressed={view === 'list'}
            >
              <HiOutlineViewList className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="dash-card-surface p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <label className="dash-label">Search</label>
            <div className="relative">
              <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dash-soft)]" />
              <input
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search trips..."
                className="dash-input pl-9 py-2 text-sm"
              />
            </div>
          </div>

          <FilterSelect
            label="Destination"
            value={filters.destination}
            onChange={(v) => onFilterChange('destination', v)}
            options={destinationOptions}
          />
          <FilterSelect
            label="Country"
            value={filters.country}
            onChange={(v) => onFilterChange('country', v)}
            options={countryOptions}
          />
          <FilterSelect
            label="Travel Style"
            value={filters.travelStyle}
            onChange={(v) => onFilterChange('travelStyle', v)}
            options={styleOptions}
          />
          <FilterSelect
            label="Budget"
            value={filters.budget}
            onChange={(v) => onFilterChange('budget', v)}
            options={BUDGET_OPTIONS}
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            onChange={(v) => onFilterChange('status', v)}
            options={STATUS_OPTIONS}
          />
          <FilterSelect
            label="Date"
            value={filters.date}
            onChange={(v) => onFilterChange('date', v)}
            options={DATE_OPTIONS}
          />
          <FilterSelect
            label="Sort"
            value={sort}
            onChange={onSortChange}
            options={SORT_OPTIONS}
          />
        </div>
      </div>
    </div>
  )
}
