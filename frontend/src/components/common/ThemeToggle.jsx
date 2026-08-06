import { ThemeToggleButton } from '@/components/ui/skiper-ui/skiper26'
import { cn } from '../../utils'

/**
 * Animated light/dark theme control — full-page view-transition wipe.
 */
export default function ThemeToggle({ className = '' }) {
  return (
    <ThemeToggleButton
      variant="circle"
      start="center"
      className={cn('size-10 shrink-0', className)}
    />
  )
}
