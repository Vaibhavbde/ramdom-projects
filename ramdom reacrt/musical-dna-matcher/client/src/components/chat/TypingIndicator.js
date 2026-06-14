import React from "react";
import { motion } from "framer-motion";

export default function TypingIndicator({ user, avatar }) {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-end space-x-2 max-w-xs">
        {/* Avatar */}
        <img 
          src={avatar} 
          alt={user.name}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />

        {/* Typing Bubble */}
        <div className="bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
          <div className="flex items-center space-x-1">
            <span className="text-gray-400 text-sm mr-2">
              {user.name} is typing
            </span>
            
            {/* Animated Dots */}
            <div className="flex space-x-1">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
