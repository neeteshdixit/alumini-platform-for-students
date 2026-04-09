import { Link } from 'react-router-dom'

function InfoPage({ title, description }) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-4 text-3xl font-black text-blue-950">{title}</h1>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">
          {description || 'Data not available right now'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-bold text-white"
            to="/"
          >
            Back to Home
          </Link>
          <Link
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            to="/login"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default InfoPage
