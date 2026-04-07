function MentorshipFooter() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 w-full py-12 px-8 border-t border-slate-200/20 dark:border-slate-800/20 flex flex-col md:flex-row justify-between items-center gap-4">
      <div>
        <span className="font-bold text-blue-900 dark:text-white">AlumniConnect</span>
        <p className="font-inter text-xs tracking-widest uppercase text-slate-400 dark:text-slate-500 mt-2">
          © 2024 AlumniConnect. Building a Legacy.
        </p>
      </div>

      <div className="flex gap-8 font-inter text-xs tracking-widest uppercase">
        <a
          href="#"
          className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-300 transition-all opacity-80 hover:opacity-100"
        >
          About Us
        </a>
        <a
          href="#"
          className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-300 transition-all opacity-80 hover:opacity-100"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-300 transition-all opacity-80 hover:opacity-100"
        >
          Terms of Service
        </a>
        <a
          href="#"
          className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-300 transition-all opacity-80 hover:opacity-100"
        >
          Contact
        </a>
      </div>
    </footer>
  )
}

export default MentorshipFooter
