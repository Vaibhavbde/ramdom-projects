import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/shared/ThemeToggle";

export default function MyProfile() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  const sidebarItems = [
    { id: "overview", label: "Profile Overview", icon: "👤", description: "Your basic info" },
    { id: "music", label: "Musical DNA", icon: "🧬", description: "Your music preferences" },
    { id: "photos", label: "Photos", icon: "📸", description: "Manage your photos" },
    { id: "settings", label: "Settings", icon: "⚙️", description: "App preferences" },
    { id: "privacy", label: "Privacy", icon: "🔒", description: "Privacy controls" },
    { id: "help", label: "Help & Support", icon: "❓", description: "Get assistance" }
  ];

  const userProfile = {
    name: "Alex Johnson",
    age: 26,
    location: "San Francisco, CA",
    bio: "Music lover, coffee enthusiast, and always looking for the next great song to discover. Love everything from indie rock to electronic beats!",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    topGenres: ["Indie Rock", "Electronic", "Alternative", "Jazz Fusion"],
    favoriteArtists: ["Radiohead", "Bon Iver", "Flying Lotus", "Thom Yorke"],
    musicalDnaScore: 92,
    totalMatches: 47,
    songsDiscovered: 1234,
    favoriteDecade: "2010s"
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl font-bold text-white shadow-xl">
              👤
            </div>
            <motion.button
              className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              📷
            </motion.button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {userProfile.name}
              </h1>
              {!isEditing && (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className={`p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✏️
                </motion.button>
              )}
            </div>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
              {userProfile.age} • {userProfile.location}
            </p>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {userProfile.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "DNA Score", value: userProfile.musicalDnaScore, suffix: "%", color: "text-green-400" },
          { label: "Total Matches", value: userProfile.totalMatches, suffix: "", color: "text-pink-400" },
          { label: "Songs Found", value: userProfile.songsDiscovered, suffix: "", color: "text-blue-400" },
          { label: "Favorite Era", value: userProfile.favoriteDecade, suffix: "", color: "text-purple-400" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {typeof stat.value === 'number' && stat.value > 999 
                ? `${(stat.value / 1000).toFixed(1)}k` 
                : stat.value}{stat.suffix}
            </div>
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Musical Preferences */}
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          🎵 Musical DNA
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className={`font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Top Genres
            </h4>
            <div className="flex flex-wrap gap-2">
              {userProfile.topGenres.map((genre, index) => (
                <span
                  key={genre}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
                  style={{ 
                    background: `linear-gradient(135deg, hsl(${index * 60}, 60%, ${isDark ? '30%' : '85%'}), hsl(${(index * 60) + 30}, 60%, ${isDark ? '25%' : '90%'}))` 
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className={`font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Favorite Artists
            </h4>
            <div className="space-y-2">
              {userProfile.favoriteArtists.map((artist) => (
                <div
                  key={artist}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    🎤
                  </div>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {artist}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Settings
      </h2>
      
      {/* Settings sections */}
      {[
        {
          title: "Account Settings",
          items: [
            { label: "Email", value: "alex@example.com", action: "Change" },
            { label: "Password", value: "••••••••", action: "Update" },
            { label: "Phone", value: "+1 (555) 123-4567", action: "Verify" }
          ]
        },
        {
          title: "App Preferences",
          items: [
            { label: "Theme", component: <ThemeToggle />, action: null },
            { label: "Language", value: "English", action: "Change" },
            { label: "Notifications", value: "Enabled", action: "Configure" }
          ]
        },
        {
          title: "Discovery Preferences",
          items: [
            { label: "Age Range", value: "22-30", action: "Adjust" },
            { label: "Distance", value: "50 miles", action: "Change" },
            { label: "Genre Compatibility", value: "Strict", action: "Modify" }
          ]
        },
        {
          title: "Notifications",
          items: [
            { label: "New Matches", value: "Enabled", action: "Toggle" },
            { label: "Messages", value: "Enabled", action: "Toggle" },
            { label: "Song Recommendations", value: "Disabled", action: "Toggle" }
          ]
        }
      ].map((section, sectionIndex) => (
        <div key={section.title} className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {section.title}
          </h3>
          <div className="space-y-3">
            {section.items.map((item, index) => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <div className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {item.label}
                  </div>
                  {item.value && (
                    <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {item.value}
                    </div>
                  )}
                </div>
                {item.component ? (
                  item.component
                ) : (
                  <motion.button
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isDark 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    } transition-colors`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.action}
                  </motion.button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "settings":
        return renderSettings();
      case "music":
        return (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🧬</div>
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Musical DNA Analysis
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
              Coming soon - Deep dive into your music preferences
            </p>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Coming Soon
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
              This section is under development
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          className={`w-64 min-h-screen border-r p-6 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your Profile
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your account and preferences
            </p>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs opacity-70 ${
                    activeSection === item.id ? 'text-white' : ''
                  }`}>
                    {item.description}
                  </div>
                </div>
              </motion.button>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
            <motion.button
              onClick={() => navigate(-1)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl">←</span>
              <div>
                <div className="font-medium">Back to App</div>
                <div className="text-xs opacity-70">Return to discovery</div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
