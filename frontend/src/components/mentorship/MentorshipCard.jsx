function MentorshipCard({
  avatarSrc,
  avatarAlt,
  title,
  subtitle,
  badgeText,
  badgeClasses = 'bg-primary/5 text-primary',
  wrapperClass = 'border-primary dark:border-primary-fixed',
  children,
}) {
  return (
    <div className={`bg-surface-container-lowest dark:bg-slate-900 p-8 rounded-xl border-l-4 ${wrapperClass} shadow-sm`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg overflow-hidden grayscale">
            <img alt={avatarAlt} className="w-full h-full object-cover" src={avatarSrc} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-on-surface">{title}</h3>
            <p className="text-sm text-on-surface-variant">{subtitle}</p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${badgeClasses}`}>{badgeText}</span>
      </div>

      {children}
    </div>
  )
}

export default MentorshipCard
