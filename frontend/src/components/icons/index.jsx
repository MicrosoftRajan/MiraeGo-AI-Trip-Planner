import { cn } from '@/lib/utils'
import { SearchIcon } from './SearchIcon'

const MASK_STYLE = (src) => ({
  maskImage: `url(${src})`,
  WebkitMaskImage: `url(${src})`,
  maskSize: 'contain',
  WebkitMaskSize: 'contain',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskPosition: 'center',
  WebkitMaskPosition: 'center',
})

function MaskIcon({ src, className, alt = '', ...props }) {
  return (
    <span
      role="img"
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn('inline-block shrink-0 bg-current', className)}
      style={MASK_STYLE(src)}
      {...props}
    />
  )
}

/** Colorful AI sparkles (icons8). */
export function AiIcon({ className, alt = 'AI', ...props }) {
  return (
    <img
      src="/icons/icons8-ai-94.png"
      alt={alt}
      className={cn('inline-block shrink-0 object-contain', className)}
      draggable={false}
      {...props}
    />
  )
}

/** Outline bookmark ribbon — inherits `currentColor`. */
export function BookmarkIcon({ className, ...props }) {
  return (
    <MaskIcon
      src="/icons/icons8-bookmark-64.png"
      className={className}
      {...props}
    />
  )
}

/** Filled bookmark ribbon — inherits `currentColor`. */
export function BookmarkFilledIcon({ className, ...props }) {
  return (
    <MaskIcon
      src="/icons/icons8-filled-bookmark-ribbon-64.png"
      className={className}
      {...props}
    />
  )
}

export { SearchIcon }
