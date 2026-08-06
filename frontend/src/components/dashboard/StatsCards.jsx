import { useMemo } from 'react'
import { useSavedTrips } from '../../context/SavedTripsContext'
import StatsCard from './StatsCard'

export default function StatsCards() {
  const { trips } = useSavedTrips()

  const stats = useMemo(() => {
    const countries = new Set(trips.map((t) => t.country).filter(Boolean))
    const totalDays = trips.reduce((sum, t) => sum + (Number(t.days) || 0), 0)
    const upcoming = trips.filter((t) => t.status === 'upcoming').length

    return [
      { id: 'generated', label: 'Trips Created', value: trips.length },
      { id: 'countries', label: 'Countries Planned', value: countries.size },
      { id: 'days', label: 'Days Planned', value: totalDays },
      { id: 'upcoming', label: 'Upcoming Trips', value: upcoming },
    ]
  }, [trips])

  return (
    <section aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        Statistics
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <StatsCard key={stat.id} index={i} {...stat} />
        ))}
      </div>
    </section>
  )
}
