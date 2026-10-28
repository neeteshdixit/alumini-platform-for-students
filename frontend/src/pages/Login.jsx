// 📁 frontend/src/pages/Login.jsx
import React from "react";
import AuthVisualSide from "../components/auth/AuthVisualSide";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    // 50/50 Split Screen Grid: Mobile pe 1 column, Desktop pe 2 columns
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      
      {/* 1. Left 50%: Reusable Visual Banner */}
      <AuthVisualSide 
        title="Welcome back to your campus network."
        subtitle="Log in to access your verified alumni directory, schedule 1-on-1 mentorship sessions, and request job referrals."
      />

      {/* 2. Right 50%: Interactive Login Form */}
      <LoginForm />

    </div>
  );
}
