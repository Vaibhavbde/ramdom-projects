import React, { createContext, useState, useContext, useEffect } from 'react';
import { mockTasks } from '../data/mockTasks';
import { arrayMove } from '@dnd-kit/sortable';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

// Generate dummy dates for history tracking demo
const today = new Date();
const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

const initialDummyHistory = [
  ...mockTasks,
  { id: 'hist-1', title: 'Complete Client Presentation', duration: 120, category: 'work', priority: 'high', energy: 'high', status: 'completed', completedAt: yesterday.toISOString() },
  { id: 'hist-2', title: 'Gym Session - Legs', duration: 60, category: 'health', priority: 'medium', energy: 'high', status: 'completed', completedAt: yesterday.toISOString() },
  { id: 'hist-3', title: 'Read Atomic Habits ch 4-5', duration: 45, category: 'learning', priority: 'low', energy: 'low', status: 'completed', completedAt: yesterday.toISOString() },
  { id: 'hist-4', title: 'Weekly Groceries', duration: 45, category: 'life', priority: 'medium', energy: 'low', status: 'completed', completedAt: twoDaysAgo.toISOString() },
  { id: 'hist-5', title: 'Inbox Zero & Email catchup', duration: 30, category: 'work', priority: 'low', energy: 'medium', status: 'completed', completedAt: twoDaysAgo.toISOString() },
  { id: 'hist-6', title: 'Plan Sprint Architecture', duration: 90, category: 'work', priority: 'high', energy: 'high', status: 'completed', completedAt: twoDaysAgo.toISOString() }
];

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [focusMode, setFocusMode] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    // Start with dummy history so Analytics page is fully populated
    setTasks(initialDummyHistory);
  }, []);

  const addTask = (taskDetails) => {
    const newTask = {
      id: "t_" + Date.now().toString(),
      ...taskDetails,
      status: "pending" 
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const isCompleting = task.status !== "completed";
        return { 
          ...task, 
          status: isCompleting ? "completed" : "pending",
          completedAt: isCompleting ? new Date().toISOString() : null
        };
      }
      return task;
    }));
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const reorderTasks = (activeId, overId) => {
    setTasks((prevTasks) => {
      const oldIndex = prevTasks.findIndex(t => t.id === activeId);
      const newIndex = prevTasks.findIndex(t => t.id === overId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(prevTasks, oldIndex, newIndex);
      }
      return prevTasks;
    });
  };

  const startFocus = (task) => {
    setActiveTask(task);
    setFocusMode(true);
  };

  const endFocus = () => {
    setFocusMode(false);
    if(activeTask && activeTask.status === "completed") {
      setActiveTask(null);
    }
  };

  const contextValue = {
    tasks,
    setTasks,
    addTask,
    toggleTaskStatus,
    updateTask,
    reorderTasks,
    focusMode,
    startFocus,
    endFocus,
    activeTask,
    setActiveTask
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};
