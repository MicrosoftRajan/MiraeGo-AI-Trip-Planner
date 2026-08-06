import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../../utils'

export default function SettingsSegmented({ options, value, onChange, ariaLabel }) {
  const reduce = useReducedMotion()
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="settings-segmented relative grid rounded-[10px] bg-[var(--dash-settings-select)] p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      <motion.span
        aria-hidden
        className="absolute inset-y-1 rounded-[8px] bg-[var(--dash-card)] shadow-[0_1px_3px_rgb(0_0_0_/_0.08),0_1px_1px_rgb(0_0_0_/_0.04)]"
        initial={false}
        animate={{
          left: `calc(${(100 / options.length) * activeIndex}% + 4px)`,
          width: `calc(${100 / options.length}% - 8px)`,
        }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: 'spring', stiffness: 420, damping: 36 }
        }
      />
      {options.map((option) => {
        const active = option.value === value
        const Icon = option.icon
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative z-[1] flex items-center justify-center gap-1.5 rounded-[8px] px-2 py-1.5',
              'text-[12px] font-medium transition-colors duration-200',
              active ? 'text-[var(--dash-text)]' : 'text-[var(--dash-muted)] hover:text-[var(--dash-text)]',
            )}
          >
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
