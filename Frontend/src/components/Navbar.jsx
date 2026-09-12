import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brain, ArrowDownRight, UploadCloud, LogIn, UserPlus } from "lucide-react";
import { gsap } from "gsap";

export default function Navbar() {
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/upload" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform duration-300">
            <Brain size={18} className="text-black font-bold" />
          </div>
          <span
            className="font-black text-white tracking-tight text-sm sm:text-base md:text-lg flex items-center gap-2"
            style={{ fontFamily: "Space Grotesk" }}
          >
            AI CAREER COACH
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5 sm:gap-3">
          <Link
            to="/upload"
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              isActive("/upload")
                ? "bg-white text-black shadow-md shadow-white/20"
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <UploadCloud size={14} className="shrink-0" />
            <span className="hidden xs:inline">Upload</span>
            <span className="xs:hidden">Upload</span>
          </Link>

          <Link
            to="/"
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              isActive("/")
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <LogIn size={14} className="shrink-0" />
            <span className="hidden xs:inline">Sign In</span>
            <span className="xs:hidden">Login</span>
          </Link>

          <Link
            to="/register"
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              isActive("/register")
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <UserPlus size={14} className="shrink-0" />
            <span className="hidden sm:inline">Register</span>
          </Link>

          <Link
            to="/upload"
            className="gsap-pill-btn text-xs px-4 py-1.5 hidden md:inline-flex"
          >
            Analyze Resume <ArrowDownRight size={14} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
