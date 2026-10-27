export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      {/* LEFT CONTENT */}
      <div className="space-y-6">
        
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <span>🏛️</span>
          <span>India's First Verified College Alumni Network</span>
        </div>
        
        {/* Giant Heading with Blue Accent */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Connect with Verified Alumni from{' '}
          <span className="text-blue-600">Your Alma Mater.</span>
        </h1>
        
        {/* Hinglish Description */}
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
          Apne college ke un seniors se connect karein jo aaj Google, Microsoft aur top companies me hain. 
          Paiye authentic mentorship, mock interviews aur verified referrals — bina kisi fake profile ya spam ke.
        </p>

        {/* Two Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button className="px-6 py-3.5 bg-blue-900 hover:bg-blue-800 active:scale-95 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
>
            Join Your College Network →
          </button>
          <button className="px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 font-medium rounded-xl transition-all cursor-pointer">
            Explore Mentors
          </button>
        </div>

        {/* Trust Footnote */}
        <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-2">
          <span>🔒</span> Zero spam guarantee • Profiles with institutional verification • Open to all colleges
        </p>
      </div>

      {/* RIGHT FLOATING CARD */}
      <div className="flex justify-center lg:justify-end">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 p-6 space-y-5">
          
          {/* Senior Profile Header */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-inner">
              👨‍💻
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">Ayush Singhania</h3>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                  Batch '19
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600">Senior Software Engineer @ Microsoft</p>
              <p className="text-xs text-slate-400">IIT Kharagpur • Computer Science</p>
            </div>
          </div>

          {/* Verification & Slot Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span>✓</span> Institute Credential Verified
              </span>
              <span className="text-slate-400">@iitkgp.ac.in</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span className="font-medium">Next Mentorship Slot:</span>
              <span className="font-semibold text-blue-600">Saturday, 4:00 PM</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Response Rate:</span>
              <span>96% within 2 hrs</span>
            </div>
          </div>

          {/* Card Button */}
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
>
            Request 1-on-1 Call
          </button>
        </div>
      </div>
    </section>
  )
}
