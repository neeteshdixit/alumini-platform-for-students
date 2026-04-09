import { Link } from 'react-router-dom'

function MentorshipFooter() {
  return (
    <footer className="w-full border-t border-slate-200/20 bg-slate-100 px-8 py-12 dark:border-slate-800/20 dark:bg-slate-950">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <span className="font-bold text-blue-900 dark:text-white">AlumniConnect</span>
          <p className="mt-2 text-xs tracking-widest text-slate-400 uppercase dark:text-slate-500">
            (c) 2024 AlumniConnect. Building a Legacy.
          </p>
        </div>

        <div className="flex gap-8 text-xs tracking-widest uppercase">
          <Link
            className="text-slate-400 opacity-80 transition-all hover:text-blue-600 hover:opacity-100 dark:text-slate-500 dark:hover:text-blue-300"
            to="/about"
          >
            About Us
          </Link>
          <Link
            className="text-slate-400 opacity-80 transition-all hover:text-blue-600 hover:opacity-100 dark:text-slate-500 dark:hover:text-blue-300"
            to="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-slate-400 opacity-80 transition-all hover:text-blue-600 hover:opacity-100 dark:text-slate-500 dark:hover:text-blue-300"
            to="/terms"
          >
            Terms of Service
          </Link>
          <Link
            className="text-slate-400 opacity-80 transition-all hover:text-blue-600 hover:opacity-100 dark:text-slate-500 dark:hover:text-blue-300"
            to="/contact"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default MentorshipFooter
