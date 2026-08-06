import { useState } from 'react'

export default function useExpandedDays(dayIds = []) {
  const [expanded, setExpanded] = useState(() => new Set(dayIds.slice(0, 1)))

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return { expanded, toggle }
}
