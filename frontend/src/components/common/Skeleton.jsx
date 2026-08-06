import { cn } from '../../utils'

/**
 * Shimmer placeholder block. Use size/radius via className to match final UI.
 */
export default function Skeleton({
  className = '',
  rounded = 'md',
  ...props
}) {
  const radius =
    rounded === 'full'
      ? 'rounded-full'
      : rounded === 'xl'
        ? 'rounded-xl'
        : rounded === '2xl'
          ? 'rounded-2xl'
          : rounded === 'card'
            ? 'rounded-[var(--radius-card)]'
            : rounded === 'lg'
              ? 'rounded-lg'
              : 'rounded-md'

  return (
    <span
      className={cn('skeleton block', radius, className)}
      aria-hidden
      {...props}
    />
  )
}
