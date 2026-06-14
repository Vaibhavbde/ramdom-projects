import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useMatches } from "../../context/MatchContext";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { matches } = useMatches();

  const navigationItems = [
    { 
      path: "/discover", 
      icon: "🃏", 
      label: "Discover",
      gradient: "from-purple-500 to-purple-600"
    },
    { 
      path: "/music", 
      icon: "�", 
      label: "Music",
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      path: "/matches", 
      icon: "💖", 
      label: "Matches",
      gradient: "from-pink-500 to-pink-600"
    },
    { 
      path: "/my-profile", 
      icon: "👤", 
      label: "Profile",
      gradient: "from-indigo-500 to-indigo-600"
    }
  ];

  const isActiveRoute = (path) => {
    if (path === "/discover") {
      return location.pathname === "/" || location.pathname === "/discover";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Hide navigation on chat and profile pages for full-screen experience
  const hideNavigation = location.pathname.startsWith('/chat') || location.pathname.startsWith('/profile');

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>

      {/* Main Content */}
      <main className={`flex-1 ${hideNavigation ? '' : 'pb-20 pt-2'} transition-all duration-300`}>
        <AnimatePresence mode="wait" key={location.pathname}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation - Enhanced with responsive design */}
      {!hideNavigation && (
        <motion.nav 
          className={`fixed bottom-0 left-0 right-0 border-t backdrop-blur-lg bg-opacity-95 z-40 transition-colors duration-300 ${
            isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center justify-around py-1 px-2 max-w-md mx-auto">
            {navigationItems.map((item, index) => (
              <motion.button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`relative flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                  isActiveRoute(item.path)
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                    : `transition-colors duration-200 ${
                        isDark 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Icon with bounce animation for active state */}
                <motion.span 
                  className="text-xl sm:text-2xl mb-1 relative"
                  animate={isActiveRoute(item.path) ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.icon}
                  {/* Match count badge for matches tab */}
                  {item.path === "/matches" && matches.length > 0 && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {matches.length > 9 ? '9+' : matches.length}
                    </motion.div>
                  )}
                </motion.span>
                
                {/* Label with responsive text */}
                <span className="text-xs font-medium tracking-wide">
                  {item.label}
                </span>
                
                {/* Active indicator dot */}
                <AnimatePresence>
                  {isActiveRoute(item.path) && (
                    <motion.div
                      className="absolute -top-1 w-1 h-1 rounded-full bg-white"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
          
          {/* Bottom safe area for mobile devices */}
          <div className="h-safe-bottom" />
        </motion.nav>
      )}
    </div>
  );
}
