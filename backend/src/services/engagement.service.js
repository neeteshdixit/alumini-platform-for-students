import cron from 'node-cron'

import { prisma } from '../config/prisma.js'
import { sendGraduationCongratsEmail, sendGraduationReminderEmail } from './email.service.js'
import {
  createNotification,
  broadcastToAllOnlineUsers,
} from './notification.service.js'

const monthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const getGraduationDate = (profile) => {
  const year = Number(profile?.graduationYear)
  const month = Number(profile?.graduationMonth)

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return null
  }

  return new Date(year, month, 0, 23, 59, 59, 999)
}

const formatGraduationLabel = (profile) => {
  const year = Number(profile?.graduationYear)
  const month = Number(profile?.graduationMonth)

  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return 'your degree'
  }

  return `${monthLabels[month - 1]} ${year}`
}

const buildUserFullName = (user) => {
  return `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim() || 'there'
}

export const syncGraduationStatuses = async (io) => {
  const now = new Date()

  const candidates = await prisma.user.findMany({
    where: {
      role: 'STUDENT',
      profile: {
        isNot: null,
      },
    },
    include: {
      profile: true,
      college: true,
    },
  })

  for (const user of candidates) {
    const graduationDate = getGraduationDate(user.profile)
    if (!graduationDate) {
      continue
    }

    const graduationLabel = formatGraduationLabel(user.profile)
    const userFullName = buildUserFullName(user)
    const hasGraduated = graduationDate <= now

    if (hasGraduated && user.role === 'STUDENT') {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          role: 'ALUMNI',
        },
      })
    }

    if (hasGraduated && !user.graduationMailSentAt) {
      await sendGraduationCongratsEmail({
        toEmail: user.email,
        name: userFullName,
        graduationLabel,
      })

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          graduationMailSentAt: now,
          graduationReminderSentAt: now,
        },
      })

      await createNotification({
        io,
        userId: user.id,
        type: 'GRADUATION_COMPLETE',
        title: 'Degree completed',
        body: `Congrats on your ${graduationLabel}! Update your profile to keep alumni visible.`,
        meta: {
          graduationDate: graduationDate.toISOString(),
        },
      })

      broadcastToAllOnlineUsers(io, 'broadcast:achievement', {
        type: 'GRADUATION_COMPLETE',
        userId: user.id,
        name: userFullName,
        message: `${userFullName} has completed ${graduationLabel}.`,
      })
      continue
    }

    if (
      user.graduationMailSentAt &&
      (!user.lastLoginAt || user.lastLoginAt < user.graduationMailSentAt) &&
      now.getTime() - user.graduationMailSentAt.getTime() >= 24 * 60 * 60 * 1000 &&
      (!user.graduationReminderSentAt ||
        now.getTime() - user.graduationReminderSentAt.getTime() >= 24 * 60 * 60 * 1000)
    ) {
      await sendGraduationReminderEmail({
        toEmail: user.email,
        name: userFullName,
        hoursElapsed: Math.floor(
          (now.getTime() - user.graduationMailSentAt.getTime()) / (60 * 60 * 1000),
        ),
      })

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          graduationReminderSentAt: now,
        },
      })

      await createNotification({
        io,
        userId: user.id,
        type: 'REMINDER',
        title: 'We saved your alumni spotlight',
        body: 'Login to continue building your alumni profile and achievements.',
        meta: {
          graduationDate: graduationDate.toISOString(),
        },
      })
    }
  }
}

export const scheduleEngagementJobs = (io) => {
  const task = cron.schedule('0 * * * *', () => {
    syncGraduationStatuses(io).catch((error) => {
      console.error('[cron] graduation sync failed:', error)
    })
  })

  return [task]
}

export const getGraduationMetadata = (profile) => ({
  label: formatGraduationLabel(profile),
  date: getGraduationDate(profile),
})
