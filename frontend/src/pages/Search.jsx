import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import AppShell from '../components/layout/AppShell'
import {
  getOtherUsers,
  getSameCollegeUsers,
  sendConnectionRequest,
} from '../services/platformApi'
import { getErrorMessage } from '../utils/error'

function Search() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })

  const sameCollegeQuery = useQuery({
    queryKey: ['users', 'same-college'],
    queryFn: getSameCollegeUsers,
  })

  const otherUsersQuery = useQuery({
    queryKey: ['users', 'other'],
    queryFn: getOtherUsers,
  })

  const connectMutation = useMutation({
    mutationFn: sendConnectionRequest,
    onSuccess: async (data) => {
      setStatus({
        type: 'success',
        message: data.message || 'Connection request sent.',
      })
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      await queryClient.invalidateQueries({ queryKey: ['connections'] })
    },
    onError: (error) => {
      setStatus({
        type: 'error',
        message: getErrorMessage(error, 'Failed to send request.'),
      })
    },
  })

  const mergedUsers = useMemo(() => {
    const list = [
      ...(sameCollegeQuery.data?.users || []),
      ...(otherUsersQuery.data?.users || []),
    ]

    const keyword = search.trim().toLowerCase()
    if (!keyword) return list

    return list.filter((user) => {
      return (
        user.name.toLowerCase().includes(keyword) ||
        (user.collegeName || '').toLowerCase().includes(keyword) ||
        user.skills.join(' ').toLowerCase().includes(keyword) ||
        user.interests.join(' ').toLowerCase().includes(keyword)
      )
    })
  }, [otherUsersQuery.data, sameCollegeQuery.data, search])

  return (
    <AppShell title="Directory">
      {status.message && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${
            status.type === 'error'
              ? 'bg-red-100 text-red-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {status.message}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <input
            className="w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-sm"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, college, skill, interest"
            value={search}
          />
          <span className="text-sm font-semibold text-slate-600">
            {mergedUsers.length} result(s)
          </span>
        </div>

        {(sameCollegeQuery.isLoading || otherUsersQuery.isLoading) && (
          <p className="text-sm text-slate-600">Loading users...</p>
        )}
        {(sameCollegeQuery.isError || otherUsersQuery.isError) && (
          <p className="text-sm text-slate-600">Data not available right now</p>
        )}
        {!sameCollegeQuery.isLoading &&
          !otherUsersQuery.isLoading &&
          !sameCollegeQuery.isError &&
          !otherUsersQuery.isError &&
          mergedUsers.length === 0 && <p className="text-sm text-slate-600">No users found</p>}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {mergedUsers.map((user) => (
            <article className="rounded-lg border border-slate-200 p-4" key={user.id}>
              <div className="mb-2 flex items-start justify-between gap-2">
                <h2 className="font-bold text-slate-900">{user.name}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
                  {user.connectionStatus}
                </span>
              </div>
              <p className="text-sm text-slate-700">{user.role}</p>
              <p className="text-xs text-slate-600">{user.collegeName}</p>
              <p className="mt-2 text-xs text-slate-600">
                <span className="font-semibold">Skills:</span>{' '}
                {user.skills.length ? user.skills.join(', ') : 'Not added'}
              </p>
              <p className="text-xs text-slate-600">
                <span className="font-semibold">Interests:</span>{' '}
                {user.interests.length ? user.interests.join(', ') : 'Not added'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(user.connectionStatus === 'NONE' ||
                  user.connectionStatus === 'REJECTED') && (
                  <button
                    className="rounded-lg bg-blue-900 px-3 py-1.5 text-xs font-bold text-white"
                    onClick={() => connectMutation.mutate(user.id)}
                    type="button"
                  >
                    Connect
                  </button>
                )}
                {user.connectionStatus === 'CONNECTED' && (
                  <Link
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700"
                    to={`/messages?with=${user.id}`}
                  >
                    Message
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  )
}

export default Search
