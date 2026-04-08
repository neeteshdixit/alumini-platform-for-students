import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/app-error.js'
import { sendSuccess } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'
import { buildPublicUser } from '../services/user-presenter.service.js'
import {
  areUsersConnected,
  findDmChatBetweenUsers,
  getChatAccessState,
  getOrCreateDmChat,
} from '../services/chat.service.js'
import {
  decryptMessageContent,
  encryptMessageContent,
} from '../services/message-crypto.service.js'

const includeUserShape = {
  college: true,
  profile: true,
}

const formatMessage = (message) => {
  return {
    id: message.id,
    chatId: message.chatId,
    fromId: message.fromId,
    content: decryptMessageContent(message.content || ''),
    createdAt: message.createdAt,
  }
}

const ensureParticipant = async (chatId, userId) => {
  const participant = await prisma.chatParticipant.findFirst({
    where: {
      chatId,
      userId,
    },
    select: {
      chatId: true,
    },
  })

  return Boolean(participant)
}

export const sendMessage = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { toUserId, content } = req.body

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  if (currentUserId === toUserId) {
    throw new AppError('Cannot send message to yourself.', 400)
  }

  const target = await prisma.user.findUnique({
    where: {
      id: toUserId,
    },
    select: {
      id: true,
    },
  })

  if (!target) {
    throw new AppError('Target user not found.', 404)
  }

  const chat = await getOrCreateDmChat(currentUserId, toUserId)
  const connected = await areUsersConnected(currentUserId, toUserId)
  const access = await getChatAccessState({
    chatId: chat.id,
    isConnected: connected,
  })

  if (!access.canMessage) {
    throw new AppError(
      'Free chat window ended. Send a connection request to continue chatting.',
      403,
      { locked: true, trialRemainingSeconds: 0 },
    )
  }

  const encryptedContent = encryptMessageContent(content.trim())

  const message = await prisma.message.create({
    data: {
      chatId: chat.id,
      fromId: currentUserId,
      content: encryptedContent,
      type: 'TEXT',
    },
  })

  await prisma.chat.update({
    where: {
      id: chat.id,
    },
    data: {
      lastMessageAt: message.createdAt,
    },
  })

  const refreshedAccess = await getChatAccessState({
    chatId: chat.id,
    isConnected: connected,
  })

  return sendSuccess(
    res,
    {
      message: formatMessage(message),
      access: {
        ...refreshedAccess,
        isConnected: connected,
      },
    },
    201,
  )
})

export const getMessages = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const withUserId = String(req.query.withUserId || '').trim()

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  if (!withUserId) {
    const chats = await prisma.chat.findMany({
      where: {
        type: 'DM',
        participants: {
          some: {
            userId: currentUserId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              include: includeUserShape,
            },
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: [{ lastMessageAt: 'desc' }, { createdAt: 'desc' }],
    })

    const conversations = []
    for (const chat of chats) {
      const participant = chat.participants.find(
        (item) => item.userId !== currentUserId,
      )
      if (!participant) continue

      const connected = await areUsersConnected(currentUserId, participant.userId)
      const access = await getChatAccessState({
        chatId: chat.id,
        isConnected: connected,
      })

      conversations.push({
        chatId: chat.id,
        user: buildPublicUser(participant.user),
        lastMessage: chat.messages[0] ? formatMessage(chat.messages[0]) : null,
        access: {
          ...access,
          isConnected: connected,
        },
        updatedAt: chat.lastMessageAt || chat.createdAt,
      })
    }

    return sendSuccess(res, {
      conversations,
    })
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: withUserId,
    },
    include: includeUserShape,
  })

  if (!targetUser) {
    throw new AppError('Conversation user not found.', 404)
  }

  const chat = await findDmChatBetweenUsers(currentUserId, withUserId)
  if (!chat) {
    const connected = await areUsersConnected(currentUserId, withUserId)

    return sendSuccess(res, {
      chatId: null,
      user: buildPublicUser(targetUser),
      messages: [],
      access: {
        canMessage: true,
        locked: false,
        trialRemainingSeconds: connected ? null : 120,
        isConnected: connected,
      },
    })
  }

  const isParticipant = await ensureParticipant(chat.id, currentUserId)
  if (!isParticipant) {
    throw new AppError('Unauthorized chat access.', 403)
  }

  const connected = await areUsersConnected(currentUserId, withUserId)
  const access = await getChatAccessState({
    chatId: chat.id,
    isConnected: connected,
  })

  const messages = await prisma.message.findMany({
    where: {
      chatId: chat.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return sendSuccess(res, {
    chatId: chat.id,
    user: buildPublicUser(targetUser),
    messages: messages.map(formatMessage),
    access: {
      ...access,
      isConnected: connected,
    },
  })
})
