import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function MusicalDNARadio({ onSongSelect }) {
  const { isDark } = useTheme();
  const [isLive, setIsLive] = useState(false);
  const [currentShow, setCurrentShow] = useState("Chill Vibes Mix");
  const [listeners, setListeners] = useState(1247);

  // Radio stations based on different vibes
  const radioStations = [
    {
      id: "chill",
      name: "Chill Vibes",
      description: "Relaxing indie and lo-fi beats",
      color: "from-blue-400 to-purple-500",
      emoji: "🌙",
      listeners: 1247
    },
    {
      id: "party",
      name: "Party Mode",
      description: "High-energy dance and pop hits",
      color: "from-pink-400 to-red-500",
      emoji: "🎉",
      listeners: 892
    },
    {
      id: "focus",
      name: "Focus Flow",
      description: "Instrumental and ambient music",
      color: "from-green-400 to-teal-500",
      emoji: "🧘",
      listeners: 654
    },
    {
      id: "discover",
      name: "Discovery Zone",
      description: "Hidden gems and new releases",
      color: "from-yellow-400 to-orange-500",
      emoji: "🔍",
      listeners: 423
    },
    {
      id: "throwback",
      name: "Throwback Central",
      description: "Classic hits across decades",
      color: "from-purple-400 to-pink-500",
      emoji: "📻",
      listeners: 1089
    },
    {
      id: "world",
      name: "World Beats",
      description: "Global sounds and world music",
      color: "from-teal-400 to-blue-500",
      emoji: "🌍",
      listeners: 376
    }
  ];

  // Simulate listener count fluctuation
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setListeners(prev => prev + Math.floor(Math.random() * 11) - 5);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleStationSelect = (station) => {
    setCurrentShow(station.name);
    setListeners(station.listeners);
    setIsLive(true);
    
    // Simulate starting radio with a sample song
    if (onSongSelect) {
      onSongSelect({
        id: `radio-${station.id}`,
        title: `${station.name} Live Radio`,
        artist: "Musical DNA Radio",
        genre: station.description,
        isRadio: true
      });
    }
  };

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          📻 Musical DNA Radio
        </h1>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Curated stations that match your musical personality
        </p>
        
        {/* Live Indicator */}
        <AnimatePresence>
          {isLive && (
            <motion.div
              className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-red-500 text-white rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-sm font-semibold">
                LIVE: {currentShow} • {listeners.toLocaleString()} listeners
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Radio Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {radioStations.map((station, index) => (
          <motion.div
            key={station.id}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl'
            }`}
            onClick={() => handleStationSelect(station)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${station.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
            
            <div className="relative p-6">
              {/* Station Icon */}
              <motion.div
                className="text-4xl mb-4"
                whileHover={{ 
                  scale: 1.2,
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.5 }
                }}
              >
                {station.emoji}
              </motion.div>

              {/* Station Info */}
              <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {station.name}
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {station.description}
              </p>

              {/* Listener Count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full bg-green-400 ${
                    currentShow === station.name ? 'animate-pulse' : ''
                  }`} />
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {station.listeners.toLocaleString()} listening
                  </span>
                </div>
                
                {/* Play Button */}
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  } group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white transition-all duration-300`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Hover Glow Effect */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${station.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.1 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Features */}
      <motion.div
        className={`text-center p-8 rounded-2xl ${
          isDark 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-gray-50 border border-gray-200'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🚀 Coming Soon
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">🎤</div>
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Live DJ Sessions
            </h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Real-time sets from top DJs
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">👥</div>
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Group Listening
            </h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Listen together with friends
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">🎯</div>
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Smart Recommendations
            </h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              AI-powered personalized stations
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
