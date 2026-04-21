import crypto from 'crypto'
import bcrypt from 'bcryptjs'

import { env } from '../config/env.js'
import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/app-error.js'
import { sendPasswordResetEmail } from './email.service.js'

const RESET_TOKEN_TTL_MS = 1000 * 60 * 30

const hashToken = (token) => {
  return crypto.createHash('sha256').update(String(token)).digest('hex')
}

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

export const requestPasswordReset = async ({ email, name }) => {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail) {
    throw new AppError('Email is required.', 400)
  }

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  })

  if (!user) {
    return {
      message: 'If an account exists, a reset link has been sent.',
    }
  }

  const rawToken = generateToken()
  const tokenHash = hashToken(rawToken)
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS)

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
      sentVia: 'email',
    },
  })

  const resetUrl = `${env.appOrigin}/reset-password?token=${rawToken}&email=${encodeURIComponent(
    user.email,
  )}`

  await sendPasswordResetEmail({
    toEmail: user.email,
    name:
      name ||
      `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim() ||
      'there',
    resetUrl,
  })

  return {
    message: 'If an account exists, a reset link has been sent.',
  }
}

export const consumePasswordResetToken = async ({ token, email, newPassword }) => {
  const tokenHash = hashToken(token)
  const record = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  })

  if (!record) {
    throw new AppError('Invalid or expired reset token.', 400)
  }

  if (record.consumedAt || record.expiresAt < new Date()) {
    throw new AppError('Invalid or expired reset token.', 400)
  }

  if (email && record.user.email !== String(email).trim().toLowerCase()) {
    throw new AppError('Invalid or expired reset token.', 400)
  }

  const passwordHash = await bcrypt.hash(newPassword, 12)

  await prisma.$transaction([
    prisma.passwordResetToken.update({
      where: {
        id: record.id,
      },
      data: {
        consumedAt: new Date(),
      },
    }),
    prisma.user.update({
      where: {
        id: record.userId,
      },
      data: {
        passwordHash,
        tokenVersion: {
          increment: 1,
        },
        authProvider: record.user?.googleId ? 'GOOGLE' : 'LOCAL',
      },
    }),
    prisma.refreshToken.updateMany({
      where: {
        userId: record.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    }),
  ])

  return {
    message: 'Password reset successfully. Please login again.',
  }
}
