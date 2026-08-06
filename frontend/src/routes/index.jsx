import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import DashboardPage from '../pages/DashboardPage'
import MyTripsPage from '../pages/MyTripsPage'
import AIHistoryPage from '../pages/AIHistoryPage'
import ExplorePage from '../pages/ExplorePage'
import SavedPlansPage from '../pages/SavedPlansPage'
import TripPage from '../pages/TripPage'
import SettingsPage from '../pages/SettingsPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/dashboard/trips"
          element={
            <AppLayout>
              <MyTripsPage />
            </AppLayout>
          }
        />
        <Route
          path="/dashboard/history"
          element={
            <AppLayout>
              <AIHistoryPage />
            </AppLayout>
          }
        />
        <Route
          path="/dashboard/explore"
          element={
            <AppLayout>
              <ExplorePage />
            </AppLayout>
          }
        />
        <Route
          path="/dashboard/saved-plans"
          element={
            <AppLayout>
              <SavedPlansPage />
            </AppLayout>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          }
        />
        <Route
          path="/dashboard/trip/:id"
          element={
            <AppLayout>
              <TripPage />
            </AppLayout>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/planner" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
