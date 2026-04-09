import { Link, useNavigate } from 'react-router-dom'

function MentorshipSidebar() {
  const navigate = useNavigate()

  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-64 flex-col bg-slate-50 p-6 text-sm font-medium lg:flex dark:bg-slate-950">
      <div className="mb-8">
        <h2 className="text-lg font-black text-blue-900 dark:text-white">Mentorship</h2>
        <p className="text-xs tracking-widest text-on-surface-variant/70 uppercase">
          The Digital Curator
        </p>
      </div>

      <div className="flex flex-grow flex-col gap-2">
        <Link
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:translate-x-1 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
          to="/dashboard"
        >
          <span className="material-symbols-outlined">dashboard</span>
          Dashboard
        </Link>
        <Link
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:translate-x-1 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
          to="/search"
        >
          <span className="material-symbols-outlined">search</span>
          Search
        </Link>
        <Link
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:translate-x-1 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
          to="/messages"
        >
          <span className="material-symbols-outlined">chat</span>
          Messages
        </Link>
        <Link
          className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 font-semibold text-blue-900 shadow-sm dark:bg-slate-800 dark:text-white"
          to="/mentorship"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            school
          </span>
          Mentorship
        </Link>
        <Link
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:translate-x-1 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
          to="/profile"
        >
          <span className="material-symbols-outlined">person</span>
          My Profile
        </Link>
      </div>

      <button
        className="mt-auto w-full rounded-xl bg-gradient-to-br from-primary to-primary-container py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all active:scale-95"
        onClick={() => navigate('/dashboard')}
        type="button"
      >
        New Post
      </button>
    </aside>
  )
}

export default MentorshipSidebar
