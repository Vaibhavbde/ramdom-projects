import React from "react";

export default function ChatsList({ matches, onStartChat }) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <div className="text-6xl mb-4">💬</div>
        <h2 className="text-xl font-semibold mb-2">No conversations yet</h2>
        <p className="text-center text-gray-500">Start chatting with your matches!</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Your Conversations
      </h2>
      
      <div className="space-y-3">
        {matches.map((user, index) => (
          <div
            key={user.id}
            className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-all duration-200"
            onClick={() => onStartChat(user)}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-white truncate">{user.name}</h3>
                  <span className="text-xs text-gray-400">
                    {index === 0 ? "2m ago" : index === 1 ? "1h ago" : "3h ago"}
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 truncate">
                  {index === 0 && "Love it! 🔥"}
                  {index === 1 && "This is such a vibe!"}
                  {index === 2 && "You have incredible taste! 🎵"}
                  {index > 2 && "Hey! I saw we both love music! 🎵"}
                </p>
                
                {/* Match indicator */}
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                    {user.compatibility}% Match
                  </span>
                  {index < 2 && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>
              </div>

              {/* Chat arrow */}
              <div className="text-gray-400">
                →
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {matches.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            💬 Tap any conversation to continue chatting
          </p>
        </div>
      )}
    </div>
  );
}
