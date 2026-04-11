import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { startCall as startCallApi } from '../../services/platformApi'
import { useAuthStore } from '../../store/authStore'
import { useSocket } from '../../contexts/SocketContext'
import CallWindow from './CallWindow'

const CallContext = createContext(null)

const getInitial = (name) => String(name || 'U').slice(0, 1).toUpperCase()

const getRemoteUser = (call) => {
  if (!call) {
    return null
  }

  return call.isCaller ? call.callee : call.caller
}

function IncomingCallDialog({ call, onAccept, onReject }) {
  const remoteUser = getRemoteUser(call)
  const isVideo = call?.mode === 'VIDEO'

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-black text-blue-900">
            {getInitial(remoteUser?.name)}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-700">
              Incoming {isVideo ? 'Video' : 'Voice'} Call
            </p>
            <h3 className="mt-1 text-2xl font-black text-slate-950">
              {remoteUser?.name || 'Someone'}
            </h3>
            <p className="text-sm text-slate-600">
              {remoteUser?.collegeName || 'Your network'}
            </p>
          </div>
        </div>

        <p className="mb-6 text-sm leading-6 text-slate-600">
          {isVideo
            ? 'The caller wants to start a live video conversation.'
            : 'The caller wants to start a voice conversation.'}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            onClick={onReject}
            type="button"
          >
            Reject
          </button>
          <button
            className="rounded-2xl bg-blue-900 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800"
            onClick={onAccept}
            type="button"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

export function CallProvider({ children }) {
  const socket = useSocket()
  const currentUser = useAuthStore((state) => state.user)
  const [incomingCall, setIncomingCall] = useState(null)
  const [activeCall, setActiveCall] = useState(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!notice) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setNotice('')
    }, 3500)

    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (!socket) {
      return undefined
    }

    const handleIncomingCall = ({ call }) => {
      if (!call || call.calleeId !== currentUser?.id) {
        return
      }

      if (incomingCall || activeCall) {
        socket.emit('call:reject', {
          callId: call.id,
          reason: 'busy',
        })
        setNotice('You are already on a call.')
        return
      }

      setIncomingCall(call)
    }

    const handleCallRejected = ({ call, reason }) => {
      if (!call) {
        return
      }

      if (activeCall?.id === call.id || incomingCall?.id === call.id) {
        setIncomingCall(null)
        setActiveCall(null)
        setNotice(reason === 'busy' ? 'The other user is busy.' : 'Call rejected.')
      }
    }

    const handleCallEnded = ({ call }) => {
      if (!call) {
        return
      }

      if (activeCall?.id === call.id || incomingCall?.id === call.id) {
        setIncomingCall(null)
        setActiveCall(null)
        setNotice('Call ended.')
      }
    }

    socket.on('call:incoming', handleIncomingCall)
    socket.on('call:rejected', handleCallRejected)
    socket.on('call:ended', handleCallEnded)

    return () => {
      socket.off('call:incoming', handleIncomingCall)
      socket.off('call:rejected', handleCallRejected)
      socket.off('call:ended', handleCallEnded)
    }
  }, [activeCall?.id, currentUser?.id, incomingCall?.id, socket])

  const startCall = async ({ toUserId, mode }) => {
    if (!socket) {
      throw new Error('Realtime connection is not available right now.')
    }

    if (activeCall || incomingCall) {
      throw new Error('You are already in a call.')
    }

    const response = await startCallApi({ toUserId, mode })
    const call = response?.call

    if (!call) {
      throw new Error('Call could not be started.')
    }

    setActiveCall(call)
    socket.emit('call:join', { callId: call.id })
    setNotice(`Calling ${getRemoteUser(call)?.name || 'user'}...`)
    return response
  }

  const acceptIncomingCall = () => {
    if (!incomingCall || !socket) {
      return
    }

    const nextCall = { ...incomingCall, status: 'ACTIVE' }
    setIncomingCall(null)
    setActiveCall(nextCall)
    socket.emit('call:join', { callId: incomingCall.id })
    socket.emit('call:accept', { callId: incomingCall.id })
    setNotice(`Accepted call from ${getRemoteUser(nextCall)?.name || 'the caller'}.`)
  }

  const rejectIncomingCall = () => {
    if (!incomingCall || !socket) {
      setIncomingCall(null)
      return
    }

    socket.emit('call:reject', {
      callId: incomingCall.id,
      reason: 'rejected',
    })
    setIncomingCall(null)
    setNotice('Call rejected.')
  }

  const dismissActiveCall = () => {
    setIncomingCall(null)
    setActiveCall(null)
    setNotice('')
  }

  const contextValue = useMemo(
    () => ({
      socket,
      activeCall,
      incomingCall,
      busy: Boolean(activeCall || incomingCall),
      startCall,
      acceptIncomingCall,
      rejectIncomingCall,
      dismissActiveCall,
    }),
    [
      acceptIncomingCall,
      activeCall,
      dismissActiveCall,
      incomingCall,
      rejectIncomingCall,
      socket,
      startCall,
    ],
  )

  return (
    <CallContext.Provider value={contextValue}>
      {children}

      {notice && (
        <div className="fixed bottom-4 right-4 z-[85] max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-2xl">
          {notice}
        </div>
      )}

      {incomingCall && (
        <IncomingCallDialog
          call={incomingCall}
          onAccept={acceptIncomingCall}
          onReject={rejectIncomingCall}
        />
      )}

      {activeCall && (
        <CallWindow call={activeCall} onEnd={dismissActiveCall} socket={socket} />
      )}
    </CallContext.Provider>
  )
}

export const useCall = () => {
  const context = useContext(CallContext)

  if (!context) {
    throw new Error('useCall must be used within a CallProvider.')
  }

  return context
}
