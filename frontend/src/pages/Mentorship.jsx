import MentorshipNavbar from '../components/MentorshipNavbar'
import MentorshipSidebar from '../components/MentorshipSidebar'
import MentorshipCard from '../components/MentorshipCard'
import MentorshipRequestCard from '../components/MentorshipRequestCard'
import MentorshipFooter from '../components/MentorshipFooter'

function Mentorship() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
      <MentorshipNavbar />
      <MentorshipSidebar />

      <main className="lg:ml-64 pt-24 pb-12 px-6 md:px-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <span className="text-xs font-bold text-primary tracking-[0.2em] uppercase mb-2 block">
              Curation Hub
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-white tracking-tight leading-none mb-4">
              Empowering Generations.
            </h1>
            <p className="text-on-surface-variant max-w-2xl text-lg">
              Manage your connections, share your legacy, and track the progress of your professional growth journey.
            </p>
          </header>

          <div className="flex flex-wrap gap-4 mb-10 border-b border-outline-variant/10 pb-4">
            <button className="px-6 py-2 rounded-full bg-secondary-container text-on-secondary-container font-semibold text-sm transition-all hover:opacity-80">
              Active Mentorships
            </button>
            <button className="px-6 py-2 rounded-full text-slate-500 dark:text-slate-400 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              Incoming Requests (3)
            </button>
            <button className="px-6 py-2 rounded-full text-slate-500 dark:text-slate-400 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              Completed
            </button>
            <button className="px-6 py-2 rounded-full text-slate-500 dark:text-slate-400 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              Browse Mentors
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">Ongoing Journeys</h2>

              <MentorshipCard
                avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuC7CI4Fms0qo7NFX9eRTI2ojpIPfKcbFbQe3maW05baKMamC6lSrACo5Hh7Iw0w5e8DWutH0ruCW1VSvgnKvRCTqAzk4H8nfDJCahnrqp5S1N8eqOjIkVQFpRCO17GgQz9dMi7ziBUSEMsUQsEtLWzguetEUXEr-hn4Jx4HxitJ2EEKzJIJOr35iZZj1f9GkPKGL4PSZHWXK21nEr9vSjIkbpIuYvps9vbL3A86TQbJmjIPSiC-rdPWi87fWlqcLj-d5Xm0-Ev65Tw"
                avatarAlt="Mentee avatar"
                title="Elena Rodriguez"
                subtitle="Class of '22 • Software Architecture"
                badgeText="WEEK 6 OF 12"
                badgeClasses="px-3 py-1 bg-primary/5 text-primary text-xs font-bold rounded-full border border-primary/10"
                wrapperClass="border-primary dark:border-primary-fixed"
              >
                <div className="mb-8 p-4 bg-surface-container-low dark:bg-slate-800/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Current Milestone
                    </span>
                    <span className="text-xs font-bold text-primary">75% Complete</span>
                  </div>
                  <p className="text-sm text-on-surface leading-relaxed italic">
                    "Working on the microservices transition plan and finalizing the infrastructure diagram."
                  </p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div className="bg-primary h-full w-3/4 rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                      ER
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                      ME
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-primary font-bold text-sm hover:bg-primary/5 transition-colors rounded-lg" type="button">
                      <span className="material-symbols-outlined text-sm">description</span>
                      Log Session
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:shadow-lg transition-all active:scale-95" type="button">
                      <span className="material-symbols-outlined text-sm">chat</span>
                      Chat
                    </button>
                  </div>
                </div>
              </MentorshipCard>

              <MentorshipCard
                avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDNvV362a9WdjSdZGTPlW5tZFN3nGJ1qwhbYA7Are0yH1uyaglMAEMnQkKPQa82KcQ3MvUDwcOw6hvkMcqGLm4ZQjt991n4DWjlf4P6zFQCjZdzh5sa9aX4nVg0KXEh_9d2jpWSfN6Ui7U_3hq_PYnol7Cmo66IFiuT3zyx0t2PI20RtJRpI8jY70gXRi3hTlWLrPjJR2bG7Tl9JxqwvCxOnZehwDuSUZaOwO97scQcEIiG-CsURZn9QgmM8l1I9fAi_Si-61NZJgg"
                avatarAlt="Mentor avatar"
                title="Dr. Marcus Thorne"
                subtitle="Mentor • Fintech Leadership"
                badgeText="UPCOMING"
                badgeClasses="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-full"
                wrapperClass="border-slate-300 dark:border-slate-700 shadow-sm opacity-90"
              >
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                  Our next strategy review is scheduled for Thursday at 4:00 PM. Topic: Ethical AI implementation in consumer banking.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">event</span>
                    Dec 12, 16:00
                  </span>
                  <button className="px-6 py-2 border border-outline-variant text-on-surface font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors" type="button">
                    Reschedule
                  </button>
                </div>
              </MentorshipCard>
            </div>

            <div className="flex flex-col gap-8">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-primary dark:text-white">Requests</h2>
                  <a className="text-xs font-bold text-primary uppercase tracking-tighter hover:underline" href="#">
                    View All
                  </a>
                </div>
                <div className="space-y-4">
                  <MentorshipRequestCard
                    imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAHwW9nqYnCugylr-mnmV_CSnKM8jdUf5w3OG5IPtTPiEk0g8XKiC4yN-T6bRkcKQaMVlru99AE1mGP4EXimTWXL9YULUVR4qZgKhKimmLMvak7F0X5SljXDErMczGroYKcFd09uLbUVZuLpe7QoKgFhPk1lzABL65SUjIHgbdTgRkTRuZbwSSQ7pWa6SaTneZZ3A3uGAInxUHEv4jdrVDpr4JR1-R1Ty_IgeEBbM_5ke9swOSsx9G5cboRwvAtv2xXUtA8XP5Cqps"
                    imageAlt="Mentee request"
                    name="Julian Chen"
                    subtitle="B.S. Economics '24"
                    quote="I'm looking for guidance on transitioning from academia to market research..."
                  />
                  <MentorshipRequestCard
                    imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuCJHYTKXP-edZADbprirJ4en0aL3ZJ7If-jBfMm0yYM49DlDuG0hryUOfhA18YKlS-3Q54t5Seu0smdgzoo5aReGs7zjSUZayEI35Dv0QNuit7vwxkZcdtn-EfoMI6K-ghavxcwAfMZ2ziLauPmjyrOuj1n-r4rikeT2xX4uq-QhvxfdxgtVnhijnXq8LqHnUbZ2WIqqesHqIj4atYZtHcWfv0xugthqy8pXmkQaHIKj3CizLOuDAk09i-GX3MARwu7D1GsyD5DDag"
                    imageAlt="Mentee request"
                    name="Sarah Jenkins"
                    subtitle="MFA Design '23"
                    quote="Would love to discuss portfolio building for senior product roles."
                  />
                </div>
              </section>

              <div className="bg-primary text-white p-8 rounded-xl overflow-hidden relative group">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-2 block">
                    Your Impact
                  </span>
                  <div className="text-4xl font-black mb-2">420</div>
                  <div className="text-sm font-medium opacity-90">Hours of mentorship shared since 2018.</div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <span
                    className="material-symbols-outlined text-9xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    award_star
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MentorshipFooter />
    </div>
  )
}

export default Mentorship
