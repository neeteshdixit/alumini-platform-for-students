import React from "react";

export default function Testimonials() {
  const reviews = [
    {
      stars: 5,
      quote:
        "LinkedIn par 50+ seniors ko cold message bheja tha, kisi ne reply nahi diya. AlumConnect par mere college ke senior Ayush bhaiya ne 2 din me reply kiya, mock interview liya aur Microsoft me referral dilwaya!",
      name: "Rohan Sharma",
      role: "3rd Year B.Tech CSE",
      college: "Tier-2 Engineering College",
      badge: "Placed at Microsoft",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      initials: "RS",
      avatarColor: "bg-blue-600",
    },
    {
      stars: 5,
      quote:
        "Hamesha apne campus ke juniors ki help karni thi, lekin LinkedIn par bohot random spam aate the. Yaha har student mere hi college se verified hota hai. Meine abhi tak 15+ juniors ke resume review kiye hain.",
      name: "Ananya Sen",
      role: "Senior SDE @ Amazon",
      college: "Alumni (Batch 2021)",
      badge: "Top Mentor (15+ Sessions)",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      initials: "AS",
      avatarColor: "bg-indigo-600",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            Real Proof
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Real outcomes from students like you
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            See how the bridge between campus juniors and industry seniors is changing career trajectories.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm 
                         hover:shadow-xl hover:border-blue-300 hover:-translate-y-2 
                         transition-all duration-300 flex flex-col justify-between group cursor-default"
            >
              <div>
                {/* 5 Stars Rating Row */}
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(item.stars)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Testimonial Quote */}
                <p className="mt-5 text-slate-700 text-base leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Row */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-11 h-11 rounded-full ${item.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-xs`}>
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {item.role} • {item.college}
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border shadow-2xs ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
