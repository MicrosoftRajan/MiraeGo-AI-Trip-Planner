import { cn } from '../../utils'

export default function GlassCard({
  as: Tag = 'div',
  children,
  className = '',
  strong = false,
  dark = false,
  interactive = false,
  ...props
}) {
  return (
    <Tag
      className={cn(
        'rounded-[var(--radius-card)]',
        dark ? 'glass-dark' : strong ? 'glass-strong' : 'glass',
        interactive && 'interactive',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
