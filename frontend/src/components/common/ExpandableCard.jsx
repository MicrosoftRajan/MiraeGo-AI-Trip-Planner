import { cn } from '../../utils'
import GlassCard from './GlassCard'

/**
 * Reusable glass accordion card — header toggles a smoothly expanding body.
 * Optional `actions` render beside the toggle (never nested inside the button).
 */
export default function ExpandableCard({
  expanded = false,
  onToggle,
  header,
  actions,
  children,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  bodyId,
  strong = true,
  style,
  ...props
}) {
  return (
    <GlassCard
      strong={strong}
      className={cn(
        'overflow-hidden transition-[box-shadow,transform] duration-300 ease-out',
        expanded ? 'shadow-lift' : 'hover:shadow-lift',
        className,
      )}
      style={style}
      {...props}
    >
      <div
        className={cn(
          'flex items-start gap-2 px-5 py-5 sm:gap-3 sm:px-6',
          headerClassName,
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={bodyId}
          className="flex min-w-0 flex-1 items-start gap-3 text-left sm:gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sea/30 rounded-xl"
        >
          {header}
        </button>

        {actions ? (
          <div className="flex shrink-0 items-center gap-1 pt-0.5">{actions}</div>
        ) : null}
      </div>

      <div
        id={bodyId}
        role="region"
        aria-hidden={!expanded}
        inert={!expanded || undefined}
        className={cn(
          'grid transition-[grid-template-rows] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              'border-t border-divider px-5 pb-5 pt-4 sm:px-6',
              bodyClassName,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

/** Chevron that rotates when the parent card is expanded. */
export function ExpandChevron({ expanded, className = '' }) {
  return (
    <span
      className={cn(
        'mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-chip text-ink-muted transition-all duration-300 ease-out',
        expanded && 'rotate-180 bg-chip-hover',
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
        <path
          d="M5 7.5 10 12.5 15 7.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
