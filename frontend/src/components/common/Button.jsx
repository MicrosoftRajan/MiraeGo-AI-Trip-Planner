import { cn } from '../../utils'

const variants = {
  primary:
    'bg-sea text-white hover:bg-sea-deep hover:shadow-lift focus-visible:ring-sea/40 shadow-soft',
  secondary:
    'glass-strong text-ink hover:bg-chip-hover focus-visible:ring-sea/25',
  ghost:
    'bg-transparent text-ink-muted hover:text-ink hover:bg-chip focus-visible:ring-sea/20',
  danger:
    'bg-coral/10 text-coral hover:bg-coral/20 focus-visible:ring-coral/30',
}

const sizes = {
  sm: 'px-3.5 py-2 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-2xl',
  lg: 'px-6 py-3.5 text-base rounded-2xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-foam',
        'disabled:pointer-events-none disabled:opacity-50',
        'active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
