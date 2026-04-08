import { Router } from 'express'

import {
  acceptOrRejectConnection,
  getMyConnections,
  sendConnectionRequest,
} from '../controllers/connections.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { acceptSchema, connectSchema } from '../validations/connection.validation.js'

const router = Router()

router.get('/connections', requireAuth, getMyConnections)
router.post('/connect', requireAuth, validate(connectSchema), sendConnectionRequest)
router.post('/accept', requireAuth, validate(acceptSchema), acceptOrRejectConnection)

export default router
