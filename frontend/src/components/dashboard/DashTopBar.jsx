import { Link, NavLink } from 'react-router-dom'
import { UserButton } from '@clerk/react'
import { AiIcon } from '@/components/icons'
import { cn } from '../../utils'

const LINKS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/planner', label: 'AI Planner' },
]

export default function DashTopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#05060a]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#7c6cff] via-[#5b8cff] to-[#3dd6c6] shadow-[0_8px_24px_rgb(124_108_255/0.35)]">
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-white" fill="none" aria-hidden>
              <path
                d="M4 16c3-1 5-4 8-4s5 3 8 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path d="M12 5v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="12" cy="4.5" r="1.4" fill="currentColor" />
            </svg>
          </span>
          <span className="dash-display text-lg font-bold tracking-tight text-white">
            Gilora
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'rounded-xl px-3.5 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[var(--dash-muted)] hover:bg-white/[0.04] hover:text-white',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/planner"
            className="dash-generate inline-flex !w-auto items-center gap-2 !rounded-xl !px-3.5 !py-2 !text-sm"
          >
            <AiIcon className="h-4 w-4" alt="" />
            Plan trip
          </Link>
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: 'h-9 w-9' } }}
          />
        </div>
      </div>
    </header>
  )
}
