import { Navigate, Route, Routes } from 'react-router-dom'

import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import InfoPage from './pages/InfoPage'
import Landing from './pages/Landing'
import Mentorship from './pages/Mentorship'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Search from './pages/Search'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuthStore } from './store/authStore'

function AuthGate() {
  const accessToken = useAuthStore((state) => state.accessToken)

  if (accessToken) {
    return <Navigate replace to="/dashboard" />
  }

  return <Auth />
}

function App() {
  return (
    <Routes>
      <Route element={<Landing />} path="/" />
      <Route
        element={
          <InfoPage
            description="Events data is not available right now."
            title="Events"
          />
        }
        path="/events"
      />
      <Route
        element={
          <InfoPage
            description="News data is not available right now."
            title="News"
          />
        }
        path="/news"
      />
      <Route
        element={
          <InfoPage
            description="About information is not available right now."
            title="About Us"
          />
        }
        path="/about"
      />
      <Route
        element={
          <InfoPage
            description="Privacy policy content is not available right now."
            title="Privacy Policy"
          />
        }
        path="/privacy"
      />
      <Route
        element={
          <InfoPage
            description="Terms content is not available right now."
            title="Terms of Service"
          />
        }
        path="/terms"
      />
      <Route
        element={
          <InfoPage
            description="Contact details are not available right now."
            title="Contact"
          />
        }
        path="/contact"
      />

      <Route element={<AuthGate />} path="/auth" />
      <Route element={<AuthGate />} path="/login" />
      <Route element={<AuthGate />} path="/signin" />
      <Route element={<AuthGate />} path="/signup" />

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
  )
}

export default App
