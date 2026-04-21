import { Navigate, Route, Routes } from 'react-router-dom'

import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import InfoPage from './pages/InfoPage'
import Landing from './pages/Landing'
import Mentorship from './pages/Mentorship'
import Messages from './pages/Messages'
import Opportunities from './pages/Opportunities'
import Profile from './pages/Profile'
import Search from './pages/Search'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuthStore } from './store/authStore'
import AppErrorBoundary from './components/ui/AppErrorBoundary'

function AuthGate() {
  const accessToken = useAuthStore((state) => state.accessToken)

  if (accessToken) {
    return <Navigate replace to="/dashboard" />
  }

  return <Auth />
}

function App() {
  return (
    <AppErrorBoundary>
      <Routes>
        <Route element={<Landing />} path="/" />
        <Route
          element={<Navigate replace to="/opportunities?type=EVENT" />}
          path="/events"
        />
        <Route
          element={
            <ProtectedRoute>
              <Opportunities />
            </ProtectedRoute>
          }
          path="/opportunities"
        />
        <Route
          element={
            <InfoPage
              description="Live college announcements and platform news will appear here as the timeline expands. For now, use Dashboard and Opportunities for active content."
              title="News"
            />
          }
          path="/news"
        />
        <Route
          element={
            <InfoPage
              description="AlumniConnect is a college-first mentorship and networking ecosystem built for verified students and alumni."
              title="About Us"
            />
          }
          path="/about"
        />
        <Route
          element={
            <InfoPage
              description="Your profile, network, and messages are protected with JWT authentication, role checks, and encrypted chat storage."
              title="Privacy Policy"
            />
          }
          path="/privacy"
        />
        <Route
          element={
            <InfoPage
              description="Use the platform respectfully, keep your profile accurate, and only access information you are authorized to view."
              title="Terms of Service"
            />
          }
          path="/terms"
        />
        <Route
          element={
            <InfoPage
              description="Support is handled through your college admin channel and the platform admin workflow."
              title="Contact"
            />
          }
          path="/contact"
        />

        <Route element={<AuthGate />} path="/auth" />
        <Route element={<AuthGate />} path="/login" />
        <Route element={<AuthGate />} path="/signin" />
        <Route element={<AuthGate />} path="/signup" />
        <Route element={<Auth />} path="/reset-password" />
        <Route element={<Auth />} path="/auth/reset-password" />

        <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          path="/dashboard"
        />
        <Route
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
          path="/search"
        />
        <Route
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
          path="/directory"
        />
        <Route
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
          path="/messages"
        />
        <Route
          element={
            <ProtectedRoute>
              <Mentorship />
            </ProtectedRoute>
          }
          path="/mentorship"
        />
        <Route
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
          path="/profile"
        />

        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </AppErrorBoundary>
  )
}

export default App
