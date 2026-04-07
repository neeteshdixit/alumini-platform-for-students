function MentorshipRequestCard({ imageSrc, imageAlt, name, subtitle, quote }) {
  return (
    <div className="bg-surface-container dark:bg-slate-900/40 p-5 rounded-xl border border-transparent hover:border-primary/20 transition-all">
      <div className="flex gap-4 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img alt={imageAlt} className="w-full h-full object-cover" src={imageSrc} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-on-surface">{name}</h4>
          <p className="text-xs text-on-surface-variant">{subtitle}</p>
        </div>
      </div>
      <p className="text-xs text-on-surface-variant italic mb-4 line-clamp-2">{quote}</p>
      <div className="grid grid-cols-2 gap-2">
        <button className="py-2 text-xs font-bold text-on-surface bg-surface-container-highest dark:bg-slate-800 rounded-lg hover:opacity-80 transition-all" type="button">
          Decline
        </button>
        <button className="py-2 text-xs font-bold text-white bg-primary rounded-lg shadow-sm hover:shadow-primary/20 transition-all" type="button">
          Accept
        </button>
      </div>
    </div>
  )
}

export default MentorshipRequestCard
