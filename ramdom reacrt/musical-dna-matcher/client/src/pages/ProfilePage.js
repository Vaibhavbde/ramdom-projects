import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import ProfileView from "../components/profile/ProfileView";

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleStartChat = () => {
    navigate(`/chat/${id}`);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div 
      className={`min-h-screen transition-colors duration-300 ${
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
      {/* Header with back button */}
      <motion.div 
        className={`sticky top-0 z-10 p-4 transition-colors duration-300 ${
          isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } border-b backdrop-blur-sm bg-opacity-90`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <motion.button 
            onClick={handleBack}
            className={`flex items-center space-x-2 transition-colors duration-200 ${
              isDark
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </motion.button>
          
          <motion.button
            onClick={handleStartChat}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💬 Chat
          </motion.button>
        </div>
      </motion.div>

      {/* Profile Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <ProfileView 
          userId={id} 
          showBackButton={false} // We handle navigation in this component
        />
      </motion.div>
    </motion.div>
  );
}
