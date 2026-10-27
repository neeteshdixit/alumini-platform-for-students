import React from "react";

export default function TrustLogos() {
  const companies = [
    { name: "Google", initials: "G", color: "hover:text-red-500" },
    { name: "Microsoft", initials: "MS", color: "hover:text-blue-500" },
    { name: "Amazon", initials: "AZ", color: "hover:text-amber-500" },
    { name: "Adobe", initials: "AD", color: "hover:text-rose-600" },
    { name: "Flipkart", initials: "FK", color: "hover:text-yellow-500" },
    { name: "Atlassian", initials: "AT", color: "hover:text-sky-500" },
  ];

  const collegeTrustBadges = [
    "🎓 50+ NAAC 'A++' Accredited Campuses",
    "🏛️ NIRF Top Ranked Engineering Colleges",
    "🤝 Official T&P Cell Integration",
  ];

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sub-heading */}
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400">
          Our verified alumni are building at world-class teams
        </p>

        {/* Company Logos Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14">
          {companies.map((item, index) => (
            <div
              key={index}
              className={`flex items-center space-x-2 text-slate-400 font-bold text-lg sm:text-xl tracking-tight 
                         transition-all duration-300 hover:scale-105 cursor-default select-none ${item.color}`}
            >
              <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-extrabold text-slate-600 border border-slate-200">
                {item.initials}
              </span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>

        {/* Institutional Trust Badges (College & Dean trust factor) */}
        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-medium text-slate-600">
          {collegeTrustBadges.map((badge, idx) => (
            <div
              key={idx}
              className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 shadow-xs"
            >
              <span>{badge}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
