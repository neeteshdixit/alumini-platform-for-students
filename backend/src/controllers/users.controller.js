import { prisma } from '../config/prisma.js'
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

export const updateMe = asyncHandler(async (req, res) => {
  const userId = req.user?.userId
  if (!userId) {
    throw new AppError('Unauthorized.', 401)
  }

  const { name, skills, interests } = req.body
  const profileUpdate = {}

  if (name) {
    const { firstName, lastName } = splitName(name)
    profileUpdate.firstName = firstName
    profileUpdate.lastName = lastName
  }

  if (skills) {
    profileUpdate.skillTags = skills.map((item) => item.trim())
  }

  if (interests) {
    profileUpdate.interestTags = interests.map((item) => item.trim())
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
