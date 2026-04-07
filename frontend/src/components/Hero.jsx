function Hero() {
  return (
    <section className="relative flex min-h-[921px] items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          alt="Historic university campus at sunrise"
          className="h-full w-full object-cover opacity-10 dark:opacity-20"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLPxhJIrpb_boVSL6rpujYaIZD9rZga4YqLkXIGHfNUFTlVJDeyvZ4NQ5yUVw6b0EwujvwpeDAGgGijTNpCEsX632QEvkO5GgZ5bgCIjJfq-4k7vB_LK_9aK8tJneL5gYYcPEcAUP_XglKjfFmaLkDUZb_i3_LcmMgMka60kLZsxPTDonFw-TB6fxRqcZhCyMleZmzyS_75iYYLUDCZdpAzePO0LySxmI_25bg2ft-qtrwSD9BlKX8m-q9HrB0HE3rknyo9cPZDV4"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-surface via-surface/60 to-transparent" />
      </div>

      <div className="container z-10 mx-auto grid items-center gap-12 px-8 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full bg-secondary-container px-4 py-2 text-xs font-bold uppercase tracking-widest text-on-secondary-container">
            <span className="material-symbols-outlined text-sm">school</span>
            Empowering Legacies
          </div>

          <h1 className="text-6xl leading-[0.9] font-black tracking-tighter text-primary md:text-8xl">
            Your College,
            <br />
            <span className="text-primary-container">Your Network</span>
          </h1>

          <p className="font-body max-w-lg text-xl leading-relaxed text-on-surface-variant">
            The Digital Curator of your professional journey. Connect with verified alumni,
            secure mentorship, and grow within an exclusive elite ecosystem.
          </p>

          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <a
              className="editorial-gradient rounded-xl px-8 py-4 text-center font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              href="/auth?mode=signup"
            >
              Join as Alumni
            </a>
            <a
              className="rounded-xl bg-surface-container-highest px-8 py-4 text-center font-bold text-on-surface transition-all hover:bg-surface-container-high active:scale-95"
              href="/auth?mode=login"
            >
              Join as Student
            </a>
          </div>

          <div className="pt-8">
            <label
              className="mb-3 block text-xs font-bold uppercase tracking-widest text-slate-400"
              htmlFor="institution-select"
            >
              Find your Institution
            </label>
            <div className="relative max-w-md">
              <select
                className="w-full appearance-none rounded-xl border-none bg-surface-container-lowest px-4 py-3 ring-1 ring-outline-variant/20 focus:ring-primary"
                id="institution-select"
                name="institution"
              >
                <option>Select your College</option>
                <option>Ivy League University</option>
                <option>Grand Heritage Institute</option>
                <option>Modern Tech Academy</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-400">
                expand_more
              </span>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="aspect-square rotate-3 overflow-hidden rounded-[2rem] shadow-2xl transition-transform duration-700 hover:rotate-0">
            <img
              alt="Alumni networking in a modern atrium"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB-z9zFT8E4rog5OKlUmvt9UCGQX84ZePq_wY9UQR2u2_ZU05abyhKrk7Cjw-6zdjpFPdHsKcBoJyebCk_nTvXjawYBllFbVDgwcp5KUvQf64KrwDeu3B8CXLAokaLSs8FVCV7qE4cw5WbDkyRbXkikKkIJTFVqemJ-No_50PagZl13NndSk5Dc_wn6G7SlRDhwyLlPExAopmBYGqUn4Ia4PFDUohwlv6M1T6hO65mh5XtopefDNpsPdNRQcvBKAIsbqNtWNh4K3w"
            />
          </div>

          <div className="absolute -bottom-8 -left-8 max-w-xs -rotate-3 rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <div className="mb-3 flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <span className="text-sm font-bold">Verified Network</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Every profile on AlumniConnect is manually verified against institution
              records for absolute trust.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
