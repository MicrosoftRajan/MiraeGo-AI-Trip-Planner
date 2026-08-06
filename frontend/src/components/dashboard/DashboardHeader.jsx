import { motion } from 'framer-motion'
import { useUser } from '@clerk/react'
import { useModal } from '@/components/ui/animated-modal'
import { Button } from '@/components/ui/button'
import { AiIcon } from '@/components/icons'
import CenteredSearch from './CenteredSearch'

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

export default function DashboardHeader({ search, onSearchChange }) {
  const { user } = useUser()
  const { setOpen } = useModal()
  const name = user?.firstName || 'there'
  const today = DATE_FORMAT.format(new Date())

  return (
    <motion.header
      className="mb-6 w-full min-w-0 sm:mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex w-full min-w-0 flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-[var(--dash-muted)] sm:text-sm">{today}</p>
          <h1 className="mt-1 truncate text-xl font-semibold tracking-tight text-[var(--dash-text)] sm:text-2xl lg:text-3xl">
            Welcome Back, {name}{' '}
            <span className="inline-block origin-[70%_70%] animate-[wave_1.6s_ease-in-out_infinite]">
              👋
            </span>
          </h1>
        </div>
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="hidden h-10 shrink-0 gap-2 bg-[var(--dash-accent)] px-5 text-[var(--dash-on-accent)] hover:bg-[var(--dash-accent-hover)] sm:inline-flex"
        >
          <AiIcon className="h-4 w-4" alt="" />
          Plan A Trip
        </Button>
      </div>

      <CenteredSearch
        className="mt-5 w-full sm:mt-6"
        value={search}
        onChange={onSearchChange}
        placeholder="Search trips, destinations, saved plans…"
        shortPlaceholder="Search trips…"
        ariaLabel="Search trips"
      />

      <style>{`
        @keyframes wave {
          0%, 60%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(14deg); }
          20%, 40% { transform: rotate(-8deg); }
        }
      `}</style>
    </motion.header>
  )
}
