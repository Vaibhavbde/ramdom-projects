import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { generateDailyPlan } from '../utils/planner';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Edit3, GripVertical } from 'lucide-react';
import TaskEditModal from './TaskEditModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/* Sortable Timeline Block Component */
const SortableTimelineBlock = ({ block, getSlotColor, onEditClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, disabled: block.isBreak });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  if (block.isBreak) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="relative mb-6 opacity-80"
      >
        <div className="absolute -left-[31px] top-4 w-3 h-3 rounded-full border-2 border-gray-600 bg-background z-10" />
        <div className="text-xs font-mono text-gray-400 mb-1 flex items-center gap-2">
          <span>{block.startTime}</span> <span className="opacity-50">—</span> <span>{block.endTime}</span>
          <span className="ml-2 px-1.5 py-0.5 rounded bg-white/5 text-[10px]">{block.durationMinutes}m Rest</span>
        </div>
        <div className="p-3 rounded-xl border border-white/5 bg-surface/50 backdrop-blur-md flex items-center justify-center text-gray-400 text-sm font-medium border-dashed">
          <Zap size={14} className="mr-2 text-yellow-500/50" /> {block.title}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative mb-8 ${isDragging ? 'opacity-80 scale-[1.02] shadow-[0_0_20px_rgba(59,130,246,0.3)]' : ''}`}
    >
      <div className="absolute -left-[31px] top-4 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10" />
      
      <div className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-2">
        <span className="text-white font-medium">{block.startTime}</span> 
        <span className="opacity-50">—</span> 
        <span>{block.endTime}</span>
        <span className="ml-2 px-1.5 py-0.5 rounded bg-white/5 text-[10px]">{block.durationMinutes}m</span>
      </div>
      
      <div className={`group p-4 rounded-xl border backdrop-blur-md ${getSlotColor(block.category, block.priority)} transition-all relative flex flex-col`}>
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-2">
            <div 
              {...attributes} 
              {...listeners} 
              className="text-white/40 hover:text-white cursor-grab active:cursor-grabbing -ml-1 mt-0.5"
            >
              <GripVertical size={18} />
            </div>
            <h4 className="font-semibold text-lg">{block.title}</h4>
          </div>
          
          <button 
            onClick={() => onEditClick(block)}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 p-1.5 rounded-lg text-white backdrop-blur-md"
          >
            <Edit3 size={16} />
          </button>
        </div>

        <div className="flex items-center gap-4 mt-2 text-xs opacity-80 pl-7">
          <span className="capitalize">Energy: {block.energy}</span>
          <span className="capitalize shadow-sm">Priority: {block.priority}</span>
        </div>
      </div>
    </div>
  );
};

const Timeline = () => {
  const { tasks, updateTask, reorderTasks } = useTasks();
  const [timeline, setTimeline] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handlePlanDay = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const plan = generateDailyPlan(tasks, 9); // Start at 9 AM
      setTimeline(plan);
      setIsGenerating(false);
    }, 600); 
  };

  // Keep timeline in sync when tasks update if the timeline is already generated
  useEffect(() => {
    if (timeline.length > 0) {
      setTimeline(generateDailyPlan(tasks, 9));
    }
  }, [tasks]);

  const handleSaveEdit = (updatedBlock) => {
    updateTask(updatedBlock.id, updatedBlock);
    setEditingTask(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTasks(active.id, over.id);
    }
  };

  // Re-generate if tasks change drastically ?
  // For MVP, manual clicking "Plan My Day" is better.

  const getSlotColor = (category, priority) => {
    if (priority === "high") return "bg-danger/20 border-danger/40 text-danger";
    if (category === "study") return "bg-blue-500/20 border-blue-500/40 text-blue-400";
    if (category === "work") return "bg-purple-500/20 border-purple-500/40 text-purple-400";
    if (category === "health") return "bg-accent/20 border-accent/40 text-accent";
    return "bg-white/10 border-white/20 text-gray-300";
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="font-semibold text-xl">Daily Planner Timeline</h3>
        <button 
          id="plan-my-day-btn"
          onClick={handlePlanDay}
          disabled={isGenerating}
          className="bg-primary hover:bg-primary/80 transition-all text-white px-5 py-2 rounded-xl font-medium shadow-lg hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center gap-2 disabled:opacity-70 disabled:hover:shadow-none"
        >
          <Zap size={18} className={isGenerating ? "animate-pulse" : ""} />
          {isGenerating ? "Synthesizing..." : "Plan My Day"}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar relative border-l-2 border-white/10 ml-4 pl-6 pb-20">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={timeline.filter(t => !t.isBreak).map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {timeline.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-gray-500 absolute top-1/3 left-[50%] -translate-x-[50%] flex flex-col items-center gap-4 text-center w-full"
                >
                  <Zap size={40} className="text-gray-700 mx-auto" />
                  <p>Hit "Plan My Day" to generate an optimized schedule<br/>based on priority and energy levels.</p>
                </motion.div>
              ) : (
                timeline.map((block, index) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <SortableTimelineBlock 
                      block={block} 
                      getSlotColor={getSlotColor} 
                      onEditClick={setEditingTask} 
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
        
        {/* End of day marker */}
        {timeline.length > 0 && (
           <div className="absolute -left-[29px] bottom-10 w-2 h-2 rounded-full bg-white/20 ring-4 ring-background" />
        )}
      </div>

      <TaskEditModal 
        isOpen={editingTask !== null}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default Timeline;
