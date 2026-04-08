const alumniCards = [
  {
    id: 'elena',
    name: 'Elena Rodriguez',
    title: 'Senior UX Designer',
    org: 'Google  |  San Francisco, CA',
    batch: "Class of '18",
    tags: ['Systems Design', 'Mentoring'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC-7S_Znk71Uq9XkqX8RXCbEneYvi-esXx_-kkGV5XPFx1bzGkmxbEUpEEcA8w8DnzghCBJzoSwvfz4v-fEJv8U48WkgDRxm4MDJOajkJ2Ch-HIwuUmNjA2eFPGhe4eTZC22e157kXbbczitV8xdjK9hoONCAgMrFcgB5eSjg74YLAYiULea8pppyx1BCADkvU6ToB_av9s94aGRNIKnbEpybdTV9ifFCDP0p5xrtl8DdRcvJvH4zP1PTWfhg58koO9ZgWaNMt2j9Y',
  },
  {
    id: 'marcus',
    name: 'Marcus Thorne',
    title: 'VP of Engineering',
    org: 'Stripe  |  New York, NY',
    batch: "Class of '12",
    tags: ['Fintech', 'Scaling'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCtnFYSQ9a_qRpm-rdxZMc-EzEvp_gyI0_1YO3IZsXX14j8O7_lpgTcG6t4ysov-7_ES7DxPYXoP0BReTHwCr1Qz0tVUvAFgjGwK8u8l3MAlPOw8gDvsGrH3v5h4CBIPYmSgjwAz582Y5FzT-69o5-Nis1miNwGTLKpL1EDAF8ob4jV34RZ0lGy_G0r2Ge8PrvS9SzNH69JFA653ELnBVshI8F8ByuJp-RhTqHjQhZXAQ2IAdwD-FUR09LioE1b65mAg2ID9i8YfPw',
  },
  {
    id: 'sarah',
    name: 'Sarah Chen',
    title: 'Data Scientist',
    org: 'Tesla  |  Austin, TX',
    batch: "Class of '21",
    tags: ['AI/ML', 'Neural Networks'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDSMp91PhcMVR-fi0IskDcMvBNHFhiqi76DfSxELMfVg4i59X8xCHlAlOl8JxwM28pTEN0qvpTw-9N-2CDiLo8t0N5NGqyH_kpoLvXvyHWt2BJKGNWD1bLV9AFC6FwT7ku7-kl8lyzv7g-kdrgLPVJWR_7c_T-QH5eccQgJIjdKYj9Ui2m6vhjLdutSZKLgtAyUo-kKz1QFE70wnUNejs1wb5fnAu9guLbtwKV_hWLii6RIDF8CO0NnPpLbgzfjm4VaHN5PeF2GkXI',
  },
  {
    id: 'david',
    name: 'David Miller',
    title: 'Chief Legal Officer',
    org: 'Blue Origin  |  Seattle, WA',
    batch: "Class of '05",
    tags: ['IP Law', 'Governance'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDNq0WpuctmmnED2NszaWJUloE-LB6oia8XqysROWGQyfrKwipa5Sc99jPwus0Ks8e03i6-HjU_mJpESN5AjJT6ZTZCulPcrekGNGvAfWQRc7RCXLA-RHzRRghHs_c_djAqfIHoQA_G5_RH07S5pMBMnBl1g3mIWv4gEj8DuF5tidED1fOwWR_LQUMM7e6yU1Au5jR3Id3do-yEOwOqgREXb0m4h3g6uaCAL0Kt8xu2bIWFGDnua9AtE7-hdy63kWMQ4mf24yjhI-A',
  },
  {
    id: 'leila',
    name: 'Leila Al-Farsi',
    title: 'Renewable Energy Lead',
    org: 'Masdar City  |  Abu Dhabi',
    batch: "Class of '15",
    tags: ['Sustainability', 'Solar Tech'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAM0rFQoaDFD7gmJdfXepNAEEcc-z7fkII4ASbTtLWHDd-zYl6fJ1ZAxGVuYgvB6sV2JsxibJZKwsOmDJBSc2Pcg5yicR0F1TFvwN1YT4oAyp9LEMf437T5vTTr-l4DvyvUMf306xofC4kcrs8ItqNXduj5tb8pEBlpKB91dikn_UN8KyJ6_XOaEc69QxH63gQy7Xc_KRfAmwaVMcusj2fQVXBYBK9j7_W6KeAliL5-0zAwEhwlMREM96ufRwPSRrcZIY1YlqYWkJQ',
  },
  {
    id: 'james',
    name: 'James Sterling',
    title: 'Founder & CEO',
    org: 'Sterling Ventures  |  London',
    batch: "Class of '98",
    tags: ['VC', 'Philanthropy'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmj6T_OLelyM0DVqfW_F07LgoGQQUQi44qjAjFfsKH8SvECvWEVBaYGO1TyxbpCk4BCUW_2bdNzt5zjkKTe0IB9w4XviAg0C3ossNJ_8_SX_8vU4uJPbJmujKhOsI--C0mfrk68ye2E8yu4zcdHaRsmzcdjd-kqeG_iTsrAClrVrHHWLHI_-4aYXZGqUxai6-r5V9YCOHLFHw45iqm4XxZD1z3PD3QWTHAUejPuG66RF4N_UW-xMa-zPRdpsyJjBBSRr9K2AhlxuU',
  },
]

function Search() {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <nav className="fixed top-0 z-50 flex h-16 w-full max-w-full items-center justify-between bg-white/80 px-8 shadow-[0_20px_50px_rgba(23,28,31,0.06)] backdrop-blur-md dark:bg-slate-900/80">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-blue-900 dark:text-white">
            AlumniConnect
          </span>
          <div className="hidden items-center gap-6 md:flex">
            <a className="border-b-2 border-blue-900 pb-1 font-bold tracking-tight text-blue-900 dark:border-blue-400 dark:text-blue-400" href="/search">
              Directory
            </a>
            <a className="tracking-tight text-slate-500 transition-colors hover:text-blue-800 dark:text-slate-400" href="#">
              Events
            </a>
            <a className="tracking-tight text-slate-500 transition-colors hover:text-blue-800 dark:text-slate-400" href="#">
              News
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-outline-variant">
              search
            </span>
            <input
              className="w-64 rounded-xl border-none bg-surface-container-low py-2 pr-4 pl-10 text-sm transition-all focus:ring-2 focus:ring-primary"
              placeholder="Search the directory..."
              type="text"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-blue-900 transition-colors hover:bg-slate-100 dark:text-blue-100 dark:hover:bg-slate-800" type="button">
            Logout
          </button>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary-fixed">
            <img
              alt="User profile avatar"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFo-HTsjUeA16ZWHUz_AEecYv2eeKW_TPgpFpOFZ3nPFTE_8V1EJuwTZMEmprD3S7VwHqt5VlVuJ5q8My71Le7uCpCwJkWbriXBAPW3EvsYBgYNFDJQF6zjGbFZv16IuSTzLO5_hkBl2Cte59eH9TDJt-chCeMjF9S7Dw2ZDC9t7lSQBUPBy0b7pnhsGNvVe8iJa4JyLKNCol-Oyt8cA3wFpNQ5MoHV-H-VYnoX4dbkkpB_PTWUn8UcIxJVevCwFfyAL-gTqzhizA"
            />
          </div>
        </div>
      </nav>

      <aside className="fixed top-0 left-0 z-40 hidden h-full w-64 flex-col bg-slate-50 pt-24 dark:bg-slate-950 lg:flex">
        <div className="mb-8 px-8">
          <h2 className="mb-4 text-xs font-bold tracking-widest text-outline uppercase">
            Navigation
          </h2>
          <nav className="space-y-1">
            <a className="flex items-center gap-3 rounded-lg p-3 text-slate-500 transition-all hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50" href="/dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="text-sm font-medium">Dashboard</span>
            </a>
            <a className="flex items-center gap-3 rounded-lg bg-white p-3 font-semibold text-blue-900 shadow-sm dark:bg-slate-800 dark:text-white" href="/search">
              <span className="material-symbols-outlined">search</span>
              <span className="text-sm font-medium">Search</span>
            </a>
            <a className="flex items-center gap-3 rounded-lg p-3 text-slate-500 transition-all hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50" href="/messages">
              <span className="material-symbols-outlined">chat</span>
              <span className="text-sm font-medium">Messages</span>
            </a>
            <a className="flex items-center gap-3 rounded-lg p-3 text-slate-500 transition-all hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50" href="/mentorship">
              <span className="material-symbols-outlined">school</span>
              <span className="text-sm font-medium">Mentorship</span>
            </a>
            <a className="flex items-center gap-3 rounded-lg p-3 text-slate-500 transition-all hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50" href="/profile">
              <span className="material-symbols-outlined">person</span>
              <span className="text-sm font-medium">My Profile</span>
            </a>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container py-3 font-bold text-white transition-opacity hover:opacity-90" type="button">
            <span className="material-symbols-outlined text-sm">add</span>
            New Post
          </button>
        </div>
      </aside>

      <main className="min-h-screen pt-24 pb-12 lg:pl-64">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-primary">
                Find Alumni
              </h1>
              <p className="font-medium text-on-surface-variant">
                Connecting 24,000+ graduates across 85 countries.
              </p>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-surface-container-highest px-6 py-3 font-bold text-primary md:hidden" type="button">
              <span className="material-symbols-outlined">tune</span>
              Filters
            </button>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3 hidden space-y-8 md:block">
              <div className="space-y-6 rounded-2xl bg-surface-container-low p-6">
                <div>
                  <label className="mb-3 block text-xs font-bold tracking-widest text-outline uppercase">
                    Batch Year
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input className="w-full rounded-lg border-none bg-surface-container-lowest p-2 text-sm focus:ring-1 focus:ring-primary" placeholder="From" type="number" />
                    <input className="w-full rounded-lg border-none bg-surface-container-lowest p-2 text-sm focus:ring-1 focus:ring-primary" placeholder="To" type="number" />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-xs font-bold tracking-widest text-outline uppercase">
                    Department
                  </label>
                  <div className="space-y-2">
                    {['Computer Science', 'Business Admin', 'Mechanical Engineering'].map((dept) => (
                      <label className="group flex cursor-pointer items-center gap-3" key={dept}>
                        <input className="rounded border-outline-variant bg-white text-primary focus:ring-primary" type="checkbox" />
                        <span className="text-sm text-on-surface-variant transition-colors group-hover:text-primary">
                          {dept}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-xs font-bold tracking-widest text-outline uppercase">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Product Design', 'Data Science', 'Leadership', 'Python'].map((skill) => (
                      <span className="cursor-pointer rounded-full bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container transition-colors hover:bg-primary-fixed" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-outline-variant/10 pt-4">
                  <label className="flex cursor-pointer items-center justify-between">
                    <span className="text-sm font-bold text-primary">Open to Mentorship</span>
                    <input className="toggle toggle-primary bg-slate-300" type="checkbox" />
                  </label>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-9">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {alumniCards.map((alumni) => (
                  <article
                    className="group flex h-full flex-col rounded-2xl bg-surface-container-lowest p-5 transition-all hover:shadow-[0_20px_50px_rgba(23,28,31,0.06)]"
                    key={alumni.id}
                  >
                    <div className="relative mb-6">
                      <div className="mb-4 aspect-[4/3] overflow-hidden rounded-xl">
                        <img
                          alt={`${alumni.name} profile`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src={alumni.image}
                        />
                      </div>
                      <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black tracking-widest uppercase shadow-sm backdrop-blur">
                        {alumni.batch}
                      </span>
                    </div>

                    <div className="mb-auto">
                      <h3 className="text-lg font-bold tracking-tight text-on-surface">{alumni.name}</h3>
                      <p className="mb-1 text-sm font-semibold text-primary">{alumni.title}</p>
                      <p className="text-xs text-on-surface-variant">{alumni.org}</p>
                    </div>

                    <div className="my-4 flex flex-wrap gap-1">
                      {alumni.tags.map((tag) => (
                        <span className="rounded bg-surface-container-high px-2 py-0.5 text-[10px] font-medium text-on-surface-variant" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button className="rounded-lg bg-surface-container-highest py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white active:scale-95" type="button">
                        Message
                      </button>
                      <button className="rounded-lg bg-gradient-to-br from-primary to-primary-container py-2 text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95" type="button">
                        Mentorship
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-12 flex items-center justify-center gap-4">
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary transition-colors hover:bg-primary hover:text-white" type="button">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="text-xs font-bold tracking-widest text-outline uppercase">
                  Page 01 of 12
                </span>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary transition-colors hover:bg-primary hover:text-white" type="button">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-slate-200/20 bg-slate-100 px-8 py-12 dark:border-slate-800/20 dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="font-bold tracking-tighter text-blue-900 dark:text-white">
              AlumniConnect
            </span>
            <span className="text-xs tracking-widest text-slate-400 uppercase dark:text-slate-500">
              (c) 2024 AlumniConnect. Building a Legacy.
            </span>
          </div>
          <div className="flex gap-8">
            <a className="text-xs tracking-widest text-slate-400 uppercase transition-opacity hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-300" href="#">
              About Us
            </a>
            <a className="text-xs tracking-widest text-slate-400 uppercase transition-opacity hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-300" href="#">
              Privacy Policy
            </a>
            <a className="text-xs tracking-widest text-slate-400 uppercase transition-opacity hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-300" href="#">
              Terms of Service
            </a>
            <a className="text-xs tracking-widest text-slate-400 uppercase transition-opacity hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-300" href="#">
              Contact
            </a>
          </div>
        </div>
      </footer>

      <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 md:hidden">
        <a className="flex flex-col items-center justify-center text-slate-400" href="/dashboard">
          <span className="material-symbols-outlined">dashboard</span>
        </a>
        <a className="flex flex-col items-center justify-center font-bold text-blue-900" href="/search">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            search
          </span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400" href="/messages">
          <span className="material-symbols-outlined">chat</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400" href="/profile">
          <span className="material-symbols-outlined">person</span>
        </a>
      </nav>
    </div>
  )
}

export default Search
