import { Link, useNavigate } from 'react-router-dom'

import { logout } from '../../services/platformApi'
import { useAuthStore } from '../../store/authStore'

function MentorshipNavbar() {
  const navigate = useNavigate()
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
    <nav className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-white/80 px-8 shadow-[0_20px_50px_rgba(23,28,31,0.06)] backdrop-blur-md dark:bg-slate-900/80">
      <div className="flex items-center gap-8">
        <Link className="text-xl font-bold tracking-tighter text-blue-900 dark:text-white" to="/">
          AlumniConnect
        </Link>
        <div className="hidden gap-6 tracking-tight md:flex">
          <Link
            className="text-slate-500 transition-colors hover:text-blue-800 dark:text-slate-400"
            to="/search"
          >
            Directory
          </Link>
          <Link
            className="text-slate-500 transition-colors hover:text-blue-800 dark:text-slate-400"
            to="/events"
          >
            Events
          </Link>
          <Link
            className="text-slate-500 transition-colors hover:text-blue-800 dark:text-slate-400"
            to="/news"
          >
            News
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => navigate('/search')}
          type="button"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
        <button
          className="text-sm text-slate-500 transition-colors hover:text-blue-800 dark:text-slate-400"
          onClick={handleLogout}
          type="button"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default MentorshipNavbar
