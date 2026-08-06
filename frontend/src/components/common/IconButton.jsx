import { cn } from '../../utils'

/**
 * Accessible icon-only button used across itinerary cards.
 */
export default function IconButton({
  label,
  disabled = false,
  onClick,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-xl p-2 text-ink-soft transition-all duration-300',
        'hover:bg-chip-hover hover:text-ink hover:scale-105',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/30 focus-visible:ring-offset-1 focus-visible:ring-offset-foam',
        'active:scale-95',
        'disabled:pointer-events-none disabled:opacity-30',
        className,
      )}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
