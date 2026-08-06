import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { SearchIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

/**
 * Compact search that opens a centered overlay on click/focus.
 * Uses icons8 Lottie search/cancel for the search affordance.
 */
export default function CenteredSearch({
  value = '',
  onChange,
  placeholder = 'Search…',
  shortPlaceholder,
  ariaLabel = 'Search',
  className,
}) {
  const reduce = useReducedMotion()
  const layoutId = useId().replace(/:/g, '')
  const triggerRef = useRef(null)
  const overlayInputRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)

  const mobilePlaceholder = shortPlaceholder || 'Search…'
  const hasQuery = Boolean(value?.trim())
  const spring = reduce
    ? { duration: 0 }
    : { type: 'spring', stiffness: 380, damping: 32 }

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const sync = () => setIsNarrow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!open) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }

    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const t = window.setTimeout(() => overlayInputRef.current?.focus(), 40)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      window.clearTimeout(t)
    }
  }, [open, close])

  const displayPlaceholder = isNarrow ? mobilePlaceholder : placeholder

  const clearQuery = () => {
    onChange?.('')
    overlayInputRef.current?.focus()
  }

  return (
    <>
      <div className={cn('relative w-full min-w-0 max-w-xl', className)}>
        <SearchIcon
          mode="search"
          animate={false}
          className="pointer-events-none absolute left-2.5 top-1/2 z-[1] h-5 w-5 -translate-y-1/2 sm:left-3 sm:h-4 sm:w-4"
        />
        {!open ? (
          <motion.button
            type="button"
            ref={triggerRef}
            layoutId={reduce ? undefined : `centered-search-shell-${layoutId}`}
            transition={spring}
            onClick={() => setOpen(true)}
            className={cn(
              'dash-input flex h-11 w-full min-w-0 cursor-text items-center pl-10 text-left sm:h-auto sm:pl-10',
              'text-[15px] sm:text-sm',
              value ? 'text-[var(--dash-text)]' : 'text-[var(--dash-soft)]',
            )}
            aria-label={ariaLabel}
            aria-expanded={false}
            aria-haspopup="dialog"
          >
            <motion.span
              layoutId={reduce ? undefined : `centered-search-text-${layoutId}`}
              className="min-w-0 flex-1 truncate pr-1"
              transition={spring}
            >
              {value || displayPlaceholder}
            </motion.span>
          </motion.button>
        ) : (
          <div
            className="dash-input pointer-events-none invisible flex h-11 w-full items-center pl-10 sm:h-auto"
            aria-hidden
          >
            <span className="truncate">{value || displayPlaceholder}</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {open ? (
          <div
            className="fixed inset-0 z-[80]"
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
          >
            <motion.button
              type="button"
              aria-label="Close search"
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
            />

            <div
              className={cn(
                'pointer-events-none absolute inset-x-0 top-0 flex justify-center',
                'px-3 pt-[max(0.75rem,env(safe-area-inset-top))]',
                'sm:inset-0 sm:items-start sm:px-4 sm:pt-[min(26vh,11rem)]',
              )}
            >
              <motion.div
                layoutId={reduce ? undefined : `centered-search-shell-${layoutId}`}
                transition={spring}
                className={cn(
                  'pointer-events-auto relative flex w-full max-w-xl items-center gap-2',
                  'mt-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-card)]',
                  'py-3 shadow-[0_16px_48px_rgb(0_0_0/0.22)]',
                  'pl-[max(0.75rem,env(safe-area-inset-left))]',
                  'pr-[max(0.75rem,env(safe-area-inset-right))]',
                  'sm:mt-0 sm:gap-2.5 sm:rounded-2xl sm:px-4 sm:py-3.5',
                  'sm:shadow-[0_24px_80px_rgb(0_0_0/0.28)]',
                )}
              >
                <button
                  type="button"
                  onClick={hasQuery ? clearQuery : undefined}
                  disabled={!hasQuery}
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition sm:h-8 sm:w-8',
                    hasQuery
                      ? 'hover:bg-[var(--dash-surface)]'
                      : 'pointer-events-none',
                  )}
                  aria-label={hasQuery ? 'Clear search' : undefined}
                  tabIndex={hasQuery ? 0 : -1}
                >
                  <SearchIcon
                    mode={hasQuery ? 'cancel' : 'search'}
                    animate={!reduce}
                    className="h-6 w-6 sm:h-5 sm:w-5"
                  />
                </button>
                <motion.div
                  layoutId={reduce ? undefined : `centered-search-text-${layoutId}`}
                  className="min-w-0 flex-1"
                  transition={spring}
                >
                  <input
                    ref={overlayInputRef}
                    type="search"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={displayPlaceholder}
                    className={cn(
                      'w-full min-w-0 bg-transparent outline-none',
                      'text-base leading-normal text-[var(--dash-text)]',
                      'placeholder:text-[var(--dash-soft)]',
                      'sm:text-[15px]',
                      '[&::-webkit-search-cancel-button]:hidden',
                    )}
                    aria-label={ariaLabel}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    enterKeyHint="search"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        close()
                      }
                    }}
                  />
                </motion.div>
                {!hasQuery ? (
                  <kbd className="hidden shrink-0 rounded-md border border-[var(--dash-border)] bg-[var(--dash-surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--dash-soft)] sm:inline-block">
                    esc
                  </kbd>
                ) : null}
              </motion.div>
            </div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
