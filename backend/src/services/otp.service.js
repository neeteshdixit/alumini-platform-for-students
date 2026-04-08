import crypto from 'crypto'

import { prisma } from '../config/prisma.js'
import { env } from '../config/env.js'
import { AppError } from '../utils/app-error.js'
import { sendOtpEmail } from './email.service.js'

const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(String(otp)).digest('hex')
}

const generateOtpCode = () => {
  return String(Math.floor(100000 + Math.random() * 900000))
}

const getExpiryDate = () => {
  return new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000)
}

export const issueOtpForUser = async ({ userId, email, name }) => {
  const otp = generateOtpCode()
  const otpHash = hashOtp(otp)
  const expiresAt = getExpiryDate()

  await prisma.emailOtp.create({
    data: {
      userId,
      otpHash,
      expiresAt,
    },
  })

  await sendOtpEmail({
    toEmail: email,
    name,
    otp,
  })
}

export const verifyUserOtp = async ({ userId, otp }) => {
  const now = new Date()

  const latestOtp = await prisma.emailOtp.findFirst({
    where: {
      userId,
      consumedAt: null,
      expiresAt: {
        gt: now,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (!latestOtp) {
    throw new AppError('OTP expired. Please request a new code.', 400)
  }

  if (latestOtp.attempts >= env.otpMaxAttempts) {
    throw new AppError('Too many failed OTP attempts. Request a new code.', 429)
  }

  const incomingHash = hashOtp(otp)
  if (incomingHash !== latestOtp.otpHash) {
    await prisma.emailOtp.update({
      where: {
        id: latestOtp.id,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    })

    throw new AppError('Invalid OTP code.', 400)
  }

  await prisma.$transaction([
    prisma.emailOtp.update({
      where: {
        id: latestOtp.id,
      },
      data: {
        consumedAt: now,
      },
    }),
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        verified: true,
        verificationStatus: 'APPROVED',
      },
    }),
  ])
}
