import React from "react";
import { motion } from "framer-motion";

export default function MessageBubble({ message, isOwn, timestamp, showAvatar, avatar }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className={`flex max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwn && (
          <div className="flex-shrink-0 mr-2">
            {showAvatar ? (
              <img 
                src={avatar} 
                alt={message.senderName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8" /> // Spacer for alignment
            )}
          </div>
        )}

        {/* Message Container */}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {/* Sender Name (only for received messages and first in sequence) */}
          {!isOwn && showAvatar && (
            <span className="text-xs text-gray-400 mb-1 px-3">
              {message.senderName}
            </span>
          )}

          {/* Message Bubble */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative px-4 py-2 rounded-2xl ${
              isOwn 
                ? 'bg-purple-600 text-white rounded-br-md' 
                : 'bg-gray-700 text-white rounded-bl-md'
            } shadow-lg`}
          >
            <p className="text-sm leading-relaxed break-words">
              {message.text}
            </p>
            
            {/* Message tail */}
            <div className={`absolute top-0 w-3 h-3 ${
              isOwn 
                ? 'right-0 bg-purple-600 transform rotate-45 translate-x-1/2 translate-y-1/2' 
                : 'left-0 bg-gray-700 transform rotate-45 -translate-x-1/2 translate-y-1/2'
            }`} />
          </motion.div>

          {/* Timestamp */}
          <span className={`text-xs text-gray-500 mt-1 px-3 ${
            isOwn ? 'text-right' : 'text-left'
          }`}>
            {timestamp}
          </span>
        </div>

        {/* Own avatar space */}
        {isOwn && <div className="w-8 h-8 ml-2" />}
      </div>
    </div>
  );
}
