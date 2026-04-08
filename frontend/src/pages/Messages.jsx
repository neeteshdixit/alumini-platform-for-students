const conversationList = [
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    preview: 'Looking forward to the alumni gala!',
    time: '12:45 PM',
    active: true,
    online: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBPo0-pu5vnk_re-aA4FujAUugMJi2QaF3Td90DmEYr1L6jJ9_Q_0hqbcvHDvyV5PzJIc2CfhbjetjYKIWFXwwC-9_k9mswGCrVmM7T_NL1CuWvAobHSpSaTejueSvYyhCfNTQ1uVNsDjuLJmus0lOKuTsKiyPNKAnqYN5mBjVekvvxT4I259Vigc4JLVjqi2jyWlLWf-_xoQJm4LbrXZcT28pD1A6pzCmy9OWdwKSGzmo6A8DVES_odKvW6MHOfKzb87Mu7oxB6GM',
  },
  {
    id: 'david',
    name: 'David Chen',
    preview: 'The mentorship program details are attached...',
    time: 'Yesterday',
    active: false,
    online: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA0af8Uv2TgSTq43SHMtJiL5dYmJjre8tQFqG0iQKnflgv4bYGVhB-6ROdAIhvgIjG0taIhF4zrkSXcGw7eYMtrUOtHgARv8JoodUWj77KuizJx4HnDiq-91juJv1cU6jngdrOEZJPnjUyWBHtQhGYmqBMOQktxKVa5RUTKAsuVNZxSIwnMbNwQnpU3fPR0kRpm4903TNK1h9tQma07klwHe6KU6nFsJ43f4tDcO9pgIuF19sSo3p-Ah76awea5WAHJg8vDabj5lY',
  },
  {
    id: 'elena',
    name: 'Elena Rodriguez',
    preview: "Thanks for the referral, I'll check it out!",
    time: 'Tue',
    active: false,
    online: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBTNBS2mDKbXBEZ5RIXgBAxN7vicSRhERpZB1xcHKpXhrGcFCczJCMYOmoPz3r9axbuJDTC9FxXwQXwJHEpO_r998TZUtAVWJJ2K93xVBIf0VIv86WiRRVWRyVq_iJUJDX-kpycZWUghAniirq1pfr0DdGaR_IOYphFvKntqv-S7NfCjO0-D_dfKS7-NY_lLAEZd0aCACQwLf64JW67CezbPHqZqxfzIr-SRwG9RCvKDEvaJqn7RxtM0po8oZQtPJcRccHvssfUsrE',
  },
]

function Messages() {
  return (
    <div className="bg-background text-on-surface selection:bg-primary-fixed">
      <div className="flex h-screen overflow-hidden">
        <aside className="fixed top-0 left-0 z-40 hidden h-screen w-64 flex-col bg-slate-50 p-6 text-sm font-medium text-blue-900 dark:bg-slate-950 dark:text-blue-100 md:flex">
          <div className="mb-8 text-lg font-black text-blue-900 dark:text-white">
            AlumniConnect
          </div>
          <nav className="flex-1 space-y-2">
            <a className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:translate-x-1 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50" href="/dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </a>
            <a className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:translate-x-1 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50" href="/search">
              <span className="material-symbols-outlined">search</span>
              <span>Search</span>
            </a>
            <a className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 font-semibold text-blue-900 shadow-sm transition-all hover:translate-x-1 dark:bg-slate-800 dark:text-white" href="/messages">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                chat
              </span>
              <span>Messages</span>
            </a>
            <a className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:translate-x-1 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50" href="/mentorship">
              <span className="material-symbols-outlined">school</span>
              <span>Mentorship</span>
            </a>
            <a className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:translate-x-1 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/50" href="/profile">
              <span className="material-symbols-outlined">person</span>
              <span>My Profile</span>
            </a>
          </nav>
          <button className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-container py-3 text-on-primary transition-transform active:scale-95" type="button">
            <span className="material-symbols-outlined">add</span>
            New Post
          </button>
        </aside>

        <main className="relative flex h-full flex-1 flex-col bg-surface-container-low md:ml-64">
          <header className="fixed top-0 right-0 z-30 flex h-16 items-center justify-between bg-white/80 px-8 shadow-[0_20px_50px_rgba(23,28,31,0.06)] backdrop-blur-md dark:bg-slate-900/80 md:left-64">
            <h1 className="text-xl font-bold tracking-tighter text-blue-900 dark:text-white">
              Messages
            </h1>
            <div className="flex items-center gap-6">
              <div className="relative hidden sm:block">
                <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-lg text-slate-400">
                  search
                </span>
                <input
                  className="w-64 rounded-full border-none bg-surface-container-lowest py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-primary-fixed"
                  placeholder="Search conversations..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-3">
                <img
                  alt="Current user avatar"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/10"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwnGrmQ7aJetyezIo8t0bd29OYAyzeu6tqSCn1t3XI2-gAZzwDYXcg4XnI7AQFntRLmEI5QG4-GJca4XPR2E-FWBXTmEIWuiH0xlW3Pg4dWqEgITy5EfUkuAtIqDRZUcu-wQWUJocp-zj5xlRS77s4-quQyRJwR5VVUuHQrtOtQ2lnSOY1X9i-VjGu9jOaFCvUrNqEJjD5m2CofLG83CCdS6WG_lDgmn4xjFWMxEAbs3qzbV9S_ACji-zHTO-eU05gEhMp3LxqD80"
                />
                <span className="material-symbols-outlined cursor-pointer text-slate-400 transition-colors hover:text-primary">
                  logout
                </span>
              </div>
            </div>
          </header>

          <div className="flex h-full flex-1 pt-16">
            <section className="flex w-full flex-col overflow-hidden border-r border-slate-200/20 bg-surface-container-lowest dark:border-slate-800/20 md:w-80 lg:w-96">
              <div className="p-6">
                <h2 className="mb-4 text-label-sm font-bold tracking-widest text-slate-400 uppercase">
                  Recent Conversations
                </h2>
                <div className="space-y-1">
                  {conversationList.map((chat) => (
                    <div
                      className={`flex cursor-pointer items-center gap-4 rounded-xl p-4 transition-all ${
                        chat.active
                          ? 'border-l-4 border-primary bg-secondary-container/30'
                          : 'hover:bg-surface-container-low'
                      }`}
                      key={chat.id}
                    >
                      <div className="relative">
                        <img
                          alt={`${chat.name} avatar`}
                          className="h-12 w-12 rounded-full object-cover"
                          src={chat.image}
                        />
                        <span
                          className={`absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white ${
                            chat.online ? 'bg-green-500' : 'bg-slate-300'
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between">
                          <h3 className="truncate font-medium text-on-surface">{chat.name}</h3>
                          <span className="text-[10px] text-slate-400">{chat.time}</span>
                        </div>
                        <p
                          className={`truncate text-sm ${
                            chat.active ? 'font-semibold text-primary' : 'text-on-surface-variant'
                          }`}
                        >
                          {chat.preview}
                        </p>
                      </div>
                      {chat.active && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="hidden flex-1 flex-col overflow-hidden bg-surface md:flex">
              <div className="flex items-center justify-between bg-surface-container-lowest px-8 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      alt="Sarah Jenkins avatar"
                      className="h-10 w-10 rounded-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuArKkBdlY7vLLYSsuCT4Mt_ly5-sypBSQIa--3dt1x33mMn6s821hFM0UijL_n6kM71WH7ARa58I-bncRPIa8i24mMDz8iHl0pqQF9kJxy8Aa5xhyhDEuD41OdyatF-qj-r0GSaC1pjAG6JMxBsbqDlB1-B2Nk92O6vqMclIvLVowDVrgRGVD-VlyXF22Qna1fPU4GN9dJ9EhE975SfzVvgk7o8TsvZRjyi3EhRc5FNKmngaLewwicBTJS6lEy0vd_0e3Lw5uGuFZw"
                    />
                    <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                  </div>
                  <div>
                    <h2 className="leading-tight font-bold text-on-surface">Sarah Jenkins</h2>
                    <p className="text-xs font-medium text-green-600">Online now</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {['videocam', 'call', 'info'].map((icon) => (
                    <button
                      className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
                      key={icon}
                      type="button"
                    >
                      <span className="material-symbols-outlined">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-8 overflow-y-auto bg-slate-50/30 p-8">
                <div className="flex justify-center">
                  <span className="rounded-full bg-surface-container px-4 py-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    October 24, 2024
                  </span>
                </div>

                <div className="flex max-w-[80%] items-end gap-3">
                  <img
                    alt="Sarah avatar small"
                    className="h-8 w-8 rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrWQgdcRCxuvB9vGIPUPsbvwc7i3-85EUKg5nJGd4AuSSv-OyztOnvHBnpiySFxpTe_0E0_AQp2r8AqMpSTe-81GVKvpzSkPCQOt7UpZVJ9x1hCw87Mwp0hXRLhV4UjFRxOI1HWa1um6mdKG1lYrszIt60AoopxRmKUo2Q0EOlIaJDabqOIuI6UcbINWVUpDwnlMELbsTXReghsq-rgi5EWjVRTBGGPN1_heKzA6dBNyjRvOvQb-RjmYippMmf_dh90mKYNp2CNr8"
                  />
                  <div className="space-y-1">
                    <div className="rounded-2xl rounded-bl-none bg-white p-4 text-sm leading-relaxed text-on-surface shadow-sm dark:bg-slate-800">
                      Hi there! I just saw the invitation for the Class of &apos;15 reunion.
                      Are you planning to attend this year?
                    </div>
                    <span className="px-1 text-[10px] text-slate-400">12:40 PM</span>
                  </div>
                </div>

                <div className="ml-auto flex max-w-[80%] flex-row-reverse items-end gap-3">
                  <div className="space-y-1 text-right">
                    <div className="rounded-2xl rounded-br-none bg-gradient-to-br from-primary to-primary-container p-4 text-sm leading-relaxed text-on-primary shadow-md">
                      Absolutely! I wouldn&apos;t miss it. I heard they are hosting it at the
                      new waterfront venue this time.
                    </div>
                    <div className="flex items-center justify-end gap-1 px-1">
                      <span className="text-[10px] text-slate-400">12:42 PM</span>
                      <span className="material-symbols-outlined text-[14px] text-primary">
                        done_all
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex max-w-[80%] items-end gap-3">
                  <img
                    alt="Sarah avatar small second"
                    className="h-8 w-8 rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqu9B6Mbn98tta94-px_SIhdymiCK9dmbfdEAtWWEDwAssTUWVE_byrP2yblCjhkZ0DdA4LLHz6vMg2Bsl2SwSt-YTYAbvgo84jr2BOMApBIh3NRaDDX7_zZY-psj5PD7OWbhy8dF6M39JXk4jXhtyqdmi1FFqy5e4F5qBHDiPOSBIT3VPsIJrFRL-sIh8xi8oAuqpbi1c45H5E89YIP3oTO3rT9Gt68uAFXP8dNfvMNtPd5x9vv6WTbbJk_JzxWhovECktVBtcHc"
                  />
                  <div className="space-y-1">
                    <div className="rounded-2xl rounded-bl-none bg-white p-4 text-sm leading-relaxed text-on-surface shadow-sm dark:bg-slate-800">
                      Yes! It looks amazing. Check out the preview they sent:
                      <div className="mt-3 overflow-hidden rounded-lg border border-slate-100">
                        <img
                          alt="Waterfront venue preview"
                          className="h-48 w-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkN0wPu38UYoe7mwy_LPbnj7f7ljiDv10DcvMOABn2NaOXLikUrnXb4Gu_fUv5sXpGHgg9LrUfLJijUTETnGYyv9NDaL2xzaDdBD9iCCABSt5_E38yGyvfKZQu3yRXXaHWCan-SSS8ByWiaJpYxTP3VripcmPHtF1FTOcZrd-fIveUaz6ukayiY3DZPcE_JsJEl91ED2MYX6gPyFXjQwMLLBIM4qsFR55Z6tZal6Nly4dddKBI3-ZnthAGUX5WnMsjSB4mzvQui8w"
                        />
                      </div>
                    </div>
                    <span className="px-1 text-[10px] text-slate-400">12:44 PM</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200/10 bg-surface-container-lowest p-6">
                <div className="mx-auto flex max-w-4xl items-end gap-4">
                  <div className="flex gap-2 pb-2">
                    <button className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary" type="button">
                      <span className="material-symbols-outlined">add_circle</span>
                    </button>
                    <button className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary" type="button">
                      <span className="material-symbols-outlined">mood</span>
                    </button>
                  </div>
                  <div className="relative flex-1">
                    <textarea
                      className="max-h-32 w-full resize-none rounded-2xl border-none bg-surface-container-low px-5 py-3 text-sm focus:ring-2 focus:ring-primary-fixed"
                      placeholder="Type your message here..."
                      rows="1"
                    />
                  </div>
                  <button className="mb-1 rounded-xl bg-primary p-3 text-on-primary shadow-lg transition-all hover:shadow-primary/20 active:scale-95" type="button">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      send
                    </span>
                  </button>
                </div>
              </div>
            </section>
          </div>

          <nav className="fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around bg-white/80 px-4 backdrop-blur-md dark:bg-slate-900/80 md:hidden">
            <a className="flex flex-col items-center gap-1 text-slate-400" href="/dashboard">
              <span className="material-symbols-outlined">dashboard</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-slate-400" href="/search">
              <span className="material-symbols-outlined">search</span>
            </a>
            <a className="flex flex-col items-center gap-1 border-b-2 border-blue-900 pb-1 font-bold text-blue-900 dark:border-blue-400 dark:text-blue-400" href="/messages">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                chat
              </span>
            </a>
            <a className="flex flex-col items-center gap-1 text-slate-400" href="/mentorship">
              <span className="material-symbols-outlined">school</span>
            </a>
            <a className="flex flex-col items-center gap-1 text-slate-400" href="/profile">
              <span className="material-symbols-outlined">person</span>
            </a>
          </nav>
        </main>
      </div>
    </div>
  )
}

export default Messages
