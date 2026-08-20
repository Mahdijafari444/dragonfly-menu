"use client";

import { motion } from "framer-motion";

const categories = [
  { id: "all", label: "همه", icon: "✨" },
  { id: "drinks", label: "نوشیدنی", icon: "☕" },
  { id: "foods", label: "غذا", icon: "🍽️" },
  { id: "desserts", label: "دسر", icon: "🍰" },
];

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`
            relative flex items-center gap-1.5 px-5 py-2.5 rounded-full
            text-sm font-medium whitespace-nowrap transition-colors duration-200
            ${
              active === cat.id
                ? "text-white"
                : "text-dragonfly-muted hover:text-dragonfly-brown hover:bg-dragonfly-taupe/30"
            }
          `}
        >
          {active === cat.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-dragonfly-brown rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat.icon}</span>
          <span className="relative z-10">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
