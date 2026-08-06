import { HiOutlineStar } from 'react-icons/hi'
import { formatMoney } from '../../utils'

/**
 * Extract restaurant-like stops from the trip for a curated dining strip.
 */
export function collectRestaurants(trip) {
  if (!trip?.days) return []
  const keywords = /restaurant|cafe|dinner|lunch|food|ramen|sushi|bistro|dining|market|cuisine/i
  const found = []

  for (const day of trip.days) {
    for (const stop of day.stops || []) {
      const hay = `${stop.name || ''} ${stop.title || ''} ${stop.category || ''} ${stop.type || ''}`
      if (keywords.test(hay) || stop.category === 'Food') {
        found.push({
          id: stop.id,
          name: stop.name || stop.title,
          day: day.day,
          time: stop.time,
          notes: stop.notes || stop.description,
          cost: stop.cost,
          location: stop.location,
        })
      }
    }
  }

  return found.slice(0, 6)
}

export default function RestaurantCard({ restaurant, currencySymbol = '¥', index = 0 }) {
  return (
    <article className="dash-glass dash-card flex flex-col gap-2 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3dd6c6]">
            Day {restaurant.day}
            {restaurant.time ? ` · ${restaurant.time}` : ''}
          </p>
          <h4 className="mt-1 font-semibold text-[var(--dash-text)]">{restaurant.name}</h4>
        </div>
        <span className="flex items-center gap-0.5 text-amber-300">
          <HiOutlineStar className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{(4.6 - index * 0.1).toFixed(1)}</span>
        </span>
      </div>
      {restaurant.location ? (
        <p className="text-xs text-[var(--dash-muted)]">{restaurant.location}</p>
      ) : null}
      {restaurant.notes ? (
        <p className="line-clamp-2 text-xs leading-relaxed text-[var(--dash-soft)]">
          {restaurant.notes}
        </p>
      ) : null}
      {restaurant.cost != null ? (
        <p className="mt-auto text-sm font-semibold text-[#a89bff]">
          {formatMoney(restaurant.cost, currencySymbol)}
        </p>
      ) : null}
    </article>
  )
}
