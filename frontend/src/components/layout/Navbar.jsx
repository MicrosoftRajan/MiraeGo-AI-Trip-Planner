import { useEffect, useId, useRef, useState } from 'react'
import { UserButton } from '@clerk/react'
import { NAV_LINKS } from '../../constants'
import useFocusTrap from '../../hooks/useFocusTrap'
import { cn } from '../../utils'
import Button from '../common/Button'
import ThemeToggle from '../common/ThemeToggle'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)

  useFocusTrap(menuRef, open, menuButtonRef)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled ? 'py-3' : 'py-5',
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav
          className={cn(
            'flex items-center justify-between gap-3 rounded-[1.35rem] px-3 py-3 transition-all duration-500 sm:gap-4 sm:px-5',
            scrolled || open
              ? 'glass-strong shadow-lift'
              : 'border border-transparent bg-transparent',
          )}
          aria-label="Primary"
        >
          <a
            href="#top"
            className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/40 focus-visible:ring-offset-2 focus-visible:ring-offset-foam"
            onClick={() => setOpen(false)}
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-sea text-white shadow-soft transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path
                  d="M4 16c3-1 5-4 8-4s5 3 8 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M12 5v7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="4.5" r="1.4" fill="currentColor" />
              </svg>
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-ink transition-colors group-hover:text-sea-deep">
              Gilora
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-3.5 py-2 text-sm font-medium text-ink-muted transition-all duration-300 hover:bg-nav-hover hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/30"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <div className="hidden md:block">
              <Button
                size="sm"
                onClick={() => {
                  document
                    .getElementById('planner')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Start planning
              </Button>
            </div>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'h-9 w-9',
                },
              }}
            />

            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink transition-colors duration-300 hover:bg-chip-hover md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/30"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <div className="relative h-4 w-5" aria-hidden>
                <span
                  className={cn(
                    'absolute left-0 top-0 h-0.5 w-full rounded-full bg-ink transition-all duration-300',
                    open && 'top-1.5 rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-1.5 h-0.5 w-full rounded-full bg-ink transition-all duration-300',
                    open && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-3 h-0.5 w-full rounded-full bg-ink transition-all duration-300',
                    open && 'top-1.5 -rotate-45',
                  )}
                />
              </div>
            </button>
          </div>
        </nav>

        {open ? (
          <div
            ref={menuRef}
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="mt-2 animate-slide-down rounded-[1.35rem] glass-strong p-4 shadow-lift md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-base font-medium text-ink transition-colors duration-300 hover:bg-nav-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sea/30"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button
                className="mt-2 w-full"
                onClick={() => {
                  setOpen(false)
                  document
                    .getElementById('planner')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Start planning
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
