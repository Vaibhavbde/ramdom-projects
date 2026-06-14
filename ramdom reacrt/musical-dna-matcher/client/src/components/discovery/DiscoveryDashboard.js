import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useMatches } from "../../context/MatchContext";
import { useNavigate } from "react-router-dom";
import MatchCard from "../matching/MatchCard";
import RecommendedSongs from "./RecommendedSongs";
import MusicalDNARadio from "./MusicalDNARadio";
import MusicPlayer from "../shared/MusicPlayer";
import mockUsers from "../../data/mockUsers";
import mockSongs from "../../data/mockSongs";

export default function DiscoveryDashboard() {
  const { isDark } = useTheme();
  const { matches, addMatch, addToSwipeHistory } = useMatches();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("swipe"); // swipe, songs, radio
  const [currentSong, setCurrentSong] = useState(null);
  const [songHistory, setSongHistory] = useState([]);
  const [users, setUsers] = useState(mockUsers.slice(0, 3)); // Show fewer users for dashboard

  const tabs = [
    { id: "swipe", label: "Discover People", icon: "👫", description: "Find your musical soulmate" },
    { id: "songs", label: "Recommended Songs", icon: "🎵", description: "Curated for your taste" },
    { id: "radio", label: "DNA Radio", icon: "📻", description: "Live curated stations" }
  ];

  const handleSongSelect = (song) => {
    if (currentSong?.id !== song.id) {
      setSongHistory(prev => currentSong ? [currentSong, ...prev.slice(0, 9)] : prev);
      setCurrentSong(song);
    }
  };

  const handleNextSong = () => {
    const availableSongs = mockSongs.filter(song => song.id !== currentSong?.id);
    const randomSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
    handleSongSelect(randomSong);
  };

  const handlePreviousSong = () => {
    if (songHistory.length > 0) {
      const previousSong = songHistory[0];
      setSongHistory(prev => prev.slice(1));
      setCurrentSong(previousSong);
    }
  };

  const handleSwipe = (direction, user) => {
    // Add to swipe history
    addToSwipeHistory(user, direction);
    
    if (direction === "right") {
      addMatch(user);
      console.log("New match:", user.name);
    }
    
    // Remove user from current list
    setUsers(prev => prev.filter(u => u.id !== user.id));
  };

  const handleProfileClick = (user) => {
    navigate(`/profile/${user.id}`);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <motion.div
        className={`border-b transition-colors duration-300 ${
          isDark ? 'border-gray-700 bg-gray-900/95' : 'border-gray-200 bg-white/95'
        } backdrop-blur-sm sticky top-0 z-40`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Discovery Dashboard
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Explore music and connect with like-minded people
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{matches.length}</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Matches Today</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {songHistory.length + (currentSong ? 1 : 0)}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Songs Played</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-0">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-2 px-4 py-3 rounded-t-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? isDark
                      ? 'bg-gray-800 text-white border-b-2 border-purple-500'
                      : 'bg-white text-gray-900 border-b-2 border-purple-500'
                    : isDark
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                whileHover={{ y: activeTab === tab.id ? 0 : -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{tab.icon}</span>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-sm">{tab.label}</div>
                  <div className="text-xs opacity-70">{tab.description}</div>
                </div>
                
                {/* Active Tab Indicator */}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`pb-24 ${currentSong ? 'pb-32' : 'pb-24'}`}>
        <AnimatePresence mode="wait">
          {activeTab === "swipe" && (
            <motion.div
              key="swipe"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Swipe Cards Section */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Discover New Matches
                    </h2>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {users.length} profiles remaining
                    </div>
                  </div>
                  
                  {users.length > 0 ? (
                    <div className="relative flex justify-center">
                      <div className="w-full max-w-sm">
                        {users.slice(0, 1).map((user) => (
                          <MatchCard
                            key={user.id}
                            user={user}
                            onSwipe={(dir) => handleSwipe(dir, user)}
                            onProfileClick={handleProfileClick}
                            compact={true}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div className="text-4xl mb-4">🎵</div>
                      <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        No more profiles!
                      </h3>
                      <p>Check back later for new people to discover.</p>
                    </div>
                  )}
                </div>

                {/* Quick Actions Sidebar */}
                <div className="lg:w-80">
                  <div className={`p-6 rounded-2xl ${
                    isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <motion.button
                        onClick={() => setActiveTab("songs")}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
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
                            <div className="font-semibold">Discover Songs</div>
                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Find your next favorite track
                            </div>
                          </div>
                        </div>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => setActiveTab("radio")}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                          isDark 
                            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">📻</span>
                          <div>
                            <div className="font-semibold">DNA Radio</div>
                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              Live curated music stations
                            </div>
                          </div>
                        </div>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => navigate("/matches")}
                        className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
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
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "songs" && (
            <motion.div
              key="songs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <RecommendedSongs 
                onSongSelect={handleSongSelect}
                currentSong={currentSong}
              />
            </motion.div>
          )}

          {activeTab === "radio" && (
            <motion.div
              key="radio"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <MusicalDNARadio onSongSelect={handleSongSelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Music Player */}
      <MusicPlayer
        song={currentSong}
        onNext={handleNextSong}
        onPrevious={handlePreviousSong}
        isVisible={!!currentSong}
      />
    </div>
  );
}
