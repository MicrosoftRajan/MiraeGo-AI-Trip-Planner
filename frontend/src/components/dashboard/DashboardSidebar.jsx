import { Link, useLocation } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/react'
import {
  HiOutlineClock,
  HiOutlineCog,
  HiOutlineGlobe,
  HiOutlineLogout,
  HiOutlineMap,
  HiOutlineViewGrid,
} from 'react-icons/hi'
import { motion } from 'motion/react'
import {
  Sidebar,
  SidebarLink,
  DesktopSidebar,
  useSidebar,
} from '@/components/ui/sidebar'
import { BookmarkIcon } from '@/components/icons'
import ThemeToggle from '../common/ThemeToggle'
import { cn } from '../../utils'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
  { href: '/dashboard/trips', label: 'My Trips', icon: HiOutlineMap },
  { href: '/dashboard/history', label: 'History', icon: HiOutlineClock },
  { href: '/dashboard/explore', label: 'Explore', icon: HiOutlineGlobe },
  { href: '/dashboard/saved-plans', label: 'Saved Plans', icon: BookmarkIcon },
  { href: '/dashboard/settings', label: 'Settings', icon: HiOutlineCog },
]

function isNavActive(label, pathname) {
  if (label === 'My Trips') {
    return pathname === '/dashboard/trips' || pathname.startsWith('/dashboard/trip/')
  }
  if (label === 'History') {
    return pathname === '/dashboard/history'
  }
  if (label === 'Explore') {
    return pathname === '/dashboard/explore'
  }
  if (label === 'Saved Plans') {
    return pathname === '/dashboard/saved-plans'
  }
  if (label === 'Settings') {
    return pathname === '/dashboard/settings'
  }
  if (label === 'Dashboard') {
    return pathname === '/dashboard'
  }
  return false
}

function Logo() {
  const { open, animate } = useSidebar()

  return (
    <Link
      to="/dashboard"
      className={cn(
        'flex min-h-10 items-center overflow-hidden',
        open ? 'gap-2.5 px-1' : 'justify-center px-0',
      )}
      aria-label="Miraego home"
    >
      <img
        src="/logo/Miraego.png"
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 object-contain"
      />
      <motion.span
        animate={{
          width: animate ? (open ? 'auto' : 0) : 'auto',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden whitespace-nowrap text-sm font-semibold tracking-tight text-[var(--dash-text)] lg:text-base"
      >
        Miraego
      </motion.span>
    </Link>
  )
}

function ProfileBlock() {
  const { open, animate } = useSidebar()
  const { user } = useUser()
  const name = user?.firstName || user?.fullName || 'Traveler'
  const email = user?.primaryEmailAddress?.emailAddress || ''

  return (
    <div className="mt-auto space-y-3 overflow-hidden border-t border-[var(--dash-border)] pt-4">
      <div
        className={cn(
          'flex items-center',
          open ? 'gap-3 px-1' : 'justify-center',
        )}
      >
        <UserButton
          afterSignOutUrl="/"
          appearance={{ elements: { avatarBox: 'h-8 w-8 sm:h-9 sm:w-9' } }}
        />
        <motion.div
          animate={{
            width: animate ? (open ? 'auto' : 0) : 'auto',
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          transition={{ duration: 0.2 }}
          className="min-w-0 flex-1 overflow-hidden"
        >
          <p className="truncate whitespace-nowrap text-sm font-medium text-[var(--dash-text)]">
            {name}
          </p>
          <p className="truncate whitespace-nowrap text-xs text-[var(--dash-muted)]">
            {email}
          </p>
        </motion.div>
      </div>

      <div
        className={cn(
          'flex items-center gap-1',
          open ? 'justify-between px-0.5' : 'flex-col justify-center',
        )}
      >
        <a
          href="/"
          className={cn(
            'flex items-center rounded-lg px-2 py-2 text-sm text-[var(--dash-muted)] transition hover:bg-[var(--dash-surface)] hover:text-[var(--dash-text)]',
            open ? 'gap-2' : 'justify-center',
          )}
          aria-label="Log out"
        >
          <HiOutlineLogout className="h-4 w-4 shrink-0" />
          <motion.span
            animate={{
              width: animate ? (open ? 'auto' : 0) : 'auto',
              opacity: animate ? (open ? 1 : 0) : 1,
              height: animate ? (open ? 'auto' : 0) : 'auto',
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden whitespace-nowrap"
          >
            Logout
          </motion.span>
        </a>
        <ThemeToggle className="size-8 sm:size-9" />
      </div>
    </div>
  )
}

export default function DashboardSidebar() {
  const { pathname } = useLocation()

  return (
    <Sidebar animate>
      <DesktopSidebar
        className={cn(
          'sticky top-0 z-30 hidden h-dvh shrink-0 flex-col overflow-hidden',
          'border-r border-[var(--dash-border)] bg-[var(--dash-card)]',
          'px-2 py-4 sm:px-3 sm:py-5',
          'md:flex',
        )}
      >
        <Logo />
        <nav
          className="mt-4 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto sm:mt-6 sm:gap-1"
          aria-label="Dashboard"
        >
          {NAV.map((item) => {
            const Icon = item.icon
            const active = isNavActive(item.label, pathname)
            return (
              <SidebarLink
                key={item.label}
                link={{
                  href: item.href,
                  label: item.label,
                  icon: (
                    <Icon
                      className={cn(
                        'h-5 w-5 shrink-0',
                        active ? 'text-[var(--dash-text)]' : 'text-[var(--dash-muted)]',
                      )}
                    />
                  ),
                }}
                className={cn(
                  'rounded-lg px-2 py-2 transition sm:py-2.5',
                  active
                    ? 'bg-[var(--dash-surface)] text-[var(--dash-text)]'
                    : 'text-[var(--dash-muted)] hover:bg-[var(--dash-surface)]',
                )}
              />
            )
          })}
        </nav>
        <ProfileBlock />
      </DesktopSidebar>
    </Sidebar>
  )
}
