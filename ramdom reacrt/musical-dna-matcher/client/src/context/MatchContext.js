import React, { createContext, useContext, useState } from 'react';

const MatchContext = createContext();

export const useMatches = () => {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error('useMatches must be used within a MatchProvider');
  }
  return context;
};

export const MatchProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);
  const [swipeHistory, setSwipeHistory] = useState([]);

  const addMatch = (user) => {
    setMatches(prev => {
      // Avoid duplicates
      if (prev.find(match => match.id === user.id)) {
        return prev;
      }
      return [...prev, user];
    });
  };

  const removeMatch = (userId) => {
    setMatches(prev => prev.filter(match => match.id !== userId));
  };

  const removeFromSwipeHistory = (userId) => {
    setSwipeHistory(prev => prev.filter(swipe => swipe.user.id !== userId));
  };

  const addToSwipeHistory = (user, direction) => {
    setSwipeHistory(prev => [...prev, { user, direction, timestamp: Date.now() }]);
  };

  const getMatchCount = () => matches.length;

  const getSwipeHistoryCount = () => swipeHistory.length;

  const hasUserBeenSwiped = (userId) => {
    return swipeHistory.some(swipe => swipe.user.id === userId);
  };

  const getUserSwipeDirection = (userId) => {
    const swipe = swipeHistory.find(swipe => swipe.user.id === userId);
    return swipe ? swipe.direction : null;
  };

  const clearMatches = () => {
    setMatches([]);
  };

  const clearSwipeHistory = () => {
    setSwipeHistory([]);
  };

  const value = {
    matches,
    swipeHistory,
    addMatch,
    removeMatch,
    addToSwipeHistory,
    removeFromSwipeHistory,
    getMatchCount,
    getSwipeHistoryCount,
    hasUserBeenSwiped,
    getUserSwipeDirection,
    clearMatches,
    clearSwipeHistory
  };

  return (
    <MatchContext.Provider value={value}>
      {children}
    </MatchContext.Provider>
  );
};
