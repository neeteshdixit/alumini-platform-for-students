import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/app-error.js'
import { sendSuccess } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'
import { buildPublicUser } from '../services/user-presenter.service.js'

const includeUserShape = {
  college: true,
  profile: true,
}

const formatRequest = (request, currentUserId) => {
  const isRequester = request.requesterId === currentUserId
  const otherUser = isRequester ? request.receiver : request.requester

  return {
    id: request.id,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
    requestedByMe: isRequester,
    user: otherUser ? buildPublicUser(otherUser) : null,
  }
}

export const sendConnectionRequest = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { targetUserId } = req.body

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  if (currentUserId === targetUserId) {
    throw new AppError('You cannot connect with yourself.', 400)
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: targetUserId,
    },
    select: {
      id: true,
    },
  })

  if (!targetUser) {
    throw new AppError('Target user not found.', 404)
  }

  const existingRelationship = await prisma.connectionRequest.findFirst({
    where: {
      OR: [
        {
          requesterId: currentUserId,
          receiverId: targetUserId,
        },
        {
          requesterId: targetUserId,
          receiverId: currentUserId,
        },
      ],
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  if (existingRelationship?.status === 'ACCEPTED') {
    return sendSuccess(res, {
      message: 'You are already connected.',
      connection: existingRelationship,
    })
  }

  if (
    existingRelationship?.status === 'PENDING' &&
    existingRelationship.requesterId === targetUserId
  ) {
    const accepted = await prisma.connectionRequest.update({
      where: {
        id: existingRelationship.id,
      },
      data: {
        status: 'ACCEPTED',
        respondedAt: new Date(),
      },
      include: {
        requester: {
          include: includeUserShape,
        },
        receiver: {
          include: includeUserShape,
        },
      },
    })

    return sendSuccess(res, {
      message: 'Connection accepted automatically.',
      request: formatRequest(accepted, currentUserId),
    })
  }

  if (
    existingRelationship?.status === 'PENDING' &&
    existingRelationship.requesterId === currentUserId
  ) {
    throw new AppError('Connection request already sent.', 409)
  }

  let request
  if (
    existingRelationship &&
    existingRelationship.requesterId === currentUserId &&
    existingRelationship.receiverId === targetUserId
  ) {
    request = await prisma.connectionRequest.update({
      where: {
        id: existingRelationship.id,
      },
      data: {
        status: 'PENDING',
        respondedAt: null,
      },
      include: {
        requester: {
          include: includeUserShape,
        },
        receiver: {
          include: includeUserShape,
        },
      },
    })
  } else {
    request = await prisma.connectionRequest.create({
      data: {
        requesterId: currentUserId,
        receiverId: targetUserId,
        status: 'PENDING',
      },
      include: {
        requester: {
          include: includeUserShape,
        },
        receiver: {
          include: includeUserShape,
        },
      },
    })
  }

  return sendSuccess(
    res,
    {
      message: 'Connection request sent.',
      request: formatRequest(request, currentUserId),
    },
    201,
  )
})

export const acceptOrRejectConnection = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { requestId, action } = req.body

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const request = await prisma.connectionRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      requester: {
        include: includeUserShape,
      },
      receiver: {
        include: includeUserShape,
      },
    },
  })

  if (!request) {
    throw new AppError('Connection request not found.', 404)
  }

  if (request.receiverId !== currentUserId) {
    throw new AppError('Only the receiver can respond to this request.', 403)
  }

  if (request.status !== 'PENDING') {
    throw new AppError('Connection request is already resolved.', 409)
  }

  const nextStatus = action === 'REJECT' ? 'REJECTED' : 'ACCEPTED'

  const updated = await prisma.connectionRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: nextStatus,
      respondedAt: new Date(),
    },
    include: {
      requester: {
        include: includeUserShape,
      },
      receiver: {
        include: includeUserShape,
      },
    },
  })

  return sendSuccess(res, {
    message:
      nextStatus === 'ACCEPTED'
        ? 'Connection request accepted.'
        : 'Connection request rejected.',
    request: formatRequest(updated, currentUserId),
  })
})

export const getMyConnections = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const requests = await prisma.connectionRequest.findMany({
    where: {
      OR: [{ requesterId: currentUserId }, { receiverId: currentUserId }],
    },
    include: {
      requester: {
        include: includeUserShape,
      },
      receiver: {
        include: includeUserShape,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const incoming = []
  const outgoing = []
  const connected = []

  for (const request of requests) {
    const formatted = formatRequest(request, currentUserId)

    if (request.status === 'ACCEPTED') {
      connected.push(formatted)
      continue
    }

    if (request.status === 'PENDING' && !formatted.requestedByMe) {
      incoming.push(formatted)
      continue
    }

    if (request.status === 'PENDING' && formatted.requestedByMe) {
      outgoing.push(formatted)
    }
  }

  return sendSuccess(res, {
    incoming,
    outgoing,
    connected,
  })
})
