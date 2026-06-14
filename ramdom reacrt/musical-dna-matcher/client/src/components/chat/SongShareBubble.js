import React, { useState } from "react";
import { motion } from "framer-motion";

export default function SongShareBubble({ message, isOwn, timestamp }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const song = message.song;

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control actual audio playback
    setTimeout(() => setIsPlaying(false), 3000); // Simulate 3-second preview
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex flex-col max-w-sm ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Message Text */}
        {message.text && (
          <div className={`mb-2 px-4 py-2 rounded-2xl text-sm ${
            isOwn 
              ? 'bg-purple-600 text-white rounded-br-md' 
              : 'bg-gray-700 text-white rounded-bl-md'
          }`}>
            {message.text}
          </div>
        )}

        {/* Song Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 shadow-xl border border-gray-600 cursor-pointer ${
            isOwn ? 'ml-4' : 'mr-4'
          }`}
          onClick={handlePlay}
        >
          {/* Song Info */}
          <div className="flex items-center space-x-3">
            {/* Album Cover */}
            <div className="relative flex-shrink-0">
              <img 
                src={song.cover} 
                alt={`${song.album} cover`}
                className="w-12 h-12 rounded-lg object-cover"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <motion.div
                  animate={isPlaying ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
                  className="text-white text-lg"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </motion.div>
              </div>
            </div>

            {/* Song Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm truncate">
                {song.title}
              </h4>
              <p className="text-gray-300 text-xs truncate">
                {song.artist}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {song.album}
              </p>
            </div>

            {/* Duration */}
            <div className="text-gray-400 text-xs">
              {song.duration}
            </div>
          </div>

          {/* Genre Badge */}
          <div className="mt-3 flex items-center justify-between">
            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
              🎵 {song.genre}
            </span>
            
            {/* Waveform Animation */}
            {isPlaying && (
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-purple-400 rounded-full"
                    animate={{
                      height: [4, 16, 8, 20, 6],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Hover Instructions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 rounded-xl transition-all duration-200 flex items-center justify-center">
            <span className="text-white text-xs opacity-0 hover:opacity-100 transition-opacity">
              {isPlaying ? 'Playing...' : 'Tap to preview'}
            </span>
          </div>
        </motion.div>

        {/* Timestamp */}
        <span className={`text-xs text-gray-500 mt-2 px-3 ${
          isOwn ? 'text-right' : 'text-left'
        }`}>
          {timestamp}
        </span>
      </div>
    </div>
  );
}
