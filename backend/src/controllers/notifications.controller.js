import { AppError } from '../utils/app-error.js'
import { sendSuccess } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notification.service.js'

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user?.userId

  if (!userId) {
    throw new AppError('Unauthorized.', 401)
  }

  const limitRaw = Number(req.query.limit || 20)
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 20
  const notifications = await listNotifications({ userId, limit })

  return sendSuccess(res, {
    notifications,
  })
})

export const readNotification = asyncHandler(async (req, res) => {
  const userId = req.user?.userId
  const { notificationId } = req.params

  if (!userId) {
    throw new AppError('Unauthorized.', 401)
  }

  const notification = await markNotificationRead({
    notificationId,
    userId,
  })

  if (!notification) {
    throw new AppError('Notification not found.', 404)
  }

  return sendSuccess(res, {
    notification,
  })
})

export const readAllNotifications = asyncHandler(async (req, res) => {
  const userId = req.user?.userId

  if (!userId) {
    throw new AppError('Unauthorized.', 401)
  }

  await markAllNotificationsRead(userId)

  return sendSuccess(res, {
    message: 'Notifications marked as read.',
  })
})
