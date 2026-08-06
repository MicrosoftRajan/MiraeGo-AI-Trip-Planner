import { useState } from 'react'
import { PACKING_DEFAULTS } from '../../constants/dashboard'
import { cn } from '../../utils'

export default function PackingList({ items = PACKING_DEFAULTS }) {
  const [checked, setChecked] = useState(() => new Set())

  const toggle = (item) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(item)) next.delete(item)
      else next.add(item)
      return next
    })
  }

  return (
    <section className="dash-glass rounded-[24px] p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
        Packing
      </p>
      <h3 className="dash-display mt-1 text-xl font-bold text-[var(--dash-text)]">
        Essentials list
      </h3>
      <ul className="mt-4 space-y-2">
        {items.map((item) => {
          const on = checked.has(item)
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => toggle(item)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
                  on ? 'bg-emerald-50' : 'bg-[var(--dash-surface)] hover:bg-[var(--dash-card)]',
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-md border text-[10px]',
                    on
                      ? 'border-emerald-400/50 bg-emerald-400/20 text-emerald-300'
                      : 'border-white/15 text-transparent',
                  )}
                >
                  ✓
                </span>
                <span
                  className={cn(
                    'text-sm',
                    on ? 'text-[var(--dash-soft)] line-through' : 'text-[var(--dash-text)]',
                  )}
                >
                  {item}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
