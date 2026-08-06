import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

const TripFormPrefillContext = createContext(null)

export function TripFormPrefillProvider({ children }) {
  const [prefill, setPrefill] = useState(null)
  const [prefillKey, setPrefillKey] = useState(0)
  const [pendingOpen, setPendingOpen] = useState(false)

  const openWithForm = useCallback((form) => {
    setPrefill(form)
    setPrefillKey((k) => k + 1)
    setPendingOpen(true)
  }, [])

  const clearPrefill = useCallback(() => {
    setPrefill(null)
    setPendingOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      prefill,
      prefillKey,
      pendingOpen,
      setPendingOpen,
      openWithForm,
      clearPrefill,
    }),
    [prefill, prefillKey, pendingOpen, openWithForm, clearPrefill],
  )

  return (
    <TripFormPrefillContext.Provider value={value}>
      {children}
    </TripFormPrefillContext.Provider>
  )
}

export function useTripFormPrefill() {
  const ctx = useContext(TripFormPrefillContext)
  if (!ctx) {
    throw new Error('useTripFormPrefill must be used within TripFormPrefillProvider')
  }
  return ctx
}
