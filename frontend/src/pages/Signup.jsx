// 📁 frontend/src/pages/Signup.jsx
import React from "react";
import AuthVisualSide from "../components/auth/AuthVisualSide";
import SignupForm from "../components/auth/SignupForm";

export default function Signup() {
  return (
    // 50/50 Split Screen Grid
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      
      {/* 1. Left 50%: Reusable Visual Banner with Custom Props */}
      <AuthVisualSide 
        title="Claim your verified campus profile."
        subtitle="Join 10,000+ students and alumni bridging the campus-to-career gap. 100% free forever for verified students."
      />

      {/* 2. Right 50%: Interactive Signup Form */}
      <SignupForm />

    </div>
  );
}
