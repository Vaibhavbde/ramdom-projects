import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import CompatibilityScore from "./CompatibilityScore";

export default function MatchCard({ user, onSwipe, onProfileClick, isAnimating, animationDirection }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const { isDark } = useTheme();

  const handleDragStart = (event, info) => {
    setIsDragging(true);
    setDragStart({ x: info.point.x, y: info.point.y });
  };

  const handleDrag = (event, info) => {
    setDragOffset(info.offset.x);
  };

  const handleDragEnd = (event, info) => {
    const dragDistance = Math.abs(info.point.x - dragStart.x);
    
    // Only trigger swipe if dragged significantly
    if (dragDistance > 50) {
      if (info.offset.x > 150) {
        onSwipe("right");
      } else if (info.offset.x < -150) {
        onSwipe("left");
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleClick = (e) => {
    // Only trigger profile view if not dragging and click handler exists
    if (!isDragging && onProfileClick) {
      onProfileClick(user);
    }
  };

  // Exit animation variants
  const exitVariants = {
    left: {
      x: -400,
      opacity: 0,
      rotate: -30,
      transition: { duration: 0.3 }
    },
    right: {
      x: 400,
      opacity: 0,
      rotate: 30,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden select-none mx-auto cursor-pointer relative border-2 transition-all duration-300 ${
        isDark 
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
      drag={!isAnimating ? "x" : false}
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.7}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      whileTap={!isAnimating ? { scale: 0.98 } : {}}
      whileDrag={{ scale: 1.02, rotate: dragOffset * 0.05 }}
      initial={{ scale: 1, x: 0, opacity: 1, rotate: 0 }}
      animate={isAnimating && animationDirection ? exitVariants[animationDirection] : { scale: 1, x: 0, opacity: 1, rotate: 0 }}
      style={{ pointerEvents: isAnimating ? "none" : "auto" }}
    >
      {/* Swipe indicators */}
      {isDragging && Math.abs(dragOffset) > 50 && (
        <>
          <motion.div
            className={`absolute top-6 left-6 px-4 py-2 rounded-xl font-bold text-lg z-10 backdrop-blur-sm transition-opacity ${
              dragOffset > 0 ? "bg-green-500 text-white opacity-100 shadow-lg" : "opacity-0"
            }`}
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
          >
            MATCH ❤️
          </motion.div>
          <motion.div
            className={`absolute top-6 right-6 px-4 py-2 rounded-xl font-bold text-lg z-10 backdrop-blur-sm transition-opacity ${
              dragOffset < 0 ? "bg-red-500 text-white opacity-100 shadow-lg" : "opacity-0"
            }`}
            initial={{ scale: 0.8, rotate: 10 }}
            animate={{ scale: 1, rotate: 0 }}
          >
            PASS ✕
          </motion.div>
        </>
      )}
      
      {/* Image with gradient overlay */}
      <div className="relative h-80">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=34d399&color=fff&size=512`;
          }}
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent h-32"></div>
        
        {/* Name and compatibility on image */}
        <div className="absolute bottom-6 left-6 right-6">
          <motion.h2 
            className="text-3xl font-bold text-white mb-2 drop-shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {user.name}
          </motion.h2>
          <CompatibilityScore score={user.compatibility} />
        </div>
      </div>
      
      {/* Bottom info section */}
      <div className={`p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Favorite Genres
            </p>
            <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {user.topGenres?.slice(0, 2).join(", ") || "Music Lover"}
            </p>
          </div>
          
          {/* Tap indicator */}
          <motion.div 
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
            }`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Tap for profile
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
