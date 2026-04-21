import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import CollegeSelector from '../CollegeSelector'
import ActionButton from '../ui/ActionButton'
import ConfettiBurst from '../ui/ConfettiBurst'
import {
  forgotPassword,
  getMe,
  login,
  resendOtp,
  resetPassword,
  signup,
  verifyOtp,
} from '../../services/platformApi'
import { useAuthStore } from '../../store/authStore'
import { getErrorMessage } from '../../utils/error'
import { playPopSound, playWelcomeSound } from '../../utils/audio'

const monthOptions = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
]

const buildYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years = []

  for (let year = currentYear - 6; year <= currentYear + 8; year += 1) {
    years.push(year)
  }

  return years
}

const signupInitial = {
  role: 'STUDENT',
  name: '',
  email: '',
  mobileNumber: '',
  enrollmentNumber: '',
  password: '',
  confirmPassword: '',
  graduationMonth: new Date().getMonth() + 1,
  graduationYear: new Date().getFullYear() + 4,
}

const loginInitial = {
  identifier: '',
  password: '',
}

const resetInitial = {
  newPassword: '',
  confirmPassword: '',
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
  const [showForgotStep, setShowForgotStep] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [signupSelection, setSignupSelection] = useState(null)
  const [resetForm, setResetForm] = useState(resetInitial)

  const isLogin = useMemo(() => {
    return location.pathname === '/login' || location.pathname === '/signin'
  }, [location.pathname])

  const isResetPassword = useMemo(() => {
    return location.pathname === '/reset-password'
  }, [location.pathname])

  const resetToken = searchParams.get('token') || ''
  const resetEmail = searchParams.get('email') || ''
  const yearOptions = useMemo(() => buildYearOptions(), [])

  useEffect(() => {
    const roleFromUrl = searchParams.get('role')
    if (roleFromUrl === 'ALUMNI' || roleFromUrl === 'STUDENT') {
      setSignupForm((current) => ({ ...current, role: roleFromUrl }))
    }
  }, [searchParams])

  useEffect(() => {
    setFeedback({ type: '', message: '' })
    setShowOtpStep(false)
    setShowForgotStep(false)
    setShowConfetti(false)
  }, [location.pathname])

  useEffect(() => {
    if (resetEmail) {
      setForgotEmail(resetEmail)
    }
  }, [resetEmail])

  useEffect(() => {
    if (!showConfetti) {
      return undefined
    }

    const timeout = window.setTimeout(() => setShowConfetti(false), 3500)
    return () => window.clearTimeout(timeout)
  }, [showConfetti])

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
    setShowForgotStep(false)
    if (mode === 'signup') {
      navigate('/signup')
      return
    }
    navigate('/login')
  }

  const handleCollegeSelect = (selection) => {
    setSignupSelection(selection)
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    setFeedback({ type: '', message: '' })

    if (!signupSelection?.collegeId && !signupSelection?.collegeName) {
      setFeedback({
        type: 'error',
        message: 'Please select your state, district, and college first.',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        role: signupForm.role,
        name: signupForm.name,
        email: signupForm.email,
        mobileNumber: signupForm.mobileNumber,
        password: signupForm.password,
        confirmPassword: signupForm.confirmPassword,
        graduationMonth: Number(signupForm.graduationMonth),
        graduationYear: Number(signupForm.graduationYear),
        ...signupSelection,
      }

      if (signupForm.role === 'ALUMNI') {
        payload.enrollmentNumber = signupForm.enrollmentNumber
      }

      const response = await signup(payload)

      setOtpEmail(signupForm.email)
      setOtpCode('')
      setDebugOtp(response?.debugOtp ? String(response.debugOtp) : '')
      setShowOtpStep(true)
      setShowConfetti(true)
      playPopSound()
      toast.success(response?.message || 'Signup completed. Verify OTP to continue.')
      setFeedback({
        type: 'success',
        message:
          response?.message || 'Signup completed. Enter the OTP sent to your email.',
      })
    } catch (error) {
      setDebugOtp('')
      const message = getErrorMessage(error, 'Signup failed.')
      toast.error(message)
      setFeedback({
        type: 'error',
        message,
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

      toast.success('Email verified successfully. Please login.')
      setFeedback({
        type: 'success',
        message: 'OTP verified. Please login.',
      })
      setDebugOtp('')
      setShowOtpStep(false)
      setSignupForm(signupInitial)
      setSignupSelection(null)
      navigate('/login')
    } catch (error) {
      const message = getErrorMessage(error, 'OTP verification failed.')
      toast.error(message)
      setFeedback({
        type: 'error',
        message,
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
      toast.success(response?.message || 'A new OTP has been sent.')
      setFeedback({
        type: 'success',
        message: response?.message || 'A new OTP has been sent.',
      })
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to resend OTP.')
      toast.error(message)
      setFeedback({
        type: 'error',
        message,
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

      if (response?.shouldPlayWelcome) {
        playWelcomeSound()
      }

      toast.success(response?.message || 'Login successful.')
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
        const message =
          error.response?.data?.message ||
          'Please verify OTP before login. Enter the OTP to continue.'
        toast(message)
        setFeedback({
          type: 'success',
          message,
        })
        return
      }

      const message = getErrorMessage(error, 'Login failed.')
      toast.error(message)
      setFeedback({
        type: 'error',
        message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      const email = forgotEmail.trim() || loginForm.identifier.trim()
      if (!email) {
        throw new Error('Email is required.')
      }

      const response = await forgotPassword({ email })
      toast.success(response?.message || 'If an account exists, a reset link has been sent.')
      setFeedback({
        type: 'success',
        message: response?.message || 'Reset link sent.',
      })
      setShowForgotStep(false)
    } catch (error) {
      const message = getErrorMessage(error, 'Unable to send reset link.')
      toast.error(message)
      setFeedback({
        type: 'error',
        message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await resetPassword({
        token: resetToken,
        email: resetEmail || forgotEmail,
        newPassword: resetForm.newPassword,
        confirmPassword: resetForm.confirmPassword,
      })

      toast.success(response?.message || 'Password reset successfully.')
      setFeedback({
        type: 'success',
        message: response?.message || 'Password reset successfully.',
      })
      setResetForm(resetInitial)
      navigate('/login')
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to reset password.')
      toast.error(message)
      setFeedback({
        type: 'error',
        message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isResetPassword) {
    return (
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h2 className="text-xl font-black text-blue-950">Reset your password</h2>
          <p className="text-sm text-slate-600">
            Create a new password using the secure link from your email.
          </p>
        </div>

        <form className="space-y-4 p-6 md:p-8" onSubmit={handleResetPassword}>
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            disabled
            value={resetEmail || forgotEmail || 'Email not detected'}
          />
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            onChange={(event) =>
              setResetForm((current) => ({
                ...current,
                newPassword: event.target.value,
              }))
            }
            placeholder="New password"
            type="password"
            value={resetForm.newPassword}
          />
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            onChange={(event) =>
              setResetForm((current) => ({
                ...current,
                confirmPassword: event.target.value,
              }))
            }
            placeholder="Confirm new password"
            type="password"
            value={resetForm.confirmPassword}
          />
          <ActionButton
            className="w-full bg-blue-900 text-white"
            disabled={isSubmitting || !resetToken}
            type="submit"
          >
            {isSubmitting ? 'Updating...' : 'Reset Password'}
          </ActionButton>

          {feedback.message && (
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                feedback.type === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {feedback.message}
            </div>
          )}
        </form>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
      <ConfettiBurst active={showConfetti} />

      <div className="grid grid-cols-2 border-b border-slate-200">
        <ActionButton
          className={`rounded-none border-0 px-4 py-3 ${
            isLogin ? 'bg-blue-950 text-white' : 'bg-white text-slate-600'
          }`}
          onClick={() => switchMode('login')}
          type="button"
        >
          Login
        </ActionButton>
        <ActionButton
          className={`rounded-none border-0 px-4 py-3 ${
            !isLogin ? 'bg-blue-950 text-white' : 'bg-white text-slate-600'
          }`}
          onClick={() => switchMode('signup')}
          type="button"
        >
          Sign Up
        </ActionButton>
      </div>

      <div className="p-6 md:p-8">
        {showOtpStep ? (
          <form className="space-y-4" onSubmit={handleVerifyOtp}>
            <h2 className="text-xl font-black text-blue-950">Verify Email OTP</h2>
            <p className="text-sm text-slate-600">
              We sent a 6-digit OTP to <span className="font-bold">{otpEmail}</span>.
            </p>
            {debugOtp && (
              <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Dev OTP: <span className="font-bold">{debugOtp}</span>
              </div>
            )}
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              maxLength={6}
              onChange={(event) => setOtpCode(event.target.value)}
              placeholder="Enter 6-digit OTP"
              value={otpCode}
            />
            <div className="flex flex-wrap gap-2">
              <ActionButton className="bg-blue-900 text-white" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </ActionButton>
              <ActionButton
                className="border border-slate-300 bg-white text-slate-700"
                disabled={isSubmitting}
                onClick={handleResendOtp}
                type="button"
              >
                Resend OTP
              </ActionButton>
              <ActionButton
                className="border border-slate-300 bg-white text-slate-700"
                onClick={() => setShowOtpStep(false)}
                type="button"
              >
                Back
              </ActionButton>
            </div>
          </form>
        ) : isLogin ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-blue-950">Login</h2>
                <p className="text-sm text-slate-600">Welcome back to the alumni network.</p>
              </div>
              <ActionButton
                className="border border-slate-300 bg-white text-slate-700"
                onClick={() => setShowForgotStep((current) => !current)}
                type="button"
              >
                Forgot?
              </ActionButton>
            </div>

            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) => updateLoginField('identifier', event.target.value)}
              placeholder="Email, enrollment number, or mobile"
              value={loginForm.identifier}
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) => updateLoginField('password', event.target.value)}
              placeholder="Password"
              type="password"
              value={loginForm.password}
            />
            <ActionButton className="w-full bg-blue-900 text-white" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Logging in...' : 'Login'}
            </ActionButton>

            {showForgotStep && (
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">Send a reset link</p>
                <input
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                  onChange={(event) => setForgotEmail(event.target.value)}
                  placeholder="Email address"
                  value={forgotEmail}
                />
                <ActionButton className="bg-slate-900 text-white" disabled={isSubmitting} onClick={handleForgotPassword} type="button">
                  {isSubmitting ? 'Sending...' : 'Send reset link'}
                </ActionButton>
              </div>
            )}
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSignup}>
            <h2 className="text-xl font-black text-blue-950">Create Account</h2>
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                className={`rounded-xl px-3 py-2 ${
                  signupForm.role === 'STUDENT'
                    ? 'bg-blue-900 text-white'
                    : 'border border-slate-300 bg-white text-slate-700'
                }`}
                onClick={() => updateSignupField('role', 'STUDENT')}
                type="button"
              >
                Join as Student
              </ActionButton>
              <ActionButton
                className={`rounded-xl px-3 py-2 ${
                  signupForm.role === 'ALUMNI'
                    ? 'bg-blue-900 text-white'
                    : 'border border-slate-300 bg-white text-slate-700'
                }`}
                onClick={() => updateSignupField('role', 'ALUMNI')}
                type="button"
              >
                Join as Alumni
              </ActionButton>
            </div>

            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) => updateSignupField('name', event.target.value)}
              placeholder="Full name"
              value={signupForm.name}
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) => updateSignupField('email', event.target.value)}
              placeholder={
                signupForm.role === 'STUDENT'
                  ? 'College email'
                  : 'Email for verification'
              }
              type="email"
              value={signupForm.email}
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) => updateSignupField('mobileNumber', event.target.value)}
              placeholder="Mobile number"
              value={signupForm.mobileNumber}
            />
            {signupForm.role === 'ALUMNI' && (
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                onChange={(event) => updateSignupField('enrollmentNumber', event.target.value)}
                placeholder="Enrollment number"
                value={signupForm.enrollmentNumber}
              />
            )}

            <CollegeSelector
              allowCreateCollege
              description="Choose your location to unlock the right network, chat, and career feed."
              heading="College Selection"
              onSelectionChange={handleCollegeSelect}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">
                  Graduation month
                </span>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                  onChange={(event) => updateSignupField('graduationMonth', event.target.value)}
                  value={signupForm.graduationMonth}
                >
                  {monthOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-slate-700">
                  Graduation year
                </span>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                  onChange={(event) => updateSignupField('graduationYear', event.target.value)}
                  value={signupForm.graduationYear}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) => updateSignupField('password', event.target.value)}
              placeholder="Password"
              type="password"
              value={signupForm.password}
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              onChange={(event) => updateSignupField('confirmPassword', event.target.value)}
              placeholder="Confirm password"
              type="password"
              value={signupForm.confirmPassword}
            />
            <ActionButton className="w-full bg-blue-900 text-white" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Creating account...' : 'Sign Up & Send OTP'}
            </ActionButton>
          </form>
        )}

        {feedback.message && !showForgotStep && (
          <div
            className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
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
