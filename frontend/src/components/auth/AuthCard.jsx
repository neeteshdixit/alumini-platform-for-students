import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import {
  getMe,
  login,
  resendOtp,
  signup,
  verifyOtp,
} from '../../services/platformApi'
import { useAuthStore } from '../../store/authStore'
import { getErrorMessage } from '../../utils/error'

const signupInitial = {
  role: 'STUDENT',
  name: '',
  email: '',
  enrollmentNumber: '',
  collegeName: '',
  password: '',
  confirmPassword: '',
}

const loginInitial = {
  identifier: '',
  password: '',
}

function AuthCard() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const setSession = useAuthStore((state) => state.setSession)
  const setUser = useAuthStore((state) => state.setUser)
  const clearSession = useAuthStore((state) => state.clearSession)

  const [signupForm, setSignupForm] = useState(signupInitial)
  const [loginForm, setLoginForm] = useState(loginInitial)
  const [otpEmail, setOtpEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [debugOtp, setDebugOtp] = useState('')
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOtpStep, setShowOtpStep] = useState(false)

  const isLogin = useMemo(() => {
    return location.pathname === '/login' || location.pathname === '/signin'
  }, [location.pathname])

  useEffect(() => {
    const roleFromUrl = searchParams.get('role')
    if (roleFromUrl === 'ALUMNI' || roleFromUrl === 'STUDENT') {
      setSignupForm((current) => ({ ...current, role: roleFromUrl }))
    }
  }, [searchParams])

  useEffect(() => {
    setFeedback({ type: '', message: '' })
  }, [location.pathname])

  const updateSignupField = (field, value) => {
    setSignupForm((current) => ({ ...current, [field]: value }))
  }

  const updateLoginField = (field, value) => {
    setLoginForm((current) => ({ ...current, [field]: value }))
  }

  const switchMode = (mode) => {
    setFeedback({ type: '', message: '' })
    setShowOtpStep(false)
    setDebugOtp('')
    if (mode === 'signup') {
      navigate('/signup')
      return
    }
    navigate('/login')
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    setFeedback({ type: '', message: '' })

    setIsSubmitting(true)
    try {
      const payload = {
        role: signupForm.role,
        name: signupForm.name,
        email: signupForm.email,
        enrollmentNumber:
          signupForm.role === 'ALUMNI' ? signupForm.enrollmentNumber : undefined,
        collegeName: signupForm.collegeName,
        password: signupForm.password,
        confirmPassword: signupForm.confirmPassword,
      }

      const response = await signup(payload)

      setOtpEmail(signupForm.email)
      setOtpCode('')
      setDebugOtp(response?.debugOtp ? String(response.debugOtp) : '')
      setShowOtpStep(true)
      setFeedback({
        type: 'success',
        message:
          response?.message || 'Signup completed. Enter the OTP sent to your email.',
      })
    } catch (error) {
      setDebugOtp('')
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Signup failed.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    setFeedback({ type: '', message: '' })
    setIsSubmitting(true)

    try {
      await verifyOtp({
        email: otpEmail,
        otp: otpCode,
      })

      setFeedback({
        type: 'success',
        message: 'OTP verified. Please login.',
      })
      setDebugOtp('')
      setShowOtpStep(false)
      setSignupForm(signupInitial)
      navigate('/login')
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'OTP verification failed.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    setFeedback({ type: '', message: '' })
    setIsSubmitting(true)

    try {
      const response = await resendOtp({ email: otpEmail })
      setDebugOtp(response?.debugOtp ? String(response.debugOtp) : '')
      setFeedback({
        type: 'success',
        message: response?.message || 'A new OTP has been sent.',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Failed to resend OTP.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setFeedback({ type: '', message: '' })
    setIsSubmitting(true)

    try {
      clearSession()

      const response = await login({
        identifier: loginForm.identifier,
        password: loginForm.password,
      })

      if (!response?.accessToken) {
        throw new Error('Login response missing access token.')
      }

      setSession({
        user: null,
        accessToken: response.accessToken,
      })

      try {
        const meResponse = await getMe()
        if (meResponse?.user) {
          setUser(meResponse.user)
        } else if (response.user) {
          setUser(response.user)
        }
      } catch {
        if (response.user) {
          setUser(response.user)
        }
      }

      navigate('/dashboard', { replace: true })
    } catch (error) {
      clearSession()

      const requiresOtp =
        error?.response?.status === 403 &&
        Boolean(error?.response?.data?.details?.requiresOtp)

      if (requiresOtp) {
        const details = error.response?.data?.details || {}
        const typedIdentifier = loginForm.identifier.trim()
        const fallbackEmail = typedIdentifier.includes('@') ? typedIdentifier : ''
        const nextOtpEmail = details.email || fallbackEmail

        setOtpEmail(nextOtpEmail)
        setOtpCode('')
        setShowOtpStep(true)
        setDebugOtp(details.debugOtp ? String(details.debugOtp) : '')
        setFeedback({
          type: 'success',
          message:
            error.response?.data?.message ||
            'Please verify OTP before login. Enter the OTP to continue.',
        })
        return
      }

      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Login failed.'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="grid grid-cols-2 border-b border-slate-200">
        <button
          className={`px-4 py-3 text-sm font-bold ${
            isLogin ? 'bg-blue-900 text-white' : 'text-slate-600'
          }`}
          onClick={() => switchMode('login')}
          type="button"
        >
          Login
        </button>
        <button
          className={`px-4 py-3 text-sm font-bold ${
            !isLogin ? 'bg-blue-900 text-white' : 'text-slate-600'
          }`}
          onClick={() => switchMode('signup')}
          type="button"
        >
          Sign Up
        </button>
      </div>

      <div className="p-6 md:p-8">
        {showOtpStep ? (
          <form className="space-y-4" onSubmit={handleVerifyOtp}>
            <h2 className="text-xl font-black text-blue-950">Verify Email OTP</h2>
            <p className="text-sm text-slate-600">
              We sent a 6-digit OTP to <span className="font-bold">{otpEmail}</span>.
            </p>
            {debugOtp && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Dev OTP (temporary): <span className="font-bold">{debugOtp}</span>
              </div>
            )}
            <input
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
              maxLength={6}
              onChange={(event) => setOtpCode(event.target.value)}
              placeholder="Enter 6-digit OTP"
              value={otpCode}
            />
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-bold text-white"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                disabled={isSubmitting}
                onClick={handleResendOtp}
                type="button"
              >
                Resend OTP
              </button>
              <button
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                onClick={() => setShowOtpStep(false)}
                type="button"
              >
                Back
              </button>
            </div>
          </form>
        ) : isLogin ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <h2 className="text-xl font-black text-blue-950">Login</h2>
            <input
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) => updateLoginField('identifier', event.target.value)}
              placeholder="Email or Enrollment Number"
              value={loginForm.identifier}
            />
            <input
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) => updateLoginField('password', event.target.value)}
              placeholder="Password"
              type="password"
              value={loginForm.password}
            />
            <button
              className="w-full rounded-lg bg-blue-900 px-4 py-3 text-sm font-bold text-white"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSignup}>
            <h2 className="text-xl font-black text-blue-950">Create Account</h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`rounded-lg px-3 py-2 text-sm font-bold ${
                  signupForm.role === 'STUDENT'
                    ? 'bg-blue-900 text-white'
                    : 'border border-slate-300 text-slate-700'
                }`}
                onClick={() => updateSignupField('role', 'STUDENT')}
                type="button"
              >
                Join as Student
              </button>
              <button
                className={`rounded-lg px-3 py-2 text-sm font-bold ${
                  signupForm.role === 'ALUMNI'
                    ? 'bg-blue-900 text-white'
                    : 'border border-slate-300 text-slate-700'
                }`}
                onClick={() => updateSignupField('role', 'ALUMNI')}
                type="button"
              >
                Join as Alumni
              </button>
            </div>

            <input
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) => updateSignupField('name', event.target.value)}
              placeholder="Full Name"
              value={signupForm.name}
            />
            <input
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) => updateSignupField('email', event.target.value)}
              placeholder={
                signupForm.role === 'STUDENT'
                  ? 'College Email'
                  : 'Email for OTP verification'
              }
              type="email"
              value={signupForm.email}
            />
            {signupForm.role === 'ALUMNI' && (
              <input
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
                onChange={(event) =>
                  updateSignupField('enrollmentNumber', event.target.value)
                }
                placeholder="Enrollment Number"
                value={signupForm.enrollmentNumber}
              />
            )}
            <input
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) => updateSignupField('collegeName', event.target.value)}
              placeholder="College Name"
              value={signupForm.collegeName}
            />
            <input
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) => updateSignupField('password', event.target.value)}
              placeholder="Password"
              type="password"
              value={signupForm.password}
            />
            <input
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) =>
                updateSignupField('confirmPassword', event.target.value)
              }
              placeholder="Confirm Password"
              type="password"
              value={signupForm.confirmPassword}
            />
            <button
              className="w-full rounded-lg bg-blue-900 px-4 py-3 text-sm font-bold text-white"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up & Send OTP'}
            </button>
          </form>
        )}

        {feedback.message && (
          <div
            className={`mt-4 rounded-lg px-4 py-3 text-sm font-semibold ${
              feedback.type === 'error'
                ? 'bg-red-100 text-red-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthCard
