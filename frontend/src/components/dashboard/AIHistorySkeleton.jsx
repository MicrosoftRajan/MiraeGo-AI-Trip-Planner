import Skeleton from '../common/Skeleton'

export default function AIHistorySkeleton() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading history">
      {[0, 1].map((group) => (
        <div key={group} className="space-y-4">
          <Skeleton className="h-5 w-32" rounded="lg" />
          <div className="dash-timeline">
            {[0, 1, 2].map((i) => (
              <div key={i} className="dash-timeline-item">
                <div className="dash-timeline-marker">
                  <Skeleton className="h-3 w-3" rounded="full" />
                </div>
                <div className="dash-timeline-card dash-card-surface p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2 min-w-0 flex-1">
                      <Skeleton className="h-4 w-3/4 max-w-xs" rounded="lg" />
                      <Skeleton className="h-3 w-1/2 max-w-[200px]" rounded="lg" />
                    </div>
                    <Skeleton className="h-6 w-20" rounded="full" />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[0, 1, 2, 3].map((n) => (
                      <div key={n} className="space-y-1.5">
                        <Skeleton className="h-3 w-16" rounded="lg" />
                        <Skeleton className="h-4 w-24" rounded="lg" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {[0, 1, 2, 3].map((n) => (
                      <Skeleton key={n} className="h-8 w-24" rounded="lg" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
