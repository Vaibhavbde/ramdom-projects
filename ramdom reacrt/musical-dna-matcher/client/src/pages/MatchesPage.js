import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useMatches } from "../context/MatchContext";
import CompatibilityScore from "../components/matching/CompatibilityScore";
import { MatchesSkeleton } from "../components/shared/LoadingComponents";

export default function MatchesPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { matches } = useMatches();
  const [isLoading, setIsLoading] = useState(true);

  // Load matches from localStorage or use sample data
  useEffect(() => {
    // Simulate loading delay for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const handleViewProfile = (user) => {
    navigate(`/profile/${user.id}`);
  };

  const handleStartChat = (user) => {
    navigate(`/chat/${user.id}`);
  };

  if (isLoading) {
    return <MatchesSkeleton />;
  }

  if (matches.length === 0) {
    return (
      <motion.div 
        className={`flex flex-col items-center justify-center min-h-screen p-6 sm:p-8 transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-900 text-gray-400' 
            : 'bg-gray-50 text-gray-600'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        variants={{
          initial: { opacity: 0 },
          animate: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        <motion.div 
          className="text-4xl sm:text-6xl mb-4"
          variants={{
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 }
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -10, 10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          💔
        </motion.div>
        <motion.h2 
          className={`text-xl font-semibold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}
        >
          No matches yet
        </motion.h2>
        <motion.p 
          className="text-center mb-6 max-w-md"
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}
        >
          Keep swiping to find your musical soulmate!
        </motion.p>
        <motion.button
          onClick={() => navigate('/discover')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variants={{
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 }
          }}
        >
          Start Discovering
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 pt-4"
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}
        >
          <motion.h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            variants={{
              initial: { opacity: 0, y: -20 },
              animate: { opacity: 1, y: 0 }
            }}
          >
            Your Matches
          </motion.h1>
          <motion.p 
            className={`text-sm sm:text-base ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 }
            }}
          >
            You have {matches.length} musical connection{matches.length !== 1 ? 's' : ''}
          </motion.p>
        </motion.div>

        {/* Matches Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <AnimatePresence>
            {matches.map((user, index) => (
              <motion.div
                key={user.id}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
                variants={{
                  initial: { scale: 0.8, opacity: 0 },
                  animate: { scale: 1, opacity: 1 }
                }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Profile Image */}
                <div className="relative overflow-hidden">
                  <motion.img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-48 sm:h-52 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold backdrop-blur-sm bg-opacity-90">
                    ✨ Match
                  </div>
                  <div className="absolute bottom-3 left-3 backdrop-blur-sm bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
                    <CompatibilityScore score={user.compatibility} />
                  </div>
                </div>

                {/* User Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className={`font-bold text-lg sm:text-xl ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {user.name}
                    </h3>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {user.age}, {user.location}
                    </p>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2">
                    {user.topGenres?.slice(0, 2).map((genre, index) => (
                      <motion.span
                        key={index}
                        className="text-xs bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        {genre}
                      </motion.span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <motion.button
                      onClick={() => handleStartChat(user)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      💬 Chat
                    </motion.button>
                    <motion.button
                      onClick={() => handleViewProfile(user)}
                      className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm ${
                        isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      👤 Profile
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12 mb-8"
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}
        >
          <motion.p 
            className={`mb-6 text-sm sm:text-base ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 }
            }}
          >
            💬 Start chatting with your matches or 👤 view their full profiles
          </motion.p>
          <motion.button
            onClick={() => navigate('/discover')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={{
              initial: { scale: 0.8, opacity: 0 },
              animate: { scale: 1, opacity: 1 }
            }}
          >
            Find More Matches
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
