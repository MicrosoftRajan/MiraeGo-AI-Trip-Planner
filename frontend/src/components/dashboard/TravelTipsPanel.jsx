import { useState } from 'react'
import useTrip from '../../hooks/useTrip'
import { cn } from '../../utils'

export default function TravelTipsPanel() {
  const tips = useTrip()?.tips ?? []
  const [openId, setOpenId] = useState(tips[0]?.id ?? null)

  if (!tips.length) return null

  return (
    <section className="dash-glass rounded-[24px] p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
        Insights
      </p>
      <h3 className="dash-display mt-1 text-xl font-bold text-[var(--dash-text)]">
        Travel tips
      </h3>
      <div className="mt-4 space-y-2">
        {tips.map((tip, i) => {
          const open = openId === tip.id
          return (
            <div
              key={tip.id}
              className="overflow-hidden rounded-xl border border-[var(--dash-border)] bg-[var(--dash-surface)]"
            >
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : tip.id)}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--dash-surface)] text-xs font-bold text-[var(--dash-text)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-sm font-medium text-[var(--dash-text)]">
                  {tip.title}
                </span>
                <span className={cn('text-[var(--dash-soft)]', open && 'rotate-180')}>
                  ▾
                </span>
              </button>
              {open && tip.body ? (
                <p className="border-t border-[var(--dash-border)] px-3.5 pb-3.5 pt-2 text-sm leading-relaxed text-[var(--dash-muted)]">
                  {tip.body}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}
