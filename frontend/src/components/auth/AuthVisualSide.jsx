// Step 4: Final Complete Code with Ambient Glow
import React from "react";
import { Link } from "react-router-dom";

export default function AuthVisualSide({ title, subtitle }) {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
      
      {/* Decorative Ambient Glow Circles */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Top Logo */}
      <div className="relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <span className="text-3xl group-hover:scale-110 transition-transform duration-200">🎓</span>
          <span className="text-2xl font-bold text-white tracking-tight">
            Alumni<span className="text-blue-400">Connect</span>
          </span>
        </Link>
      </div>

      {/* 2. Middle Pitch */}
      <div className="space-y-6 max-w-lg relative z-10">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-300 bg-white/10 px-3.5 py-1 rounded-full border border-white/10 backdrop-blur-sm">
          Institutional Network
        </span>

        <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
          {title || "Step back into your campus network."}
        </h2>

        <p className="text-slate-300 text-base leading-relaxed">
          {subtitle || "Connect with 10,000+ verified alumni across top global tech companies. Get mentorship, referral slots, and career roadmaps without spam."}
        </p>

        {/* Social Proof Quote Card */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <p className="text-sm italic text-blue-100">
            "Finding my college senior Ayush at Microsoft helped me prepare targeted interview DSA questions and get placed!"
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-white">Rohan Sharma</span>
            <span>Placed @ Microsoft</span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Security Badge */}
      <div className="relative z-10 flex items-center gap-2 text-xs text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>256-Bit SSL Encrypted Campus Authentication</span>
      </div>

    </div>
  );
}
