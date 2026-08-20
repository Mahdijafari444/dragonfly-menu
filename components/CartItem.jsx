"use client";

import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/store";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className="flex items-center gap-4 p-4 bg-white rounded-xl"
    >
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-dragonfly-text text-sm truncate">
          {item.name}
        </h4>
        <p className="text-dragonfly-gold font-semibold text-sm">
          {(item.price * item.quantity).toLocaleString("fa-IR")} ت
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 rounded-full border border-dragonfly-taupe flex items-center justify-center text-dragonfly-muted hover:border-dragonfly-brown hover:text-dragonfly-brown transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center font-medium text-sm">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded-full border border-dragonfly-taupe flex items-center justify-center text-dragonfly-muted hover:border-dragonfly-brown hover:text-dragonfly-brown transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id)}
        className="p-2 rounded-full text-dragonfly-muted hover:text-dragonfly-red hover:bg-red-50 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}
