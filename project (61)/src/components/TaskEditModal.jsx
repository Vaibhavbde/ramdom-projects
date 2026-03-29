import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';

const TaskEditModal = ({ isOpen, onClose, task, onSave }) => {
  const [editedTask, setEditedTask] = useState(null);

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  if (!isOpen || !editedTask) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedTask);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-surface border border-white/10 p-6 rounded-3xl shadow-2xl max-w-md w-full relative mx-4"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <h3 className="text-xl font-bold text-white mb-6">Customize Task</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase">Task Title</label>
              <input 
                type="text" 
                required
                value={editedTask.title}
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white focus:border-primary outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase">Duration (mins)</label>
                <input 
                  type="number" 
                  min="5" step="5" required
                  value={editedTask.duration}
                  onChange={(e) => setEditedTask({...editedTask, duration: parseInt(e.target.value, 10)})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white focus:border-primary outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase">Priority</label>
                <select 
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({...editedTask, priority: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white focus:border-primary outline-none appearance-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase">Energy Level</label>
              <select 
                value={editedTask.energy}
                onChange={(e) => setEditedTask({...editedTask, energy: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-white focus:border-primary outline-none appearance-none"
              >
                <option value="high">High (Maximum Focus)</option>
                <option value="medium">Medium (Steady Pace)</option>
                <option value="low">Low (Relaxed Work)</option>
              </select>
            </div>

            <button 
              type="submit"
              className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Save size={18} /> Update Task
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskEditModal;
