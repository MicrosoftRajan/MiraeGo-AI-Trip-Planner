import { lazy, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NotFoundScene = lazy(() => import('../components/not-found/NotFoundScene'))

const BG_SRC = '/images/peeps/neom-eOWabmCNEdg-unsplash.jpg'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className="relative isolate min-h-dvh overflow-hidden text-white">
      <img
        src={BG_SRC}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        fetchPriority="high"
      />

      {/* Readability scrims */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/70"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        aria-hidden
      />

      {/* 3D 404 — upper sky */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[58%] min-h-[280px] sm:h-[62%]">
        <Suspense fallback={null}>
          <NotFoundScene />
        </Suspense>
      </div>

      <header className="relative z-[2] flex items-center gap-2.5 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-8">
        <Link to="/dashboard" className="flex items-center gap-2.5" aria-label="Miraego home">
          <img
            src="/logo/Miraego.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain drop-shadow-md"
          />
          <span className="font-display text-lg font-semibold tracking-tight drop-shadow-sm">
            Miraego
          </span>
        </Link>
      </header>

      <div className="relative z-[2] mx-auto flex min-h-[calc(100dvh-5rem)] max-w-2xl flex-col justify-end px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24 sm:px-8 sm:pb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
          Error 404
        </p>
        <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Looks like this trail doesn’t exist
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
          The page you’re looking for wandered off the map. Head back to your dashboard and keep
          planning the journey that matters.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-[#0f1c24] transition hover:bg-white/90"
          >
            Back to Dashboard
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Go back
          </button>
        </div>
      </div>
    </main>
  )
}
