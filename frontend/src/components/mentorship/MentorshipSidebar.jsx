function MentorshipSidebar() {
  return (
    <aside className="hidden lg:flex flex-col p-6 fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-slate-50 dark:bg-slate-950 font-inter text-sm font-medium">
      <div className="mb-8">
        <h2 className="text-lg font-black text-blue-900 dark:text-white">Mentorship</h2>
        <p className="text-xs text-on-surface-variant/70 uppercase tracking-widest">
          The Digital Curator
        </p>
      </div>

      <div className="flex flex-col gap-2 flex-grow">
        <a
          className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all rounded-lg"
          href="/dashboard"
        >
          <span className="material-symbols-outlined">dashboard</span>
          Dashboard
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all rounded-lg"
          href="/search"
        >
          <span className="material-symbols-outlined">search</span>
          Search
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all rounded-lg"
          href="/messages"
        >
          <span className="material-symbols-outlined">chat</span>
          Messages
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 text-blue-900 dark:text-white rounded-lg shadow-sm font-semibold"
          href="/mentorship"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            school
          </span>
          Mentorship
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:translate-x-1 transition-all rounded-lg"
          href="/profile"
        >
          <span className="material-symbols-outlined">person</span>
          My Profile
        </a>
      </div>

      <button
        type="button"
        className="mt-auto w-full py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold active:scale-95 transition-all shadow-lg shadow-primary/20"
      >
        New Post
      </button>
    </aside>
  )
}

export default MentorshipSidebar
