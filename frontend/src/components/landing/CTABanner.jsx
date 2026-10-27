import React from "react";

export default function CTABanner() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navy Gradient Card Container */}
        <div className="rounded-3xl py-16 px-6 sm:px-12 text-center flex flex-col items-center bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white shadow-2xl relative overflow-hidden border border-blue-800/40">
          
          {/* Subtle Ambient Glow Circles in Background */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Eyebrow Pill */}
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-300 bg-white/10 px-3.5 py-1 rounded-full border border-white/15 backdrop-blur-sm relative z-10">
            Join 10,000+ Students & Alumni
          </span>

          {/* Headline */}
          <h2 className="mt-5 text-3xl sm:text-5xl font-black tracking-tight max-w-3xl leading-tight relative z-10">
            Turn your college identity into career capital
          </h2>

          {/* Subtext */}
          <p className="mt-4 text-base sm:text-lg text-blue-100/80 max-w-2xl leading-relaxed relative z-10">
            Stop waiting weeks for cold LinkedIn rejections. Get direct guidance, resume reviews, and verified referrals from seniors who share your campus roots.
          </p>

          {/* Action Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto relative z-10">
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-950 hover:bg-blue-50 font-bold rounded-xl shadow-lg shadow-black/20 text-sm hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              Claim Your Campus Profile →
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 text-sm backdrop-blur-sm transition-all duration-300 cursor-pointer">
              Explore Alumni Directory
            </button>
          </div>

          {/* 3 Value Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-blue-200/90 font-medium relative z-10">
            <span className="flex items-center space-x-1.5">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <span>100% Free for verified students</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <span>Institutional college email only</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="text-emerald-400 font-bold text-sm">✓</span>
              <span>Zero spammers or sales bots</span>
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
