import React from "react";

export default function Stats() {
  const stats = [
    {
      value: "10,000+",
      label: "Verified Alumni",
      desc: "Working at Google, Microsoft, Amazon & more",
      badge: "Verified",
    },
    {
      value: "50+",
      label: "Partner Colleges",
      desc: "Tier-2 & Tier-3 engineering institutions",
      badge: "Pan-India",
    },
    {
      value: "45%+",
      label: "Avg Response Rate",
      desc: "Compared to <3% on traditional cold InMail",
      badge: "High Intent",
    },
    {
      value: "2,500+",
      label: "Mentorships Done",
      desc: "Resume reviews, mock tests & referral chats",
      badge: "Active",
    },
  ];

  return (
    <section className="py-12 bg-slate-50/60 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm 
                         hover:shadow-md hover:border-blue-300 hover:-translate-y-1 
                         transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight group-hover:scale-105 transition-transform duration-300">
                {item.value}
              </div>
              <div className="mt-2 text-sm sm:text-base font-semibold text-slate-900">
                {item.label}
              </div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
