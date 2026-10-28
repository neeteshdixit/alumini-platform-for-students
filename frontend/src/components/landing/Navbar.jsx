import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 flex justify-between items-center px-8 py-4">

      {/* Logo with hover scale */}
      <div className="flex items-center gap-2 cursor-pointer group">
        <span className="text-2xl group-hover:scale-110 transition-transform">🎓</span>
        <span className="text-xl font-bold text-slate-900 tracking-tight">
          Alumni<span className="text-blue-600">Connect</span>
        </span>
      </div>

      {/* Links with blue hover transition */}
      <ul className="flex items-center gap-8 text-sm font-medium text-slate-600">
        <li>
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
        </li>
        <li>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
        </li>
        <li>
          <a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</a>
        </li>
        <li>
          <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
        </li>
      </ul>

      {/* Buttons with hover states */}
      <div className="flex items-center gap-4 text-sm font-medium">
        <Link
          to="/login"
          className="text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors cursor-pointer"
        >
          Sign In
        </Link>


        {/* Hover par color thoda dark ho aur click par halka sa press (active:scale-95) ho */}
        <Link
  to="/signup"
  className="bg-blue-900 hover:bg-blue-800 active:scale-95 text-white px-5 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer inline-block"
>
  Join Your College
</Link>


        {/* Avatar hover border */}
        <div className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer flex items-center justify-center text-slate-600 border border-slate-200 transition-colors">
          👤
        </div>
      </div>
    </nav>
  )
}
