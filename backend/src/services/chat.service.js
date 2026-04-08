import { prisma } from '../config/prisma.js'

const trialDurationMs = 2 * 60 * 1000

export const findDmChatBetweenUsers = async (userIdA, userIdB) => {
  return prisma.chat.findFirst({
    where: {
      type: 'DM',
      AND: [
        {
          participants: {
            some: {
              userId: userIdA,
            },
          },
        },
        {
          participants: {
            some: {
              userId: userIdB,
            },
          },
        },
      ],
    },
  })
}

export const getOrCreateDmChat = async (userIdA, userIdB) => {
  const existing = await findDmChatBetweenUsers(userIdA, userIdB)
  if (existing) {
    return existing
  }

  return prisma.chat.create({
    data: {
      type: 'DM',
      participants: {
        create: [{ userId: userIdA }, { userId: userIdB }],
      },
    },
  })
}

export const areUsersConnected = async (userIdA, userIdB) => {
  const connection = await prisma.connectionRequest.findFirst({
    where: {
      status: 'ACCEPTED',
      OR: [
        {
          requesterId: userIdA,
          receiverId: userIdB,
        },
        {
          requesterId: userIdB,
          receiverId: userIdA,
        },
      ],
    },
    select: {
      id: true,
    },
  })

  return Boolean(connection)
}

const getFirstMessage = async (chatId) => {
  return prisma.message.findFirst({
    where: {
      chatId,
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      createdAt: true,
    },
  })
}

export const getChatAccessState = async ({ chatId, isConnected }) => {
  if (isConnected) {
    return {
      canMessage: true,
      locked: false,
      trialRemainingSeconds: null,
    }
  }

  const firstMessage = await getFirstMessage(chatId)
  if (!firstMessage) {
    return {
      canMessage: true,
      locked: false,
      trialRemainingSeconds: 120,
    }
  }

  const elapsed = Date.now() - firstMessage.createdAt.getTime()
  const remainingMs = trialDurationMs - elapsed

  if (remainingMs <= 0) {
    return {
      canMessage: false,
      locked: true,
      trialRemainingSeconds: 0,
    }
  }

  return {
    canMessage: true,
    locked: false,
    trialRemainingSeconds: Math.ceil(remainingMs / 1000),
  }
}
