import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const rtcConfig = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
    },
  ],
}

const stopStream = (stream) => {
  stream?.getTracks?.().forEach((track) => track.stop())
}

const getInitial = (name) => String(name || 'U').slice(0, 1).toUpperCase()

const formatDuration = (seconds) => {
  const totalSeconds = Math.max(0, Number(seconds) || 0)
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function CallWindow({ call, onEnd, socket }) {
  const remoteUser = useMemo(() => {
    if (!call) return null
    return call.isCaller ? call.callee : call.caller
  }, [call])

  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const remoteAudioRef = useRef(null)
  const peerRef = useRef(null)
  const localStreamRef = useRef(null)
  const remoteStreamRef = useRef(null)
  const pendingSignalsRef = useRef([])
  const acceptedRef = useRef(call?.status === 'ACTIVE')
  const closedRef = useRef(false)
  const offerSentRef = useRef(false)

  const [error, setError] = useState('')
  const [status, setStatus] = useState(
    call?.status === 'ACTIVE'
      ? 'Connecting...'
      : call?.isCaller
        ? 'Calling...'
        : 'Waiting for answer...',
  )
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [localPreviewVersion, setLocalPreviewVersion] = useState(0)
  const [remotePreviewVersion, setRemotePreviewVersion] = useState(0)

  const cleanupPeer = useCallback(() => {
    const peer = peerRef.current
    peerRef.current = null

    if (peer) {
      peer.onicecandidate = null
      peer.ontrack = null
      peer.onconnectionstatechange = null
      peer.close()
    }

    stopStream(localStreamRef.current)
    localStreamRef.current = null
    remoteStreamRef.current = null
  }, [])

  const handleEnd = useCallback(
    (shouldEmit = true) => {
      if (closedRef.current) {
        return
      }

      closedRef.current = true

      if (shouldEmit && socket && call?.id) {
        socket.emit('call:end', { callId: call.id })
      }

      cleanupPeer()

      if (typeof onEnd === 'function') {
        onEnd()
      }
    },
    [call?.id, cleanupPeer, onEnd, socket],
  )

  const createPeer = useCallback(() => {
    if (peerRef.current) {
      return peerRef.current
    }

    const peer = new RTCPeerConnection(rtcConfig)
    remoteStreamRef.current = new MediaStream()

    peer.onicecandidate = (event) => {
      if (event.candidate && socket && call?.id) {
        socket.emit('call:signal', {
          callId: call.id,
          signal: {
            type: 'ice',
            candidate: event.candidate,
          },
        })
      }
    }

    peer.ontrack = (event) => {
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream()
      }

      const targetStream = event.streams?.[0]
      if (targetStream) {
        remoteStreamRef.current = targetStream
      } else {
        remoteStreamRef.current.addTrack(event.track)
      }

      setRemotePreviewVersion((value) => value + 1)
    }

    peer.onconnectionstatechange = () => {
      const connectionState = peer.connectionState
      if (connectionState === 'connected') {
        setStatus('Connected')
        return
      }

      if (connectionState === 'connecting') {
        setStatus('Connecting...')
        return
      }

      if (
        connectionState === 'failed' ||
        connectionState === 'closed'
      ) {
        setStatus('Call ended')
        if (!closedRef.current) {
          handleEnd(false)
        }
      }
    }

    const localStream = localStreamRef.current
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peer.addTrack(track, localStream)
      })
    }

    peerRef.current = peer
    return peer
  }, [call?.id, handleEnd, socket])

  const maybeStartOffer = useCallback(async () => {
    if (!socket || !call?.id || !call?.isCaller || !acceptedRef.current) {
      return
    }

    const peer = peerRef.current
    const localStream = localStreamRef.current

    if (!peer || !localStream || offerSentRef.current) {
      return
    }

    try {
      offerSentRef.current = true
      const offer = await peer.createOffer()
      await peer.setLocalDescription(offer)
      socket.emit('call:signal', {
        callId: call.id,
        signal: {
          type: 'offer',
          sdp: offer,
        },
      })
      setStatus('Connecting...')
    } catch (offerError) {
      setError(offerError?.message || 'Unable to start the call.')
      handleEnd(true)
    }
  }, [call?.id, call?.isCaller, handleEnd, socket])

  const processSignal = useCallback(
    async (signal) => {
      if (!signal) {
        return
      }

      const peer = peerRef.current || createPeer()
      if (!peer) {
        pendingSignalsRef.current.push(signal)
        return
      }

      try {
        if (signal.type === 'offer' && signal.sdp) {
          await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp))
          const answer = await peer.createAnswer()
          await peer.setLocalDescription(answer)
          socket.emit('call:signal', {
            callId: call.id,
            signal: {
              type: 'answer',
              sdp: answer,
            },
          })
          acceptedRef.current = true
          setStatus('Connected')
          return
        }

        if (signal.type === 'answer' && signal.sdp) {
          await peer.setRemoteDescription(new RTCSessionDescription(signal.sdp))
          acceptedRef.current = true
          setStatus('Connected')
          return
        }

        if (signal.type === 'ice' && signal.candidate) {
          await peer.addIceCandidate(new RTCIceCandidate(signal.candidate))
        }
      } catch (signalError) {
        setError(signalError?.message || 'Call negotiation failed.')
      }
    },
    [call?.id, createPeer, socket],
  )

  useEffect(() => {
    if (!socket || !call?.id) {
      return undefined
    }

    const handleAccepted = ({ call: updatedCall }) => {
      if (updatedCall?.id !== call.id) {
        return
      }

      acceptedRef.current = true
      setStatus('Connecting...')
      maybeStartOffer()
    }

    const handleRejected = ({ call: updatedCall, reason }) => {
      if (updatedCall?.id !== call.id) {
        return
      }

      setStatus(reason === 'busy' ? 'Call declined because the user is busy.' : 'Call rejected.')
      handleEnd(false)
    }

    const handleEnded = ({ call: updatedCall }) => {
      if (updatedCall?.id !== call.id) {
        return
      }

      setStatus('Call ended.')
      handleEnd(false)
    }

    const handleSignal = ({ callId, signal }) => {
      if (callId !== call.id || !signal) {
        return
      }

      if (!peerRef.current || !localStreamRef.current) {
        pendingSignalsRef.current.push(signal)
        return
      }

      processSignal(signal)
    }

    socket.on('call:accepted', handleAccepted)
    socket.on('call:rejected', handleRejected)
    socket.on('call:ended', handleEnded)
    socket.on('call:signal', handleSignal)
    socket.emit('call:join', { callId: call.id })

    return () => {
      socket.off('call:accepted', handleAccepted)
      socket.off('call:rejected', handleRejected)
      socket.off('call:ended', handleEnded)
      socket.off('call:signal', handleSignal)
    }
  }, [call?.id, handleEnd, maybeStartOffer, processSignal, socket])

  useEffect(() => {
    if (!call?.id) {
      return undefined
    }

    let cancelled = false
    setError('')
    setStatus(call.status === 'ACTIVE' ? 'Connecting...' : call.isCaller ? 'Calling...' : 'Waiting for answer...')
    acceptedRef.current = call.status === 'ACTIVE'
    offerSentRef.current = false
    pendingSignalsRef.current = []

    const constraints =
      call.mode === 'VIDEO'
        ? { audio: true, video: { facingMode: 'user' } }
        : { audio: true, video: false }

    const initializeStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        if (cancelled) {
          stopStream(stream)
          return
        }

        localStreamRef.current = stream
        setLocalPreviewVersion((value) => value + 1)
        const peer = createPeer()

        while (pendingSignalsRef.current.length) {
          const nextSignal = pendingSignalsRef.current.shift()
          // eslint-disable-next-line no-await-in-loop
          await processSignal(nextSignal)
        }

        if (call.isCaller && acceptedRef.current && peer && !offerSentRef.current) {
          await maybeStartOffer()
        }
      } catch (_error) {
        setError('Unable to access your microphone or camera.')
        handleEnd(true)
      }
    }

    initializeStream()

    return () => {
      cancelled = true
      if (!closedRef.current && socket && call?.id) {
        socket.emit('call:end', { callId: call.id })
      }
      cleanupPeer()
    }
  }, [call?.id, call?.isCaller, call?.mode, cleanupPeer, createPeer, handleEnd, maybeStartOffer, processSignal, socket])

  useEffect(() => {
    if (status === 'Connected') {
      const startedAt = Date.now()
      setElapsedSeconds(0)

      const timer = window.setInterval(() => {
        setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)))
      }, 1000)

      return () => window.clearInterval(timer)
    }

    setElapsedSeconds(0)
    return undefined
  }, [call?.id, status])

  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current && call?.mode === 'VIDEO') {
      localVideoRef.current.srcObject = localStreamRef.current
    }
  }, [call?.mode, localPreviewVersion])

  useEffect(() => {
    const targetElement = call?.mode === 'VIDEO' ? remoteVideoRef.current : remoteAudioRef.current
    if (targetElement && remoteStreamRef.current) {
      targetElement.srcObject = remoteStreamRef.current
    }
  }, [call?.mode, remotePreviewVersion])

  const toggleMute = () => {
    const nextMutedState = !isMuted
    localStreamRef.current?.getAudioTracks?.().forEach((track) => {
      track.enabled = !nextMutedState
    })
    setIsMuted(nextMutedState)
  }

  const toggleCamera = () => {
    if (call?.mode !== 'VIDEO') {
      return
    }

    const nextCameraState = !isCameraOff
    localStreamRef.current?.getVideoTracks?.().forEach((track) => {
      track.enabled = !nextCameraState
    })
    setIsCameraOff(nextCameraState)
  }

  const remoteLabel = remoteUser?.name || 'Participant'
  const isVideo = call?.mode === 'VIDEO'
  const statusText = error || status
  const hasRemoteStream = remotePreviewVersion > 0

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 text-white shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-sky-300">
              {isVideo ? 'Video Call' : 'Voice Call'}
            </p>
            <h2 className="text-xl font-black">{remoteLabel}</h2>
            <p className="text-sm text-slate-300">
              {statusText}
              {status === 'Connected' && !error ? ` | ${formatDuration(elapsedSeconds)}` : ''}
            </p>
          </div>

          <button
            className="rounded-full bg-rose-500 px-4 py-2 text-sm font-bold text-white hover:bg-rose-400"
            onClick={() => handleEnd(true)}
            type="button"
          >
            End Call
          </button>
        </div>

        <div className={`grid gap-4 p-4 ${isVideo ? 'lg:grid-cols-[2fr_1fr]' : 'grid-cols-1'}`}>
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-black">
            {isVideo ? (
              <>
                <video
                  autoPlay
                  className="h-full w-full object-cover"
                  playsInline
                  ref={remoteVideoRef}
                />
                {!hasRemoteStream && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-3xl font-black text-white">
                        {getInitial(remoteLabel)}
                      </div>
                      <p className="text-lg font-bold">Waiting for the other side...</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-900 via-slate-950 to-black px-6 text-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/10 text-4xl font-black text-white">
                  {getInitial(remoteLabel)}
                </div>
                <div>
                  <p className="text-2xl font-black">{remoteLabel}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Voice call in progress. Audio will play here.
                  </p>
                </div>
                <audio autoPlay className="hidden" ref={remoteAudioRef} />
              </div>
            )}
          </div>

          <div className="space-y-4">
            {isVideo ? (
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
                <video
                  autoPlay
                  className="h-64 w-full object-cover"
                  muted
                  playsInline
                  ref={localVideoRef}
                />
                <div className="border-t border-white/10 p-4">
                  <p className="text-sm font-bold text-white">Your preview</p>
                  <p className="text-xs text-slate-300">
                    {isMuted ? 'Microphone muted' : 'Microphone active'} |{' '}
                    {isCameraOff ? 'Camera off' : 'Camera on'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-slate-900 p-4">
                <p className="text-sm font-bold text-white">Your microphone</p>
                <p className="mt-1 text-sm text-slate-300">
                  {isMuted ? 'Muted' : 'Live'} |{' '}
                  {status === 'Connected'
                    ? `Connected for ${formatDuration(elapsedSeconds)}`
                    : 'Connecting...'}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
                onClick={toggleMute}
                type="button"
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <button
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10 disabled:opacity-40"
                disabled={!isVideo}
                onClick={toggleCamera}
                type="button"
              >
                {isCameraOff ? 'Camera On' : 'Camera Off'}
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">
                Session
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-200">
                <p>
                  Type: <span className="font-bold">{isVideo ? 'Video' : 'Voice'}</span>
                </p>
                <p>
                  State: <span className="font-bold">{status || call?.status || 'RINGING'}</span>
                </p>
                <p>
                  Remote: <span className="font-bold">{remoteLabel}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallWindow
