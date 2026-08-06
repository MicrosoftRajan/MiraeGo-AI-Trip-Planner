import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserButton, useUser } from '@clerk/react'
import { HiOutlineMenuAlt2, HiOutlineX } from 'react-icons/hi'
import { SIDEBAR_NAV } from '../../constants/dashboard'
import { cn } from '../../utils'

function LogoMark({ compact = false }) {
  return (
    <div className={cn('flex items-center gap-3', compact && 'justify-center')}>
      <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#7c6cff] via-[#5b8cff] to-[#3dd6c6] shadow-[0_8px_24px_rgb(124_108_255/0.4)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" aria-hidden>
          <path
            d="M4 16c3-1 5-4 8-4s5 3 8 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path d="M12 5v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="4.5" r="1.4" fill="currentColor" />
        </svg>
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent to-white/25" />
      </span>
      {!compact ? (
        <div>
          <p className="dash-display text-lg font-bold tracking-tight text-white">Gilora</p>
          <p className="text-[11px] font-medium tracking-wide text-[var(--dash-muted)]">
            AI Travel OS
          </p>
        </div>
      ) : null}
    </div>
  )
}

function NavItem({ item, active, compact, onClick }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={() => onClick?.(item.id)}
      className={cn(
        'group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-300',
        compact && 'justify-center px-2',
        active
          ? 'bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]'
          : 'text-[var(--dash-muted)] hover:bg-white/[0.04] hover:text-white',
      )}
      aria-current={active ? 'page' : undefined}
      title={compact ? item.label : undefined}
    >
      {active ? (
        <motion.span
          layoutId="sidebar-active"
          className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#7c6cff] to-[#3dd6c6]"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      ) : null}
      <Icon
        className={cn(
          'h-5 w-5 shrink-0 transition-colors',
          active ? 'text-[#a89bff]' : 'group-hover:text-white',
        )}
      />
      {!compact ? (
        <span className="text-sm font-medium tracking-tight">{item.label}</span>
      ) : null}
    </button>
  )
}

function ProfileCard({ compact }) {
  const { user } = useUser()
  const name = user?.firstName || user?.fullName || 'Traveler'
  const email = user?.primaryEmailAddress?.emailAddress || 'Premium member'

  if (compact) {
    return (
      <div className="flex justify-center pb-2">
        <UserButton
          afterSignOutUrl="/"
          appearance={{ elements: { avatarBox: 'h-10 w-10' } }}
        />
      </div>
    )
  }

  return (
    <div className="dash-glass rounded-2xl p-3">
      <div className="flex items-center gap-3">
        <UserButton
          afterSignOutUrl="/"
          appearance={{ elements: { avatarBox: 'h-10 w-10' } }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{name}</p>
          <p className="truncate text-xs text-[var(--dash-muted)]">{email}</p>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ active = 'dashboard', onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const content = (isCompact) => (
    <div className="flex h-full flex-col gap-6 p-4 lg:p-5">
      <LogoMark compact={isCompact} />

      <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
        {SIDEBAR_NAV.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={active === item.id}
            compact={isCompact}
            onClick={(id) => {
              onNavigate?.(id)
              setMobileOpen(false)
            }}
          />
        ))}
      </nav>

      <ProfileCard compact={isCompact} />
    </div>
  )

  return (
    <>
      {/* Desktop / tablet rail */}
      <aside className="hidden h-full border-r border-white/[0.06] lg:block">
        <div className="hidden h-full xl:block">{content(false)}</div>
        <div className="hidden h-full lg:block xl:hidden">{content(true)}</div>
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="dash-mobile-nav fixed inset-x-0 top-0 z-40 items-center justify-between border-b border-white/[0.06] bg-[#05060a]/80 px-4 py-3 backdrop-blur-xl">
        <LogoMark />
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-white"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <HiOutlineX className="h-5 w-5" /> : <HiOutlineMenuAlt2 className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/[0.08] bg-[#0b0d14] lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              {content(false)}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}
