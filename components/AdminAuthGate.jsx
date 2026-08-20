"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";

const ADMIN_PASSWORD = "dragonfly2024";

export default function AdminAuthGate({ children }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("dragonfly_admin_auth");
      if (stored === "true") {
        setAuthed(true);
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      sessionStorage.setItem("dragonfly_admin_auth", "true");
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (authed) {
    return children;
  }

  return (
    <div className="min-h-screen bg-dragonfly-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
      >
        <div className="w-16 h-16 mx-auto bg-dragonfly-green rounded-2xl flex items-center justify-center mb-6">
          <span className="text-3xl">🪰</span>
        </div>

        <h1 className="text-xl font-bold text-dragonfly-text mb-1">
          پنل مدیریت دراگون فلای
        </h1>
        <p className="text-dragonfly-muted text-sm mb-8">
          رمز عبور را وارد کنید
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Lock
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-dragonfly-muted"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="رمز عبور"
              autoFocus
              className={`
                w-full pr-11 pl-12 py-3.5 rounded-xl text-sm text-dragonfly-text
                placeholder:text-dragonfly-muted/50 focus:outline-none transition-all
                ${
                  error
                    ? "bg-red-50 border-2 border-red-300 focus:ring-red-200"
                    : "bg-dragonfly-cream border-2 border-transparent focus:border-dragonfly-brown/30 focus:ring-2 focus:ring-dragonfly-brown/10"
                }
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-dragonfly-muted hover:text-dragonfly-brown transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs"
            >
              رمز عبور اشتباه است. دوباره تلاش کنید.
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-dragonfly-brown text-white rounded-xl font-medium text-sm hover:bg-dragonfly-brown-light transition-colors"
          >
            ورود به پنل مدیریت
          </button>
        </form>

        <p className="text-dragonfly-muted/60 text-[10px] mt-6">
          این صفحه مخصوص مدیریت کافه است.
        </p>
      </motion.div>
    </div>
  );
}
