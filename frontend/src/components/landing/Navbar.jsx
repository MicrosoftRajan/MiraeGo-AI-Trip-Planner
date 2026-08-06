import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { PrimaryButton } from './shared/LandingButtons'

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: 'https://github.com', label: 'GitHub', external: true },
]

export default function Navbar({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const menuId = useId()

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
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <motion.header
      initial={reduce ? false : { y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex max-w-5xl items-center justify-between px-5 py-4 transition-all duration-500 sm:px-8 ${
          scrolled
            ? 'mt-3 rounded-xl border border-[#22262C] bg-[#0F1115]/90 backdrop-blur-xl'
            : ''
        }`}
      >
        <a href="#home" className="flex items-center gap-2.5" aria-label="Miraego home">
          <img
            src="/logo/Miraego.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-md bg-white object-contain p-0.5"
          />
          <span className="lp-display text-[15px] font-semibold tracking-tight text-white">
            Miraego
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2 text-[13px] font-medium text-[#A2AAB7] transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-2 text-[13px] font-medium text-[#A2AAB7] transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <PrimaryButton onClick={onGetStarted} ariaLabel="Get started" className="!text-[13px]">
              Get Started
            </PrimaryButton>
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#2A2E35] text-white md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <HiX size={18} /> : <HiMenuAlt3 size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-2 rounded-xl border border-[#2A2E35] bg-[#12151A]/95 p-4 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-[#A2AAB7] hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onGetStarted?.()
                }}
                className="mt-2 rounded-lg bg-[#6A52E0] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5B46C1]"
              >
                Get Started
              </button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
