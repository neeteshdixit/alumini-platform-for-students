import jwt from 'jsonwebtoken'
import { Server } from 'socket.io'

import { env } from '../config/env.js'
import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/app-error.js'
import {
  acceptCallSession,
  endCallSession,
  formatCallSession,
  getCallSessionById,
  rejectCallSession,
} from '../services/call.service.js'

const authenticateSocket = (socket, next) => {
  const rawToken =
    socket.handshake.auth?.token ||
    socket.handshake.headers.authorization?.replace(/^Bearer\s+/i, '')

  if (!rawToken) {
    return next(new Error('Unauthorized'))
  }

  try {
    const payload = jwt.verify(rawToken, env.jwtAccessSecret)
    socket.data.user = payload
    return next()
  } catch (_error) {
    return next(new Error('Unauthorized'))
  }
}

const emitSocketError = (socket, error) => {
  socket.emit('socket:error', {
    message: error instanceof AppError ? error.message : 'Something went wrong.',
    statusCode: error instanceof AppError ? error.statusCode : 500,
  })
}

const ensureChatParticipant = async (chatId, userId) => {
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

export const createSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin.split(',').map((origin) => origin.trim()),
      credentials: true,
    },
  })

  io.use(authenticateSocket)

  io.on('connection', (socket) => {
    const currentUserId = socket.data.user?.userId
    const currentCollegeId = socket.data.user?.collegeId

    if (currentUserId) {
      socket.join(`user:${currentUserId}`)
    }

    if (currentCollegeId) {
      socket.join(`college:${currentCollegeId}`)
    }

    socket.on('joinChat', async ({ chatId }) => {
      try {
        if (!chatId || !currentUserId) {
          return
        }

        const allowed = await ensureChatParticipant(chatId, currentUserId)
        if (!allowed) {
          return
        }

        socket.join(`chat:${chatId}`)
      } catch (error) {
        emitSocketError(socket, error)
      }
    })

    socket.on('typing', ({ chatId }) => {
      if (chatId) {
        socket.to(`chat:${chatId}`).emit('typing', { chatId, socketId: socket.id })
      }
    })

    socket.on('stopTyping', ({ chatId }) => {
      if (chatId) {
        socket.to(`chat:${chatId}`).emit('stopTyping', { chatId, socketId: socket.id })
      }
    })

    socket.on('call:join', async ({ callId }) => {
      try {
        if (!callId || !currentUserId) {
          return
        }

        const callSession = await getCallSessionById(callId, currentUserId)
        socket.join(`call:${callId}`)
        socket.emit('call:joined', {
          call: formatCallSession(callSession, currentUserId),
        })
      } catch (error) {
        emitSocketError(socket, error)
      }
    })

    socket.on('call:accept', async ({ callId }) => {
      try {
        if (!callId || !currentUserId) {
          return
        }

        const call = await acceptCallSession({
          callId,
          currentUserId,
        })

        socket.join(`call:${callId}`)
        io.to(`call:${callId}`).emit('call:accepted', {
          call,
          byUserId: currentUserId,
        })
      } catch (error) {
        emitSocketError(socket, error)
      }
    })

    socket.on('call:reject', async ({ callId, reason }) => {
      try {
        if (!callId || !currentUserId) {
          return
        }

        const call = await rejectCallSession({
          callId,
          currentUserId,
        })

        io.to(`call:${callId}`).emit('call:rejected', {
          call,
          byUserId: currentUserId,
          reason: reason || 'rejected',
        })
      } catch (error) {
        emitSocketError(socket, error)
      }
    })

    socket.on('call:end', async ({ callId }) => {
      try {
        if (!callId || !currentUserId) {
          return
        }

        const call = await endCallSession({
          callId,
          currentUserId,
        })

        io.to(`call:${callId}`).emit('call:ended', {
          call,
          byUserId: currentUserId,
        })
      } catch (error) {
        emitSocketError(socket, error)
      }
    })

    socket.on('call:signal', async ({ callId, signal }) => {
      try {
        if (!callId || !currentUserId || !signal) {
          return
        }

        const callSession = await getCallSessionById(callId, currentUserId)
        if (callSession.status !== 'ACTIVE') {
          throw new AppError('Call is not active.', 409)
        }

        socket.to(`call:${callId}`).emit('call:signal', {
          callId,
          signal,
          fromUserId: currentUserId,
          mode: callSession.mode,
        })
      } catch (error) {
        emitSocketError(socket, error)
      }
    })
  })

  return io
}
