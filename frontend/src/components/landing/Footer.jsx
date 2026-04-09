import { Link, useNavigate } from 'react-router-dom'

function Footer() {
  const navigate = useNavigate()

  const handleShare = async () => {
    const sharePayload = {
      title: 'AlumniConnect',
      text: 'Join AlumniConnect for real college alumni networking.',
      url: window.location.origin,
    }

    if (navigator.share) {
      try {
        await navigator.share(sharePayload)
        return
      } catch {
        // ignored: user may cancel share
      }
    }

    try {
      await navigator.clipboard.writeText(sharePayload.url)
      window.alert('Link copied to clipboard.')
    } catch {
      window.alert('Unable to share right now.')
    }
  }

  return (
    <footer className="w-full border-t border-slate-200/20 bg-slate-100 px-8 py-12 dark:border-slate-800/20 dark:bg-slate-950">
      <div className="flex max-w-full flex-col items-center justify-between gap-8 md:flex-row">
        <div className="text-center md:text-left">
          <span className="text-xl font-bold text-blue-900 dark:text-white">
            AlumniConnect
          </span>
          <p className="mt-2 text-xs tracking-widest text-slate-400 uppercase dark:text-slate-500">
            (c) 2024 AlumniConnect. Building a Legacy.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <Link
            className="text-xs tracking-widest text-slate-400 uppercase opacity-80 transition-colors hover:text-blue-600 hover:opacity-100 dark:text-slate-500 dark:hover:text-blue-300"
            to="/about"
          >
            About Us
          </Link>
          <Link
            className="text-xs tracking-widest text-slate-400 uppercase opacity-80 transition-colors hover:text-blue-600 hover:opacity-100 dark:text-slate-500 dark:hover:text-blue-300"
            to="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-xs tracking-widest text-slate-400 uppercase opacity-80 transition-colors hover:text-blue-600 hover:opacity-100 dark:text-slate-500 dark:hover:text-blue-300"
            to="/terms"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs tracking-widest text-slate-400 uppercase opacity-80 transition-colors hover:text-blue-600 hover:opacity-100 dark:text-slate-500 dark:hover:text-blue-300"
            to="/contact"
          >
            Contact
          </Link>
        </div>

        <div className="flex gap-4">
          <button
            aria-label="Public website"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-surface-container text-primary transition-all hover:bg-primary hover:text-white"
            onClick={() => navigate('/')}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">public</span>
          </button>
          <button
            aria-label="Share AlumniConnect"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-surface-container text-primary transition-all hover:bg-primary hover:text-white"
            onClick={handleShare}
            type="button"
          >
            <span className="material-symbols-outlined text-xl">share</span>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
