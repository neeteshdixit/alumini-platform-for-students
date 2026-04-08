import { Navigate, Route, Routes } from 'react-router-dom'

import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
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
        path="/dashboard/search"
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
            <Messages />
          </ProtectedRoute>
        }
        path="/dashboard/chat"
      />
      <Route
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
        path="/dashboard/chat/:chatId"
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
            <Mentorship />
          </ProtectedRoute>
        }
        path="/dashboard/mentorship"
      />
      <Route
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
        path="/profile"
      />
      <Route
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
        path="/profile/:id"
      />
      <Route
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
        path="/dashboard/profile"
      />
      <Route
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
        path="/dashboard/profile/:id"
      />

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}

export default App
