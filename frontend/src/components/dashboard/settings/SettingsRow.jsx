import { HiChevronRight } from 'react-icons/hi'
import { cn } from '../../../utils'

export default function SettingsRow({
  icon: Icon,
  label,
  description,
  children,
  onClick,
  destructive = false,
  showChevron = false,
  last = false,
  className,
}) {
  const interactive = typeof onClick === 'function'
  const Comp = interactive ? 'button' : 'div'

  return (
    <Comp
      type={interactive ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'settings-row group flex w-full items-center gap-3 px-4 py-3.5 text-left',
        'transition-colors duration-200',
        interactive && 'hover:bg-[var(--dash-surface)] active:bg-[#f5f5f5]',
        !last && 'border-b border-[var(--dash-border)]',
        className,
      )}
    >
      {Icon ? (
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]',
            destructive ? 'bg-[#fff1f0] text-[#ff3b30]' : 'bg-[var(--dash-chip)] text-[var(--dash-text)]',
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-[15px] font-medium leading-snug tracking-[-0.01em]',
            destructive ? 'text-[#ff3b30]' : 'text-[var(--dash-text)]',
          )}
        >
          {label}
        </p>
        {description ? (
          <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--dash-muted)]">{description}</p>
        ) : null}
      </div>

      {children ? (
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      ) : null}

      {showChevron ? (
        <HiChevronRight className="h-4 w-4 shrink-0 text-[#c7c7cc] transition group-hover:text-[var(--dash-muted)]" />
      ) : null}
    </Comp>
  )
}
