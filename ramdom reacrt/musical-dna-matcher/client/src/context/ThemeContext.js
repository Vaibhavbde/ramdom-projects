import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default to dark mode

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('musical-dna-theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  // Save theme preference and apply to document
  useEffect(() => {
    localStorage.setItem('musical-dna-theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: {
      // Background colors
      primary: isDark ? 'bg-gray-900' : 'bg-white',
      secondary: isDark ? 'bg-gray-800' : 'bg-gray-50',
      tertiary: isDark ? 'bg-gray-700' : 'bg-gray-100',
      
      // Text colors
      textPrimary: isDark ? 'text-white' : 'text-gray-900',
      textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
      textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
      
      // Border colors
      border: isDark ? 'border-gray-700' : 'border-gray-200',
      borderLight: isDark ? 'border-gray-600' : 'border-gray-300',
      
      // Interactive colors
      accent: 'bg-purple-600 hover:bg-purple-700',
      accentSecondary: 'bg-pink-600 hover:bg-pink-700',
      success: 'bg-green-600 hover:bg-green-700',
      warning: 'bg-yellow-600 hover:bg-yellow-700',
      danger: 'bg-red-600 hover:bg-red-700',
      
      // Card colors
      cardBg: isDark ? 'bg-gray-800' : 'bg-white',
      cardHover: isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50',
      
      // Input colors
      input: isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300',
      inputFocus: isDark ? 'focus:border-purple-500' : 'focus:border-purple-500',
    },
    shadows: {
      sm: isDark ? 'shadow-lg shadow-black/20' : 'shadow-md shadow-gray-200/50',
      md: isDark ? 'shadow-xl shadow-black/30' : 'shadow-lg shadow-gray-300/30',
      lg: isDark ? 'shadow-2xl shadow-black/40' : 'shadow-xl shadow-gray-400/20',
    },
    animations: {
      fadeIn: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
      },
      slideIn: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.4 }
      },
      scaleIn: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 }
      },
      staggerChildren: {
        animate: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
