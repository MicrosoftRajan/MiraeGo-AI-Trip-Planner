import useTrip from '../../hooks/useTrip'
import { formatMoney } from '../../utils'
import GlassCard from '../common/GlassCard'

export default function BudgetSummary() {
  const trip = useTrip()
  const budget = trip?.budget
  if (!budget) return null

  const barLabel = budget.categories
    .map((cat) => `${cat.label} ${cat.percent}%`)
    .join(', ')

  return (
    <section id="budget" className="content-auto scroll-mt-28 py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sea">
            Budget
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Spend at a glance
          </h2>
          <p className="mt-3 text-ink-muted leading-relaxed">
            Rough estimates across lodging, food, tickets, and extras — tune stops
            and the totals update when the API is live.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-[1.1fr_1fr]">
          <GlassCard strong className="animate-fade-up p-5 sm:p-6 md:p-8">
            <p className="text-sm font-medium text-ink-muted">Estimated total</p>
            <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {formatMoney(budget.total, budget.currencySymbol)}
            </p>
            <p className="mt-2 text-ink-muted">
              About {formatMoney(budget.perPerson, budget.currencySymbol)} per person
              <span className="text-ink-soft"> · {budget.currency}</span>
            </p>

            <div
              className="mt-8 h-3 overflow-hidden rounded-full bg-mist/80"
              role="img"
              aria-label={`Budget breakdown: ${barLabel}`}
            >
              <div className="flex h-full w-full" aria-hidden>
                {budget.categories.map((cat, i) => (
                  <div
                    key={cat.id}
                    className="h-full transition-all duration-700 first:rounded-l-full last:rounded-r-full"
                    style={{
                      width: `${cat.percent}%`,
                      backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                      opacity: 0.85,
                    }}
                    title={`${cat.label}: ${cat.percent}%`}
                  />
                ))}
              </div>
            </div>

            <ul className="sr-only">
              {budget.categories.map((cat) => (
                <li key={cat.id}>
                  {cat.label}: {formatMoney(cat.amount, budget.currencySymbol)} (
                  {cat.percent}%)
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="animate-fade-up stagger-2 space-y-3 p-4 sm:p-5 md:p-6">
            {budget.categories.map((cat, i) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 rounded-2xl bg-panel px-3 py-3 transition-all duration-300 hover:bg-panel-hover hover:shadow-soft sm:px-4"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-sm font-medium text-ink">{cat.label}</p>
                    <p className="shrink-0 text-sm font-semibold text-ink">
                      {formatMoney(cat.amount, budget.currencySymbol)}
                    </p>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${cat.percent}%`,
                        backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                        opacity: 0.75,
                      }}
                    />
                  </div>
                </div>
                <span className="w-10 text-right text-xs font-medium text-ink-soft">
                  {cat.percent}%
                </span>
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

const BAR_COLORS = ['#0e7c7b', '#c4a574', '#1a9e9c', '#4a5d6a', '#c45c4a']
