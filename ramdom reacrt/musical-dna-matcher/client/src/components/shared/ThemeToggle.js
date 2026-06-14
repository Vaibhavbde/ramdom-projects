import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-12 h-6 rounded-full transition-colors ${
        isDark ? 'bg-purple-600' : 'bg-gray-300'
      } ${className}`}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Toggle circle */}
      <motion.div
        className={`absolute w-5 h-5 rounded-full shadow-lg ${
          isDark ? 'bg-yellow-300' : 'bg-white'
        } flex items-center justify-center`}
        animate={{
          x: isDark ? 14 : -14,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        {/* Icon */}
        <span className="text-xs">
          {isDark ? '🌙' : '☀️'}
        </span>
      </motion.div>

      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1">
        <span className={`text-xs transition-opacity ${isDark ? 'opacity-0' : 'opacity-70'}`}>
          ☀️
        </span>
        <span className={`text-xs transition-opacity ${isDark ? 'opacity-70' : 'opacity-0'}`}>
          🌙
        </span>
      </div>
    </motion.button>
  );
}
