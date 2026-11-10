import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AlumniProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("authUser") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💼</span>
          <span className="text-xl font-bold">AlumniConnect <span className="text-emerald-600 text-sm font-semibold">| Alumni Mentor Portal</span></span>
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs font-semibold px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white text-2xl font-black flex items-center justify-center">
              {user.fullName ? user.fullName.charAt(0) : "A"}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{user.fullName || "Alumni Name"}</h1>
              <p className="text-sm text-slate-600">{user.designation || "Software Engineer"} @ <span className="font-bold text-slate-900">{user.company || "Top Tech"}</span></p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                💼 Role: VERIFIED ALUMNI MENTOR
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 uppercase font-semibold">Alma Mater College</span>
              <p className="font-semibold text-slate-800 mt-1">{user.college} (Batch {user.batch || "2020"})</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 uppercase font-semibold">Work Email</span>
              <p className="font-semibold text-slate-800 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all">
              Manage Mentorship Slots (Calendar) →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}