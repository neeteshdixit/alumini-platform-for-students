import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import { useSocket } from '../../contexts/SocketContext'
import { useAuthStore } from '../../store/authStore'
import { playDingSound, playPopSound } from '../../utils/audio'

const shouldPlayDing = (notification) => {
  return ['NEW_MESSAGE', 'CONNECTION_REQUEST', 'CONNECTION_ACCEPTED', 'REMINDER'].includes(
    notification?.type,
  )
}

const shouldCelebrate = (notification) => {
  return ['GRADUATION_COMPLETE', 'CERTIFICATE', 'ACHIEVEMENT', 'WELCOME'].includes(
    notification?.type,
  )
}

function dispatchRealtimeEvent(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail }))
}

function RealtimeBridge() {
  const socket = useSocket()
  const queryClient = useQueryClient()
  const currentUserId = useAuthStore((state) => state.user?.id)

  useEffect(() => {
    if (!socket) {
      return undefined
    }

    const handleNotification = ({ notification }) => {
      if (!notification) return

      dispatchRealtimeEvent('alumni:notification:new', notification)
      queryClient.invalidateQueries({ queryKey: ['notifications'] })

      if (shouldPlayDing(notification)) {
        playDingSound()
      }

      if (shouldCelebrate(notification)) {
        playPopSound()
      }

      toast(notification.title || notification.body || 'Notification received', {
        icon: '🔔',
      })
    }

    const handleFeed = ({ post }) => {
      dispatchRealtimeEvent('alumni:feed:new', post)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      if (post?.type === 'CERTIFICATE') {
        playPopSound()
      }
    }

    const handleAchievement = (payload) => {
      if (!payload) return
      dispatchRealtimeEvent('alumni:broadcast:new', payload)
      if (payload?.userId !== currentUserId) {
        playPopSound()
      }
    }

    const handleMessage = ({ message, chatId }) => {
      dispatchRealtimeEvent('alumni:message:new', { message, chatId })
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    }

    socket.on('notification:new', handleNotification)
    socket.on('feed:new', handleFeed)
    socket.on('broadcast:achievement', handleAchievement)
    socket.on('message:new', handleMessage)

    return () => {
      socket.off('notification:new', handleNotification)
      socket.off('feed:new', handleFeed)
      socket.off('broadcast:achievement', handleAchievement)
      socket.off('message:new', handleMessage)
    }
  }, [currentUserId, queryClient, socket])

  return null
}

export default RealtimeBridge
