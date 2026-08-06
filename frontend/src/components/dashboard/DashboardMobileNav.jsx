import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/react'
import { Menu, MenuItem, HoveredLink } from '@/components/ui/navbar-menu'
import { useModal } from '@/components/ui/animated-modal'
import { AiIcon } from '@/components/icons'
import ThemeToggle from '../common/ThemeToggle'

export default function DashboardMobileNav() {
  const [active, setActive] = useState(null)
  const { setOpen } = useModal()

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--dash-border)] bg-[color-mix(in_srgb,var(--dash-bg)_90%,transparent)] backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img
            src="/logo/Miraego.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="text-sm font-semibold text-[var(--dash-text)]">Miraego</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />
        </div>
      </div>

      <div className="flex justify-center px-4 pb-4">
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Navigate">
            <div className="flex flex-col gap-2 text-sm">
              <HoveredLink href="/dashboard">Dashboard</HoveredLink>
              <HoveredLink href="/dashboard/trips">My Trips</HoveredLink>
              <HoveredLink href="/dashboard/history">History</HoveredLink>
              <HoveredLink href="/dashboard/explore">Explore</HoveredLink>
              <HoveredLink href="/dashboard/saved-plans">Saved Plans</HoveredLink>
              <HoveredLink href="/dashboard/settings">Settings</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Plan">
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--dash-text)]"
              onClick={() => {
                setActive(null)
                setOpen(true)
              }}
            >
              <AiIcon className="h-4 w-4" alt="" />
              Plan A Trip
            </button>
          </MenuItem>
        </Menu>
      </div>
    </header>
  )
}
