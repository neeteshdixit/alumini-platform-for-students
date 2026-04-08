import bcrypt from 'bcryptjs'

import { prisma } from '../config/prisma.js'
import { env } from '../config/env.js'
import { AppError } from '../utils/app-error.js'
import { sendSuccess } from '../utils/api-response.js'
import {
  getRefreshCookieOptions,
  refreshCookieName,
} from '../utils/cookie-options.js'
import { asyncHandler } from '../utils/async-handler.js'
import {
  createAccessToken,
  createRefreshToken,
  getRefreshTokenExpiryDate,
  hashToken,
  verifyRefreshToken,
} from '../services/token.service.js'

const normalizeEmail = (email) => email.trim().toLowerCase()

const splitFullName = (fullName) => {
  const compact = fullName.trim().replace(/\s+/g, ' ')
  const [firstName, ...rest] = compact.split(' ')

  return {
    firstName,
    lastName: rest.join(' ') || '-',
  }
}

const institutionIsPlaceholder = (institution = '') => {
  return institution.trim().toLowerCase() === 'select your college'
}

const ensureCollege = async ({ email, institution }) => {
  const emailDomain = email.split('@')[1]

  let college = await prisma.college.findFirst({
    where: {
      emailDomain,
    },
  })

  if (!college && institution && !institutionIsPlaceholder(institution)) {
    college = await prisma.college.findFirst({
      where: {
        name: {
          equals: institution.trim(),
          mode: 'insensitive',
        },
      },
    })

    if (!college) {
      college = await prisma.college.create({
        data: {
          name: institution.trim(),
          emailDomain,
        },
      })
    }
  }

  if (!college) {
    college = await prisma.college.create({
      data: {
        name: emailDomain.toUpperCase(),
        emailDomain,
      },
    })
  }

  return college
}

const buildUserResponse = (user) => {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    verified: user.verified,
    collegeId: user.collegeId,
    collegeName: user.college?.name || null,
    fullName: user.profile
      ? `${user.profile.firstName} ${user.profile.lastName}`.trim()
      : user.email,
    firstName: user.profile?.firstName || '',
    lastName: user.profile?.lastName || '',
    avatarUrl: user.profile?.avatarUrl || null,
    openToMentorship: user.profile?.openToMentorship || false,
  }
}

const buildTokenPayload = (user) => {
  return {
    userId: user.id,
    role: user.role,
    collegeId: user.collegeId,
    tokenVersion: user.tokenVersion,
  }
}

const issueAuthSession = async ({ user, req, res }) => {
  const tokenPayload = buildTokenPayload(user)
  const accessToken = createAccessToken(tokenPayload)
  const refreshToken = createRefreshToken(tokenPayload)
  const refreshTokenHash = hashToken(refreshToken)
  const refreshTokenExpiresAt = getRefreshTokenExpiryDate()

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: refreshTokenExpiresAt,
      userAgent: req.get('user-agent') || null,
      ipAddress: req.ip || null,
    },
  })

  res.cookie(
    refreshCookieName,
    refreshToken,
    getRefreshCookieOptions(refreshTokenExpiresAt),
  )

  return accessToken
}

export const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password, institution } = req.body
  const normalizedEmail = normalizeEmail(email)

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  })

  if (existingUser) {
    throw new AppError('Email already exists.', 409)
  }

  const college = await ensureCollege({
    email: normalizedEmail,
    institution,
  })

  const { firstName, lastName } = splitFullName(fullName)
  const passwordHash = await bcrypt.hash(password, 12)
  const now = new Date()

  const createdUser = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      collegeId: college.id,
      role: 'STUDENT',
      profile: {
        create: {
          firstName,
          lastName,
          batchYear: now.getFullYear(),
          graduationYear: now.getFullYear() + 4,
          department: 'Not specified',
          maxMentees: 3,
        },
      },
    },
    include: {
      college: true,
      profile: true,
    },
  })

  return sendSuccess(
    res,
    {
      message: 'Signup successful. Please login with your credentials.',
      user: buildUserResponse(createdUser),
    },
    201,
  )
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const normalizedEmail = normalizeEmail(email)

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    include: {
      college: true,
      profile: true,
    },
  })

  if (!user || !user.passwordHash) {
    throw new AppError('Invalid email or password.', 401)
  }

  const now = new Date()
  if (user.lockedUntil && user.lockedUntil > now) {
    throw new AppError('Account is temporarily locked. Please try again later.', 423)
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash)

  if (!passwordMatches) {
    const failedAttempts = user.failedLoginAttempts + 1
    const lockReached = failedAttempts >= env.authLoginMaxAttempts

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        failedLoginAttempts: lockReached ? 0 : failedAttempts,
        lockedUntil: lockReached
          ? new Date(Date.now() + env.authLockMinutes * 60 * 1000)
          : null,
      },
    })

    throw new AppError('Invalid email or password.', 401)
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  })

  const accessToken = await issueAuthSession({
    user,
    req,
    res,
  })

  return sendSuccess(res, {
    message: 'Login successful.',
    accessToken,
    user: buildUserResponse(user),
  })
})

export const refreshToken = asyncHandler(async (req, res) => {
  const cookieToken = req.cookies?.[refreshCookieName]
  const bodyToken = req.body?.refreshToken
  const incomingToken = cookieToken || bodyToken

  if (!incomingToken) {
    throw new AppError('Refresh token is required.', 401)
  }

  let payload
  try {
    payload = verifyRefreshToken(incomingToken)
  } catch (_error) {
    throw new AppError('Invalid refresh token.', 401)
  }

  const incomingTokenHash = hashToken(incomingToken)

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      tokenHash: incomingTokenHash,
    },
    include: {
      user: {
        include: {
          college: true,
          profile: true,
        },
      },
    },
  })

  if (!storedToken) {
    throw new AppError('Refresh token not recognized.', 401)
  }

  if (storedToken.revokedAt || storedToken.expiresAt < new Date()) {
    throw new AppError('Refresh token expired. Please login again.', 401)
  }

  if (!storedToken.user || storedToken.user.tokenVersion !== payload.tokenVersion) {
    throw new AppError('Session is no longer valid. Please login again.', 401)
  }

  await prisma.refreshToken.update({
    where: {
      id: storedToken.id,
    },
    data: {
      revokedAt: new Date(),
    },
  })

  const accessToken = await issueAuthSession({
    user: storedToken.user,
    req,
    res,
  })

  return sendSuccess(res, {
    message: 'Token refreshed successfully.',
    accessToken,
    user: buildUserResponse(storedToken.user),
  })
})

export const logout = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.[refreshCookieName] || req.body?.refreshToken

  if (incomingToken) {
    const incomingTokenHash = hashToken(incomingToken)

    await prisma.refreshToken.updateMany({
      where: {
        tokenHash: incomingTokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    })
  }

  res.clearCookie(refreshCookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProduction,
    path: '/api/v1/auth',
  })

  return sendSuccess(res, {
    message: 'Logged out successfully.',
  })
})

export const logoutAllDevices = asyncHandler(async (req, res) => {
  const userId = req.user?.userId

  if (!userId) {
    throw new AppError('Unauthorized.', 401)
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      tokenVersion: {
        increment: 1,
      },
    },
  })

  await prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  })

  res.clearCookie(refreshCookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProduction,
    path: '/api/v1/auth',
  })

  return sendSuccess(res, {
    message: 'Logged out from all devices.',
  })
})

export const me = asyncHandler(async (req, res) => {
  const userId = req.user?.userId

  if (!userId) {
    throw new AppError('Unauthorized.', 401)
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      college: true,
      profile: true,
    },
  })

  if (!user) {
    throw new AppError('User not found.', 404)
  }

  return sendSuccess(res, {
    user: buildUserResponse(user),
  })
})
