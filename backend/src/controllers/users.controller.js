import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

import { env } from '../config/env.js'
import { prisma } from '../config/prisma.js'
import { refreshCookieName } from '../utils/cookie-options.js'
import { AppError } from '../utils/app-error.js'
import { sendSuccess } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'
import { buildPublicUser } from '../services/user-presenter.service.js'

const includeUserShape = {
  college: true,
  profile: true,
}

const splitName = (name) => {
  const compact = name.trim().replace(/\s+/g, ' ')
  const [firstName, ...rest] = compact.split(' ')
  return {
    firstName,
    lastName: rest.join(' ') || '-',
  }
}

const allowedDomains = ['tech', 'non-tech', 'both']

const normalizeDomain = (domain) => {
  const normalized = String(domain || '').trim().toLowerCase()
  return allowedDomains.includes(normalized) ? normalized : 'both'
}

const getPreferredDomains = (domain) => {
  const normalized = normalizeDomain(domain)

  if (normalized === 'tech') {
    return ['tech', 'both']
  }

  if (normalized === 'non-tech') {
    return ['non-tech', 'both']
  }

  return [...allowedDomains]
}

const normalizeTagList = (items = []) => {
  const unique = new Set()
  for (const item of items) {
    const cleaned = String(item || '').trim()
    if (!cleaned) continue
    unique.add(cleaned)
  }
  return Array.from(unique)
}

const normalizeOptionalText = (value) => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed || null
}

const getDomainFilter = (domain) => {
  return {
    profile: {
      is: {
        domain: {
          in: getPreferredDomains(domain),
        },
      },
    },
  }
}

const parseImageData = (fileData) => {
  const data = String(fileData || '').trim()
  const match = data.match(
    /^data:(image\/(?:png|jpe?g|webp));base64,([a-zA-Z0-9+/=]+)$/,
  )

  if (!match) {
    throw new AppError('Invalid image payload.', 400)
  }

  const mimeType = match[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : match[1]
  const base64Data = match[2]
  const buffer = Buffer.from(base64Data, 'base64')

  if (!buffer.length) {
    throw new AppError('Image data is empty.', 400)
  }

  const maxBytes = 2 * 1024 * 1024
  if (buffer.length > maxBytes) {
    throw new AppError('Image size must be 2MB or less.', 400)
  }

  return { mimeType, buffer }
}

const getConnectionRecords = async (currentUserId, targetIds) => {
  if (!targetIds.length) return []

  return prisma.connectionRequest.findMany({
    where: {
      OR: [
        {
          requesterId: currentUserId,
          receiverId: {
            in: targetIds,
          },
        },
        {
          requesterId: {
            in: targetIds,
          },
          receiverId: currentUserId,
        },
      ],
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
}

const buildConnectionMap = ({ currentUserId, records }) => {
  const map = new Map()

  for (const record of records) {
    const targetId =
      record.requesterId === currentUserId ? record.receiverId : record.requesterId

    if (map.has(targetId)) {
      continue
    }

    const isRequester = record.requesterId === currentUserId

    let status = 'NONE'
    if (record.status === 'ACCEPTED') {
      status = 'CONNECTED'
    } else if (record.status === 'PENDING') {
      status = isRequester ? 'REQUEST_SENT' : 'REQUEST_RECEIVED'
    } else if (record.status === 'REJECTED') {
      status = 'REJECTED'
    }

    map.set(targetId, {
      status,
      requestId: record.id,
      isRequester,
    })
  }

  return map
}

const withConnectionData = ({ currentUserId, users, connectionMap }) => {
  return users.map((user) => {
    const base = buildPublicUser(user)
    const connection = connectionMap.get(user.id) || {
      status: 'NONE',
      requestId: null,
      isRequester: false,
    }

    return {
      ...base,
      connectionStatus: connection.status,
      connectionRequestId: connection.requestId,
      requestedByMe: connection.isRequester,
      isCurrentUser: user.id === currentUserId,
    }
  })
}

export const getMe = asyncHandler(async (req, res) => {
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

export const getUserById = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const { userId } = req.params
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

export const updateMe = asyncHandler(async (req, res) => {
  const userId = req.user?.userId
  if (!userId) {
    throw new AppError('Unauthorized.', 401)
  }

  const {
    name,
    skills,
    interests,
    domain,
    internships,
    projects,
    bio,
    linkedinUrl,
    githubUrl,
    profileImage,
  } = req.body

  const profileUpdate = {}

  if (name) {
    const { firstName, lastName } = splitName(name)
    profileUpdate.firstName = firstName
    profileUpdate.lastName = lastName
  }

  if (Array.isArray(skills)) {
    profileUpdate.skillTags = normalizeTagList(skills)
  }

  if (Array.isArray(interests)) {
    profileUpdate.interestTags = normalizeTagList(interests)
  }

  if ('domain' in req.body) {
    profileUpdate.domain = normalizeDomain(domain)
  }

  if ('internships' in req.body) {
    profileUpdate.internships = normalizeOptionalText(internships)
  }

  if ('projects' in req.body) {
    profileUpdate.projects = normalizeOptionalText(projects)
  }

  if ('bio' in req.body) {
    profileUpdate.bio = normalizeOptionalText(bio)
  }

  if ('linkedinUrl' in req.body) {
    profileUpdate.linkedinUrl = normalizeOptionalText(linkedinUrl)
  }

  if ('githubUrl' in req.body) {
    profileUpdate.githubUrl = normalizeOptionalText(githubUrl)
  }

  if ('profileImage' in req.body) {
    profileUpdate.avatarUrl = normalizeOptionalText(profileImage)
  }

  if (!Object.keys(profileUpdate).length) {
    throw new AppError('No profile fields were provided.', 400)
  }

  const updated = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      profile: {
        update: profileUpdate,
      },
    },
    include: includeUserShape,
  })

  return sendSuccess(res, {
    message: 'Profile updated successfully.',
    user: buildPublicUser(updated),
  })
})

export const uploadProfileImage = asyncHandler(async (req, res) => {
  const userId = req.user?.userId
  if (!userId) {
    throw new AppError('Unauthorized.', 401)
  }

  const { fileData } = req.body
  const { mimeType, buffer } = parseImageData(fileData)

  const extensionMap = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }

  const extension = extensionMap[mimeType]
  if (!extension) {
    throw new AppError('Unsupported image format.', 400)
  }

  const uploadDir = path.resolve(process.cwd(), 'uploads', 'profile-images')
  await mkdir(uploadDir, { recursive: true })

  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  const filePath = path.join(uploadDir, fileName)
  await writeFile(filePath, buffer)

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/profile-images/${fileName}`

  return sendSuccess(res, {
    message: 'Profile image uploaded successfully.',
    url: fileUrl,
  })
})

export const deleteMe = asyncHandler(async (req, res) => {
  const userId = req.user?.userId
  if (!userId) {
    throw new AppError('Unauthorized.', 401)
  }

  const { password } = req.body

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    throw new AppError('User not found.', 404)
  }

  if (user.passwordHash) {
    if (!password) {
      throw new AppError('Password is required to delete your account.', 400)
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatches) {
      throw new AppError('Incorrect password.', 401)
    }
  }

  await prisma.$transaction([
    prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    }),
    prisma.user.delete({
      where: {
        id: userId,
      },
    }),
  ])

  res.clearCookie(refreshCookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProduction,
    path: '/api',
  })

  return sendSuccess(res, {
    message: 'Account deleted successfully.',
  })
})

export const getSameCollegeUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const me = await prisma.user.findUnique({
    where: {
      id: currentUserId,
    },
    select: {
      collegeId: true,
      profile: {
        select: {
          domain: true,
        },
      },
    },
  })

  if (!me) {
    throw new AppError('User not found.', 404)
  }

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
      },
      collegeId: me.collegeId,
    },
    include: includeUserShape,
    orderBy: {
      createdAt: 'desc',
    },
  })

  const connectionRecords = await getConnectionRecords(
    currentUserId,
    users.map((user) => user.id),
  )

  const connectionMap = buildConnectionMap({
    currentUserId,
    records: connectionRecords,
  })

  return sendSuccess(res, {
    users: withConnectionData({
      currentUserId,
      users,
      connectionMap,
    }),
  })
})

export const getOtherAlumniUsers = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const me = await prisma.user.findUnique({
    where: {
      id: currentUserId,
    },
    select: {
      collegeId: true,
    },
  })

  if (!me) {
    throw new AppError('User not found.', 404)
  }

  const users = await prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
      },
      role: 'ALUMNI',
      collegeId: {
        not: me.collegeId,
      },
      ...getDomainFilter(me.profile?.domain),
    },
    include: includeUserShape,
    orderBy: {
      createdAt: 'desc',
    },
  })

  const connectionRecords = await getConnectionRecords(
    currentUserId,
    users.map((user) => user.id),
  )

  const connectionMap = buildConnectionMap({
    currentUserId,
    records: connectionRecords,
  })

  return sendSuccess(res, {
    users: withConnectionData({
      currentUserId,
      users,
      connectionMap,
    }),
  })
})

export const getUserSuggestions = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const me = await prisma.user.findUnique({
    where: {
      id: currentUserId,
    },
    select: {
      collegeId: true,
      profile: {
        select: {
          domain: true,
        },
      },
    },
  })

  if (!me) {
    throw new AppError('User not found.', 404)
  }

  const domainScopedFilter = getDomainFilter(me.profile?.domain)

  const [sameCollegeUsers, otherAlumniUsers] = await Promise.all([
    prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
        role: 'ALUMNI',
        collegeId: me.collegeId,
        ...domainScopedFilter,
      },
      include: includeUserShape,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
        role: 'ALUMNI',
        collegeId: {
          not: me.collegeId,
        },
        ...domainScopedFilter,
      },
      include: includeUserShape,
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ])

  const mergedUsers = [...sameCollegeUsers, ...otherAlumniUsers]

  const connectionRecords = await getConnectionRecords(
    currentUserId,
    mergedUsers.map((user) => user.id),
  )

  const connectionMap = buildConnectionMap({
    currentUserId,
    records: connectionRecords,
  })

  const mappedSameCollegeUsers = withConnectionData({
    currentUserId,
    users: sameCollegeUsers,
    connectionMap,
  })

  const mappedOtherAlumniUsers = withConnectionData({
    currentUserId,
    users: otherAlumniUsers,
    connectionMap,
  })

  return sendSuccess(res, {
    domain: normalizeDomain(me.profile?.domain),
    users: [...mappedSameCollegeUsers, ...mappedOtherAlumniUsers],
    sameCollegeUsers: mappedSameCollegeUsers,
    otherAlumniUsers: mappedOtherAlumniUsers,
  })
})
