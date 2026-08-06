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
 * Reusable error banner for request failures (network, timeout, rate limit, etc.).
 *
 * @param {{
 *   error: unknown,
 *   onRetry?: () => void,
 *   onDismiss?: () => void,
 *   className?: string,
 *   compact?: boolean,
 * }} props
 */
export default function ErrorBanner({
  error,
  onRetry,
  onDismiss,
  className = '',
  compact = false,
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
    <GlassCard
      strong
      role="alert"
      aria-live="assertive"
      className={cn(
        'border border-coral/25 bg-coral/5',
        compact ? 'px-4 py-3' : 'px-5 py-4 sm:px-6',
        className,
      )}
    >
      <div
        className={cn(
          'flex gap-3',
          compact ? 'items-center' : 'flex-col sm:flex-row sm:items-start',
        )}
      >
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-coral/10 text-coral"
          aria-hidden
        >
          <ErrorIcon code={normalized.code} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-medium text-ink">{title}</p>
          <p className={cn('text-sm text-ink-muted', compact ? 'mt-0.5' : 'mt-1')}>
            {message}
          </p>
          {Array.isArray(normalized.details) && normalized.details.length > 0 ? (
            <ul className="mt-2 list-inside list-disc text-sm text-ink-soft">
              {normalized.details.slice(0, 4).map((item) => (
                <li key={String(item)}>{String(item)}</li>
              ))}
            </ul>
          ) : null}
        </div>

        {(canRetry || onDismiss) && (
          <div className="flex shrink-0 flex-wrap gap-2 sm:pt-0.5">
            {canRetry ? (
              <Button type="button" size="sm" variant="secondary" onClick={onRetry}>
                Try again
              </Button>
            ) : null}
            {onDismiss ? (
              <Button type="button" size="sm" variant="ghost" onClick={onDismiss}>
                Dismiss
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </GlassCard>
  )
}

function ErrorIcon({ code }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  if (code === ERROR_CODES.NETWORK) {
    return (
      <svg {...common}>
        <path d="M5 12.5c2.5-4 6-6 9.5-6" />
        <path d="M7.5 16c1.8-2.8 4.2-4.2 7-4.2" />
        <path d="M10 19.5c.9-1.4 2.1-2.1 3.5-2.1" />
        <circle cx="14.5" cy="19.5" r="1" fill="currentColor" stroke="none" />
        <path d="M4 4l16 16" />
      </svg>
    )
  }

  if (code === ERROR_CODES.TIMEOUT) {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4.5l3 1.5" />
      </svg>
    )
  }

  if (code === ERROR_CODES.RATE_LIMITED) {
    return (
      <svg {...common}>
        <path d="M12 5v3" />
        <path d="M12 16v3" />
        <path d="M5 12h3" />
        <path d="M16 12h3" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}
