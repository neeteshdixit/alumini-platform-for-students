import { Router } from 'express'

import {
  getNotifications,
  readAllNotifications,
  readNotification,
} from '../controllers/notifications.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/notifications', requireAuth, getNotifications)
router.post('/notifications/read-all', requireAuth, readAllNotifications)
router.post('/notifications/:notificationId/read', requireAuth, readNotification)

export default router
