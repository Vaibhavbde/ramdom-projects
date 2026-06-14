import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const LoadingSpinner = ({ size = 'md', color = 'purple' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    purple: 'border-purple-500',
    pink: 'border-pink-500',
    blue: 'border-blue-500',
    green: 'border-green-500'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-t-transparent ${colorClasses[color]} rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

export const CardSkeleton = () => {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      className={`rounded-xl overflow-hidden shadow-lg max-w-sm mx-auto transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image skeleton */}
      <div className={`w-full h-64 animate-pulse ${
        isDark ? 'bg-gray-700' : 'bg-gray-200'
      }`} />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className={`h-6 rounded animate-pulse ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
        <div className={`h-4 rounded w-3/4 animate-pulse ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
        <div className={`h-4 rounded w-1/2 animate-pulse ${
          isDark ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
      </div>
    </motion.div>
  );
};

export const ProfileSkeleton = () => {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center space-x-4">
          <div className={`w-4 h-4 rounded animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className={`h-6 rounded w-20 animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
        </div>
        
        {/* Profile card skeleton */}
        <div className={`rounded-xl p-6 shadow-lg transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar skeleton */}
            <div className={`w-32 h-32 rounded-full animate-pulse mx-auto lg:mx-0 ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
            
            {/* Info skeleton */}
            <div className="flex-1 space-y-4">
              <div className={`h-8 rounded w-48 animate-pulse ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
              <div className={`h-6 rounded w-32 animate-pulse ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
              <div className="space-y-2">
                <div className={`h-4 rounded animate-pulse ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
                <div className={`h-4 rounded w-3/4 animate-pulse ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className={`rounded-xl p-6 shadow-lg transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`h-6 rounded w-40 animate-pulse mb-4 ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
              <div className={`h-48 rounded animate-pulse ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const ChatSkeleton = () => {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      className={`h-screen flex flex-col transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header skeleton */}
      <div className={`p-4 border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className={`w-10 h-10 rounded-full animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className="flex-1">
            <div className={`h-5 rounded w-24 animate-pulse mb-2 ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
            <div className={`h-3 rounded w-16 animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`} />
          </div>
        </div>
      </div>
      
      {/* Messages skeleton */}
      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs rounded-lg p-3 animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div className={`h-4 rounded w-full mb-2 ${
                i % 2 === 0 ? 'bg-purple-300' : (isDark ? 'bg-gray-600' : 'bg-gray-300')
              }`} />
              <div className={`h-4 rounded w-3/4 ${
                i % 2 === 0 ? 'bg-purple-300' : (isDark ? 'bg-gray-600' : 'bg-gray-300')
              }`} />
            </div>
          </div>
        ))}
      </div>
      
      {/* Input skeleton */}
      <div className={`p-4 border-t transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className={`flex-1 h-10 rounded-lg animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className={`w-10 h-10 rounded-full animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
        </div>
      </div>
    </motion.div>
  );
};

export const MatchesSkeleton = () => {
  const { isDark } = useTheme();
  
  return (
    <motion.div
      className={`min-h-screen p-4 transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-8 pt-4">
          <div className={`h-8 rounded w-48 mx-auto animate-pulse mb-4 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
          <div className={`h-5 rounded w-64 mx-auto animate-pulse ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`} />
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <motion.div
              key={i}
              className={`rounded-xl overflow-hidden shadow-lg transition-colors duration-300 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <div className={`w-full h-48 animate-pulse ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
              <div className="p-4 space-y-3">
                <div className={`h-6 rounded animate-pulse ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
                <div className={`h-4 rounded w-3/4 animate-pulse ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
                <div className="flex gap-2">
                  <div className={`h-6 rounded-full w-16 animate-pulse ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                  <div className={`h-6 rounded-full w-20 animate-pulse ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                </div>
                <div className="flex gap-2">
                  <div className={`h-8 rounded flex-1 animate-pulse ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                  <div className={`h-8 rounded flex-1 animate-pulse ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
