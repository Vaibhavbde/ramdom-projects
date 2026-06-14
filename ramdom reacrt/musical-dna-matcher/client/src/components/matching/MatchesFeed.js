import React from "react";
import CompatibilityScore from "./CompatibilityScore";

export default function MatchesFeed({ matches, onSelect, onStartChat }) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <div className="text-6xl mb-4">💔</div>
        <h2 className="text-xl font-semibold mb-2">No matches yet</h2>
        <p className="text-center text-gray-500">Keep swiping to find your musical soulmate!</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Your Matches ({matches.length})
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {matches.map(user => (
          <div
            key={user.id}
            className="bg-gray-800 rounded-lg p-3 transition-all duration-200 transform hover:scale-105"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-32 object-cover rounded-lg cursor-pointer"
                onClick={() => onSelect(user)}
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                ✨ Match
              </div>
            </div>
            
            <div className="mt-3">
              <h3 
                className="font-bold text-white text-sm truncate cursor-pointer hover:text-purple-400 transition-colors"
                onClick={() => onSelect(user)}
              >
                {user.name}
              </h3>
              <p className="text-gray-400 text-xs mb-2">{user.age}, {user.location}</p>
              <CompatibilityScore score={user.compatibility} />
              
              {/* Quick interests preview */}
              <div className="mt-2 flex flex-wrap gap-1">
                {user.topGenres?.slice(0, 2).map((genre, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartChat(user);
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  💬 Chat
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(user);
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 px-3 rounded-lg transition-colors"
                >
                  👤 Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {matches.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            💬 Start chatting with your matches or 👤 view their full profiles
          </p>
        </div>
      )}
    </div>
  );
}
