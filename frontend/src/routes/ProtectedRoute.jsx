import { Navigate, useLocation } from 'react-router-dom'

import { useAuthStore } from '../store/authStore'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const accessToken = useAuthStore((state) => state.accessToken)

  if (!accessToken) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return children
}

export default ProtectedRoute
