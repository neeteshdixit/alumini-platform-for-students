const skills = [
  'Machine Learning',
  'Bioinformatics',
  'Python (PyTorch)',
  'Strategic Leadership',
  'Data Ethics',
  'Genomic Sequencing',
]

function Profile() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
      <nav className="fixed top-0 z-50 flex h-16 w-full max-w-full items-center justify-between bg-white/80 px-8 shadow-[0_20px_50px_rgba(23,28,31,0.06)] backdrop-blur-md dark:bg-slate-900/80">
        <div className="text-xl font-bold tracking-tight text-blue-900 dark:text-white">
          AlumniConnect
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a className="tracking-tight text-slate-500 transition-colors hover:text-blue-800 dark:text-slate-400" href="/search">
            Directory
          </a>
          <a className="tracking-tight text-slate-500 transition-colors hover:text-blue-800 dark:text-slate-400" href="#">
            Events
          </a>
          <a className="tracking-tight text-slate-500 transition-colors hover:text-blue-800 dark:text-slate-400" href="#">
            News
          </a>
          <a className="border-b-2 border-blue-900 pb-1 font-bold tracking-tight text-blue-900 dark:border-blue-400 dark:text-blue-400" href="/profile">
            My Profile
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            type="button"
          >
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
          </button>
          <div className="h-8 w-8 overflow-hidden rounded-full border border-outline-variant/20">
            <img
              alt="User profile avatar"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbOwUrsiCu8RHxCvsvhXMQNW018AVjh2mf1o95dJSQZNtryDkTcDuTHzzc1TMmsbNXK_2MIos9XoFj0Qm_A9hHLQaQNmTOvmTGPgHxN7QaVRGAwUi9pDlDMqvgLQOreIkPHAJCIj8Gn0pTCNjtB9S1gq7leK7jIfvpymZvIc19B1A05b8yy3pj2JY4AOQlwi0Xaz4DX8QrjoVUQBK-F89OfdzNYI56nY32-jrt3WMeyniSqte9tI5ibu7Zys4XfGKLBDa78N4jmkA"
            />
          </div>
          <button className="text-xs font-bold tracking-widest text-slate-500 uppercase transition-colors hover:text-blue-800 dark:text-slate-400" type="button">
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-24 pb-20 md:flex-row md:px-8">
        <aside className="flex flex-col gap-6 md:w-1/3">
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_50px_rgba(23,28,31,0.06)]">
            <div className="absolute top-0 left-0 h-24 w-full bg-gradient-to-br from-primary to-primary-container" />
            <div className="relative mt-8 flex flex-col items-center text-center">
              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-xl border-4 border-surface-container-lowest shadow-lg">
                  <img
                    alt="Profile image"
                    className="h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlkCU29GL0MF7Jp9O68ss0ZmCymckMTzTnU-dk2MYUc0HLyz743LZjWEzFxasuE32moroH9qDtbEG_G0DGRz4XCi8Ss6feac7h0gT__hzvrzQPBCZEiEaE2joNL0S2M1rBbkfg2DWys8WgMkyqYoEQvJGNEnblMw7VNlFSMm1s-qanX9jRXBsutuaf2qTV-Y39-Dwudg8LoWJn73_YkK0a5fo-JfJLXuVdqkhbWuyz4FB_dNuBhLI5mqbXhre2x1JJRFcaeTN5sqY"
                  />
                </div>
                <button
                  className="absolute right-2 bottom-2 rounded-lg bg-primary p-2 text-on-primary shadow-lg transition-all hover:scale-105 active:scale-95"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">upload</span>
                </button>
              </div>

              <div className="mt-6 w-full px-2">
                <input
                  className="w-full rounded-lg border-none bg-transparent p-1 text-center text-2xl font-bold tracking-tight text-on-surface focus:ring-2 focus:ring-primary/10"
                  defaultValue="Dr. Julian V. Sterling"
                  type="text"
                />
                <input
                  className="w-full rounded-lg border-none bg-transparent p-1 text-center text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/10"
                  defaultValue="Principal AI Researcher at Veridian Labs"
                  type="text"
                />
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="rounded-full bg-secondary-container px-3 py-1 text-[10px] font-bold tracking-wider text-on-secondary-container uppercase">
                    Class of &apos;12
                  </span>
                  <span className="rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">
                    PhD Genetics
                  </span>
                </div>
              </div>

              <div className="mt-8 w-full space-y-4 border-t border-outline-variant/10 pt-8">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <span className="text-sm">San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary">mail</span>
                  <span className="text-sm">j.sterling@alumni.edu</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary">link</span>
                  <span className="text-sm">scholar.google.com/sterling</span>
                </div>
              </div>

              <button
                className="mt-8 w-full rounded-lg bg-gradient-to-br from-primary to-primary-container py-3 font-bold text-on-primary shadow-lg transition-all hover:opacity-90 active:scale-95"
                type="button"
              >
                Save Profile Changes
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-surface-container-low p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-on-surface">Profile Strength</span>
              <span className="text-xs font-bold text-primary">85%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div className="h-full w-[85%] bg-primary" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-on-surface-variant">
              Complete your experience timeline to unlock the Legacy Mentor badge.
            </p>
          </div>
        </aside>

        <section className="flex flex-col gap-6 md:w-2/3">
          <div className="rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_50px_rgba(23,28,31,0.06)]">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-on-surface">Biography</h2>
            <textarea
              className="min-h-[120px] w-full rounded-xl border-none bg-surface-container-low p-4 text-sm leading-relaxed text-on-surface-variant focus:ring-2 focus:ring-primary/20"
              defaultValue="Passionate researcher focused on the intersection of deep learning and genomic sequencing. Over a decade of experience bridging the gap between academic theory and scalable industry applications."
            />
          </div>

          <div className="overflow-x-auto border-b border-outline-variant/10 pb-1">
            <div className="flex gap-8">
              <button className="border-b-2 border-primary pb-4 text-sm font-bold text-primary whitespace-nowrap" type="button">
                Experience
              </button>
              <button className="pb-4 text-sm font-medium whitespace-nowrap text-on-surface-variant transition-colors hover:text-on-surface" type="button">
                Skills &amp; Expertise
              </button>
              <button className="pb-4 text-sm font-medium whitespace-nowrap text-on-surface-variant transition-colors hover:text-on-surface" type="button">
                Achievements
              </button>
              <button className="pb-4 text-sm font-medium whitespace-nowrap text-on-surface-variant transition-colors hover:text-on-surface" type="button">
                Connections
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight text-on-surface">
                Professional History
              </h3>
              <button className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-primary transition-all hover:bg-primary-fixed-dim/20" type="button">
                <span className="material-symbols-outlined text-sm">add</span>
                Add Position
              </button>
            </div>

            <div className="relative space-y-8 pl-8 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-[2px] before:bg-surface-container-highest before:content-['']">
              <div className="group relative">
                <div className="absolute -left-[30px] top-1 z-10 h-5 w-5 rounded-full border-4 border-surface-container-lowest bg-primary" />
                <div className="rounded-xl bg-surface-container-low p-6 shadow-sm transition-colors group-hover:bg-surface-container-lowest group-hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-on-surface">Principal AI Researcher</h4>
                      <p className="text-sm font-medium text-primary">Veridian Labs  |  Full-time</p>
                    </div>
                    <span className="rounded bg-surface-container-high px-2 py-1 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                      2019  -  Present
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                    Leading a team of 15 researchers in developing transformer-based models for
                    protein folding predictions.
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -left-[30px] top-1 z-10 h-5 w-5 rounded-full border-4 border-surface-container-lowest bg-surface-container-highest" />
                <div className="rounded-xl bg-surface-container-low p-6 shadow-sm transition-colors group-hover:bg-surface-container-lowest group-hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-on-surface">Senior Data Scientist</h4>
                      <p className="text-sm font-medium text-primary">GenTech Solutions</p>
                    </div>
                    <span className="rounded bg-surface-container-high px-2 py-1 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                      2015  -  2019
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                    Architected core data pipelines for personalized medicine initiatives.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-surface-container-lowest p-8 shadow-[0_20px_50px_rgba(23,28,31,0.06)]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight text-on-surface">Core Expertise</h3>
              <button className="flex items-center gap-2 rounded-lg bg-primary-fixed px-4 py-2 text-xs font-bold text-on-primary-fixed transition-all hover:scale-105 active:scale-95" type="button">
                <span className="material-symbols-outlined text-sm">bolt</span>
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <div
                  className="group relative flex items-center gap-2 rounded-lg bg-secondary-container px-4 py-2 transition-all hover:pr-8"
                  key={skill}
                >
                  <span className="text-sm font-semibold text-on-secondary-container">{skill}</span>
                  <button className="absolute right-2 opacity-0 transition-opacity group-hover:opacity-100" type="button">
                    <span className="material-symbols-outlined text-xs text-on-secondary-container">
                      close
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex w-full flex-col items-center justify-between gap-4 border-t border-slate-200/20 bg-slate-100 px-8 py-12 dark:border-slate-800/20 dark:bg-slate-950 md:flex-row">
        <div className="font-bold tracking-tight text-blue-900 dark:text-white">AlumniConnect</div>
        <div className="flex gap-8">
          <a className="text-xs tracking-widest text-slate-400 uppercase transition-colors hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-300" href="#">
            About Us
          </a>
          <a className="text-xs tracking-widest text-slate-400 uppercase transition-colors hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-300" href="#">
            Privacy Policy
          </a>
          <a className="text-xs tracking-widest text-slate-400 uppercase transition-colors hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-300 underline" href="#">
            Terms of Service
          </a>
          <a className="text-xs tracking-widest text-slate-400 uppercase transition-colors hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-300" href="#">
            Contact
          </a>
        </div>
        <div className="text-[10px] tracking-widest text-slate-400 uppercase dark:text-slate-500">
          (c) 2024 AlumniConnect. Building a Legacy.
        </div>
      </footer>
    </div>
  )
}

export default Profile
