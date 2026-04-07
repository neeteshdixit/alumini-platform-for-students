import { useMemo, useState } from 'react'

const institutions = [
  'Select your College',
  'Harvard University',
  'Stanford University',
  'MIT',
  'University of Oxford',
]

function getInitialMode() {
  if (typeof window === 'undefined') {
    return 'login'
  }

  const params = new URLSearchParams(window.location.search)
  const modeFromQuery = params.get('mode')
  const pathname = window.location.pathname.toLowerCase()

  if (modeFromQuery === 'signup' || pathname === '/signup') {
    return 'signup'
  }

  return 'login'
}

function AuthCard() {
  const [mode, setMode] = useState(getInitialMode)
  const isLogin = mode === 'login'

  const submitLabel = useMemo(
    () => (isLogin ? 'Signing in...' : 'Creating account...'),
    [isLogin],
  )

  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_20px_50px_rgba(23,28,31,0.06)] dark:bg-slate-900 dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      <div className="flex border-b border-outline-variant/10 dark:border-slate-800">
        <button
          className={`flex-1 border-b-2 py-4 text-sm transition-all ${
            isLogin
              ? 'border-primary font-bold text-primary dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent font-semibold text-slate-400 hover:text-primary dark:hover:text-blue-300'
          }`}
          onClick={() => setMode('login')}
          type="button"
        >
          Login
        </button>
        <button
          className={`flex-1 border-b-2 py-4 text-sm transition-all ${
            !isLogin
              ? 'border-primary font-bold text-primary dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent font-semibold text-slate-400 hover:text-primary dark:hover:text-blue-300'
          }`}
          onClick={() => setMode('signup')}
          type="button"
        >
          Sign Up
        </button>
      </div>

      <div className="p-8">
        <form className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label
                className="text-xs font-bold tracking-widest text-on-surface-variant uppercase dark:text-slate-500"
                htmlFor="full-name"
              >
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-lg text-slate-400">
                  person
                </span>
                <input
                  className="w-full rounded-lg border-0 bg-surface-container-low py-3 pr-4 pl-10 text-sm text-on-surface outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20"
                  id="full-name"
                  placeholder="Your full name"
                  type="text"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label
              className="text-xs font-bold tracking-widest text-on-surface-variant uppercase dark:text-slate-500"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-lg text-slate-400">
                mail
              </span>
              <input
                className="w-full rounded-lg border-0 bg-surface-container-low py-3 pr-4 pl-10 text-sm text-on-surface outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20"
                id="email"
                placeholder="alumni@university.edu"
                type="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-xs font-bold tracking-widest text-on-surface-variant uppercase dark:text-slate-500"
              htmlFor="institution"
            >
              Institution
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-lg text-slate-400">
                school
              </span>
              <select
                className="w-full appearance-none rounded-lg border-0 bg-surface-container-low py-3 pr-4 pl-10 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20"
                id="institution"
                name="institution"
              >
                {institutions.map((institution) => (
                  <option key={institution} value={institution}>
                    {institution}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400">
                expand_more
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                className="text-xs font-bold tracking-widest text-on-surface-variant uppercase dark:text-slate-500"
                htmlFor="password"
              >
                Password
              </label>
              {isLogin && (
                <a
                  className="text-[10px] font-bold tracking-widest text-primary uppercase hover:underline dark:text-blue-400"
                  href="#"
                >
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-lg text-slate-400">
                lock
              </span>
              <input
                className="w-full rounded-lg border-0 bg-surface-container-low py-3 pr-4 pl-10 text-sm text-on-surface outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20"
                id="password"
                placeholder="........"
                type="password"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label
                className="text-xs font-bold tracking-widest text-on-surface-variant uppercase dark:text-slate-500"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-lg text-slate-400">
                  verified_user
                </span>
                <input
                  className="w-full rounded-lg border-0 bg-surface-container-low py-3 pr-4 pl-10 text-sm text-on-surface outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20"
                  id="confirm-password"
                  placeholder="........"
                  type="password"
                />
              </div>
            </div>
          )}

          <button
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-br from-primary to-primary-container py-4 text-sm font-bold tracking-wide text-on-primary shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95"
            type="submit"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              />
            </svg>
            {submitLabel}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/20 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs tracking-widest uppercase">
              <span className="bg-surface-container-lowest px-4 font-semibold text-slate-400 dark:bg-slate-900">
                Or continue with
              </span>
            </div>
          </div>

          <button
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-outline-variant/30 bg-white py-3 text-sm font-semibold text-on-surface transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            type="button"
          >
            <img
              alt="Google logo"
              className="h-5 w-5"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqg1alVdaz-5rIIzBRnAjgS9pDCP0kZFIdsfTaXCYTlCyDU2AKgXWa4HlHnKaxCY2vXc1zJVRWf89kog6wpaTLY8bCvdVSz0RYvxdS616eqZOg11O2wvhsWaGcVqFz76EOP2EDF0Lp-0RkDWphOf4dBldjwvRimtZdNXLsP7Z70REB4HaM7XVgb2peH7ZW34Dnm70F1MjSTQGIYXYk3zdGICcW4ltzpLV4i1-XDlAyPNPJpUnmX_V2NQbjqmpucxW1CVSQFWMBG-I"
            />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthCard
