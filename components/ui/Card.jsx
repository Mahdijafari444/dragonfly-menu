"use client";

import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  hover = true,
  onClick,
}) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -4,
              boxShadow: "0 12px 30px rgba(74, 55, 40, 0.12)",
            }
          : undefined
      }
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      className={`
        bg-white rounded-2xl card-shadow
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
