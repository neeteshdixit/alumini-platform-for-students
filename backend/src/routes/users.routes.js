import { Router } from 'express'

import {
  deleteMe,
  getMe,
  getOtherAlumniUsers,
  getSameCollegeUsers,
  getUserById,
  getUserSuggestions,
  uploadProfileImage,
  updateMe,
} from '../controllers/users.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  deleteMeSchema,
  updateMeSchema,
  uploadProfileImageSchema,
} from '../validations/user.validation.js'

const router = Router()

router.get('/me', requireAuth, getMe)
router.put('/me', requireAuth, validate(updateMeSchema), updateMe)
router.delete('/me', requireAuth, validate(deleteMeSchema), deleteMe)

router.get('/user/me', requireAuth, getMe)
router.put('/user/update', requireAuth, validate(updateMeSchema), updateMe)
router.get('/user/:userId', requireAuth, getUserById)

router.get('/users/same-college', requireAuth, getSameCollegeUsers)
router.get('/users/other', requireAuth, getOtherAlumniUsers)
router.get('/users/suggestions', requireAuth, getUserSuggestions)

router.post(
  '/upload',
  requireAuth,
  validate(uploadProfileImageSchema),
  uploadProfileImage,
)

export default router
