import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: 5 Columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          
          {/* Brand Info (Spans 2 columns) */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-blue-500/20">
                AC
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Alum<span className="text-blue-500">Connect</span>
              </span>
            </div>

            <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
              The private institutional network bridging engineering freshers with verified global alumni for mock interviews, career roadmaps, and direct referrals.
            </p>

            <div className="mt-6 inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Campus Verification Network: Active</span>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors duration-200">Alumni Directory</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors duration-200">1-on-1 Mentorship</a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white transition-colors duration-200">Referral Pipeline</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">College T&P Login</a>
              </li>
            </ul>
          </div>

          {/* Col 2: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Resources
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Outreach Templates</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Mock Interview Guide</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Student Success Kit</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Campus Ambassador</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Trust & Safety
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Student Privacy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Verification Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">Security Architecture</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-Bar */}
        <div className="mt-14 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 AlumConnect Platform. Built for engineering students & alumni network.
          </div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-300 cursor-pointer transition-colors duration-200">Privacy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors duration-200">Cookies</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors duration-200">Status</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
