import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, CheckSquare } from 'lucide-react';

const FocusTimer = () => {
  const { focusMode, activeTask, endFocus, toggleTaskStatus } = useTasks();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 mins
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (focusMode && activeTask) {
      // Set timer to task duration or 25 mins default
      setTimeLeft((activeTask.duration || 25) * 60);
      setIsRunning(false);
    }
  }, [focusMode, activeTask]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Play a sound or notification here
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  if (!focusMode) return null;

  const toggleTimer = () => setIsRunning(!isRunning);

  const handleCompleteTask = () => {
    if (activeTask) {
      toggleTaskStatus(activeTask.id);
    }
    endFocus();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-surface border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.15)] flex flex-col items-center max-w-md w-full relative overflow-hidden"
        >
          {/* Subtle animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/5 opacity-50" />
          
          <button 
            onClick={endFocus}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="text-center relative z-10 w-full">
            <h2 className="text-xl font-medium text-gray-400 mb-2">Deep Work Focus</h2>
            <h3 className="text-2xl font-bold text-white mb-8 truncate px-4">{activeTask?.title || "Focus Session"}</h3>
            
            <div className="text-8xl font-bold text-gradient tracking-tighter mb-10 tabular-nums">
               {formatTime(timeLeft)}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={toggleTimer}
                className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                {isRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </button>
              
              <button 
                onClick={handleCompleteTask}
                className="px-6 h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-primary/40 transition-all flex items-center gap-2"
              >
                <CheckSquare size={20} />
                Complete Task
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FocusTimer;
