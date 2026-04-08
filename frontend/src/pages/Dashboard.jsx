const recentChats = [
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    message: 'Thanks for the mentorship advice!',
    time: '2m',
    online: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1PAIxiaqtFvV6y-PQov1_jbMqvtnQx6zj0_kcaeuN6Kf_jAE2HcwKpPa_mCarlv4qWsMkGlCB5wfFcNcgscOar1YKXc1uHzI4Pu4kynPtKxOI6kHvmZsL4JG2euCbsU00Lt9yvUXbPXarlNrGi_0R75yeyYsOKAi0hwrkJ0TXzv7zFGpXtjYh8hDN0cndQRoqagIiromnSX_TJWwO3vqvR-LUX5PaZ4EcrXKd_trb1dOsBMi9mUWLZc4yfC8mWlmgO0J1S2aXQtc',
  },
  {
    id: 'david',
    name: 'David Lowery',
    message: 'Are you attending the gala?',
    time: '1h',
    online: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKs9bhiNq-0ThrxLrYynCVzp6UgNYs-WL_SEzpdTe6Gkr5G3EAQ79sR2ZgmgLgoPDuPIZsPnTKLHx2Nys0j1yOIu-tWwgezvHf68owJMAPQ3y4BvRiMsBxFTMSFyVkQaCFUyK1AsmSHXd-EloIZ_kMoW438Omt7oLXr-4CHUqT05UxTzuZHRB-q4Pv_-nbpEXTYiQawzFe6EsVs__oJ1FMbrIhgiosSsz9eYRvecrwf8DPkRMCZ_log3SdsvmBnMli-vBMwbqtpCg',
  },
]

const mentorCards = [
  {
    id: 'robert',
    name: 'Robert Vance',
    role: 'Senior Director @ Adobe',
    tags: ['Product', 'Design'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCrN4bwln4WfR6b9CxWfA6Dc688kwsBrqh_tsOPgsncRMyC1gkLQqBDE_nm5ISAUyr3sEsE45cDv9RYpHlPuVl7RITDMvNAtgc7ciaZFdasTdjCq2ajxpeNOBFc0OS8A7pb0FnHoMYrBBiq_lapcRrK1asslZsurUJj2HDWE8yzEkFjLcXLxmZp_2z5rpb7S5z_LUMavucrrJrx7k8XNOPSuQf1a2dzIVdt2UAvHA4wdeKg7FOJKiYvw-kdhGStK-S-50KnSpT2gvo',
  },
  {
    id: 'elena',
    name: 'Elena Rodriguez',
    role: 'Founder of FlowState',
    tags: ['Startup', 'Leadership'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCfb_tINaLpMWxdziKDpx2BIfq78odAqc-Nox0TwEgjHj7W5VJs4-Z_QGxVs0TZmBGFsc-991l10upfEm1mucRzWPqXlTg780xTlvqTqwsbEbUwk_eerAUjPDDfvTe0daOPUdbTZixI-4DT49iWLbUuZLj7Xyw3IK054XcVcLINBZjhYoKL6cfyt2x8K_TojK5llZcfkiLhwvdaMr1LB4yj58utnft3NsimC2BzCpKZ4TsegjyLyS4a7aOmWEFrFnQUYzfIsRsdJrA',
  },
  {
    id: 'marcus',
    name: 'Marcus Thorne',
    role: 'VP of Sales @ Shopify',
    tags: ['Growth', 'Strategy'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdMI4CNVBKgi9BSCEf3bS0NvoKBw6oafTFDQo6hVPMoV8cdACvUflAktDfF9vorbaYaLIThENQFOv_sbor8Diqhw32KR-Lad-4S-AL3HjS-l1uPR-DO5gnCzr1gMU5bQw8Fd88uCKZfKrRosW0WnnoWHq4ihFj8n_G7QnPjpCT0E0RxBsMsMoNK4gu219QIyHzRZcBWoLmRYTE0TQhP3LbLfBHcTVwbADNNxVIfjgobEKbTCUm5gpfmIcmdpMALtBAsP96AIniCH0',
  },
]

function Dashboard() {
  return (
    <div className="bg-surface text-on-surface antialiased transition-colors duration-300">
      <aside className="fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col bg-slate-50 p-6 text-sm font-medium dark:bg-slate-950 md:flex">
        <div className="mb-8 text-lg font-black tracking-tighter text-blue-900 dark:text-white">
          AlumniConnect
          <div className="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            The Digital Curator
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <a
            className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 font-semibold text-blue-900 shadow-sm dark:bg-slate-800 dark:text-white"
            href="/dashboard"
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </a>
          <a
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:translate-x-1 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
            href="/search"
          >
            <span className="material-symbols-outlined">search</span>
            Search
          </a>
          <a
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:translate-x-1 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
            href="/messages"
          >
            <span className="material-symbols-outlined">chat</span>
            Messages
          </a>
          <a
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:translate-x-1 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
            href="/mentorship"
          >
            <span className="material-symbols-outlined">school</span>
            Mentorship
          </a>
          <a
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:translate-x-1 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50"
            href="/profile"
          >
            <span className="material-symbols-outlined">person</span>
            My Profile
          </a>
        </nav>

        <button
          className="mt-auto w-full rounded-xl bg-gradient-to-br from-primary to-primary-container py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all active:scale-95"
          type="button"
        >
          New Post
        </button>
      </aside>

      <main className="flex min-h-screen flex-col md:ml-64">
        <header className="fixed top-0 right-0 z-50 flex h-16 items-center justify-between bg-white/80 px-8 tracking-tight shadow-[0_20px_50px_rgba(23,28,31,0.06)] backdrop-blur-md dark:bg-slate-900/80 md:left-64">
          <div className="hidden md:block">
            <h1 className="text-xl font-bold tracking-tighter text-blue-900 dark:text-white">
              AlumniConnect
            </h1>
          </div>

          <div className="flex flex-1 items-center justify-end gap-6">
            <div className="relative hidden w-full max-w-xs sm:block">
              <span
                className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                style={{ fontSize: '18px' }}
              >
                search
              </span>
              <input
                className="w-full rounded-full border-none bg-slate-100/50 py-2 pr-4 pl-10 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 dark:bg-slate-800/50"
                placeholder="Search the network..."
                type="text"
              />
            </div>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-slate-800">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-bold text-blue-900 dark:text-white">Alexander Chen</p>
                <p className="text-[10px] text-slate-500">Class of &apos;21</p>
              </div>
              <img
                alt="User profile avatar"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm dark:ring-slate-800"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz92YByoUtYp3awQGD2sEx8l92DgyJ6hzn570NLuLgV_UaHMhz-1I7PgiALXxnLZKU1CBH5L80S3y5b55SqGevg-MrIOCFXqx5vbLDj-Vqo6zkLXZFh2KZWgQ90pQEh2-lOsy4kQVqHudsRmWeCxx36RiapgWb8Q8ZFE2JcrffvlUJF1NmZkwoMl2pqi81Fz3r06n1ZNb_IsZD_dYCf4kpx7qTbGQfPBymCLHa4OzgkMqyWwKBtTj1VNgMzkjLYiH3cTleCIA0mHY"
              />
            </div>
          </div>
        </header>

        <div className="mx-auto mt-16 w-full max-w-7xl space-y-12 p-8 lg:p-12">
          <section>
            <p className="mb-4 text-[10px] font-bold tracking-widest text-blue-600 uppercase">
              Welcome back to the legacy
            </p>
            <h2 className="text-4xl leading-tight font-black tracking-tight text-primary md:text-6xl">
              Hello,{' '}
              <span className="bg-gradient-to-r from-blue-900 to-blue-400 bg-clip-text text-transparent">
                Alexander
              </span>
              .
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed font-medium text-on-surface-variant">
              Explore new opportunities within your alumni network. 42 alumni from your
              department joined this week.
            </p>
          </section>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-4">
              <div className="rounded-2xl bg-surface-container-low p-8">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-primary dark:text-white">Recent Chats</h3>
                  <span className="cursor-pointer text-xs font-bold text-blue-600 hover:underline">
                    View All
                  </span>
                </div>
                <div className="space-y-6">
                  {recentChats.map((chat) => (
                    <div
                      className="group flex cursor-pointer items-center gap-4 transition-transform duration-200 hover:translate-x-2"
                      key={chat.id}
                    >
                      <div className="relative">
                        <img
                          alt={`${chat.name} avatar`}
                          className="h-12 w-12 rounded-full object-cover"
                          src={chat.image}
                        />
                        {chat.online && (
                          <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-surface-container-low bg-emerald-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-primary dark:text-white">
                          {chat.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">{chat.message}</p>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">{chat.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
                  <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Network
                  </p>
                  <p className="text-2xl font-black text-primary">1.2k</p>
                </div>
                <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
                  <p className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Events
                  </p>
                  <p className="text-2xl font-black text-primary">04</p>
                </div>
              </div>
            </div>

            <div className="space-y-8 lg:col-span-8">
              <div className="flex items-center gap-4 rounded-2xl border border-outline-variant/5 bg-white p-6 shadow-sm dark:bg-slate-900">
                <img
                  alt="Your avatar"
                  className="h-10 w-10 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtgtI9V89gG7IDFPH-z9F4EH3jske1Q8y1oflJygRmaYstOFjUR5p18vfU3oouQ0H2LeM7ke6YYazM5G5aVl9slDtFafVPpBO1C3QgtMfBumuW2ajiTKqK3L9Q2yXHh4aJk-7IAolsbYP1EzBAwNKajuZD2nyGvWIvTSfv-RxFEuVpG9WCXPqksFHrN59hfDSPC1tpF-odSgGzW-c-brFh0chX9Xi6syXkdcc7tExrf3-P0K_-QvpqzQdfLzjQJg9f7lMD1HS3Nmw"
                />
                <div className="flex-1 cursor-text rounded-full bg-slate-50 px-5 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-100 dark:bg-slate-800">
                  What&apos;s happening in your professional world?
                </div>
                <button
                  className="material-symbols-outlined text-slate-400 transition-colors hover:text-primary"
                  type="button"
                >
                  image
                </button>
              </div>

              <article className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm transition-shadow duration-500 hover:shadow-xl">
                <div className="p-8">
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex gap-4">
                      <img
                        alt="Amanda Stark"
                        className="h-12 w-12 rounded-xl object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5xKSuy2VpXkpFmPtU3Cgye_-Z08gwpw3Wc6dWZSTAFhnleowxs4ycdc4-LzhcOSr-ciIGjPzN5Bw24s1B9fRsMMJtP72hs8qfrOf8hcmD46yCCepkZQvy2GTs_9PMvr1EZcxDJzL47-hY5LYB94aKNJQgc71opc8kYUdbhLvgYLVfKUFzZGkIg01du5pPiiYEid6eVXdPWXvqRnW9b8QCCQ0Lh0HWEakxJuis3sO1oMCENahy4-4mgXKnDY7EOXX6cB9CH8odhNE"
                      />
                      <div>
                        <h4 className="text-base font-bold text-primary dark:text-white">
                          Global Tech Summit 2024
                        </h4>
                        <p className="text-xs text-slate-500">
                          Posted by <span className="font-bold text-blue-600">Amanda Stark</span>{' '}
                           |  2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full bg-secondary-container px-3 py-1 text-[10px] font-bold tracking-widest text-on-secondary-container uppercase">
                      Event
                    </div>
                  </div>

                  <p className="mb-6 leading-relaxed text-on-surface-variant">
                    Excited to announce our annual alumni tech gathering. This year we&apos;re
                    focusing on the intersection of AI and Ethics in the workplace.
                  </p>

                  <div className="relative mb-6 aspect-video overflow-hidden rounded-xl">
                    <img
                      alt="Conference hall visual"
                      className="h-full w-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHnbsuggyaDiT1BUEWUXKc0ca_NCZT2IsfH5cs1Qq0ZPwMmPMFSOhZwPGudmv7r8lyVIe87MXwR_Ma3WeBqZK1cZQpIHiU98r9cSt-SsyfM0wtVjbYzV0qqbwPUqCvyY2CUn28dXbXaicpQX8rXyc2rj8et8h5K7ju1u1mx0Z61AQWf5igOF5gzPCVFog5lZiW6aTlyXumH_z7kLQXb4dfAtzK9CYd4qmQY1cUcouFAiVyFMpwb7rAy1w4OTjRn7UeTokcpfPDe6c"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                  </div>

                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-blue-600" type="button">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        favorite
                      </span>
                      124
                    </button>
                    <button className="flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-blue-600" type="button">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        chat_bubble
                      </span>
                      18
                    </button>
                    <button className="ml-auto flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-blue-600" type="button">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        share
                      </span>
                    </button>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl bg-surface-container-lowest p-8 shadow-sm">
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
                      <span className="material-symbols-outlined">school</span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-primary dark:text-white">
                        Mentorship Milestone
                      </h4>
                      <p className="text-xs text-slate-500">System Update  |  5 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border-l-4 border-blue-900 bg-slate-50 p-6 dark:bg-slate-800">
                  <p className="text-sm leading-relaxed font-medium italic text-on-surface-variant">
                    &quot;Your profile matches 5 new students seeking guidance in Digital
                    Strategy.&quot;
                  </p>
                </div>
                <button className="group mt-6 flex items-center gap-2 text-sm font-black text-blue-900 dark:text-blue-400" type="button">
                  View Matches
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>
              </article>
            </div>
          </div>

          <section>
            <div className="mb-8 flex flex-col items-end justify-between gap-6 md:flex-row">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-primary dark:text-white">
                  Suggested Mentors
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Based on your shared history in Marketing
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-slate-400 transition-colors hover:bg-slate-100" type="button">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-container" type="button">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="-mx-2 flex gap-6 overflow-x-auto px-2 pb-4 no-scrollbar">
              {mentorCards.map((mentor) => (
                <div
                  className="group flex min-w-[280px] flex-col items-center rounded-2xl border border-outline-variant/10 bg-white p-6 text-center shadow-sm transition-all hover:border-blue-900/20 dark:bg-slate-900"
                  key={mentor.id}
                >
                  <img
                    alt={`${mentor.name} headshot`}
                    className="mb-4 h-20 w-20 rounded-full object-cover"
                    src={mentor.image}
                  />
                  <h5 className="font-bold text-primary dark:text-white">{mentor.name}</h5>
                  <p className="mb-4 text-xs text-slate-500">{mentor.role}</p>
                  <div className="mb-6 flex gap-2">
                    {mentor.tags.map((tag) => (
                      <span
                        className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-bold tracking-tighter text-slate-500 uppercase dark:bg-slate-800"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="w-full rounded-lg bg-surface-container-highest py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white" type="button">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-auto flex w-full flex-col items-center justify-between gap-4 border-t border-slate-200/20 bg-slate-100 px-8 py-12 text-xs tracking-widest uppercase dark:border-slate-800/20 dark:bg-slate-950 md:flex-row">
          <div className="font-bold text-blue-900 dark:text-white">AlumniConnect</div>
          <div className="text-slate-400 dark:text-slate-500">
            (c) 2024 AlumniConnect. Building a Legacy.
          </div>
          <div className="flex gap-8">
            <a
              className="text-slate-400 transition-colors hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-300"
              href="#"
            >
              About Us
            </a>
            <a
              className="text-slate-400 transition-colors hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-300"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-slate-400 transition-colors hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-300"
              href="#"
            >
              Contact
            </a>
          </div>
        </footer>
      </main>

      <nav className="fixed bottom-0 right-0 left-0 z-50 flex h-16 items-center justify-around border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900 md:hidden">
        <a className="flex flex-col items-center text-blue-900 dark:text-blue-400" href="/dashboard">
          <span className="material-symbols-outlined">dashboard</span>
        </a>
        <a className="flex flex-col items-center text-slate-400" href="/search">
          <span className="material-symbols-outlined">search</span>
        </a>
        <a className="flex flex-col items-center text-slate-400" href="/messages">
          <span className="material-symbols-outlined">chat</span>
        </a>
        <a className="flex flex-col items-center text-slate-400" href="/profile">
          <span className="material-symbols-outlined">person</span>
        </a>
      </nav>
    </div>
  )
}

export default Dashboard
