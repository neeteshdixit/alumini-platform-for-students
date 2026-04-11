import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/app-error.js'
import { areUsersConnected, getOrCreateDmChat } from './chat.service.js'
import { buildPublicUser } from './user-presenter.service.js'

const includeUserShape = {
  college: true,
  profile: true,
}

const callInclude = {
  caller: {
    include: includeUserShape,
  },
  callee: {
    include: includeUserShape,
  },
}

const normalizeCallMode = (mode) => {
  const next = String(mode || '').trim().toUpperCase()

  if (next === 'VIDEO') {
    return 'VIDEO'
  }

  return 'VOICE'
}

const loadUser = async (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: includeUserShape,
  })
}

const loadCallSession = async (callId) => {
  return prisma.callSession.findUnique({
    where: {
      id: callId,
    },
    include: callInclude,
  })
}

const ensureParticipant = (callSession, userId) => {
  if (!callSession) {
    throw new AppError('Call session not found.', 404)
  }

  if (callSession.callerId !== userId && callSession.calleeId !== userId) {
    throw new AppError('Unauthorized call access.', 403)
  }
}

const isFinalCallStatus = (status) => {
  return ['REJECTED', 'ENDED', 'CANCELLED', 'MISSED'].includes(status)
}

const formatCallSession = (callSession, currentUserId = null) => {
  if (!callSession) {
    return null
  }

  return {
    id: callSession.id,
    chatId: callSession.chatId,
    callerId: callSession.callerId,
    calleeId: callSession.calleeId,
    caller: callSession.caller ? buildPublicUser(callSession.caller) : null,
    callee: callSession.callee ? buildPublicUser(callSession.callee) : null,
    mode: callSession.mode,
    status: callSession.status,
    acceptedAt: callSession.acceptedAt,
    endedAt: callSession.endedAt,
    durationSeconds: callSession.durationSeconds ?? null,
    createdAt: callSession.createdAt,
    updatedAt: callSession.updatedAt,
    isCaller: currentUserId ? callSession.callerId === currentUserId : false,
    isCallee: currentUserId ? callSession.calleeId === currentUserId : false,
  }
}

export const getCallSessionById = async (callId, currentUserId) => {
  const callSession = await loadCallSession(callId)
  ensureParticipant(callSession, currentUserId)

  return callSession
}

export const createCallSession = async ({ callerId, calleeId, mode }) => {
  const caller = await loadUser(callerId)
  if (!caller) {
    throw new AppError('Caller not found.', 404)
  }

  const callee = await loadUser(calleeId)
  if (!callee) {
    throw new AppError('Target user not found.', 404)
  }

  if (callerId === calleeId) {
    throw new AppError('You cannot call yourself.', 400)
  }

  const sameCollege = caller.collegeId === callee.collegeId
  const connected = sameCollege || (await areUsersConnected(callerId, calleeId))

  if (!connected) {
    throw new AppError('Connect first to start a call.', 403)
  }

  const openCall = await prisma.callSession.findFirst({
    where: {
      status: {
        in: ['RINGING', 'ACTIVE'],
      },
      OR: [
        {
          callerId,
          calleeId,
        },
        {
          callerId: calleeId,
          calleeId: callerId,
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
    },
  })

  if (openCall) {
    throw new AppError('A call is already in progress.', 409)
  }

  const chat = await getOrCreateDmChat(callerId, calleeId)

  const callSession = await prisma.callSession.create({
    data: {
      chatId: chat.id,
      callerId,
      calleeId,
      mode: normalizeCallMode(mode),
      status: 'RINGING',
    },
    include: callInclude,
  })

  return formatCallSession(callSession, callerId)
}

export const acceptCallSession = async ({ callId, currentUserId }) => {
  const callSession = await getCallSessionById(callId, currentUserId)

  if (callSession.calleeId !== currentUserId) {
    throw new AppError('Only the receiver can accept the call.', 403)
  }

  if (callSession.status === 'ACTIVE') {
    return formatCallSession(callSession, currentUserId)
  }

  if (isFinalCallStatus(callSession.status)) {
    throw new AppError('Call is no longer available.', 409)
  }

  const updated = await prisma.callSession.update({
    where: {
      id: callId,
    },
    data: {
      status: 'ACTIVE',
      acceptedAt: new Date(),
    },
    include: callInclude,
  })

  return formatCallSession(updated, currentUserId)
}

export const rejectCallSession = async ({ callId, currentUserId }) => {
  const callSession = await getCallSessionById(callId, currentUserId)

  if (callSession.calleeId !== currentUserId) {
    throw new AppError('Only the receiver can reject the call.', 403)
  }

  if (isFinalCallStatus(callSession.status)) {
    return formatCallSession(callSession, currentUserId)
  }

  const updated = await prisma.callSession.update({
    where: {
      id: callId,
    },
    data: {
      status: 'REJECTED',
      endedAt: new Date(),
    },
    include: callInclude,
  })

  return formatCallSession(updated, currentUserId)
}

export const endCallSession = async ({ callId, currentUserId }) => {
  const callSession = await getCallSessionById(callId, currentUserId)

  if (isFinalCallStatus(callSession.status)) {
    return formatCallSession(callSession, currentUserId)
  }

  let nextStatus = 'ENDED'

  if (callSession.status === 'RINGING') {
    nextStatus = callSession.callerId === currentUserId ? 'CANCELLED' : 'REJECTED'
  }

  const endedAt = new Date()
  const durationSeconds =
    callSession.acceptedAt && nextStatus === 'ENDED'
      ? Math.max(0, Math.round((endedAt.getTime() - callSession.acceptedAt.getTime()) / 1000))
      : null

  const updated = await prisma.callSession.update({
    where: {
      id: callId,
    },
    data: {
      status: nextStatus,
      endedAt,
      durationSeconds,
    },
    include: callInclude,
  })

  return formatCallSession(updated, currentUserId)
}

export const resolveCallSession = async ({ callId, currentUserId }) => {
  const callSession = await getCallSessionById(callId, currentUserId)
  return formatCallSession(callSession, currentUserId)
}

export const getCallSessionDetails = loadCallSession
export { formatCallSession }
