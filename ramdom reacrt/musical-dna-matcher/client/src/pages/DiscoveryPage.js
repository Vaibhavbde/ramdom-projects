import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function DiscoveryPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const discoveryFeatures = [
    {
      icon: "🎵",
      title: "Music Trends",
      description: "Discover what's trending in your musical community",
      comingSoon: true
    },
    {
      icon: "🎤", 
      title: "Concert Finder",
      description: "Find concerts and events with people who share your taste",
      comingSoon: true
    },
    {
      icon: "🎧",
      title: "Playlist Collaboration",
      description: "Create collaborative playlists with your matches",
      comingSoon: true
    },
    {
      icon: "📊",
      title: "Music Analytics",
      description: "Deep dive into your listening patterns and preferences",
      comingSoon: true
    },
    {
      icon: "🎸",
      title: "Artist Spotlights",
      description: "Discover new artists based on your musical DNA",
      comingSoon: true
    },
    {
      icon: "🌟",
      title: "Community Insights",
      description: "See how your taste compares to others in your area",
      comingSoon: true
    }
  ];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className={`min-h-screen p-4 sm:p-6 transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 pt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold mb-3"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-gradient">Discovery Dashboard</span>
          </motion.h1>
          <motion.p 
            className={`text-lg sm:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Explore your musical universe
          </motion.p>
        </motion.div>

        {/* Coming Soon Banner */}
        <motion.div 
          className="gradient-purple rounded-xl p-6 mb-8 text-center text-white"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.h2 
            className="text-2xl font-bold mb-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            🚀 Coming Soon!
          </motion.h2>
          <motion.p 
            className="text-purple-100"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            We're building amazing discovery features to enhance your musical journey
          </motion.p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {discoveryFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className={`card p-6 relative overflow-hidden transition-all duration-300 ${
                isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
              }`}
              variants={itemVariants}
              whileHover="hover"
            >
              {/* Coming Soon Badge */}
              {feature.comingSoon && (
                <motion.div 
                  className="absolute top-3 right-3 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-semibold"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  Soon
                </motion.div>
              )}
              
              <motion.div 
                className="text-4xl mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {feature.title}
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.description}
              </p>
              
              {/* Placeholder button */}
              <motion.button
                disabled
                className={`w-full py-2 px-4 rounded-lg cursor-not-allowed transition-colors ${
                  isDark 
                    ? 'bg-gray-700 text-gray-500' 
                    : 'bg-gray-200 text-gray-400'
                }`}
                whileHover={{ scale: 0.98 }}
              >
                Coming Soon
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Current Features CTA */}
        <motion.div 
          className={`card p-8 text-center`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.h3 
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            Ready to find your musical soulmate?
          </motion.h3>
          <motion.p 
            className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            While we build these amazing features, start discovering compatible matches!
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <motion.button
              onClick={() => navigate('/discover')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🃏 Start Swiping
            </motion.button>
            <motion.button
              onClick={() => navigate('/matches')}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💖 View Matches
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Footer Info */}
        <motion.div 
          className={`text-center mt-8 text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <p>Have ideas for discovery features? We'd love to hear from you!</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
