import { prisma } from '../config/prisma.js'

const serializeNotification = (notification) => {
  return {
    id: notification.id,
    userId: notification.userId,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    read: notification.read,
    readAt: notification.readAt,
    meta: notification.meta || null,
    createdAt: notification.createdAt,
  }
}

export const emitNotification = (io, notification) => {
  if (!io || !notification?.userId) {
    return
  }

  io.to(`user:${notification.userId}`).emit('notification:new', {
    notification: serializeNotification(notification),
  })
}

export const createNotification = async ({
  io,
  userId,
  type,
  title,
  body,
  meta,
  read = false,
}) => {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      body,
      read,
      meta: meta ?? undefined,
      readAt: read ? new Date() : null,
    },
  })

  emitNotification(io, notification)
  return notification
}

export const markNotificationRead = async ({ notificationId, userId }) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  })

  if (!notification) {
    return null
  }

  if (notification.read) {
    return notification
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      read: true,
      readAt: new Date(),
    },
  })
}

export const markAllNotificationsRead = async (userId) => {
  await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
      readAt: new Date(),
    },
  })
}

export const listNotifications = async ({ userId, limit = 20 }) => {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}

export const broadcastToAllOnlineUsers = (io, eventName, payload) => {
  if (!io) return
  io.emit(eventName, payload)
}
