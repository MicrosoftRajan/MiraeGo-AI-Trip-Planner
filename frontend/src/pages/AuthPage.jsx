import { useEffect, useState } from 'react'
import { SignIn, SignUp } from '@clerk/react'

function modeFromHash() {
  return window.location.hash.includes('sign-up') ? 'sign-up' : 'sign-in'
}

export default function AuthPage({ onBack }) {
  const [mode, setMode] = useState(modeFromHash)

  useEffect(() => {
    const sync = () => setMode(modeFromHash())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const switchMode = (next) => {
    window.location.hash = next === 'sign-up' ? 'sign-up' : 'sign-in'
    setMode(next)
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgb(14 124 123 / 0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 80%, rgb(196 165 116 / 0.18), transparent 50%), var(--color-foam)',
        }}
      />

      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 top-4 rounded-full border border-ink/10 bg-white/60 px-4 py-2 text-sm font-medium text-ink-muted backdrop-blur-md transition-colors hover:bg-white/80 hover:text-ink dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 sm:left-6 sm:top-6"
        >
          ← Back to home
        </button>
      ) : null}

      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sea text-white shadow-soft">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
            <path
              d="M4 16c3-1 5-4 8-4s5 3 8 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M12 5v7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="12" cy="4.5" r="1.4" fill="currentColor" />
          </svg>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Gilora
        </h1>
        <p className="mt-2 text-sm text-ink-muted sm:text-base">
          {mode === 'sign-in'
            ? 'Sign in to plan your next trip'
            : 'Create an account to get started'}
        </p>
      </div>

      <div className="w-full max-w-[420px]">
        {mode === 'sign-in' ? (
          <SignIn
            routing="hash"
            forceRedirectUrl="/"
            signUpUrl="#sign-up"
            appearance={{
              elements: {
                rootBox: 'mx-auto w-full',
                card: 'shadow-lift',
              },
            }}
          />
        ) : (
          <SignUp
            routing="hash"
            forceRedirectUrl="/"
            signInUrl="#sign-in"
            appearance={{
              elements: {
                rootBox: 'mx-auto w-full',
                card: 'shadow-lift',
              },
            }}
          />
        )}
      </div>

      <p className="mt-6 text-sm text-ink-muted">
        {mode === 'sign-in' ? (
          <>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="font-medium text-sea transition-colors hover:text-sea-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/30"
              onClick={() => switchMode('sign-up')}
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button
              type="button"
              className="font-medium text-sea transition-colors hover:text-sea-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/30"
              onClick={() => switchMode('sign-in')}
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  )
}
