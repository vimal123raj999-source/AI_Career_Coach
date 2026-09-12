import { motion } from "framer-motion";
import { Brain, Mail, Lock } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative flex items-center justify-center px-4">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 200, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
          className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 top-10 left-0"
        />

        <motion.div
          animate={{
            x: [0, -200, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
          }}
          className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-30 bottom-10 right-0"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">

            <div className="bg-gradient-to-r from-cyan-400 to-purple-500 p-4 rounded-full mb-4">
              <Brain size={40} className="text-white" />
            </div>

            <h1 className="text-4xl font-bold text-white text-center">
              AI Career Coach
            </h1>

            <p className="text-gray-300 mt-2 text-center">
              Build Your Future With AI
            </p>

          </div>

          {/* Email */}
          <div className="mb-5 relative">

            <Mail
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full h-12 box-border bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 text-white text-base outline-none focus:border-cyan-400 transition"
            />

          </div>

          {/* Password */}
          <div className="mb-6 relative">

            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full h-12 box-border bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 text-white text-base outline-none focus:border-cyan-400 transition"
            />

          </div>

          {/* Login Button */}
          <button
            className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold text-base hover:scale-[1.02] transition"
          >
            Login
          </button>

          {/* Register */}
          <div className="text-center mt-6 text-gray-300">
            Don't have an account?
            <span className="text-cyan-400 ml-2 cursor-pointer hover:underline">
              Register
            </span>
          </div>

        </div>
      </motion.div>
    </div>
  );
}