import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { getMe } from '../services/platformApi'
import { useAuthStore } from '../store/authStore'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const accessToken = useAuthStore((state) => state.accessToken)
  const setUser = useAuthStore((state) => state.setUser)
  const clearSession = useAuthStore((state) => state.clearSession)

  const [isChecking, setIsChecking] = useState(Boolean(accessToken))

  useEffect(() => {
    if (!accessToken) {
      setIsChecking(false)
      return
    }

    let cancelled = false
    setIsChecking(true)

    getMe()
      .then((response) => {
        if (cancelled) return
        if (response?.user) {
          setUser(response.user)
        } else {
          clearSession()
        }
      })
      .catch(() => {
        if (cancelled) return
        clearSession()
      })
      .finally(() => {
        if (!cancelled) {
          setIsChecking(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [accessToken, clearSession, setUser])

  if (!accessToken) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        Loading...
      </div>
    )
  }

  const currentToken = useAuthStore.getState().accessToken
  if (!currentToken) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return children
}

export default ProtectedRoute
