import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import AppShell from '../components/layout/AppShell'
import { getConnections } from '../services/platformApi'

function Mentorship() {
  const connectionsQuery = useQuery({
    queryKey: ['connections'],
    queryFn: getConnections,
  })

  const connectedUsers = connectionsQuery.data?.connected || []

  return (
    <AppShell title="Mentorship">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-black text-blue-950">Your Connected Network</h2>
        <p className="mb-4 text-sm text-slate-600">
          Mentorship sessions are enabled for accepted connections.
        </p>

        {connectionsQuery.isLoading && (
          <p className="text-sm text-slate-600">Loading connections...</p>
        )}
        {connectionsQuery.isError && (
          <p className="text-sm text-slate-600">Data not available right now</p>
        )}

        <div className="space-y-3">
          {!connectionsQuery.isError && connectedUsers.length === 0 && (
            <p className="text-sm text-slate-600">No users found</p>
          )}
          {connectedUsers.map((item) => (
            <article className="rounded-lg border border-slate-200 p-4" key={item.id}>
              <h3 className="font-bold text-slate-900">{item.user?.name}</h3>
              <p className="text-sm text-slate-600">
                {item.user?.role} | {item.user?.collegeName}
              </p>
              <div className="mt-2">
                <Link
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700"
                  to={`/messages?with=${item.user?.id}`}
                >
                  Open Chat
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  )
}

export default Mentorship
