import { NavLink, useNavigate } from 'react-router-dom'

import { logout } from '../../services/platformApi'
import { useAuthStore } from '../../store/authStore'
import { CallProvider } from '../calls/CallProvider'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/search', label: 'Directory' },
  { to: '/opportunities', label: 'Opportunities' },
  { to: '/messages', label: 'Messages' },
  { to: '/mentorship', label: 'Mentorship' },
  { to: '/profile', label: 'Profile' },
]

const getInitial = (name) => {
  return (name || 'U').slice(0, 1).toUpperCase()
}

function AppShell({ title, children, actions = null }) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // best-effort logout
    } finally {
      clearSession()
      navigate('/login')
    }
  }

  return (
    <CallProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="flex items-center gap-6">
              <button
                className="text-lg font-black tracking-tight text-blue-900"
                onClick={() => navigate('/dashboard')}
                type="button"
              >
                AlumniConnect
              </button>
              <nav className="hidden items-center gap-1 md:flex">
                {navItems.map((item) => (
                  <NavLink
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-blue-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`
                    }
                    key={item.to}
                    to={item.to}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-slate-800">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500">{user?.collegeName || 'College'}</p>
              </div>
              {user?.profileImage || user?.avatarUrl ? (
                <img
                  alt={user?.name || 'User'}
                  className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                  src={user.profileImage || user.avatarUrl}
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-900">
                  {getInitial(user?.name)}
                </div>
              )}
              <button
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-black tracking-tight text-blue-950">{title}</h1>
            {actions}
          </div>
          {children}
        </main>
      </div>
    </CallProvider>
  )
}

export default AppShell
