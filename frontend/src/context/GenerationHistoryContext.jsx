import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  loadGenerationHistory,
  normalizeHistoryEntry,
  persistGenerationHistory,
} from '../utils/generationHistory'

const GenerationHistoryContext = createContext(null)

export function GenerationHistoryProvider({ children }) {
  const [entries, setEntries] = useState(() => loadGenerationHistory())
  const [hydrated, setHydrated] = useState(true)

  const addEntry = useCallback((input) => {
    const entry = normalizeHistoryEntry(input)
    setEntries((prev) => {
      const next = [entry, ...prev]
      persistGenerationHistory(next)
      return next
    })
    return entry
  }, [])

  const removeEntry = useCallback((id) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id)
      persistGenerationHistory(next)
      return next
    })
  }, [])

  const clearHistory = useCallback(() => {
    setEntries([])
    persistGenerationHistory([])
  }, [])

  const getEntry = useCallback(
    (id) => entries.find((e) => e.id === id) ?? null,
    [entries],
  )

  const value = useMemo(
    () => ({
      entries,
      hydrated,
      setHydrated,
      addEntry,
      removeEntry,
      clearHistory,
      getEntry,
    }),
    [entries, hydrated, addEntry, removeEntry, clearHistory, getEntry],
  )

  return (
    <GenerationHistoryContext.Provider value={value}>
      {children}
    </GenerationHistoryContext.Provider>
  )
}

export function useGenerationHistory() {
  const ctx = useContext(GenerationHistoryContext)
  if (!ctx) {
    throw new Error('useGenerationHistory must be used within GenerationHistoryProvider')
  }
  return ctx
}
