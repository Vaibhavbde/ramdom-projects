import React, { useState } from "react";
import mockUsers from "../../data/mockUsers";
import MatchCard from "./MatchCard";
import ProfileView from "../profile/ProfileView";
import MatchesFeed from "./MatchesFeed";
import ChatInterface from "../chat/ChatInterface";
import ChatsList from "../chat/ChatsList";

export default function SwipeInterface() {
  // Add default compatibility scores for users that don't have them
  const usersWithCompatibility = mockUsers.map(user => ({
    ...user,
    compatibility: user.compatibility || Math.floor(Math.random() * 40) + 60 // Random score between 60-100
  }));

  const [users, setUsers] = useState(usersWithCompatibility);
  const [matches, setMatches] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("discover"); // "discover" or "matches"
  const [swipeHistory, setSwipeHistory] = useState([]); // For undo functionality
  const [animatingCard, setAnimatingCard] = useState(null); // For exit animations
  const [chatUser, setChatUser] = useState(null); // For chat interface

  const handleSwipe = (direction, swipedUser) => {
    // Store for undo functionality
    setSwipeHistory(prev => [...prev, { user: swipedUser, direction, index: users.findIndex(u => u.id === swipedUser.id) }]);
    
    // Set animating card for exit animation
    setAnimatingCard({ user: swipedUser, direction });
    
    if (direction === "right") {
      setMatches(prev => [...prev, swipedUser]);
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
    
    // If it was a match, remove from matches
    if (lastSwipe.direction === "right") {
      setMatches(prev => prev.filter(u => u.id !== lastSwipe.user.id));
    }
    
    // Add user back to the front of the deck
    setUsers(prev => [lastSwipe.user, ...prev]);
  };

  const handleProfileClick = (user) => {
    setSelectedUser(user);
  };

  const closeProfile = () => {
    setSelectedUser(null);
  };

  const handleStartChat = (user) => {
    setChatUser(user);
  };

  const closeChatInterface = () => {
    setChatUser(null);
  };

  return (
    <>
      <div className="relative min-h-screen bg-gray-900 text-white">
        {/* Navigation Tabs */}
        <div className="flex bg-gray-800 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("discover")}
            className={`flex-1 py-4 px-4 text-center font-semibold transition-colors ${
              activeTab === "discover"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-700"
            }`}
          >
            <span className="text-lg mr-2">🃏</span>
            <span className="hidden sm:inline">Discover</span>
          </button>
          <button
            onClick={() => setActiveTab("matches")}
            className={`flex-1 py-4 px-4 text-center font-semibold transition-colors relative ${
              activeTab === "matches"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-700"
            }`}
          >
            <span className="text-lg mr-2">💖</span>
            <span className="hidden sm:inline">Matches</span>
            {matches.length > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {matches.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-4 px-4 text-center font-semibold transition-colors ${
              activeTab === "chats"
                ? "bg-purple-600 text-white"
                : "text-gray-300 hover:text-white hover:bg-gray-700"
            }`}
          >
            <span className="text-lg mr-2">💬</span>
            <span className="hidden sm:inline">Chats</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="relative">
          {activeTab === "discover" ? (
            <div className="flex items-center justify-center h-screen">
              {users.length === 0 && (
                <div className="text-center text-gray-400 p-8">
                  <div className="text-6xl mb-4">🎵</div>
                  <h2 className="text-2xl font-bold mb-4">No more users to show!</h2>
                  <p className="mb-4">You've swiped through everyone. Check back later for new matches!</p>
                  <div className="mt-4">
                    <p className="text-green-400">Total matches: {matches.length}</p>
                  </div>
                  {swipeHistory.length > 0 && (
                    <button
                      onClick={handleUndo}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      ↶ Undo Last Swipe
                    </button>
                  )}
                </div>
              )}
              
              {/* Instructions */}
              {users.length > 0 && (
                <div className="absolute top-4 left-4 text-gray-400 text-sm">
                  <p>← Swipe left to pass</p>
                  <p>→ Swipe right to match</p>
                  <p className="mt-1 text-xs">Tap card for full profile</p>
                </div>
              )}

              {/* Undo Button */}
              {users.length > 0 && swipeHistory.length > 0 && (
                <button
                  onClick={handleUndo}
                  className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  ↶ Undo
                </button>
              )}

              {/* Stack of cards */}
              <div className="relative flex items-center justify-center">
                {users.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className={index === 0 ? "relative" : "absolute"}
                    style={{
                      zIndex: users.length - index,
                      transform: index > 0 ? `translateY(${index * 4}px) scale(${1 - index * 0.05})` : 'none',
                      opacity: index > 1 ? 0.7 : 1
                    }}
                  >
                    <MatchCard
                      user={user}
                      onSwipe={(dir) => handleSwipe(dir, user)}
                      onProfileClick={index === 0 ? handleProfileClick : null}
                      isAnimating={animatingCard && animatingCard.user.id === user.id}
                      animationDirection={animatingCard?.direction}
                    />
                  </div>
                ))}
              </div>

              {/* Match counter */}
              {users.length > 0 && (
                <div className="absolute bottom-4 right-4 text-green-400 bg-gray-800 px-4 py-2 rounded-lg">
                  Matches: {matches.length}
                </div>
              )}
            </div>
          ) : activeTab === "matches" ? (
            <MatchesFeed 
              matches={matches} 
              onSelect={handleProfileClick}
              onStartChat={handleStartChat}
            />
          ) : (
            <ChatsList 
              matches={matches}
              onStartChat={handleStartChat}
            />
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full h-full overflow-y-auto">
            {/* Close button */}
            <button
              onClick={closeProfile}
              className="fixed top-4 right-4 z-60 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors"
            >
              ✕
            </button>
            <ProfileView 
              userId={selectedUser.id} 
              showBackButton={false}
            />
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {chatUser && (
        <div className="fixed inset-0 bg-gray-900 z-50">
          <ChatInterface 
            match={chatUser}
            onBack={closeChatInterface}
          />
        </div>
      )}
    </>
  );
}
