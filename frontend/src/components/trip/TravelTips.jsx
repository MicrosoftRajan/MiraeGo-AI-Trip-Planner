import { useId, useState } from 'react'
import useTrip from '../../hooks/useTrip'
import { cn } from '../../utils'
import GlassCard from '../common/GlassCard'

export default function TravelTips() {
  const tips = useTrip()?.tips ?? []
  const [openId, setOpenId] = useState(tips[0]?.id ?? null)
  const baseId = useId()

  if (!tips.length) return null

  return (
    <section id="tips" className="content-auto scroll-mt-28 py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sea">
            Travel tips
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Local notes worth keeping
          </h2>
          <p className="mt-3 text-ink-muted leading-relaxed">
            Practical cues for timing, transit, and reservations — expand any tip
            for the full note.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2">
          {tips.map((tip, index) => {
            const open = openId === tip.id
            const panelId = `${baseId}-panel-${tip.id}`
            return (
              <GlassCard
                key={tip.id}
                strong
                className={cn(
                  'animate-fade-up overflow-hidden transition-shadow duration-300',
                  open ? 'shadow-lift' : 'hover:shadow-lift',
                )}
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                <button
                  type="button"
                  className="flex w-full items-start gap-3 px-5 py-5 text-left transition-colors duration-300 hover:bg-chip/40 sm:px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sea/30"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : tip.id)}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sand/25 text-sm font-semibold text-ink">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold text-ink">
                        {tip.title}
                      </h3>
                      <span
                        className={cn(
                          'mt-0.5 text-ink-soft transition-transform duration-300',
                          open && 'rotate-45',
                        )}
                        aria-hidden
                      >
                        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
                          <path
                            d="M10 4v12M4 10h12"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </div>
                    {!open ? (
                      <p className="mt-2 line-clamp-1 text-sm text-ink-soft">{tip.body}</p>
                    ) : null}
                  </div>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-label={tip.title}
                  aria-hidden={!open}
                  inert={!open || undefined}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-divider px-5 pb-5 pt-0 text-sm leading-relaxed text-ink-muted sm:px-6">
                      <span className="block pt-4">{tip.body}</span>
                    </p>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
