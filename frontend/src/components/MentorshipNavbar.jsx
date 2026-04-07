function MentorshipNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-[0_20px_50px_rgba(23,28,31,0.06)] flex items-center justify-between px-8 h-16">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tighter text-blue-900 dark:text-white">
          AlumniConnect
        </span>
        <div className="hidden md:flex gap-6 font-inter tracking-tight">
          <a
            className="text-slate-500 dark:text-slate-400 hover:text-blue-800 transition-colors"
            href="#"
          >
            Directory
          </a>
          <a
            className="text-slate-500 dark:text-slate-400 hover:text-blue-800 transition-colors"
            href="#"
          >
            Events
          </a>
          <a
            className="text-slate-500 dark:text-slate-400 hover:text-blue-800 transition-colors"
            href="#"
          >
            News
          </a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
        <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant/20">
          <img
            alt="User profile avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDglF8verscmPzC2GSeiXaw4xTug_07KSZ8k9P0TAZrAFBn9jeGkuAcch-6YzzSA1rNs86-WHfS6kvTmw_6hysZ9hdEiMui0Q5gm3ngDHfEj4B6TPI2a6geyErJMp2Ui3wpxqFWXYLWH1cnZKrK-X9nzoj1sF0ozKUlW1YKx1QciVlxlTiJEzlItQaxYxGxhfE78D0N-lEFiXw-twEHUyntL5fmpitRZzmNtxC0eKiaRThzFO6c4vo9GgNlAcceN7Y3-PVhTHWk3UQ"
          />
        </div>
        <button
          type="button"
          className="text-slate-500 dark:text-slate-400 hover:text-blue-800 font-inter text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default MentorshipNavbar
