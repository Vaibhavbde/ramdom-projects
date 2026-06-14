import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useMatches } from "../context/MatchContext";
import mockUsers from "../data/mockUsers";
import MatchCard from "../components/matching/MatchCard";
import { CardSkeleton } from "../components/shared/LoadingComponents";

export default function DiscoverPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { matches, addMatch, addToSwipeHistory, removeMatch } = useMatches();
  
  // Add default compatibility scores for users that don't have them
  const usersWithCompatibility = mockUsers.map(user => ({
    ...user,
    compatibility: user.compatibility || Math.floor(Math.random() * 40) + 60
  }));

  const [users, setUsers] = useState(usersWithCompatibility);
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [animatingCard, setAnimatingCard] = useState(null);
  const [isLoading] = useState(false);

  const handleSwipe = (direction, swipedUser) => {
    // Store for undo functionality
    setSwipeHistory(prev => [...prev, { user: swipedUser, direction, index: users.findIndex(u => u.id === swipedUser.id) }]);
    
    // Add to global swipe history
    addToSwipeHistory(swipedUser, direction);
    
    // Set animating card for exit animation
    setAnimatingCard({ user: swipedUser, direction });
    
    if (direction === "right") {
      addMatch(swipedUser);
      console.log("New match:", swipedUser.name);
    }
    
    // Delay removal to allow exit animation
    setTimeout(() => {
      setUsers(prev => prev.filter(u => u.id !== swipedUser.id));
      setAnimatingCard(null);
    }, 300);
  };

  const handleUndo = () => {
    if (swipeHistory.length === 0) return;
    
    const lastSwipe = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory(prev => prev.slice(0, -1));
    
    // If it was a match, remove from global matches
    if (lastSwipe.direction === "right") {
      removeMatch(lastSwipe.user.id);
    }
    
    // Add user back to the front of the deck
    setUsers(prev => [lastSwipe.user, ...prev]);
  };

  const handleProfileClick = (user) => {
    navigate(`/profile/${user.id}`);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className={`h-screen overflow-hidden flex flex-col transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Compact Header */}
      <motion.div 
        className="px-4 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Discover Music Matches
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Find people who share your musical DNA
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{matches.length}</div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Matches</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {mockUsers.length - users.length}
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Viewed</div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {users.length === 0 ? (
          <motion.div 
            className="flex-1 flex items-center justify-center px-4"
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 }
            }}
            key="empty-state"
          >
            <div className={`text-center max-w-md mx-auto ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <motion.div 
                className="text-6xl mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                🎵
              </motion.div>
              <motion.h2 
                className={`text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
              >
                No more users to show!
              </motion.h2>
              <motion.p 
                className="mb-4"
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
              >
                You've swiped through everyone. Check back later for new matches!
              </motion.p>
              <motion.div 
                className="mt-4"
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 }
                }}
              >
                <p className="text-green-400 font-semibold">
                  Total matches: {matches.length}
                </p>
              </motion.div>
              {swipeHistory.length > 0 && (
                <motion.button
                  onClick={handleUndo}
                  className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={{
                    initial: { opacity: 0, scale: 0.8 },
                    animate: { opacity: 1, scale: 1 }
                  }}
                >
                  ↶ Undo Last Swipe
                </motion.button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row gap-6 px-4 pb-6">
            {/* Main Card Section */}
            <div className="flex-1 flex flex-col items-center">
              {/* Instructions */}
              <motion.div 
                className={`flex items-center space-x-6 text-sm px-6 py-3 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-90 mb-4 ${
                  isDark 
                    ? 'text-gray-300 bg-gray-800 border border-gray-700' 
                    : 'text-gray-600 bg-white border border-gray-200'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">👈</span>
                  <span className="font-medium">Pass</span>
                </div>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Match</span>
                  <span className="text-2xl">👉</span>
                </div>
              </motion.div>

              {/* Compact Cards Stack */}
              <motion.div 
                className="relative flex items-center justify-center w-full max-w-sm"
                style={{ height: '420px' }}
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
                <AnimatePresence mode="popLayout">
                  {users.slice(0, 3).map((user, index) => (
                    <motion.div
                      key={user.id}
                      className={index === 0 ? "relative" : "absolute"}
                      style={{
                        zIndex: users.length - index,
                        transform: index > 0 ? `translateY(${index * 3}px) scale(${1 - index * 0.03})` : 'none',
                        opacity: index > 1 ? 0.8 : 1
                      }}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ 
                        opacity: index > 1 ? 0.8 : 1, 
                        scale: index > 0 ? 1 - index * 0.03 : 1, 
                        y: index * 3 
                      }}
                      exit={{ 
                        opacity: 0, 
                        scale: 0.8, 
                        y: -20,
                        transition: { duration: 0.2 }
                      }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    >
                      <MatchCard
                        user={user}
                        onSwipe={(dir) => handleSwipe(dir, user)}
                        onProfileClick={index === 0 ? handleProfileClick : null}
                        isAnimating={animatingCard && animatingCard.user.id === user.id}
                        animationDirection={animatingCard?.direction}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Action Buttons */}
              {users.length > 0 && (
                <motion.div 
                  className="flex justify-center items-center mt-8 px-8"
                  style={{ gap: '2rem' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    onClick={() => handleSwipe("left", users[0])}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-red-400 to-red-500 text-white text-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleProfileClick(users[0])}
                    className={`w-14 h-14 rounded-full transition-all duration-200 shadow-lg flex items-center justify-center ${
                      isDark 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    👤
                  </motion.button>

                  {swipeHistory.length > 0 && (
                    <motion.button
                      onClick={handleUndo}
                      className={`w-12 h-12 rounded-full transition-all duration-200 shadow-lg flex items-center justify-center ${
                        isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      ↶
                    </motion.button>
                  )}
                  
                  <motion.button
                    onClick={() => handleSwipe("right", users[0])}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white text-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ❤️
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Sidebar with Quick Actions & Preview */}
            <motion.div 
              className="lg:w-80 space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Quick Actions */}
              <div className={`p-4 rounded-2xl ${
                isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <motion.button
                    onClick={() => navigate("/music")}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                      isDark 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎵</span>
                      <div>
                        <div className="font-semibold">Discover Music</div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Songs & Radio
                        </div>
                      </div>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => navigate("/matches")}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                      isDark 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💬</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">View Matches</div>
                          {matches.length > 0 && (
                            <span className="bg-green-400 text-black text-xs px-2 py-1 rounded-full font-bold">
                              {matches.length}
                            </span>
                          )}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Start conversations
                        </div>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Musical DNA Preview */}
              <div className={`p-4 rounded-2xl ${
                isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Your Musical DNA
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Top Genre
                    </span>
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Indie Pop
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Vibe Score
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        Platform compatibility
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-purple-400">
                      92/100
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Match Rate
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        Avg. with others
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-green-400">
                      High (87%)
                    </span>
                  </div>
                  <motion.button
                    onClick={() => navigate("/profile")}
                    className={`w-full mt-3 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isDark 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Edit Profile
                  </motion.button>
                </div>
              </div>

              {/* Tips */}
              <div className={`p-4 rounded-2xl ${
                isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  💡 Pro Tips
                </h3>
                <div className="space-y-2">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    • Swipe right on users with similar music taste
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    • Check their top songs before deciding
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    • Higher compatibility = better conversations
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
