import { motion, useReducedMotion } from 'framer-motion'
import { formatCompact } from '../../utils/dashboard'
import { cn } from '../../utils'
import AnimatedCounter from '../landing/shared/AnimatedCounter'

export default function StatsCard({
  label,
  value,
  prefix = '',
  suffix = '',
  format,
  index = 0,
  isText = false,
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className="dash-card-surface dash-card-lift p-5"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-xs font-medium text-[var(--dash-muted)]">{label}</p>
      <p
        className={cn(
          'mt-2 font-semibold tracking-tight text-[var(--dash-text)]',
          isText ? 'text-xl' : 'text-3xl',
        )}
      >
        {isText ? (
          value
        ) : format === 'compact' ? (
          <span>
            {prefix}
            {formatCompact(Number(value))}
          </span>
        ) : (
          <AnimatedCounter value={Number(value)} prefix={prefix} suffix={suffix} duration={1.2} />
        )}
      </p>
    </motion.div>
  )
}
