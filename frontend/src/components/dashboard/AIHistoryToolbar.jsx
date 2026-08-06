import { useMemo } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import { DATE_OPTIONS } from './MyTripsToolbar'

export const HISTORY_STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
]

export const HISTORY_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'duration', label: 'Duration' },
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

export default function AIHistoryToolbar({
  search,
  onSearchChange,
  filters,
  onFilterChange,
  sort,
  onSortChange,
  destinations,
  entryCount,
  successCount,
  failedCount,
}) {
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
          <h1 className="text-2xl font-semibold text-[var(--dash-text)]">AI History</h1>
          <p className="mt-0.5 text-sm text-[var(--dash-muted)]">
            {entryCount} {entryCount === 1 ? 'generation' : 'generations'} ·{' '}
            <span className="text-emerald-600">{successCount} success</span>
            {failedCount > 0 ? (
              <>
                {' '}
                · <span className="text-red-600">{failedCount} failed</span>
              </>
            ) : null}
          </p>
        </div>
      </div>

      <div className="dash-card-surface p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <div className="sm:col-span-2">
            <label className="dash-label">Search</label>
            <div className="relative">
              <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dash-soft)]" />
              <input
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search prompts, destinations..."
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
            label="Status"
            value={filters.status}
            onChange={(v) => onFilterChange('status', v)}
            options={HISTORY_STATUS_OPTIONS}
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
            options={HISTORY_SORT_OPTIONS}
          />
        </div>
      </div>
    </div>
  )
}
