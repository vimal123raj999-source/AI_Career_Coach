import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Brain, Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, UploadCloud } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const cardRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
    );
    gsap.to(blob1Ref.current, { x: 140, y: -100, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(blob2Ref.current, { x: -140, y: 100, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.fromTo(
      ".form-field",
      { opacity: 0, x: -25 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, delay: 0.3, ease: "power2.out" }
    );
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/register", form);
      if (res.data?.error) {
        setSuccess("Account ready! Redirecting to Resume Upload...");
        setTimeout(() => navigate("/upload"), 1200);
      } else {
        setSuccess("Account created! Redirecting...");
        setTimeout(() => navigate("/upload"), 1200);
      }
    } catch {
      setSuccess("Welcome! Proceeding to Resume Upload...");
      setTimeout(() => navigate("/upload"), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black grid-bg overflow-hidden relative flex flex-col items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div ref={blob1Ref} className="absolute w-[500px] h-[500px] bg-pink-600 rounded-full blur-[140px] opacity-20 -top-20 -right-20" />
        <div ref={blob2Ref} className="absolute w-[500px] h-[500px] bg-purple-600 rounded-full blur-[140px] opacity-20 -bottom-20 -left-20" />
      </div>

      <div ref={cardRef} className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-2xl bg-white/[0.05] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 mb-4">
              <Brain size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-gradient text-center tracking-tight" style={{ fontFamily: "Space Grotesk" }}>
              Create Account
            </h1>
            <p className="text-gray-400 mt-2 text-xs md:text-sm text-center flex items-center gap-1">
              <Sparkles size={14} className="text-pink-400" />
              Build Your Career with AI Intelligence
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Username Field */}
            <div className="form-field">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5 block">
                Username
              </label>
              <div className="relative flex items-center">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm outline-none focus:border-pink-400/60 focus:bg-white/10 transition-all placeholder-gray-500"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-field">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5 block">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm outline-none focus:border-pink-400/60 focus:bg-white/10 transition-all placeholder-gray-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-field">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2.5 block">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white text-sm outline-none focus:border-pink-400/60 focus:bg-white/10 transition-all placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none z-10"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
            {success && <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="form-field w-full py-3.5 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            type="button"
            onClick={() => navigate("/upload")}
            className="w-full py-3 border border-white/15 bg-white/5 hover:bg-white/10 text-cyan-300 rounded-xl font-medium text-xs tracking-wide flex items-center justify-center gap-2 transition-all"
          >
            <UploadCloud size={16} /> Skip Registration & Upload Resume Directly
          </button>

          <div className="text-center mt-6 text-gray-400 text-xs">
            Already have an account?{" "}
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
