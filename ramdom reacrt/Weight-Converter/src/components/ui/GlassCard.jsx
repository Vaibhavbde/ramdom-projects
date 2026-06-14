// src/components/ui/GlassCard.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * GlassCard - a small reusable frosted-glass wrapper.
 * Props:
 *  - children: node
 *  - className: extra tailwind classes
 *  - animated: boolean (default true)
 */
export default function GlassCard({ children, className = "", animated = true }) {
  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`backdrop-blur-sm bg-white/60 dark:bg-gray-800/40 border border-white/30 rounded-2xl shadow-lg ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`backdrop-blur-sm bg-white/60 dark:bg-gray-800/40 border border-white/30 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}
