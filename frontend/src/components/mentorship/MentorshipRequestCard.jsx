function MentorshipRequestCard({
  imageSrc,
  imageAlt,
  name,
  subtitle,
  quote,
  onAccept = () => {},
  onDecline = () => {},
}) {
  return (
    <div className="rounded-xl border border-transparent bg-surface-container p-5 transition-all hover:border-primary/20 dark:bg-slate-900/40">
      <div className="mb-4 flex gap-4">
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
          <img alt={imageAlt} className="h-full w-full object-cover" src={imageSrc} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-on-surface">{name}</h4>
          <p className="text-xs text-on-surface-variant">{subtitle}</p>
        </div>
      </div>
      <p className="mb-4 line-clamp-2 text-xs italic text-on-surface-variant">{quote}</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          className="rounded-lg bg-surface-container-highest py-2 text-xs font-bold text-on-surface transition-all hover:opacity-80 dark:bg-slate-800"
          onClick={onDecline}
          type="button"
        >
          Decline
        </button>
        <button
          className="rounded-lg bg-primary py-2 text-xs font-bold text-white shadow-sm transition-all hover:shadow-primary/20"
          onClick={onAccept}
          type="button"
        >
          Accept
        </button>
      </div>
    </div>
  )
}

export default MentorshipRequestCard
