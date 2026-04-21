function TypingIndicator({ label = 'Someone is typing' }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
      <span>{label}</span>
      <span className="flex items-center gap-1">
        <span className="typing-dot" />
        <span className="typing-dot typing-dot-delay-1" />
        <span className="typing-dot typing-dot-delay-2" />
      </span>
    </div>
  )
}

export default TypingIndicator
