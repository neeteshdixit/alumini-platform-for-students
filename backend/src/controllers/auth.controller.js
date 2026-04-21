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
import { buildPublicUser } from '../services/user-presenter.service.js'
import { issueOtpForUser, verifyUserOtp } from '../services/otp.service.js'
import { ensureCollegeForSignup } from '../services/location.service.js'
import {
  consumePasswordResetToken,
  requestPasswordReset,
} from '../services/password-reset.service.js'

const normalizeEmail = (value) => value.trim().toLowerCase()

const normalizeMobileNumber = (value) => {
  const digits = String(value || '').replace(/\D/g, '')
  return digits || ''
}

const isEmailLike = (value) => {
  return String(value || '').includes('@')
}

const isMobileLike = (value) => {
  const digits = normalizeMobileNumber(value)
  return digits.length >= 7 && digits.length <= 20
}

const splitName = (name) => {
  const compact = name.trim().replace(/\s+/g, ' ')
  const [firstName, ...rest] = compact.split(' ')

  return {
    firstName,
    lastName: rest.join(' ') || '-',
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

const buildGraduationDate = ({ graduationYear, graduationMonth }) => {
  const year = Number(graduationYear)
  const month = Number(graduationMonth)

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return null
  }

  if (month < 1 || month > 12) {
    return null
  }

  return new Date(year, month, 0, 23, 59, 59, 999)
}

const ensureCollege = async ({
  collegeId,
  collegeName,
  stateId,
  districtId,
  email,
}) => {
  const emailDomain = email.includes('@') ? email.split('@')[1] : null

  return ensureCollegeForSignup({
    collegeId,
    collegeName,
    stateId,
    districtId,
    emailDomain,
  })
}

const findUserForLogin = async ({ email, enrollmentNumber, mobileNumber, identifier }) => {
  const normalizedEmail = email ? normalizeEmail(email) : null
  const enrollment = enrollmentNumber?.trim()
  const lookup = identifier?.trim()
  const normalizedMobile = normalizeMobileNumber(mobileNumber || '')

  if (normalizedEmail) {
    return prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { college: true, profile: true },
    })
  }

  if (enrollment) {
    return prisma.user.findUnique({
      where: { enrollmentNumber: enrollment },
      include: { college: true, profile: true },
    })
  }

  if (normalizedMobile) {
    return prisma.user.findFirst({
      where: {
        mobileNumber: normalizedMobile,
      },
      include: { college: true, profile: true },
    })
  }

  if (!lookup) {
    return null
  }

  if (isEmailLike(lookup)) {
    return prisma.user.findUnique({
      where: { email: normalizeEmail(lookup) },
      include: { college: true, profile: true },
    })
  }

  if (isMobileLike(lookup)) {
    const lookupMobile = normalizeMobileNumber(lookup)
    return prisma.user.findFirst({
      where: {
        mobileNumber: lookupMobile,
      },
      include: { college: true, profile: true },
    })
  }

  return prisma.user.findUnique({
    where: { enrollmentNumber: lookup },
    include: { college: true, profile: true },
  })
}

const includeUserShape = {
  college: true,
  profile: true,
}

const isAccountVerified = (user) => {
  return Boolean(user?.verified || user?.verificationStatus === 'APPROVED')
}

const normalizeVerificationStateIfNeeded = async (user) => {
  if (!user) {
    return user
  }

  const shouldNormalize =
    (user.verificationStatus === 'APPROVED' && !user.verified) ||
    (user.verified && user.verificationStatus !== 'APPROVED')

  if (!shouldNormalize) {
    return user
  }

  return prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      verified: true,
      verificationStatus: 'APPROVED',
    },
    include: includeUserShape,
  })
}

export const signup = asyncHandler(async (req, res) => {
  const {
    role,
    name,
    email,
    mobileNumber,
    password,
    collegeId,
    collegeName,
    stateId,
    districtId,
    graduationMonth,
    graduationYear,
    enrollmentNumber,
  } = req.body

  const normalizedEmail = normalizeEmail(email)
  const normalizedMobile = normalizeMobileNumber(mobileNumber)
  const existingByEmail = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  })

  if (existingByEmail) {
    throw new AppError('Email already exists.', 409)
  }

  if (normalizedMobile) {
    const existingByMobile = await prisma.user.findFirst({
      where: {
        mobileNumber: normalizedMobile,
      },
      select: {
        id: true,
      },
    })

    if (existingByMobile) {
      throw new AppError('Mobile number already exists.', 409)
    }
  }

  if (role === 'ALUMNI' && enrollmentNumber) {
    const enrollmentExists = await prisma.user.findUnique({
      where: {
        enrollmentNumber,
      },
    })

    if (enrollmentExists) {
      throw new AppError('Enrollment number already exists.', 409)
    }
  }

  const college = await ensureCollege({
    collegeId,
    collegeName,
    stateId,
    districtId,
    email: normalizedEmail,
  })

  const graduationDate = buildGraduationDate({
    graduationMonth,
    graduationYear,
  })
  const effectiveRole =
    role === 'STUDENT' && graduationDate && graduationDate <= new Date()
      ? 'ALUMNI'
      : role

  const emailDomain = normalizedEmail.includes('@')
    ? normalizedEmail.split('@')[1]
    : ''
  if (
    effectiveRole === 'STUDENT' &&
    college.emailDomain &&
    emailDomain &&
    college.emailDomain.toLowerCase() !== emailDomain.toLowerCase()
  ) {
    throw new AppError('Student email must match your college email domain.', 400)
  }

  const { firstName, lastName } = splitName(name)
  const passwordHash = await bcrypt.hash(password, 12)
  const currentYear = new Date().getFullYear()

  const createdUser = await prisma.user.create({
    data: {
      email: normalizedEmail,
      mobileNumber: normalizedMobile || null,
      enrollmentNumber: effectiveRole === 'ALUMNI' ? enrollmentNumber : null,
      passwordHash,
      collegeId: college.id,
      role: effectiveRole,
      authProvider: 'LOCAL',
      verified: false,
      verificationStatus: 'PENDING',
      isFirstLogin: true,
      lastLoginAt: null,
      graduationMailSentAt: null,
      graduationReminderSentAt: null,
      profile: {
        create: {
          firstName,
          lastName,
          batchYear: currentYear,
          graduationYear: Number(graduationYear),
          graduationMonth: Number(graduationMonth),
          department: 'General',
          skillTags: [],
          interestTags: [],
          maxMentees: 3,
        },
      },
    },
    include: includeUserShape,
  })

  const otpIssue = await issueOtpForUser({
    userId: createdUser.id,
    email: createdUser.email,
    name,
  })

  const signupResponse = {
    message: otpIssue.delivery?.delivered
      ? 'Signup successful. OTP sent to your email for verification.'
      : 'Signup successful. OTP is ready on your verification screen.',
    requiresOtp: true,
    user: buildPublicUser(createdUser),
    shouldPlayWelcome: createdUser.isFirstLogin,
    ...(env.isProduction || !otpIssue.debugOtp
      ? {}
      : {
          debugOtp: otpIssue.debugOtp,
        }),
  }

  return sendSuccess(
    res,
    signupResponse,
    201,
  )
})

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body
  const normalizedEmail = normalizeEmail(email)

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    include: includeUserShape,
  })

  if (!user) {
    throw new AppError('User not found for this email.', 404)
  }

  await verifyUserOtp({
    userId: user.id,
    otp,
  })

  const refreshedUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: includeUserShape,
  })

  return sendSuccess(res, {
    message: 'Email verified successfully. You can now login.',
    user: buildPublicUser(refreshedUser),
  })
})

export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body
  const normalizedEmail = normalizeEmail(email)

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    include: includeUserShape,
  })

  if (!user) {
    throw new AppError('User not found.', 404)
  }

  if (isAccountVerified(user)) {
    return sendSuccess(res, {
      message: 'User is already verified.',
    })
  }

  const otpIssue = await issueOtpForUser({
    userId: user.id,
    email: user.email,
    name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
  })

  return sendSuccess(res, {
    message: otpIssue.delivery?.delivered
      ? 'A fresh OTP has been sent to your email.'
      : 'A fresh OTP is ready on your verification screen.',
    ...(env.isProduction || !otpIssue.debugOtp
      ? {}
      : {
          debugOtp: otpIssue.debugOtp,
        }),
  })
})

export const googleAuth = asyncHandler(async (req, res) => {
  const {
    googleId,
    email,
    name,
    collegeId,
    collegeName,
    stateId,
    districtId,
    graduationMonth,
    graduationYear,
  } = req.body

  const normalizedEmail = normalizeEmail(email)
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ googleId }, { email: normalizedEmail }],
    },
    include: includeUserShape,
  })

  const college = await ensureCollege({
    collegeId: collegeId || existingUser?.collegeId || null,
    collegeName,
    stateId,
    districtId,
    email: normalizedEmail,
  })

  const { firstName, lastName } = splitName(name)
  const now = new Date()
  const graduationDate = buildGraduationDate({
    graduationYear,
    graduationMonth,
  })
  const effectiveRole =
    graduationDate && graduationDate <= now ? 'ALUMNI' : 'STUDENT'
  const shouldPlayWelcome = Boolean(existingUser?.isFirstLogin ?? true)

  const baseUserData = {
    email: normalizedEmail,
    googleId,
    authProvider: 'GOOGLE',
    collegeId: college.id,
    verified: true,
    verificationStatus: 'APPROVED',
    isFirstLogin: false,
    lastLoginAt: now,
  }

  const profileData = {
    firstName,
    lastName,
  }

  if (graduationYear) {
    profileData.graduationYear = Number(graduationYear)
  }

  if (graduationMonth) {
    profileData.graduationMonth = Number(graduationMonth)
  }

  const user = existingUser
    ? await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          ...baseUserData,
          profile: existingUser.profile
            ? {
                update: profileData,
              }
            : {
                create: {
                  ...profileData,
                  batchYear: now.getFullYear(),
                  graduationYear: profileData.graduationYear || now.getFullYear(),
                  graduationMonth: profileData.graduationMonth || now.getMonth() + 1,
                  department: 'General',
                  skillTags: [],
                  interestTags: [],
                  maxMentees: 3,
                },
              },
        },
        include: includeUserShape,
      })
    : await prisma.user.create({
        data: {
          ...baseUserData,
          role: effectiveRole,
          profile: {
            create: {
              ...profileData,
              batchYear: now.getFullYear(),
              graduationYear: profileData.graduationYear || now.getFullYear(),
              graduationMonth: profileData.graduationMonth || now.getMonth() + 1,
              department: 'General',
              skillTags: [],
              interestTags: [],
              maxMentees: 3,
            },
          },
        },
        include: includeUserShape,
      })

  const accessToken = await issueAuthSession({
    user,
    req,
    res,
  })

  return sendSuccess(res, {
    message: 'Google account authenticated successfully.',
    accessToken,
    user: {
      ...buildPublicUser(user),
      isFirstLogin: false,
    },
    shouldPlayWelcome,
  })
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  const response = await requestPasswordReset({ email })

  return sendSuccess(res, response)
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, email, newPassword } = req.body

  const result = await consumePasswordResetToken({
    token,
    email,
    newPassword,
  })

  return sendSuccess(res, result)
})

export const login = asyncHandler(async (req, res) => {
  const { email, enrollmentNumber, mobileNumber, identifier, password } = req.body

  const user = await findUserForLogin({
    email,
    enrollmentNumber,
    mobileNumber,
    identifier,
  })

  if (!user || !user.passwordHash) {
    throw new AppError('Invalid credentials.', 401)
  }

  const normalizedUser = await normalizeVerificationStateIfNeeded(user)

  if (!isAccountVerified(normalizedUser)) {
    const otpIssue = await issueOtpForUser({
      userId: normalizedUser.id,
      email: normalizedUser.email,
      name: `${normalizedUser.profile?.firstName || ''} ${normalizedUser.profile?.lastName || ''}`.trim(),
    })

    throw new AppError(
      otpIssue.delivery?.delivered
        ? 'Please verify OTP before login. A fresh OTP was sent to your email.'
        : 'Please verify OTP before login. Use the OTP shown on your screen.',
      403,
      {
        requiresOtp: true,
        email: normalizedUser.email,
        ...(env.isProduction || !otpIssue.debugOtp
          ? {}
          : {
              debugOtp: otpIssue.debugOtp,
            }),
      },
    )
  }

  const now = new Date()
  if (normalizedUser.lockedUntil && normalizedUser.lockedUntil > now) {
    throw new AppError('Account is temporarily locked. Please try again later.', 423)
  }

  const passwordMatches = await bcrypt.compare(password, normalizedUser.passwordHash)

  if (!passwordMatches) {
    const failedAttempts = normalizedUser.failedLoginAttempts + 1
    const lockReached = failedAttempts >= env.authLoginMaxAttempts

    await prisma.user.update({
      where: {
        id: normalizedUser.id,
      },
      data: {
        failedLoginAttempts: lockReached ? 0 : failedAttempts,
        lockedUntil: lockReached
          ? new Date(Date.now() + env.authLockMinutes * 60 * 1000)
          : null,
      },
    })

    throw new AppError('Invalid credentials.', 401)
  }

  const shouldPlayWelcome = normalizedUser.isFirstLogin

  await prisma.user.update({
    where: {
      id: normalizedUser.id,
    },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: now,
      isFirstLogin: false,
    },
  })

  const accessToken = await issueAuthSession({
    user: normalizedUser,
    req,
    res,
  })

  return sendSuccess(res, {
    message: 'Login successful.',
    accessToken,
    user: {
      ...buildPublicUser(normalizedUser),
      isFirstLogin: false,
    },
    shouldPlayWelcome,
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
        include: includeUserShape,
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
    user: buildPublicUser(storedToken.user),
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
    path: '/api',
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
    path: '/api',
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
    include: includeUserShape,
  })

  if (!user) {
    throw new AppError('User not found.', 404)
  }

  return sendSuccess(res, {
    user: buildPublicUser(user),
  })
})
