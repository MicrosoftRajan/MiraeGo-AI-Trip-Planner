import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HiOutlineFolderAdd, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi'
import { cn } from '../../utils'

const COLLECTION_COLORS = ['#ef4444', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4']

export default function SavedPlansCollections({
  collections,
  activeId,
  onSelect,
  tripCounts,
  allCount,
  uncategorizedCount,
  onCreate,
  onDelete,
  dropTargetId,
}) {
  const reduce = useReducedMotion()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLLECTION_COLORS[0])

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreate?.(name.trim(), color)
    setName('')
    setColor(COLLECTION_COLORS[Math.floor(Math.random() * COLLECTION_COLORS.length)])
    setCreating(false)
  }

  const items = [
    { id: 'all', name: 'All Saved', count: allCount, color: '#111111' },
    ...collections.map((c) => ({
      id: c.id,
      name: c.name,
      count: tripCounts[c.id] ?? 0,
      color: c.color,
      deletable: true,
    })),
    {
      id: 'uncategorized',
      name: 'Uncategorized',
      count: uncategorizedCount,
      color: '#9ca3af',
    },
  ]

  return (
    <aside className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--dash-muted)]">Collections</h2>
        <button
          type="button"
          onClick={() => setCreating((v) => !v)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--dash-border)] px-2.5 text-xs font-medium text-[var(--dash-muted)] transition hover:bg-[var(--dash-surface)] hover:text-[var(--dash-text)]"
        >
          <HiOutlinePlus className="h-3.5 w-3.5" />
          New
        </button>
      </div>

      <AnimatePresence initial={false}>
        {creating ? (
          <motion.form
            key="create"
            onSubmit={submit}
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="dash-card-surface overflow-hidden p-3"
          >
            <label className="dash-label" htmlFor="collection-name">
              Collection name
            </label>
            <input
              id="collection-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer Escape"
              className="dash-input"
              autoFocus
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {COLLECTION_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-6 w-6 rounded-full transition ring-offset-2',
                    color === c ? 'ring-2 ring-[#111111]' : 'opacity-70 hover:opacity-100',
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="submit"
                className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--dash-accent)] text-xs font-medium text-[var(--dash-on-accent)]"
              >
                <HiOutlineFolderAdd className="h-4 w-4" />
                Create
              </button>
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="h-9 rounded-lg px-3 text-xs font-medium text-[var(--dash-muted)]"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        ) : null}
      </AnimatePresence>

      <ul className="space-y-1.5">
        {items.map((item, i) => {
          const active = activeId === item.id
          const isDropTarget = dropTargetId === item.id && item.id !== 'all'
          return (
            <motion.li
              key={item.id}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div
                data-collection-id={item.id === 'all' ? undefined : item.id}
                className={cn(
                  'group flex items-center gap-2 rounded-xl border px-3 py-2.5 transition',
                  active
                    ? 'border-[var(--dash-accent)] bg-[var(--dash-accent)] text-[var(--dash-on-accent)] shadow-sm'
                    : 'border-transparent bg-[var(--dash-surface)] text-[var(--dash-muted)] hover:border-[var(--dash-border)] hover:text-[var(--dash-text)]',
                  isDropTarget && !active && 'border-dashed border-[var(--dash-accent)] bg-[var(--dash-chip)] scale-[1.02]',
                  isDropTarget && active && 'ring-2 ring-white/40',
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect?.(item.id)}
                  className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: active ? 'var(--dash-on-accent)' : item.color,
                    }}
                  />
                  <span className="truncate text-sm font-medium">{item.name}</span>
                  <span
                    className={cn(
                      'ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      active ? 'bg-white/15 text-[var(--dash-on-accent)]' : 'bg-[var(--dash-card)] text-[var(--dash-soft)]',
                    )}
                  >
                    {item.count}
                  </span>
                </button>
                {item.deletable ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete “${item.name}”? Trips stay saved.`)) {
                        onDelete?.(item.id)
                      }
                    }}
                    className={cn(
                      'rounded-md p-1 opacity-0 transition group-hover:opacity-100',
                      active ? 'text-white/70 hover:bg-white/10 hover:text-[var(--dash-on-accent)]' : 'text-[var(--dash-soft)] hover:bg-[var(--dash-card)] hover:text-red-500',
                    )}
                    aria-label={`Delete ${item.name}`}
                  >
                    <HiOutlineTrash className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
            </motion.li>
          )
        })}
      </ul>

      <p className="px-1 pt-2 text-[11px] leading-relaxed text-[var(--dash-soft)]">
        Drag a trip card onto a collection to move it.
      </p>
    </aside>
  )
}
