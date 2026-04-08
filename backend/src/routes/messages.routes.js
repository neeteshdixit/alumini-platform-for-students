import { Router } from 'express'

import { getMessages, sendMessage } from '../controllers/messages.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { sendMessageSchema } from '../validations/message.validation.js'

const router = Router()

router.get('/messages', requireAuth, getMessages)
router.post('/message', requireAuth, validate(sendMessageSchema), sendMessage)

export default router
