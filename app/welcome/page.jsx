"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0); // 0: logo, 1: name, 2: tagline, 3: redirect

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),   // Show name
      setTimeout(() => setPhase(2), 1400),   // Show tagline
      setTimeout(() => setPhase(3), 2800),   // Start fade out
      setTimeout(() => router.push("/menu"), 3500), // Redirect
    ];
    return () => timers.forEach(clearTimeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient overflow-hidden relative">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
              scale: 0,
            }}
            animate={{
              y: [
                Math.random() * 600,
                Math.random() * -200,
                Math.random() * 600,
              ],
              x: [
                Math.random() * 800,
                Math.random() * 800,
                Math.random() * 800,
              ],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
            style={{
              width: 20 + Math.random() * 60,
              height: 20 + Math.random() * 60,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center z-10"
        >
          {/* Phase 0: Logo */}
          {phase === 0 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 0.8,
              }}
            >
              <div className="w-28 h-28 mx-auto bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                <span className="text-7xl">🪰</span>
              </div>
            </motion.div>
          )}

          {/* Phase 1: Name */}
          {phase === 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 mb-6 shadow-2xl">
                <span className="text-5xl">🪰</span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-bold text-white mb-2">
                دراگون فلای
              </h1>
            </motion.div>
          )}

          {/* Phase 2: Tagline + enter */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 mb-6 shadow-2xl">
                <span className="text-5xl">🪰</span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-bold text-white mb-3">
                دراگون فلای
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-white/60 text-lg mb-10"
              >
                قهوه‌ای با عشق، برای شما
              </motion.p>

              {/* Enter button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                onClick={() => router.push("/menu")}
                className="px-10 py-4 bg-white text-dragonfly-brown rounded-2xl font-semibold text-base hover:bg-dragonfly-cream transition-colors shadow-xl"
              >
                مشاهده منو →
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Fade out overlay */}
      {phase === 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-dragonfly-dark z-20"
        />
      )}

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1 }}
        whileHover={{ opacity: 1 }}
        onClick={() => router.push("/menu")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-xs hover:text-white transition-colors"
      >
        رد شدن ←
      </motion.button>
    </div>
  );
}
