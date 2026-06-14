import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatInput({ onSendMessage, placeholder }) {
  const [message, setMessage] = useState("");
  const [showSongPicker, setShowSongPicker] = useState(false);
  const inputRef = useRef(null);

  // Sample songs for sharing
  const sampleSongs = [
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      duration: "3:20",
      genre: "Synthpop"
    },
    {
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      album: "Fine Line",
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
      duration: "2:54",
      genre: "Pop Rock"
    },
    {
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      album: "SOUR",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      duration: "2:58",
      genre: "Pop Punk"
    },
    {
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      cover: "https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?w=400&h=400&fit=crop",
      duration: "3:23",
      genre: "Disco Pop"
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      inputRef.current?.focus();
    }
  };

  const handleSongShare = (song) => {
    onSendMessage("", song);
    setShowSongPicker(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative">
      {/* Song Picker Modal */}
      <AnimatePresence>
        {showSongPicker && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-t-xl shadow-xl max-h-80 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Share a Song</h3>
                <button
                  onClick={() => setShowSongPicker(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-2">
                {sampleSongs.map((song, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 cursor-pointer transition-colors"
                    onClick={() => handleSongShare(song)}
                  >
                    <img 
                      src={song.cover} 
                      alt={song.album}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {song.title}
                      </p>
                      <p className="text-gray-300 text-xs truncate">
                        {song.artist}
                      </p>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {song.duration}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Container */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          {/* Song Share Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSongPicker(!showSongPicker)}
            className={`flex-shrink-0 p-3 rounded-full transition-colors ${
              showSongPicker 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
          >
            🎵
          </motion.button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 max-h-32"
              rows="1"
              style={{
                minHeight: '48px',
                height: 'auto',
                overflowY: message.length > 100 ? 'auto' : 'hidden'
              }}
            />
          </div>

          {/* Send Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={!message.trim()}
            className={`flex-shrink-0 p-3 rounded-full transition-colors ${
              message.trim()
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            <svg 
              className="w-5 h-5 transform rotate-90" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </motion.button>
        </form>

        {/* Input Helpers */}
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{message.length}/500</span>
        </div>
      </div>
    </div>
  );
}
