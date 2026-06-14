import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import mockSongs from "../../data/mockSongs";

export default function RecommendedSongs({ onSongSelect, currentSong }) {
  const { isDark } = useTheme();
  const [hoveredSong, setHoveredSong] = useState(null);

  // Get a subset of songs for recommendations
  const recommendedSongs = mockSongs.slice(0, 8);

  const handleSongClick = (song) => {
    onSongSelect(song);
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🎵 Recommended for You
        </h2>
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Based on your musical DNA
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendedSongs.map((song, index) => (
          <motion.div
            key={song.id}
            className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
              currentSong?.id === song.id
                ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/25'
                : ''
            } ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md'
            }`}
            onClick={() => handleSongClick(song)}
            onMouseEnter={() => setHoveredSong(song.id)}
            onMouseLeave={() => setHoveredSong(null)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Album Art Placeholder */}
            <div className="aspect-square bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-4xl"
                  animate={hoveredSong === song.id ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.6 }}
                >
                  🎵
                </motion.div>
              </div>
              
              {/* Play Overlay */}
              <motion.div
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.div
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Currently Playing Indicator */}
              {currentSong?.id === song.id && (
                <motion.div
                  className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>

            {/* Song Info */}
            <div className="p-4">
              <h3 className={`font-semibold mb-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {song.title}
              </h3>
              <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {song.artist}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDark 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {song.genre}
                </span>
                
                {/* Compatibility Score */}
                <motion.div
                  className="text-xs font-semibold text-green-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {Math.floor(Math.random() * 20) + 80}% match
                </motion.div>
              </div>
            </div>

            {/* Hover Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      <motion.div
        className="flex justify-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            isDark 
              ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Discover More Songs
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
