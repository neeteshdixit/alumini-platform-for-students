import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SignupForm() {
  // 1. Multi-Field Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    college: "IIT Kharagpur",
    role: "student", // "student" ya "alumni"
    // Student specific fields:
    rollNumber: "",
    branch: "Computer Science",
    // Alumni specific fields:
    company: "",
    designation: "",
    batch: "2021",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Universal Input Change Handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert(`🎉 Registration Successful as ${formData.role.toUpperCase()}!\nName: ${formData.fullName}\nCollege: ${formData.college}`);
    }, 1000);
  };

  return (
    <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 overflow-y-auto max-h-screen">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Header */}
        <div>
          {/* Mobile Logo */}
          <div className="lg:hidden mb-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <span className="text-xl font-bold text-slate-900">
                Alumni<span className="text-blue-600">Connect</span>
              </span>
            </Link>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Join your verified institutional college network today.
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
            🎓 I am a Student
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
            💼 I am an Alumnus
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Rohan Sharma"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all"
            />
          </div>

          {/* College Dropdown Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Your College / University
            </label>
            <select
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-sm outline-none bg-white transition-all"
            >
              <option value="IIT Kharagpur">IIT Kharagpur</option>
              <option value="NIT Trichy">NIT Trichy</option>
              <option value="UIT RGPV Bhopal">UIT RGPV Bhopal</option>
              <option value="Delhi Technological University (DTU)">DTU Delhi</option>
              <option value="BITS Pilani">BITS Pilani</option>
            </select>
          </div>

          {/* =========================================
              CONDITIONAL FIELDS (STUDENT vs ALUMNI)
              ========================================= */}
          {formData.role === "student" ? (
            // STUDENT FIELDS
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  required
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="0101CS211045"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Branch
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-sm outline-none bg-white"
                >
                  <option value="Computer Science">CSE</option>
                  <option value="Information Tech">IT</option>
                  <option value="Electronics">ECE</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>
            </div>
          ) : (
            // ALUMNI FIELDS
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Company
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Microsoft"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Passing Batch
                </label>
                <input
                  type="text"
                  name="batch"
                  required
                  value={formData.batch}
                  onChange={handleChange}
                  placeholder="e.g. 2020"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-sm outline-none"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {formData.role === "student" ? "College Email / Personal Email" : "Work Email (For Verification)"}
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder={formData.role === "student" ? "rohan@college.edu" : "ayush@microsoft.com"}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Create Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-900 text-sm outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 active:scale-98 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>Creating profile...</span>
            ) : (
              <span>Claim Your Campus Profile →</span>
            )}
          </button>
        </form>

        {/* Link back to Login */}
        <div className="pt-3 border-t border-slate-200 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
}
