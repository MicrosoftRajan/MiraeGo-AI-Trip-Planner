import {
  ERROR_CODES,
  ERROR_MESSAGES,
  ERROR_TITLES,
  normalizeErrorState,
} from '../../utils/errors'
import { cn } from '../../utils'
import Button from './Button'
import GlassCard from './GlassCard'

/**
 * Larger section-level error state (results area).
 *
 * @param {{
 *   error: unknown,
 *   onRetry?: () => void,
 *   onDismiss?: () => void,
 *   className?: string,
 * }} props
 */
export default function ErrorState({
  error,
  onRetry,
  onDismiss,
  className = '',
}) {
  const normalized = normalizeErrorState(error)
  if (!normalized || normalized.code === ERROR_CODES.ABORTED) return null

  const title = ERROR_TITLES[normalized.code] || ERROR_TITLES[ERROR_CODES.UNKNOWN]
  const message =
    normalized.message ||
    ERROR_MESSAGES[normalized.code] ||
    ERROR_MESSAGES[ERROR_CODES.UNKNOWN]
  const canRetry = Boolean(onRetry) && normalized.retryable !== false

  return (
    <section
      className={cn('scroll-mt-28 py-10 sm:py-14', className)}
      aria-labelledby="trip-error-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <GlassCard
          strong
          role="alert"
          aria-live="assertive"
          className="mx-auto max-w-xl border border-coral/20 bg-gradient-to-b from-coral/8 to-white/40 px-6 py-8 text-center sm:px-10 sm:py-10"
        >
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-coral/10 text-coral"
            aria-hidden
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="8" />
              <path d="M12 8v5" />
              <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
            </svg>
          </div>

          <h2
            id="trip-error-heading"
            className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink"
          >
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
            {message}
          </p>

          {(canRetry || onDismiss) && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {canRetry ? (
                <Button type="button" onClick={onRetry}>
                  Try again
                </Button>
              ) : null}
              {onDismiss ? (
                <Button type="button" variant="ghost" onClick={onDismiss}>
                  Dismiss
                </Button>
              ) : null}
            </div>
          )}
        </GlassCard>
      </div>
    </section>
  )
}
