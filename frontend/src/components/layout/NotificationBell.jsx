import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getNotifications, readAllNotifications } from '../../services/platformApi'
import { getErrorMessage } from '../../utils/error'
import ActionButton from '../ui/ActionButton'

const formatTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString()
}

function NotificationBell() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    refetchInterval: 30000,
  })

  const notifications = notificationsQuery.data?.notifications || []
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  )

  const readAllMutation = useMutation({
    mutationFn: readAllNotifications,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (error) => {
      // Keep the bell functional even if the API hiccups.
      console.error(getErrorMessage(error, 'Unable to mark notifications as read.'))
    },
  })

  const handleToggle = async () => {
    setIsOpen((current) => !current)
    if (!isOpen && unreadCount > 0) {
      await readAllMutation.mutateAsync()
    }
  }

  return (
    <div className="relative">
      <ActionButton
        className="h-10 rounded-full border border-slate-200 bg-white px-3 text-slate-700 shadow-sm"
        onClick={handleToggle}
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">notifications</span>
        {unreadCount > 0 && (
          <span className="rounded-full bg-blue-900 px-2 py-0.5 text-[11px] font-black text-white">
            {unreadCount}
          </span>
        )}
      </ActionButton>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">Live alerts and broadcasts</p>
            </div>
            <ActionButton
              className="border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700"
              disabled={readAllMutation.isPending}
              onClick={() => readAllMutation.mutate()}
              type="button"
            >
              Mark all read
            </ActionButton>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {notificationsQuery.isLoading ? (
              <p className="px-4 py-6 text-sm text-slate-500">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-500">No notifications yet.</p>
            ) : (
              notifications.map((notification) => (
                <div
                  className={`border-b border-slate-100 px-4 py-3 transition ${
                    notification.read ? 'bg-white' : 'bg-blue-50/70'
                  }`}
                  key={notification.id}
                >
                  <p className="text-sm font-bold text-slate-900">{notification.title}</p>
                  <p className="text-xs leading-5 text-slate-600">{notification.body}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
