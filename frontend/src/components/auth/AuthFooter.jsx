function AuthFooter() {
  return (
    <footer className="flex w-full flex-col items-center justify-between gap-4 border-t border-slate-200/20 bg-slate-100 px-8 py-12 dark:border-slate-800/20 dark:bg-slate-950 md:flex-row">
      <p className="text-xs tracking-widest text-slate-400 uppercase dark:text-slate-500">
        (c) 2024 AlumniConnect. Building a Legacy.
      </p>
      <div className="flex gap-6">
        <a
          className="text-xs tracking-widest text-slate-400 uppercase transition-all hover:text-primary dark:text-slate-500 dark:hover:text-blue-300"
          href="#"
        >
          Privacy Policy
        </a>
        <a
          className="text-xs tracking-widest text-slate-400 uppercase transition-all hover:text-primary dark:text-slate-500 dark:hover:text-blue-300"
          href="#"
        >
          Terms of Service
        </a>
        <a
          className="text-xs tracking-widest text-slate-400 uppercase transition-all hover:text-primary dark:text-slate-500 dark:hover:text-blue-300"
          href="#"
        >
          Contact
        </a>
      </div>
    </footer>
  )
}

export default AuthFooter
