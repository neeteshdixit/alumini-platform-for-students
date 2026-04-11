import { AppError } from '../utils/app-error.js'
import { sendSuccess } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'
import {
  acceptCallSession,
  createCallSession,
  endCallSession,
  formatCallSession,
  getCallSessionDetails,
  rejectCallSession,
  resolveCallSession,
} from '../services/call.service.js'

const emitToRoom = (io, roomName, eventName, payload) => {
  if (!io) {
    return
  }

  io.to(roomName).emit(eventName, payload)
}

export const startCall = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { toUserId, mode } = req.body

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const call = await createCallSession({
    callerId: currentUserId,
    calleeId: toUserId,
    mode,
  })

  const io = req.app.get('io')
  const callRecord = await getCallSessionDetails(call.id, currentUserId)

  emitToRoom(io, `user:${call.calleeId}`, 'call:incoming', {
    call: formatCallSession(callRecord, call.calleeId),
    byUserId: currentUserId,
  })

  return sendSuccess(
    res,
    {
      message: 'Call started.',
      call,
    },
    201,
  )
})

export const getCall = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { callId } = req.params

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const call = await resolveCallSession({
    callId,
    currentUserId,
  })

  return sendSuccess(res, {
    call,
  })
})

export const acceptCall = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { callId } = req.params

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const call = await acceptCallSession({
    callId,
    currentUserId,
  })

  const io = req.app.get('io')
  emitToRoom(io, `call:${callId}`, 'call:accepted', {
    call,
    byUserId: currentUserId,
  })

  return sendSuccess(res, {
    message: 'Call accepted.',
    call,
  })
})

export const rejectCall = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { callId } = req.params

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const call = await rejectCallSession({
    callId,
    currentUserId,
  })

  const io = req.app.get('io')
  emitToRoom(io, `call:${callId}`, 'call:rejected', {
    call,
    byUserId: currentUserId,
    reason: 'rejected',
  })

  return sendSuccess(res, {
    message: 'Call rejected.',
    call,
  })
})

export const endCall = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { callId } = req.params

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const call = await endCallSession({
    callId,
    currentUserId,
  })

  const io = req.app.get('io')
  emitToRoom(io, `call:${callId}`, 'call:ended', {
    call,
    byUserId: currentUserId,
  })

  return sendSuccess(res, {
    message: 'Call ended.',
    call,
  })
})
