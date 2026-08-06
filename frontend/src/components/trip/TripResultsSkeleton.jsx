import GlassCard from '../common/GlassCard'
import Skeleton from '../common/Skeleton'

/**
 * Layout-matching shimmer placeholders for Timeline, Budget, and Travel Tips.
 */
export default function TripResultsSkeleton({
  destination = 'your trip',
  days = 4,
}) {
  const dayCount = Math.min(Math.max(Number(days) || 4, 3), 6)

  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">
        Crafting itinerary for {destination || 'your trip'}…
      </span>

      <DestinationSkeleton />
      <TimelineSkeleton dayCount={dayCount} />
      <BudgetSkeleton />
      <TipsSkeleton />
    </div>
  )
}

function DestinationSkeleton() {
  return (
    <section id="destination" className="scroll-mt-28 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center animate-fade-up">
          <Skeleton className="mx-auto h-3 w-24" />
          <Skeleton className="mx-auto mt-4 h-9 w-full max-w-md sm:h-10" rounded="lg" />
          <Skeleton className="mx-auto mt-3 h-4 w-full max-w-lg" />
        </div>
        <GlassCard strong className="mx-auto mt-8 max-w-4xl animate-scale-in p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="rounded-2xl bg-chip/60 px-4 py-3">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="mt-2 h-4 w-28" />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function TimelineSkeleton({ dayCount }) {
  return (
    <section id="timeline" className="scroll-mt-28 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl animate-fade-up">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-4 h-9 w-full max-w-md sm:h-10" rounded="lg" />
            <Skeleton className="mt-3 h-4 w-full max-w-lg" />
            <Skeleton className="mt-2 h-4 w-full max-w-sm" />
          </div>

          <GlassCard className="animate-fade-up stagger-2 flex flex-wrap gap-x-6 gap-y-3 px-5 py-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="min-w-[4.5rem]">
                <Skeleton className="h-2.5 w-12" />
                <Skeleton className="mt-1.5 h-4 w-16" />
              </div>
            ))}
          </GlassCard>
        </div>

        <div className="relative mt-10 space-y-4">
          <div
            className="absolute left-[2.35rem] top-6 bottom-6 hidden w-px bg-gradient-to-b from-mist via-mist/70 to-mist/30 sm:block"
            aria-hidden
          />
          {Array.from({ length: dayCount }, (_, i) => (
            <DayCardSkeleton key={i} index={i} expanded={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

function DayCardSkeleton({ index, expanded }) {
  return (
    <GlassCard
      strong
      className="animate-fade-up overflow-hidden"
      style={{ animationDelay: `${index * 0.09}s` }}
    >
      <div className="flex items-start gap-3 px-5 py-5 sm:gap-4 sm:px-6">
        <Skeleton className="h-12 w-12 shrink-0" rounded="2xl" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-5 w-full max-w-[14rem] sm:h-6" rounded="lg" />
              <Skeleton className="mt-2 h-3.5 w-full max-w-[10rem]" />
            </div>
            <Skeleton className="mt-1 hidden h-5 w-5 sm:block" rounded="full" />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-16" rounded="lg" />
            <Skeleton className="h-6 w-20" rounded="lg" />
            <Skeleton className="h-6 w-14" rounded="lg" />
            <Skeleton className="h-6 w-24 sm:ml-auto" rounded="lg" />
          </div>

          <Skeleton className="mt-3 h-1.5 w-full" rounded="full" />
        </div>

        <Skeleton className="mt-1 h-5 w-5 shrink-0 sm:hidden" rounded="full" />
      </div>

      {expanded ? (
        <div className="space-y-4 px-5 pb-5 sm:px-6">
          <div className="h-px bg-mist/60" />
          {[0.55, 0.7, 0.45].map((width, i) => (
            <div
              key={i}
              className="animate-fade-up flex items-start gap-3 rounded-2xl bg-panel px-4 py-3"
              style={{ animationDelay: `${0.12 + i * 0.08}s` }}
            >
              <Skeleton className="mt-0.5 h-8 w-8 shrink-0" rounded="xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton
                  className="h-4 max-w-full"
                  style={{ width: `${Math.round(width * 100)}%` }}
                />
                <Skeleton className="h-3 w-full max-w-xs" />
              </div>
              <Skeleton className="h-4 w-12 shrink-0" />
            </div>
          ))}
        </div>
      ) : null}
    </GlassCard>
  )
}

function BudgetSkeleton() {
  return (
    <section id="budget" className="scroll-mt-28 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl animate-fade-up">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-4 h-9 w-64 max-w-full sm:h-10" rounded="lg" />
          <Skeleton className="mt-3 h-4 w-full max-w-md" />
          <Skeleton className="mt-2 h-4 w-full max-w-sm" />
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <GlassCard strong className="animate-fade-up p-6 sm:p-8">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-3 h-12 w-48 max-w-full sm:h-14" rounded="lg" />
            <Skeleton className="mt-3 h-4 w-56 max-w-full" />
            <Skeleton className="mt-8 h-3 w-full" rounded="full" />
          </GlassCard>

          <GlassCard className="animate-fade-up stagger-2 space-y-3 p-5 sm:p-6">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl bg-panel px-4 py-3"
              >
                <Skeleton className="h-2.5 w-2.5 shrink-0" rounded="full" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3.5 w-14" />
                  </div>
                  <Skeleton className="mt-2 h-1.5 w-full" rounded="full" />
                </div>
                <Skeleton className="h-3 w-8 shrink-0" />
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

function TipsSkeleton() {
  return (
    <section id="tips" className="scroll-mt-28 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl animate-fade-up">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-9 w-72 max-w-full sm:h-10" rounded="lg" />
          <Skeleton className="mt-3 h-4 w-full max-w-md" />
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <GlassCard
              key={i}
              strong
              className="animate-fade-up overflow-hidden"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="flex items-start gap-3 px-5 py-5 sm:px-6">
                <Skeleton className="mt-0.5 h-8 w-8 shrink-0" rounded="xl" />
                <div className="min-w-0 flex-1 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <Skeleton className="h-5 w-full max-w-[12rem]" rounded="lg" />
                    <Skeleton className="mt-0.5 h-5 w-5 shrink-0" rounded="full" />
                  </div>
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-full max-w-[85%]" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
