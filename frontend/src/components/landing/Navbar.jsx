import { Link, useNavigate } from 'react-router-dom'

import { api } from '../../services/api'
import { useAuthStore } from '../../store/authStore'

function Navbar() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout', {})
    } catch {
      // Ignore API failure and still clear local auth state
    } finally {
      clearSession()
      navigate('/login')
    }
  }

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 shadow-[0_20px_50px_rgba(23,28,31,0.06)] backdrop-blur-md dark:bg-slate-900/80">
      <div className="flex h-16 w-full max-w-full items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6 md:gap-8">
          <Link
            className="text-xl font-bold tracking-tighter text-blue-900 dark:text-white"
            to="/"
          >
            AlumniConnect
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <a
              className="border-b-2 border-blue-900 pb-1 font-bold tracking-tight text-blue-900 dark:border-blue-400 dark:text-blue-400"
              href="#"
            >
              Directory
            </a>
            <a
              className="tracking-tight text-slate-500 transition-colors hover:text-blue-800 dark:text-slate-400"
              href="#"
            >
              Events
            </a>
            <a
              className="tracking-tight text-slate-500 transition-colors hover:text-blue-800 dark:text-slate-400"
              href="#"
            >
              News
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {user ? (
            <>
              <Link className="btn btn-sm btn-ghost" to="/dashboard">
                Dashboard
              </Link>
              <button
                className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
              <div className="h-8 w-8 overflow-hidden rounded-full bg-surface-container ring-1 ring-outline-variant/30">
                {user.avatarUrl ? (
                  <img
                    alt={`${user.fullName || 'User'} avatar`}
                    className="h-full w-full object-cover"
                    src={user.avatarUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-primary">
                    {(user.firstName || user.fullName || 'U').slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link className="btn btn-sm btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn btn-sm btn-primary" to="/signup">
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
