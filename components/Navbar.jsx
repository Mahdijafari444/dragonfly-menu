"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/store";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-40 glass border-b border-dragonfly-taupe/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/menu" className="flex items-center gap-2.5">
            <span className="text-2xl">🪰</span>
            <span className="font-semibold text-lg text-dragonfly-brown">
              دراگونفلای
            </span>
          </Link>

          {/* Cart */}
          <Link
            href="/order"
            className="relative p-2.5 rounded-xl bg-dragonfly-brown text-white hover:bg-dragonfly-brown-light transition-colors"
          >
            <ShoppingCart size={20} />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-dragonfly-green text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>
    </nav>
  );
}
