import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import AppShell from '../components/layout/AppShell'
import {
  createPost,
  fetchMessages,
  getConnections,
  getMe,
  getPosts,
  getUserSuggestions,
  respondConnectionRequest,
  sendConnectionRequest,
} from '../services/platformApi'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../utils/error'

const initialPostForm = {
  type: 'GENERAL',
  title: '',
  description: '',
  attachmentUrl: '',
}

const createAsyncState = () => ({
  loading: true,
  error: '',
  data: null,
})

const speakWelcome = (name) => {
  if (!window?.speechSynthesis || !name) return
  const utterance = new SpeechSynthesisUtterance(`Welcome ${name}`)
  utterance.rate = 1
  utterance.pitch = 1
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

function StatusNotice({ message, tone = 'neutral' }) {
  const className =
    tone === 'error'
      ? 'bg-red-100 text-red-700'
      : tone === 'success'
        ? 'bg-emerald-100 text-emerald-700'
        : 'bg-slate-100 text-slate-700'

  return <p className={`rounded-lg px-3 py-2 text-sm font-medium ${className}`}>{message}</p>
}

function LoadingOrFallback({ loading, error, empty, loadingText, emptyText }) {
  if (loading) {
    return <StatusNotice message={loadingText || 'Loading...'} />
  }
  if (error) {
    return <StatusNotice message="Data not available right now" />
  }
  if (empty) {
    return <StatusNotice message={emptyText || 'Data not available right now'} />
  }
  return null
}

function SuggestionCard({ user, onConnect, isConnecting }) {
  const canConnect =
    user.connectionStatus === 'NONE' || user.connectionStatus === 'REJECTED'

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900">{user.name}</h3>
          <p className="text-sm text-slate-600">
            {user.role} | {user.collegeName}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
          {user.connectionStatus}
        </span>
      </div>

      <p className="mb-1 text-xs text-slate-600">
        <span className="font-semibold text-slate-700">Skills:</span>{' '}
        {user.skills?.length ? user.skills.join(', ') : 'Not added'}
      </p>
      <p className="mb-3 text-xs text-slate-600">
        <span className="font-semibold text-slate-700">Interests:</span>{' '}
        {user.interests?.length ? user.interests.join(', ') : 'Not added'}
      </p>

      <div className="flex flex-wrap gap-2">
        {canConnect && (
          <button
            className="rounded-lg bg-blue-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
            disabled={isConnecting}
            onClick={() => onConnect(user.id)}
            type="button"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        )}

        {user.connectionStatus === 'CONNECTED' && (
          <Link
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700"
            to={`/messages?with=${user.id}`}
          >
            Message
          </Link>
        )}

        {user.connectionStatus === 'REQUEST_SENT' && (
          <span className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700">
            Request Sent
          </span>
        )}
      </div>
    </article>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const accessToken = useAuthStore((state) => state.accessToken)
  const setAuthUser = useAuthStore((state) => state.setUser)

  const [userState, setUserState] = useState(createAsyncState)
  const [suggestionsState, setSuggestionsState] = useState(createAsyncState)
  const [postsState, setPostsState] = useState(createAsyncState)
  const [chatsState, setChatsState] = useState(createAsyncState)
  const [connectionsState, setConnectionsState] = useState(createAsyncState)

  const [status, setStatus] = useState({ type: '', message: '' })
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [postForm, setPostForm] = useState(initialPostForm)
  const [isSubmittingPost, setIsSubmittingPost] = useState(false)
  const [connectingUserId, setConnectingUserId] = useState('')
  const [respondingRequestId, setRespondingRequestId] = useState('')

  const welcomedUserRef = useRef('')
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const safeSetState = (setter, value) => {
    if (!mountedRef.current) return
    setter(value)
  }

  const loadMe = async () => {
    safeSetState(setUserState, { loading: true, error: '', data: null })

    try {
      const response = await getMe()
      const user = response?.user || null
      safeSetState(setUserState, { loading: false, error: '', data: user })

      if (user) {
        setAuthUser(user)
      }
    } catch (error) {
      safeSetState(setUserState, {
        loading: false,
        error: getErrorMessage(error),
        data: null,
      })
    }
  }

  const loadSuggestions = async () => {
    safeSetState(setSuggestionsState, { loading: true, error: '', data: [] })

    try {
      const response = await getUserSuggestions()
      const users = Array.isArray(response?.users) ? response.users : []
      safeSetState(setSuggestionsState, {
        loading: false,
        error: '',
        data: users,
      })
    } catch (error) {
      safeSetState(setSuggestionsState, {
        loading: false,
        error: getErrorMessage(error),
        data: [],
      })
    }
  }

  const loadPosts = async () => {
    safeSetState(setPostsState, { loading: true, error: '', data: [] })

    try {
      const response = await getPosts()
      const posts = Array.isArray(response?.posts) ? response.posts : []
      safeSetState(setPostsState, {
        loading: false,
        error: '',
        data: posts,
      })
    } catch (error) {
      safeSetState(setPostsState, {
        loading: false,
        error: getErrorMessage(error),
        data: [],
      })
    }
  }

  const loadChats = async () => {
    safeSetState(setChatsState, { loading: true, error: '', data: [] })

    try {
      const response = await fetchMessages()
      const chats = Array.isArray(response?.conversations) ? response.conversations : []
      safeSetState(setChatsState, {
        loading: false,
        error: '',
        data: chats,
      })
    } catch (error) {
      safeSetState(setChatsState, {
        loading: false,
        error: getErrorMessage(error),
        data: [],
      })
    }
  }

  const loadConnections = async () => {
    safeSetState(setConnectionsState, { loading: true, error: '', data: { incoming: [] } })

    try {
      const response = await getConnections()
      safeSetState(setConnectionsState, {
        loading: false,
        error: '',
        data: {
          incoming: response?.incoming || [],
        },
      })
    } catch (error) {
      safeSetState(setConnectionsState, {
        loading: false,
        error: getErrorMessage(error),
        data: { incoming: [] },
      })
    }
  }

  const loadDashboard = async () => {
    if (!accessToken) {
      safeSetState(setUserState, {
        loading: false,
        error: 'Please login to continue.',
        data: null,
      })
      return
    }

    await Promise.all([
      loadMe(),
      loadSuggestions(),
      loadPosts(),
      loadChats(),
      loadConnections(),
    ])
  }

  useEffect(() => {
    loadDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  useEffect(() => {
    const me = userState.data
    if (!me || welcomedUserRef.current === me.id) return

    welcomedUserRef.current = me.id
    speakWelcome(me.name)
  }, [userState.data])

  const incomingRequests = connectionsState.data?.incoming || []
  const posts = postsState.data || []
  const chats = chatsState.data || []

  const userName = userState.data?.name || 'User'

  const mentorSuggestions = useMemo(() => {
    const suggestions = Array.isArray(suggestionsState.data)
      ? suggestionsState.data
      : []
    return suggestions.filter((item) => item.id !== userState.data?.id)
  }, [suggestionsState.data, userState.data?.id])

  const handleConnect = async (targetUserId) => {
    setConnectingUserId(targetUserId)
    setStatus({ type: '', message: '' })

    try {
      await sendConnectionRequest(targetUserId)
      setStatus({ type: 'success', message: 'Connection request sent.' })
      await Promise.all([loadSuggestions(), loadConnections(), loadChats()])
    } catch (error) {
      setStatus({ type: 'error', message: getErrorMessage(error) })
    } finally {
      setConnectingUserId('')
    }
  }

  const handleRespond = async (requestId, action) => {
    setRespondingRequestId(requestId)
    setStatus({ type: '', message: '' })

    try {
      await respondConnectionRequest({ requestId, action })
      setStatus({
        type: 'success',
        message:
          action === 'ACCEPT'
            ? 'Connection request accepted.'
            : 'Connection request rejected.',
      })
      await Promise.all([loadSuggestions(), loadConnections(), loadChats()])
    } catch (error) {
      setStatus({ type: 'error', message: getErrorMessage(error) })
    } finally {
      setRespondingRequestId('')
    }
  }

  const handleCreatePost = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setIsSubmittingPost(true)

    try {
      await createPost({
        type: postForm.type,
        title: postForm.title,
        description: postForm.description,
        attachmentUrl: postForm.attachmentUrl || undefined,
      })

      setStatus({ type: 'success', message: 'Post created successfully.' })
      setPostForm(initialPostForm)
      setIsPostModalOpen(false)
      await loadPosts()
    } catch (error) {
      setStatus({ type: 'error', message: getErrorMessage(error) })
    } finally {
      setIsSubmittingPost(false)
    }
  }

  const dashboardActions = (
    <div className="flex flex-wrap gap-2">
      <button
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        onClick={() => navigate('/search')}
        type="button"
      >
        View Matches
      </button>
      <button
        className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-bold text-white"
        onClick={() => setIsPostModalOpen(true)}
        type="button"
      >
        New Post
      </button>
    </div>
  )

  return (
    <AppShell actions={dashboardActions} title="Dashboard">
      {status.message && (
        <div className="mb-5">
          <StatusNotice message={status.message} tone={status.type || 'neutral'} />
        </div>
      )}

      {userState.loading ? (
        <StatusNotice message="Loading..." />
      ) : userState.error ? (
        <StatusNotice message="Data not available right now" />
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <section className="space-y-6 xl:col-span-8">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-2 text-lg font-black text-blue-950">Hello, {userName}</h2>
              <p className="text-sm text-slate-600">
                College: {userState.data?.collegeName || 'Not available'}
              </p>
              <p className="text-sm text-slate-600">
                Role: {userState.data?.role || 'Not available'}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Skills:{' '}
                {userState.data?.skills?.length
                  ? userState.data.skills.join(', ')
                  : 'Data not available right now'}
              </p>
              <p className="text-sm text-slate-600">
                Interests:{' '}
                {userState.data?.interests?.length
                  ? userState.data.interests.join(', ')
                  : 'Data not available right now'}
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-blue-950">Recent Chats</h2>
              <LoadingOrFallback
                empty={chats.length === 0}
                emptyText="No chats yet"
                error={Boolean(chatsState.error)}
                loading={chatsState.loading}
                loadingText="Loading..."
              />
              {!chatsState.loading &&
                !chatsState.error &&
                chats.map((chat) => (
                  <div
                    className="mb-3 rounded-lg border border-slate-200 p-3"
                    key={chat.chatId || chat.user?.id}
                  >
                    <p className="font-semibold text-slate-900">{chat.user?.name}</p>
                    <p className="text-xs text-slate-600">{chat.user?.collegeName}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {chat.lastMessage?.content || 'No messages yet'}
                    </p>
                    <div className="mt-2">
                      <Link
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700"
                        to={`/messages?with=${chat.user?.id}`}
                      >
                        Open Chat
                      </Link>
                    </div>
                  </div>
                ))}
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-blue-950">Feed</h2>
              <LoadingOrFallback
                empty={posts.length === 0}
                emptyText="No posts yet"
                error={Boolean(postsState.error)}
                loading={postsState.loading}
                loadingText="Loading..."
              />
              {!postsState.loading &&
                !postsState.error &&
                posts.map((post) => (
                  <div className="mb-3 rounded-lg border border-slate-200 p-4" key={post.id}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900">{post.title}</h3>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
                        {post.type}
                      </span>
                    </div>
                    <p className="mb-2 text-sm text-slate-700">{post.description}</p>
                    {post.attachmentUrl && (
                      <a
                        className="mb-2 inline-block text-xs font-semibold text-blue-700 underline"
                        href={post.attachmentUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        View attachment
                      </a>
                    )}
                    <p className="text-xs text-slate-500">
                      Posted by {post.author?.name || 'Unknown'} |{' '}
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
            </article>
          </section>

          <aside className="space-y-6 xl:col-span-4">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-black text-blue-950">Mentor Suggestions</h2>
              <LoadingOrFallback
                empty={mentorSuggestions.length === 0}
                emptyText="No mentors available"
                error={Boolean(suggestionsState.error)}
                loading={suggestionsState.loading}
                loadingText="Loading..."
              />
              {!suggestionsState.loading &&
                !suggestionsState.error &&
                mentorSuggestions.map((mentor) => (
                  <div className="mb-3" key={mentor.id}>
                    <SuggestionCard
                      isConnecting={connectingUserId === mentor.id}
                      onConnect={handleConnect}
                      user={mentor}
                    />
                  </div>
                ))}
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-black text-blue-950">Incoming Requests</h2>
              <LoadingOrFallback
                empty={incomingRequests.length === 0}
                emptyText="No users found"
                error={Boolean(connectionsState.error)}
                loading={connectionsState.loading}
                loadingText="Loading..."
              />
              {!connectionsState.loading &&
                !connectionsState.error &&
                incomingRequests.map((request) => (
                  <div className="mb-3 rounded-lg border border-slate-200 p-3" key={request.id}>
                    <p className="font-semibold text-slate-900">{request.user?.name}</p>
                    <p className="text-xs text-slate-600">{request.user?.collegeName}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
                        disabled={respondingRequestId === request.id}
                        onClick={() => handleRespond(request.id, 'ACCEPT')}
                        type="button"
                      >
                        Accept
                      </button>
                      <button
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-60"
                        disabled={respondingRequestId === request.id}
                        onClick={() => handleRespond(request.id, 'REJECT')}
                        type="button"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
            </article>
          </aside>
        </div>
      )}

      {isPostModalOpen && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Create New Post</h3>
            <form className="mt-4 space-y-3" onSubmit={handleCreatePost}>
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onChange={(event) =>
                  setPostForm((current) => ({
                    ...current,
                    type: event.target.value,
                  }))
                }
                value={postForm.type}
              >
                <option value="GENERAL">General</option>
                <option value="CERTIFICATE">Certificate</option>
                <option value="HACKATHON">Hackathon</option>
                <option value="EVENT">Event</option>
              </select>

              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onChange={(event) =>
                  setPostForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Title"
                value={postForm.title}
              />

              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onChange={(event) =>
                  setPostForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Description"
                value={postForm.description}
              />

              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                onChange={(event) =>
                  setPostForm((current) => ({
                    ...current,
                    attachmentUrl: event.target.value,
                  }))
                }
                placeholder="Attachment URL (optional)"
                value={postForm.attachmentUrl}
              />

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setIsPostModalOpen(false)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  disabled={isSubmittingPost}
                  type="submit"
                >
                  {isSubmittingPost ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}

export default Dashboard
