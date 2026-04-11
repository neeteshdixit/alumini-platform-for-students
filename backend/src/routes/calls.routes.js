import { Router } from 'express'

import {
  acceptCall,
  endCall,
  getCall,
  rejectCall,
  startCall,
} from '../controllers/calls.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { startCallSchema } from '../validations/call.validation.js'

const router = Router()

router.get('/calls/:callId', requireAuth, getCall)
router.post('/calls', requireAuth, validate(startCallSchema), startCall)
router.post('/calls/:callId/accept', requireAuth, acceptCall)
router.post('/calls/:callId/reject', requireAuth, rejectCall)
router.post('/calls/:callId/end', requireAuth, endCall)

export default router
