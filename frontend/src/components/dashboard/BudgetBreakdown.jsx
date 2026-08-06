import { useMemo, useState } from 'react'
import { Label, Pie, PieChart, Sector } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import useTrip from '../../hooks/useTrip'
import { formatMoney } from '../../utils'

const COLORS = ['#7c6cff', '#3dd6c6', '#ff7aac', '#5b8cff', '#fbbf24', '#34d399']

function categoryKey(cat, index) {
  const raw = cat.id || cat.label || `cat-${index}`
  return (
    String(raw)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `cat-${index}`
  )
}

export default function BudgetBreakdown() {
  const budget = useTrip()?.budget
  const [activeIndex, setActiveIndex] = useState(0)

  const { chartData, chartConfig } = useMemo(() => {
    if (!budget?.categories?.length) {
      return { chartData: [], chartConfig: { amount: { label: 'Amount' } } }
    }

    const config = {
      amount: { label: 'Amount' },
    }

    const data = budget.categories.map((cat, i) => {
      const key = categoryKey(cat, i)
      const color = COLORS[i % COLORS.length]
      config[key] = {
        label: cat.label,
        color,
      }
      return {
        category: key,
        label: cat.label,
        amount: Number(cat.amount) || 0,
        percent: Number(cat.percent) || 0,
        fill: `var(--color-${key})`,
      }
    })

    return { chartData: data, chartConfig: config }
  }, [budget])

  if (!budget) return null

  const active =
    chartData[Math.min(activeIndex, Math.max(0, chartData.length - 1))] ?? null

  return (
    <section className="dash-glass flex flex-col rounded-[24px] p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
        Budget
      </p>
      <h3 className="dash-display mt-1 text-xl font-bold text-[var(--dash-text)]">
        Breakdown
      </h3>
      <p className="mt-1 text-sm text-[var(--dash-muted)]">
        {formatMoney(budget.perPerson, budget.currencySymbol)} per person ·{' '}
        {budget.currency}
      </p>

      {chartData.length > 0 ? (
        <ChartContainer
          config={chartConfig}
          className="mx-auto mt-2 aspect-square max-h-[250px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _name, item) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {item?.payload?.label ?? item?.name}
                      </span>
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        {formatMoney(value, budget.currencySymbol)}
                        {item?.payload?.percent != null ? (
                          <span className="ml-1.5 text-muted-foreground">
                            {item.payload.percent}%
                          </span>
                        ) : null}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              shape={({ index, outerRadius = 0, ...props }) =>
                index === activeIndex ? (
                  <Sector {...props} outerRadius={outerRadius + 10} />
                ) : (
                  <Sector {...props} outerRadius={outerRadius} />
                )
              }
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !('cx' in viewBox) || !('cy' in viewBox)) {
                    return null
                  }
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy - 6}
                        className="fill-[var(--dash-text)] text-xl font-bold"
                      >
                        {formatMoney(budget.total, budget.currencySymbol)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy + 14}
                        className="fill-[var(--dash-muted)] text-[11px]"
                      >
                        {active?.label ?? 'Total'}
                      </tspan>
                    </text>
                  )
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      ) : null}

      <ul className="mt-4 space-y-2">
        {(budget.categories || []).map((cat, i) => {
          const isActive = i === activeIndex
          return (
            <li key={cat.id || cat.label}>
              <button
                type="button"
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  isActive
                    ? 'bg-[var(--dash-accent)]/10 ring-1 ring-[var(--dash-accent)]/30'
                    : 'bg-[var(--dash-surface)] hover:bg-[var(--dash-surface)]/80'
                }`}
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
              >
                <span className="flex items-center gap-2 text-sm text-[var(--dash-text)]">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {cat.label}
                </span>
                <span className="text-sm font-semibold text-[var(--dash-muted)]">
                  {formatMoney(cat.amount, budget.currencySymbol)}
                  <span className="ml-2 text-xs text-[var(--dash-soft)]">
                    {cat.percent}%
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
