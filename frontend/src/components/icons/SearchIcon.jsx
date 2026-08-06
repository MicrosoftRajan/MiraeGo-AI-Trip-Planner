import { useEffect, useRef, useState } from 'react'
import LottieReact from 'lottie-react'
import { cn } from '@/lib/utils'

// Vite/CJS interop: default export is sometimes the module namespace
const Lottie = LottieReact?.default ?? LottieReact

const SEARCH_ANIM_URL = '/icons/icons8-search.json'

/** Frames for icons8 "Search Cancel" — search ↔ X morph. */
const SEARCH_FRAME = 0
const CANCEL_FRAME = 14
const END_FRAME = 28

let animationPromise

function loadSearchAnimation() {
  if (!animationPromise) {
    animationPromise = fetch(SEARCH_ANIM_URL).then((r) => {
      if (!r.ok) throw new Error('Failed to load search icon')
      return r.json()
    })
  }
  return animationPromise
}

/**
 * Icons8 Lottie search/cancel icon.
 * `mode="search"` | `mode="cancel"` — morphs between magnifier and X.
 */
export function SearchIcon({
  mode = 'search',
  className,
  animate = true,
  ...props
}) {
  const lottieRef = useRef(null)
  const prevMode = useRef(mode)
  const [data, setData] = useState(null)

  useEffect(() => {
    let alive = true
    loadSearchAnimation()
      .then((json) => {
        if (alive) setData(json)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const anim = lottieRef.current
    if (!anim || !data) return

    const toCancel = mode === 'cancel'
    const fromCancel = prevMode.current === 'cancel'

    if (!animate) {
      anim.goToAndStop(toCancel ? CANCEL_FRAME : SEARCH_FRAME, true)
      prevMode.current = mode
      return
    }

    if (prevMode.current === mode) {
      anim.goToAndStop(toCancel ? CANCEL_FRAME : SEARCH_FRAME, true)
      return
    }

    if (toCancel && !fromCancel) {
      anim.playSegments([SEARCH_FRAME, CANCEL_FRAME], true)
    } else if (!toCancel && fromCancel) {
      anim.playSegments([CANCEL_FRAME, END_FRAME], true)
    } else {
      anim.goToAndStop(toCancel ? CANCEL_FRAME : SEARCH_FRAME, true)
    }

    prevMode.current = mode
  }, [mode, data, animate])

  if (!data || typeof Lottie !== 'function') {
    return (
      <span
        className={cn('inline-block shrink-0', className)}
        aria-hidden
        {...props}
      />
    )
  }

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={data}
      loop={false}
      autoplay={false}
      className={cn(
        'inline-block shrink-0 opacity-70 dark:invert',
        className,
      )}
      aria-hidden
      {...props}
    />
  )
}
