import useTrip from '../../hooks/useTrip'
import { formatMoney } from '../../utils'
import GlassCard from '../common/GlassCard'

const META_ITEMS = [
  { key: 'country', label: 'Country' },
  { key: 'currency', label: 'Local currency', format: formatCurrency },
  { key: 'timezone', label: 'Timezone' },
  { key: 'language', label: 'Language' },
  { key: 'bestSeason', label: 'Best season' },
]

/**
 * Worldwide destination intelligence panel (Feature 1).
 * Renders country, currency, timezone, language, and best season.
 */
export default function DestinationInfo() {
  const trip = useTrip()
  const info = trip?.destinationInfo
  if (!info) return null

  const userBudget = trip.userBudget

  return (
    <section id="destination" className="scroll-mt-28 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sea">
            Destination
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {trip.destination}
          </h2>
          {trip.summary ? (
            <p className="mt-3 text-ink-muted leading-relaxed">{trip.summary}</p>
          ) : null}
        </div>

        <GlassCard
          strong
          className="mx-auto mt-8 max-w-4xl animate-scale-in p-5 sm:mt-10 sm:p-7"
        >
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {META_ITEMS.map((item) => {
              const raw = info[item.key]
              if (!raw) return null
              const value = item.format ? item.format(info) : raw
              return (
                <div key={item.key} className="rounded-2xl bg-chip/60 px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
                    {item.label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-ink sm:text-base">
                    {value}
                  </dd>
                </div>
              )
            })}
          </dl>

          {userBudget ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-divider pt-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
                  Your budget
                </p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink">
                  {formatMoney(userBudget.amount, userBudget.currencySymbol)}
                  <span className="ml-2 text-sm font-sans font-medium text-ink-soft">
                    {userBudget.currency}
                  </span>
                </p>
              </div>
              <p className="max-w-xs text-sm text-ink-muted">
                Local costs below use {info.currency}
                {info.currencySymbol ? ` (${info.currencySymbol})` : ''}. Dual-currency
                conversion comes next.
              </p>
            </div>
          ) : null}
        </GlassCard>
      </div>
    </section>
  )
}

/**
 * @param {{ currency: string, currencySymbol: string }} info
 */
function formatCurrency(info) {
  return `${info.currencySymbol} ${info.currency}`.trim()
}
