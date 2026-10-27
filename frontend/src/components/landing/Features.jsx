import React from "react";

export default function Features() {
  const features = [
    {
      title: "Institutional Boundary",
      desc: "Only verified students & alumni from your registered college. Zero spammers, zero fake profiles.",
      badge: "100% Verified",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: "Precision Senior Filter",
      desc: "Filter alumni by Branch (CSE, IT, ECE), Passing Batch (2018-2024), Company (FAANG, Unicorns), and Role.",
      badge: "Deep Directory",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      title: "2-Minute Smart Outreach",
      desc: "No more awkward cold DMs. Choose battle-tested outreach templates for resume review, referral, or roadmap guidance.",
      badge: "15x Response",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      title: "1-on-1 Mentorship & Referrals",
      desc: "Book directly on senior's Google Meet/Zoom calendar slots. Get internal referrals directly to HR hiring pipelines.",
      badge: "Real Outcomes",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            Why AlumConnect
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered to turn college pride into real job offers
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            LinkedIn is crowded with 1 billion strangers. AlumConnect is your private campus network where alumni actually respond.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm 
                         hover:shadow-xl hover:border-blue-300 hover:-translate-y-2 
                         transition-all duration-300 flex flex-col justify-between group cursor-default"
            >
              <div>
                {/* Icon Box with micro-bounce on card hover */}
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center 
                                group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 
                                transition-all duration-300 shadow-xs">
                  {item.icon}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                    {item.badge}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform duration-200">
                <span>Learn how it works</span>
                <span className="ml-1">→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
