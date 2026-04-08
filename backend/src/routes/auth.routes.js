import { Router } from 'express'

import {
  login,
  logout,
  logoutAllDevices,
  me,
  refreshToken,
  signup,
} from '../controllers/auth.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { authRateLimiter } from '../middlewares/rate-limit.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  loginSchema,
  refreshSchema,
  signupSchema,
} from '../validations/auth.validation.js'

const router = Router()

router.post('/signup', authRateLimiter, validate(signupSchema), signup)
router.post('/login', authRateLimiter, validate(loginSchema), login)
router.post('/refresh-token', authRateLimiter, validate(refreshSchema), refreshToken)
router.post('/logout', logout)
router.post('/logout-all', requireAuth, logoutAllDevices)
router.get('/me', requireAuth, me)

export default router
