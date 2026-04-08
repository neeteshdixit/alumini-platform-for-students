import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { api } from '../../services/api'
import { useAuthStore } from '../../store/authStore'

const allStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
]

const initialForm = {
  fullName: '',
  email: '',
  state: '',
  institution: '',
  password: '',
  confirmPassword: '',
}

const getReadableError = (error, fallback) => {
  if (!error?.response) {
    return 'Unable to connect to server. Ensure backend is running at http://localhost:5000.'
  }

  const fieldErrors = error.response?.data?.details?.fieldErrors
  if (fieldErrors && typeof fieldErrors === 'object') {
    const firstFieldError = Object.values(fieldErrors)
      .flat()
      .find((message) => typeof message === 'string' && message.trim().length > 0)

    if (firstFieldError) {
      return firstFieldError
    }
  }

  return error.response?.data?.message || fallback
}

function AuthCard() {
  const location = useLocation()
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)

  const [form, setForm] = useState(initialForm)
  const [institutionOptions, setInstitutionOptions] = useState([])
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const isLogin = location.pathname !== '/signup'

  const submitLabel = useMemo(() => {
    if (isSubmitting) {
      return isLogin ? 'Signing in...' : 'Creating account...'
    }

    return isLogin ? 'Login' : 'Create Account'
  }, [isSubmitting, isLogin])

  useEffect(() => {
    if (isLogin) {
      setInstitutionOptions([])
      setIsLoadingInstitutions(false)
      return
    }

    const state = form.state.trim()
    if (!state) {
      setInstitutionOptions([])
      if (form.institution) {
        setForm((current) => ({ ...current, institution: '' }))
      }
      return
    }

    let isMounted = true
    setIsLoadingInstitutions(true)

    api
      .get('/api/colleges', {
        params: { state },
      })
      .then((response) => {
        if (!isMounted) return

        const options = response.data?.colleges || []
        setInstitutionOptions(options)

        const selectedStillExists = options.some(
          (college) => college.name === form.institution,
        )

        if (!selectedStillExists) {
          setForm((current) => ({ ...current, institution: '' }))
        }
      })
      .catch((error) => {
        if (!isMounted) return

        setInstitutionOptions([])
        setFeedback({
          type: 'error',
          message: getReadableError(
            error,
            'Unable to fetch colleges. Please try again.',
          ),
        })
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingInstitutions(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [form.state, form.institution, isLogin])

  const switchMode = (nextMode) => {
    setFeedback({ type: '', message: '' })
    if (nextMode === 'signup') {
      navigate('/signup')
      return
    }

    navigate('/login')
  }

  const updateField = (field, value) => {
    setForm((current) => {
      if (field === 'state') {
        return {
          ...current,
          state: value,
          institution: '',
        }
      }

      return { ...current, [field]: value }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback({ type: '', message: '' })

    if (!isLogin && form.password !== form.confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' })
      return
    }

    setIsSubmitting(true)

    try {
      if (isLogin) {
        const response = await api.post('/api/auth/login', {
          email: form.email,
          password: form.password,
        })

        setSession({
          user: response.data.user,
          accessToken: response.data.accessToken,
        })

        navigate('/dashboard', { replace: true })
        return
      }

      await api.post('/api/auth/signup', {
        fullName: form.fullName,
        email: form.email,
        state: form.state,
        institution: form.institution,
        password: form.password,
        confirmPassword: form.confirmPassword,
      })

      setFeedback({
        type: 'success',
        message: 'Signup successful. Please login with your credentials.',
      })
      setForm(initialForm)
      window.setTimeout(() => {
        navigate('/login')
      }, 600)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getReadableError(error, 'Request failed. Please try again.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_20px_50px_rgba(23,28,31,0.06)] dark:bg-slate-900 dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      <div className="flex border-b border-outline-variant/10 dark:border-slate-800">
        <button
          className={`flex-1 border-b-2 py-4 text-sm transition-all ${
            isLogin
              ? 'border-primary font-bold text-primary dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent font-semibold text-slate-400 hover:text-primary dark:hover:text-blue-300'
          }`}
          onClick={() => switchMode('login')}
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
          onClick={() => switchMode('signup')}
          type="button"
        >
          Sign Up
        </button>
      </div>

      <div className="p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
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
                  autoComplete="name"
                  className="w-full rounded-lg border-0 bg-surface-container-low py-3 pr-4 pl-10 text-sm text-on-surface outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20"
                  id="full-name"
                  onChange={(event) => updateField('fullName', event.target.value)}
                  placeholder="Your full name"
                  type="text"
                  value={form.fullName}
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
                autoComplete="email"
                className="w-full rounded-lg border-0 bg-surface-container-low py-3 pr-4 pl-10 text-sm text-on-surface outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20"
                id="email"
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="alumni@university.edu"
                type="email"
                value={form.email}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label
                className="text-xs font-bold tracking-widest text-on-surface-variant uppercase dark:text-slate-500"
                htmlFor="state"
              >
                State
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-lg text-slate-400">
                  location_on
                </span>
                <select
                  className="w-full appearance-none rounded-lg border-0 bg-surface-container-low py-3 pr-4 pl-10 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20"
                  id="state"
                  name="state"
                  onChange={(event) => updateField('state', event.target.value)}
                  value={form.state}
                >
                  <option value="">Select State</option>
                  {allStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400">
                  expand_more
                </span>
              </div>
            </div>
          )}

          {!isLogin && (
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
                  className="w-full appearance-none rounded-lg border-0 bg-surface-container-low py-3 pr-4 pl-10 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20"
                  disabled={!form.state || isLoadingInstitutions}
                  id="institution"
                  name="institution"
                  onChange={(event) => updateField('institution', event.target.value)}
                  value={form.institution}
                >
                  <option value="">
                    {!form.state
                      ? 'Select State first'
                      : isLoadingInstitutions
                        ? 'Loading colleges...'
                        : 'Select your College'}
                  </option>
                  {institutionOptions.map((college) => (
                    <option key={college.id} value={college.name}>
                      {college.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400">
                  expand_more
                </span>
              </div>
            </div>
          )}

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
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className="w-full rounded-lg border-0 bg-surface-container-low py-3 pr-4 pl-10 text-sm text-on-surface outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20"
                id="password"
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="........"
                type="password"
                value={form.password}
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
                  autoComplete="new-password"
                  className="w-full rounded-lg border-0 bg-surface-container-low py-3 pr-4 pl-10 text-sm text-on-surface outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20"
                  id="confirm-password"
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                  placeholder="........"
                  type="password"
                  value={form.confirmPassword}
                />
              </div>
            </div>
          )}

          {feedback.message && (
            <div
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                feedback.type === 'success'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              }`}
            >
              {feedback.message}
            </div>
          )}

          <button
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-br from-primary to-primary-container py-4 text-sm font-bold tracking-wide text-on-primary shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-80"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting && (
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
            )}
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
