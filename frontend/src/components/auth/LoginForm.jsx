import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginForm() {
  // 1. State Management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student", // "student" ya "alumni"
  });

  const [isLoading, setIsLoading] = useState(false);

  // 2. Universal Input Change Handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 3. Form Submit Handler with simulated delay
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert(`🎉 Login Successful!\nRole: ${formData.role.toUpperCase()}\nEmail: ${formData.email}`);
    }, 1000);
  };

  return (
    <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Header */}
        <div>
          {/* Mobile Only Logo (Desktop pe hide rahega kyuki left banner pe logo hai) */}
          <div className="lg:hidden mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <span className="text-xl font-bold text-slate-900">
                Alumni<span className="text-blue-600">Connect</span>
              </span>
            </Link>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter your credentials to access your institutional portal.
          </p>
        </div>

        {/* Role Toggle Switch */}
        <div className="bg-slate-100 p-1.5 rounded-xl grid grid-cols-2 gap-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "student" })}
            className={`py-2 rounded-lg transition-all text-center cursor-pointer ${
              formData.role === "student"
                ? "bg-white text-blue-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🎓 Student
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: "alumni" })}
            className={`py-2 rounded-lg transition-all text-center cursor-pointer ${
              formData.role === "alumni"
                ? "bg-white text-blue-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            💼 Alumni Mentor
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email / Roll Number Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {formData.role === "student" ? "College Email or Roll Number" : "Registered Work / Personal Email"}
            </label>
            <input
              type="text"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder={
                formData.role === "student"
                  ? "e.g. 0101CS211045 or rohan@college.edu"
                  : "e.g. ayush@microsoft.com"
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Forgot?
              </a>
            </div>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-sm outline-none transition-all"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-600 font-medium">Keep me signed in for 30 days</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 active:scale-98 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <span>Sign In as {formData.role === "student" ? "Student" : "Alumni"} →</span>
            )}
          </button>
        </form>

        {/* Link to Signup Page */}
        <div className="pt-4 border-t border-slate-200 text-center text-sm text-slate-600">
          Don't have an institutional account yet?{" "}
          <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Join Your College (Sign Up)
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
