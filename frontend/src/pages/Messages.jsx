import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import AppShell from '../components/layout/AppShell'
import {
  fetchMessages,
  sendConnectionRequest,
  sendMessage,
} from '../services/platformApi'
import { getErrorMessage } from '../utils/error'

function Messages() {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [draft, setDraft] = useState('')
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const selectedUserId = searchParams.get('with') || ''

  const conversationsQuery = useQuery({
    queryKey: ['messages', 'list'],
    queryFn: () => fetchMessages(),
    refetchInterval: 10000,
  })

  const chatQuery = useQuery({
    queryKey: ['messages', selectedUserId],
    queryFn: () => fetchMessages(selectedUserId),
    enabled: Boolean(selectedUserId),
    refetchInterval: 4000,
  })

  useEffect(() => {
    if (selectedUserId) return
    const firstConversation = conversationsQuery.data?.conversations?.[0]
    if (!firstConversation?.user?.id) return
    setSearchParams({ with: firstConversation.user.id })
  }, [conversationsQuery.data, selectedUserId, setSearchParams])

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: async () => {
      setDraft('')
      setFeedback({ type: '', message: '' })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['messages', selectedUserId] }),
        queryClient.invalidateQueries({ queryKey: ['messages', 'list'] }),
      ])
    },
    onError: (error) => {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Failed to send message.'),
      })
      if (error?.response?.data?.details?.locked) {
        queryClient.invalidateQueries({ queryKey: ['messages', selectedUserId] })
      }
    },
  })

  const connectMutation = useMutation({
    mutationFn: sendConnectionRequest,
    onSuccess: async (data) => {
      setFeedback({
        type: 'success',
        message: data.message || 'Connection request sent.',
      })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['messages', selectedUserId] }),
        queryClient.invalidateQueries({ queryKey: ['messages', 'list'] }),
        queryClient.invalidateQueries({ queryKey: ['users'] }),
        queryClient.invalidateQueries({ queryKey: ['connections'] }),
      ])
    },
    onError: (error) => {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Failed to send connection request.'),
      })
    },
  })

  const selectedChatData = chatQuery.data
  const access = selectedChatData?.access

  const lockMessage = useMemo(() => {
    if (!access || access.isConnected) return ''
    if (access.locked) {
      return '2-minute chat window ended. Connect to continue messaging.'
    }
    return `Free chat available for ${access.trialRemainingSeconds || 0}s`
  }, [access])

  const handleSend = () => {
    const trimmed = draft.trim()
    if (!trimmed || !selectedUserId) return
    sendMessageMutation.mutate({
      toUserId: selectedUserId,
      content: trimmed,
    })
  }

  return (
    <AppShell title="Messages">
      {feedback.message && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${
            feedback.type === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-4">
          <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-slate-700">
            Conversations
          </h2>
          <div className="space-y-2">
            {conversationsQuery.isLoading && (
              <p className="text-sm text-slate-600">Loading conversations...</p>
            )}
            {conversationsQuery.isError && (
              <p className="text-sm text-slate-600">Data not available right now</p>
            )}
            {!conversationsQuery.isLoading &&
              !conversationsQuery.isError &&
              (conversationsQuery.data?.conversations || []).length === 0 && (
                <p className="text-sm text-slate-600">No messages</p>
              )}
            {(conversationsQuery.data?.conversations || []).map((conversation) => (
              <button
                className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                  selectedUserId === conversation.user.id
                    ? 'border-blue-900 bg-blue-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
                key={conversation.chatId || conversation.user.id}
                onClick={() => setSearchParams({ with: conversation.user.id })}
                type="button"
              >
                <p className="font-semibold text-slate-900">{conversation.user.name}</p>
                <p className="text-xs text-slate-600">{conversation.user.collegeName}</p>
                {conversation.lastMessage?.content && (
                  <p className="mt-1 truncate text-xs text-slate-500">
                    {conversation.lastMessage.content}
                  </p>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-8">
          {!selectedUserId ? (
            <p className="text-sm text-slate-600">Select a conversation to start chatting.</p>
          ) : chatQuery.isLoading ? (
            <p className="text-sm text-slate-600">Loading messages...</p>
          ) : chatQuery.isError ? (
            <p className="text-sm text-slate-600">Data not available right now</p>
          ) : (
            <div className="flex h-[70vh] flex-col">
              <div className="border-b border-slate-200 pb-3">
                <p className="font-bold text-slate-900">{selectedChatData?.user?.name}</p>
                <p className="text-xs text-slate-600">{selectedChatData?.user?.collegeName}</p>
                {lockMessage && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${
                        access?.locked
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {lockMessage}
                    </span>
                    {access?.locked && !access?.isConnected && (
                      <button
                        className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700"
                        onClick={() => connectMutation.mutate(selectedUserId)}
                        type="button"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto py-3">
                {(selectedChatData?.messages || []).map((message) => {
                  const mine = message.fromId !== selectedChatData?.user?.id
                  return (
                    <div
                      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                      key={message.id}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          mine
                            ? 'bg-blue-900 text-white'
                            : 'border border-slate-200 bg-slate-50 text-slate-900'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`mt-1 text-[11px] ${
                            mine ? 'text-blue-100' : 'text-slate-500'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
                {selectedChatData?.messages?.length === 0 && (
                  <p className="text-sm text-slate-600">No messages yet. Start the conversation.</p>
                )}
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    disabled={Boolean(access?.locked)}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        handleSend()
                      }
                    }}
                    placeholder={
                      access?.locked
                        ? 'Chat locked. Connect to continue.'
                        : 'Type your message...'
                    }
                    value={draft}
                  />
                  <button
                    className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                    disabled={sendMessageMutation.isPending || Boolean(access?.locked)}
                    onClick={handleSend}
                    type="button"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}

export default Messages
