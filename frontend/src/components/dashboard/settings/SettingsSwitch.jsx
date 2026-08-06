import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../../utils'

export default function SettingsSwitch({ checked, onChange, disabled = false, id, label }) {
  const reduce = useReducedMotion()

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'settings-switch relative inline-flex h-[28px] w-[48px] shrink-0 items-center rounded-full p-[2px]',
        'transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/30',
        'disabled:cursor-not-allowed disabled:opacity-40',
        checked ? 'bg-[#34c759]' : 'bg-[#e5e5ea]',
      )}
    >
      <motion.span
        layout
        transition={
          reduce
            ? { duration: 0 }
            : { type: 'spring', stiffness: 700, damping: 38, mass: 0.8 }
        }
        className={cn(
          'block h-6 w-6 rounded-full bg-[var(--dash-card)] shadow-[0_1px_3px_rgb(0_0_0_/_0.18),0_1px_1px_rgb(0_0_0_/_0.06)]',
          checked ? 'ml-auto' : 'ml-0',
        )}
        whileTap={reduce || disabled ? undefined : { scale: 0.92 }}
      />
    </button>
  )
}
