import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      badge: "Step 1: Auth",
      title: "Verify Your College Identity",
      desc: "Sign up with your official college email or roll number. This confirms your institutional identity and keeps the network 100% spam-free.",
      meta: "⏱️ Takes < 60 seconds",
    },
    {
      step: "02",
      badge: "Step 2: Discovery",
      title: "Filter Seniors by Dream Role",
      desc: "Search through verified alumni by target company (Google, Microsoft, Amazon), job titles (SDE, PM, Data Science), and graduation batches.",
      meta: "🎯 10,000+ Alumni Directory",
    },
    {
      step: "03",
      badge: "Step 3: Outcome",
      title: "Book 1-on-1 or Request Referral",
      desc: "Pick an available calendar slot for a 20-minute mock interview, or send a structured referral request that gets reviewed within 48 hours.",
      meta: "⚡ 45%+ Guaranteed Response",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
            Frictionless Flow
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How AlumConnect Works
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            From campus fresher to your dream company offer letter in three simple, transparent steps.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50/70 hover:bg-white rounded-2xl p-8 border border-slate-200/80 
                         hover:border-blue-300 hover:shadow-xl hover:-translate-y-2 
                         transition-all duration-300 flex flex-col justify-between group cursor-default"
            >
              <div>
                {/* Step Number Top Row */}
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                    {item.badge}
                  </span>
                </div>

                {/* Step Title & Details */}
                <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Step Meta Footer */}
              <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center text-xs font-medium text-slate-500">
                <span>{item.meta}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
