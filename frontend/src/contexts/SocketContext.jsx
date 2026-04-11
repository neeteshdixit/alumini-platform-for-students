import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'

import { useAuthStore } from '../store/authStore'

const SocketContext = createContext({ socket: null })

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

let sharedSocket = null
let sharedToken = ''

const connectSharedSocket = (token) => {
  if (!token) {
    return null
  }

  if (sharedSocket && sharedToken === token) {
    return sharedSocket
  }

  if (sharedSocket) {
    sharedSocket.disconnect()
    sharedSocket = null
  }

  sharedToken = token
  sharedSocket = io(baseURL, {
    auth: {
      token,
    },
    autoConnect: true,
    transports: ['websocket'],
    withCredentials: true,
  })

  return sharedSocket
}

const disconnectSharedSocket = () => {
  if (sharedSocket) {
    sharedSocket.disconnect()
    sharedSocket = null
  }

  sharedToken = ''
}

export function SocketProvider({ children }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!accessToken) {
      disconnectSharedSocket()
      setSocket(null)
      return undefined
    }

    const nextSocket = connectSharedSocket(accessToken)
    setSocket(nextSocket)

    return undefined
  }, [accessToken])

  const value = useMemo(() => ({ socket }), [socket])

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  return useContext(SocketContext)?.socket || null
}
