function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 shadow-[0_20px_50px_rgba(23,28,31,0.06)] backdrop-blur-md dark:bg-slate-900/80">
      <div className="flex h-16 w-full max-w-full items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-blue-900 dark:text-white">
            AlumniConnect
          </span>
          <div className="hidden items-center gap-6 md:flex">
            <a
              className="border-b-2 border-blue-900 pb-1 font-bold tracking-tight text-blue-900 dark:border-blue-400 dark:text-blue-400"
              href="#"
            >
              Directory
            </a>
            <a
              className="tracking-tight text-slate-500 transition-colors hover:text-blue-800 dark:text-slate-400"
              href="#"
            >
              Events
            </a>
            <a
              className="tracking-tight text-slate-500 transition-colors hover:text-blue-800 dark:text-slate-400"
              href="#"
            >
              News
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="rounded-lg px-4 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            type="button"
          >
            Logout
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full bg-surface-container">
            <img
              alt="User profile avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHj4_uk5BZh2DavAHy0S4L_PJC-AdVPryAYHzKeupRCw3GFXGVULGeQ1X_BFhekWyBvS0i8Xh6ZvKXl9sGyytn5C83EDYMrWofkx4334cATYnNVHRxQRAB0b5rTyz5F4E-iqBK-3xZHvV27g01lwBUd_nYjGMoNtB8sMtjNywNQKS2nY8JhmQQWg1X2vYrBjUtx3uxQQToNIjGua-KtT9pTgs_xY42OmEsxxAZe7KllZYahTwLVD1WbciNj9i7i9OufwrFvYanlJI"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
