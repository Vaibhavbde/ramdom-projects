// src/utils/planner.js

/**
 * Auto-Day Planner Logic
 * Core Algorithm:
 * 1. Sort tasks by priority (high > medium > low) and deadline.
 * 2. Assign time slots based on expected duration. Basic collision avoidance.
 * 3. Assign optimal time of day based on energy levels if possible.
 */

export const generateDailyPlan = (tasks, startHour = 9) => {
  // Deep copy pending tasks
  let pendingTasks = tasks.filter(t => t.status === "pending").map(t => ({ ...t }));
  
  // Sorting: High priority first, then deadline (if we had strict deadlines, but using simple approach)
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  
  pendingTasks.sort((a, b) => {
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  const timeline = [];
  
  // Current time pointer (in minutes from start of day, e.g., 9:00 AM = 9 * 60 = 540)
  let currentTimeInMinutes = startHour * 60; 

  pendingTasks.forEach((task, index) => {
    const startTime = formatTimeFromMinutes(currentTimeInMinutes);
    const duration = task.duration || 60;
    
    // Add task to timeline
    timeline.push({
      ...task,
      isBreak: false,
      startTime: startTime,
      endTime: formatTimeFromMinutes(currentTimeInMinutes + duration),
      durationMinutes: duration,
      startMinutes: currentTimeInMinutes
    });

    currentTimeInMinutes += duration;

    // Smart AI Break Calculation Wait Time
    // Calculate break length: Long duration or High energy needs a longer break
    let recommendedBreak = 5; // Default short break
    if (duration >= 90) {
      recommendedBreak = 20;
    } else if (duration >= 60 || task.energy === "high") {
      recommendedBreak = 15;
    } else if (task.energy === "medium") {
      recommendedBreak = 10;
    }

    // Don't add a break after the very last task
    if (index < pendingTasks.length - 1) {
      timeline.push({
        id: `break_${index}`,
        isBreak: true,
        title: `${recommendedBreak} Min Recharge`,
        durationMinutes: recommendedBreak,
        startTime: formatTimeFromMinutes(currentTimeInMinutes),
        endTime: formatTimeFromMinutes(currentTimeInMinutes + recommendedBreak),
        startMinutes: currentTimeInMinutes
      });
      currentTimeInMinutes += recommendedBreak;
    }
  });

  return timeline;
};

// Helper: 540 -> "09:00 AM"
const formatTimeFromMinutes = (totalMinutes) => {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  const period = hours24 >= 12 && hours24 < 24 ? 'PM' : 'AM';
  const displayHours = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  
  return `${displayHours}:${displayMinutes} ${period}`;
};
