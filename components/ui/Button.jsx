"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-dragonfly-brown text-white hover:bg-dragonfly-brown-light active:scale-[0.98]",
  secondary:
    "bg-dragonfly-green text-white hover:bg-dragonfly-green-light active:scale-[0.98]",
  outline:
    "border-2 border-dragonfly-brown text-dragonfly-brown hover:bg-dragonfly-brown hover:text-white",
  ghost:
    "text-dragonfly-muted hover:text-dragonfly-brown hover:bg-dragonfly-taupe/30",
  gold: "bg-dragonfly-gold text-dragonfly-dark hover:bg-dragonfly-gold/90 active:scale-[0.98]",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-8 py-3.5 text-base rounded-xl",
};

const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    className = "",
    disabled,
    ...props
  },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-colors duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

export default Button;
