import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import ChatInterface from "../components/chat/ChatInterface";
import mockUsers from "../data/mockUsers";
import { LoadingSpinner } from "../components/shared/LoadingComponents";

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find user by ID
    const foundUser = mockUsers.find(u => u.id === id);
    
    if (foundUser) {
      // Add compatibility score if not present
      setUser({
        ...foundUser,
        compatibility: foundUser.compatibility || Math.floor(Math.random() * 40) + 60,
        avatar: foundUser.avatar.startsWith('http') 
          ? foundUser.avatar 
          : `https://images.unsplash.com/photo-${
              foundUser.id === 'u2' ? '1494790108755-2616b69011ce' :
              foundUser.id === 'u5' ? '1507003211169-0a1dd7228f2d' :
              foundUser.id === 'u8' ? '1438761681033-6461ffad8d80' :
              '1472099645785-5658abf4ff4e'
            }?w=400&h=400&fit=crop`
      });
    }
    
    setLoading(false);
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  };

  if (loading) {
    return (
      <motion.div 
        className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${
          isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <motion.p 
            className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading chat...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div 
        className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${
          isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <motion.div 
            className="text-6xl mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            😕
          </motion.div>
          <motion.h2 
            className="text-xl font-semibold mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            User not found
          </motion.h2>
          <motion.p 
            className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            This user might not exist or the chat is unavailable.
          </motion.p>
          <motion.button
            onClick={() => navigate('/matches')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Back to Matches
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <ChatInterface 
        match={user}
        onBack={handleBack}
      />
    </motion.div>
  );
}
