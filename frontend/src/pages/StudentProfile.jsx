import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const navigate = useNavigate();
  // LocalStorage se logged-in user nikalte hain:
  const user = JSON.parse(localStorage.getItem("authUser") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-bold">AlumniConnect <span className="text-blue-600 text-sm font-semibold">| Student Hub</span></span>
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs font-semibold px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          Logout
        </button>
      </header>

      {/* Main Profile Area */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white text-2xl font-black flex items-center justify-center">
              {user.fullName ? user.fullName.charAt(0) : "S"}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{user.fullName || "Student Name"}</h1>
              <p className="text-sm text-slate-500">{user.college} • {user.branch || "Computer Science"}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                🎓 Role: STUDENT
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 uppercase font-semibold">Registered Email</span>
              <p className="font-semibold text-slate-800 mt-1">{user.email}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-400 uppercase font-semibold">College Roll Number</span>
              <p className="font-semibold text-slate-800 mt-1">{user.rollNumber || "Not Provided"}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 flex gap-4">
            <Link to="/" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all">
              Explore Verified Alumni Directory →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}