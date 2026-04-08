import { Router } from 'express'

import {
  getMe,
  getOtherAlumniUsers,
  getSameCollegeUsers,
  updateMe,
} from '../controllers/users.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { updateMeSchema } from '../validations/user.validation.js'

const router = Router()

router.get('/me', requireAuth, getMe)
router.put('/me', requireAuth, validate(updateMeSchema), updateMe)
router.get('/users/same-college', requireAuth, getSameCollegeUsers)
router.get('/users/other', requireAuth, getOtherAlumniUsers)

export default router
