import { forwardRef } from 'react'
import { cn } from '../../utils'

const Textarea = forwardRef(function Textarea(
  {
    label,
    id,
    className = '',
    containerClassName = '',
    error,
    ...props
  },
  ref,
) {
  const inputId = id || props.name

  return (
    <label className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label ? (
        <span className="text-sm font-medium text-ink-muted">{label}</span>
      ) : null}
      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          'w-full min-h-[120px] resize-y rounded-2xl border border-border-input bg-input px-4 py-3 text-ink placeholder:text-ink-soft',
          'shadow-soft backdrop-blur-md transition-all duration-300',
          'hover:bg-input-hover focus:border-sea/40 focus:bg-input-focus focus:outline-none focus:ring-2 focus:ring-sea/20',
          error &&
            'border-coral/45 focus:border-coral/50 focus:ring-coral/20',
          className,
        )}
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="text-sm text-coral" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  )
})

export default Textarea
