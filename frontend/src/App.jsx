import { useState } from 'react'
import { Show, useAuth } from '@clerk/react'
import ErrorBoundary from './components/common/ErrorBoundary'
import { ThemeProvider } from './context/ThemeContext'
import { TripProvider } from './context/TripContext'
import { SavedTripsProvider } from './context/SavedTripsContext'
import { CollectionsProvider } from './context/CollectionsContext'
import { GenerationHistoryProvider } from './context/GenerationHistoryContext'
import { TripFormPrefillProvider } from './context/TripFormPrefillContext'
import GenerationHistoryRecorder from './components/GenerationHistoryRecorder'
import AppRouter from './routes'
import AuthPage from './pages/AuthPage'
import LandingPage from './pages/LandingPage'

function AppContent() {
  const { isLoaded } = useAuth()
  const [view, setView] = useState('landing')

  if (!isLoaded) {
    return (
      <div
        className="flex min-h-svh items-center justify-center bg-[#050816]"
        role="status"
        aria-label="Loading"
      >
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-[#7C3AED]" />
      </div>
    )
  }

  return (
    <>
      <Show when="signed-out">
        {view === 'auth' ? (
          <AuthPage onBack={() => setView('landing')} />
        ) : (
          <LandingPage onGetStarted={() => setView('auth')} />
        )}
      </Show>
      <Show when="signed-in">
        <SavedTripsProvider>
          <CollectionsProvider>
            <GenerationHistoryProvider>
              <TripFormPrefillProvider>
                <TripProvider>
                  <GenerationHistoryRecorder />
                  <AppRouter />
                </TripProvider>
              </TripFormPrefillProvider>
            </GenerationHistoryProvider>
          </CollectionsProvider>
        </SavedTripsProvider>
      </Show>
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
