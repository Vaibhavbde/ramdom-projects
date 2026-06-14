import React from "react";
import { motion } from "framer-motion";

export default function CompatibilityScore({ score }) {
  const getScoreColor = (score) => {
    if (score > 85) return "from-green-400 to-green-500";
    if (score > 70) return "from-yellow-400 to-orange-400";
    if (score > 50) return "from-orange-400 to-red-400";
    return "from-red-400 to-red-500";
  };

  const getScoreEmoji = (score) => {
    if (score > 85) return "🔥";
    if (score > 70) return "✨";
    if (score > 50) return "💫";
    return "💭";
  };

  return (
    <motion.div 
      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r ${getScoreColor(score)} text-white text-sm font-bold shadow-lg`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <span>{getScoreEmoji(score)}</span>
      <span>{score}% Match</span>
    </motion.div>
  );
}
