function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 ${className}`.trim()}
    />
  )
}

export default Skeleton
