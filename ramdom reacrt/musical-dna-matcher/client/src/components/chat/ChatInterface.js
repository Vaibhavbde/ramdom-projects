import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import SongShareBubble from "./SongShareBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";

export default function ChatInterface({ match, onBack }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser] = useState({ id: "user1", name: "You" });
  const messagesEndRef = useRef(null);

  // Sample initial conversation
  useEffect(() => {
    const initialMessages = [
      {
        id: 1,
        senderId: match.id,
        senderName: match.name,
        text: `Hey! I saw we both love ${match.topGenres?.[0] || 'music'} music! 🎵`,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        type: "text"
      },
      {
        id: 2,
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: "Yes! Your music taste is amazing! What's your favorite song right now?",
        timestamp: new Date(Date.now() - 3500000),
        type: "text"
      },
      {
        id: 3,
        senderId: match.id,
        senderName: match.name,
        text: "I'm obsessed with this track, you have to listen to it!",
        timestamp: new Date(Date.now() - 3400000),
        type: "text"
      },
      {
        id: 4,
        senderId: match.id,
        senderName: match.name,
        song: {
          title: "Midnight City",
          artist: "M83",
          album: "Hurry Up, We're Dreaming",
          cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
          duration: "4:01",
          genre: match.topGenres?.[0] || "Electronic"
        },
        timestamp: new Date(Date.now() - 3300000),
        type: "song"
      }
    ];
    setMessages(initialMessages);
  }, [match, currentUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (text, songData = null) => {
    const newMessage = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: songData ? `Check out this song!` : text,
      song: songData,
      timestamp: new Date(),
      type: songData ? "song" : "text"
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate match response after a delay
    if (Math.random() > 0.3) { // 70% chance of response
      simulateMatchResponse();
    }
  };

  const simulateMatchResponse = () => {
    setIsTyping(true);
    
    const responses = [
      "Love it! 🔥",
      "This is such a vibe!",
      "You have incredible taste! 🎵",
      "Adding this to my playlist right now!",
      "This reminds me of when I saw them live!",
      "Perfect for a late night drive 🌙",
      "You're introducing me to so much good music!",
      "We should definitely go to a concert together sometime 🎤"
    ];

    setTimeout(() => {
      setIsTyping(false);
      const response = {
        id: Date.now(),
        senderId: match.id,
        senderName: match.name,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: "text"
      };
      setMessages(prev => [...prev, response]);
    }, 2000 + Math.random() * 2000); // 2-4 second delay
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Chat Header */}
      <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700">
        <button 
          onClick={onBack}
          className="mr-3 p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          ← Back
        </button>
        <img 
          src={match.avatar} 
          alt={match.name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{match.name}</h2>
          <p className="text-sm text-green-400">● Online</p>
        </div>
        <div className="text-right text-sm text-gray-400">
          <p>{match.compatibility}% Match</p>
          <p className="text-xs">Musical Soulmate</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {message.type === "song" ? (
                <SongShareBubble 
                  message={message}
                  isOwn={message.senderId === currentUser.id}
                  timestamp={formatTime(message.timestamp)}
                />
              ) : (
                <MessageBubble 
                  message={message}
                  isOwn={message.senderId === currentUser.id}
                  timestamp={formatTime(message.timestamp)}
                  showAvatar={
                    index === 0 || 
                    messages[index - 1].senderId !== message.senderId
                  }
                  avatar={message.senderId === match.id ? match.avatar : null}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TypingIndicator 
                user={match} 
                avatar={match.avatar}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        placeholder={`Message ${match.name}...`}
      />
    </div>
  );
}
