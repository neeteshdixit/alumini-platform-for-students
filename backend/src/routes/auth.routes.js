import { Router } from 'express'

import {
  forgotPassword,
  googleAuth,
  login,
  logout,
  logoutAllDevices,
  me,
  refreshToken,
  resendOtp,
  signup,
  resetPassword,
  verifyOtp,
} from '../controllers/auth.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { authRateLimiter } from '../middlewares/rate-limit.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  forgotPasswordSchema,
  googleAuthSchema,
  loginSchema,
  refreshSchema,
  resendOtpSchema,
  signupSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from '../validations/auth.validation.js'

const router = Router()

const signupStack = [authRateLimiter, validate(signupSchema), signup]
const loginStack = [authRateLimiter, validate(loginSchema), login]
const verifyOtpStack = [authRateLimiter, validate(verifyOtpSchema), verifyOtp]
const resendOtpStack = [authRateLimiter, validate(resendOtpSchema), resendOtp]
const refreshStack = [authRateLimiter, validate(refreshSchema), refreshToken]

router.post('/signup', ...signupStack)
router.post('/auth/signup', ...signupStack)

router.post('/verify-otp', ...verifyOtpStack)
router.post('/auth/verify-otp', ...verifyOtpStack)

router.post('/resend-otp', ...resendOtpStack)
router.post('/auth/resend-otp', ...resendOtpStack)

router.post('/login', ...loginStack)
router.post('/auth/login', ...loginStack)

router.post('/google', authRateLimiter, validate(googleAuthSchema), googleAuth)
router.post('/auth/google', authRateLimiter, validate(googleAuthSchema), googleAuth)

router.post('/refresh-token', ...refreshStack)
router.post('/auth/refresh-token', ...refreshStack)

router.post('/forgot-password', authRateLimiter, validate(forgotPasswordSchema), forgotPassword)
router.post('/auth/forgot-password', authRateLimiter, validate(forgotPasswordSchema), forgotPassword)

router.post('/reset-password', authRateLimiter, validate(resetPasswordSchema), resetPassword)
router.post('/auth/reset-password', authRateLimiter, validate(resetPasswordSchema), resetPassword)

router.post('/logout', logout)
router.post('/auth/logout', logout)

router.post('/logout-all', requireAuth, logoutAllDevices)
router.post('/auth/logout-all', requireAuth, logoutAllDevices)

router.get('/auth/me', requireAuth, me)

export default router
