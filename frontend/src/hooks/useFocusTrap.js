import { useEffect } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Traps Tab focus inside `ref` while `active` is true.
 * Restores focus to `returnFocusRef` (or the previously focused element) on deactivate.
 */
export default function useFocusTrap(ref, active, returnFocusRef) {
  useEffect(() => {
    if (!active || !ref.current) return undefined

    const container = ref.current
    const previouslyFocused =
      returnFocusRef?.current ??
      /** @type {HTMLElement | null} */ (document.activeElement)

    const focusables = () =>
      [...container.querySelectorAll(FOCUSABLE)].filter(
        (el) =>
          el instanceof HTMLElement &&
          !el.hasAttribute('disabled') &&
          el.offsetParent !== null,
      )

    const first = focusables()[0]
    first?.focus()

    function onKeyDown(event) {
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        return
      }

      const firstEl = items[0]
      const lastEl = items[items.length - 1]

      if (event.shiftKey && document.activeElement === firstEl) {
        event.preventDefault()
        lastEl.focus()
      } else if (!event.shiftKey && document.activeElement === lastEl) {
        event.preventDefault()
        firstEl.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)
    return () => {
      container.removeEventListener('keydown', onKeyDown)
      if (
        previouslyFocused instanceof HTMLElement &&
        document.contains(previouslyFocused)
      ) {
        previouslyFocused.focus()
      }
    }
  }, [active, ref, returnFocusRef])
}
