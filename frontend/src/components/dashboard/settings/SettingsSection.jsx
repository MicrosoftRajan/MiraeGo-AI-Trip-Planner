import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../../../utils'

export default function SettingsSection({ title, description, children, delay = 0, className }) {
  const reduce = useReducedMotion()

  return (
    <motion.section
      className={cn('settings-section', className)}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {(title || description) && (
        <header className="mb-2 px-1">
          {title ? (
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-[var(--dash-soft)]">{description}</p>
          ) : null}
        </header>
      )}
      <div className="settings-card overflow-hidden">{children}</div>
    </motion.section>
  )
}
