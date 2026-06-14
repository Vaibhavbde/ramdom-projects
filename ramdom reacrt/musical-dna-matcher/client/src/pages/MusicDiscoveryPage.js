import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import RecommendedSongs from "../components/discovery/RecommendedSongs";
import MusicalDNARadio from "../components/discovery/MusicalDNARadio";
import MusicPlayer from "../components/shared/MusicPlayer";
import mockSongs from "../data/mockSongs";

export default function MusicDiscoveryPage() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("songs"); // songs, radio, playlists
  const [currentSong, setCurrentSong] = useState(null);
  const [songHistory, setSongHistory] = useState([]);

  const tabs = [
    { 
      id: "songs", 
      label: "Recommended Songs", 
      icon: "🎵", 
      description: "Curated tracks for your taste",
      color: "from-purple-500 to-pink-500"
    },
    { 
      id: "radio", 
      label: "DNA Radio", 
      icon: "📻", 
      description: "Live curated music stations",
      color: "from-blue-500 to-purple-500"
    },
    { 
      id: "playlists", 
      label: "Smart Playlists", 
      icon: "📋", 
      description: "AI-generated playlists",
      color: "from-green-500 to-blue-500"
    }
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

  const renderPlaylists = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto p-6"
    >
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🤖 Smart Playlists
        </h2>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          AI-generated playlists based on your musical DNA
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            name: "Your Vibe Today",
            description: "Songs that match your current mood",
            songCount: 25,
            duration: "1h 32m",
            color: "from-purple-400 to-pink-400",
            emoji: "🌟"
          },
          {
            name: "Deep Cuts Discovery",
            description: "Hidden gems from your favorite artists",
            songCount: 18,
            duration: "1h 12m",
            color: "from-blue-400 to-purple-400",
            emoji: "💎"
          },
          {
            name: "Genre Fusion",
            description: "Blending your top genres seamlessly",
            songCount: 30,
            duration: "2h 5m",
            color: "from-green-400 to-blue-400",
            emoji: "🌈"
          },
          {
            name: "Workout Energy",
            description: "High-energy tracks to power your sessions",
            songCount: 22,
            duration: "1h 28m",
            color: "from-red-400 to-orange-400",
            emoji: "⚡"
          },
          {
            name: "Chill & Focus",
            description: "Perfect for work and relaxation",
            songCount: 35,
            duration: "2h 45m",
            color: "from-teal-400 to-green-400",
            emoji: "🧘"
          },
          {
            name: "Weekend Vibes",
            description: "Songs for your perfect weekend",
            songCount: 28,
            duration: "1h 55m",
            color: "from-yellow-400 to-red-400",
            emoji: "🌅"
          }
        ].map((playlist, index) => (
          <motion.div
            key={playlist.name}
            className={`relative overflow-hidden rounded-2xl cursor-pointer ${
              isDark 
                ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-lg hover:shadow-xl'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${playlist.color} opacity-10`} />
            
            <div className="relative p-6">
              {/* Playlist Cover */}
              <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${playlist.color} flex items-center justify-center mb-4 shadow-lg`}>
                <span className="text-4xl">{playlist.emoji}</span>
              </div>

              {/* Playlist Info */}
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {playlist.name}
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {playlist.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs">
                <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                  {playlist.songCount} songs
                </span>
                <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                  {playlist.duration}
                </span>
              </div>

              {/* Play Button Overlay */}
              <motion.div
                className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
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
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

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
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🎵 Music Discovery
              </h1>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Explore music tailored to your taste
              </p>
            </div>
            
            {/* Music Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {songHistory.length + (currentSong ? 1 : 0)}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Songs Played</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {mockSongs.length}
                </div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Available</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-0">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-3 px-6 py-4 rounded-t-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? isDark
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-900'
                    : isDark
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                whileHover={{ y: activeTab === tab.id ? 0 : -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">{tab.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className="text-xs opacity-70">{tab.description}</div>
                </div>
                
                {/* Active Tab Indicator */}
                {activeTab === tab.id && (
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.color} rounded-t-lg`}
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

          {activeTab === "playlists" && (
            <motion.div
              key="playlists"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPlaylists()}
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
