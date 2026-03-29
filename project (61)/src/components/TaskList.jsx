import React from 'react';
import { useTasks } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Clock, Flame, Tag, GripVertical } from 'lucide-react';
import clsx from 'clsx';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/* Sortable Item Component */
const SortableTask = ({ task, toggleTaskStatus, startFocus }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  // Helper priority colors
  const getPriorityColor = (priority) => {
    switch(priority) {
      case "high": return "text-danger border-danger/30 bg-danger/10";
      case "medium": return "text-primary border-primary/30 bg-primary/10";
      case "low": return "text-gray-400 border-gray-600 bg-white/5";
      default: return "text-gray-400 border-gray-600 bg-white/5";
    }
  };

  const getEnergyColor = (energy) => {
    switch(energy) {
      case "high": return "text-accent";
      case "medium": return "text-primary";
      case "low": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "group relative bg-black/40 border p-4 rounded-xl flex items-start gap-3 transition-colors",
        isDragging ? "border-primary/60 shadow-[0_0_20px_rgba(59,130,246,0.3)] opacity-90 scale-\[1.02\]" : "border-white/5 hover:border-white/10"
      )}
    >
      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="mt-0.5 text-gray-600 hover:text-gray-300 cursor-grab active:cursor-grabbing flex-shrink-0"
      >
        <GripVertical size={20} />
      </div>

      <button 
        onClick={() => toggleTaskStatus(task.id)}
        className="mt-0.5 text-gray-400 hover:text-accent transition-colors flex-shrink-0"
      >
        <Circle size={20} />
      </button>
      
      <div className="flex-1 min-w-0 pr-8">
        <h4 className="font-medium text-gray-100 truncate pr-4">{task.title}</h4>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {task.duration}m
          </span>
          <span className={`px-1.5 py-0.5 rounded flex items-center gap-1 border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={clsx("flex items-center gap-1", getEnergyColor(task.energy))}>
            <Flame size={12} /> {task.energy}
          </span>
          {task.category && (
            <span className="flex items-center gap-1 text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">
              <Tag size={12} /> {task.category}
            </span>
          )}
        </div>
      </div>
      
      <button
        onClick={() => startFocus(task)}
        className="opacity-0 group-hover:opacity-100 absolute right-4 top-[50%] -translate-y-[50%] bg-accent/20 text-accent hover:bg-accent hover:text-white transition-all px-3 py-1.5 rounded-lg text-xs font-medium shadow-[0_0_10px_rgba(16,185,129,0.2)]"
      >
        Focus
      </button>
    </div>
  );
};

const TaskList = () => {
  const { tasks, toggleTaskStatus, startFocus, reorderTasks } = useTasks();
  
  const pendingTasks = tasks.filter(t => t.status === "pending");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      reorderTasks(active.id, over.id);
    }
  };

  return (
    <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden bg-surface/50 border-white/5 mt-4 text-sm relative">
      <div className="p-5 border-b border-white/5 bg-black/20 shrink-0 sticky top-0 z-10 backdrop-blur-md">
        <h3 className="font-semibold text-lg flex items-center justify-between">
          <span>Active Operations</span>
          <span className="text-xs bg-white/10 px-2 py-1 rounded-md text-gray-300">{pendingTasks.length} pending</span>
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col gap-2 relative">
            <SortableContext
              items={pendingTasks.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence>
                {pendingTasks.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-center p-8 text-gray-500"
                  >
                    All operations complete. Relax or add more to flow.
                  </motion.div>
                ) : (
                  pendingTasks.map((task) => (
                    <SortableTask 
                      key={task.id} 
                      task={task} 
                      toggleTaskStatus={toggleTaskStatus} 
                      startFocus={startFocus} 
                    />
                  ))
                )}
              </AnimatePresence>
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default TaskList;
