// src/utils/parser.js

/**
 * Parses natural language input into a structured task object.
 * Example input: "Study DBMS for 2 hours tomorrow high priority"
 */
export const parseTaskInput = (text) => {
  const lowerText = text.toLowerCase();
  
  const task = {
    title: text, // Will refine later
    duration: 60, // Default 60 mins
    priority: "medium",
    energy: "medium",
    category: "general",
    deadline: new Date().toISOString()
  };

  // 1. Extract Priority
  if (lowerText.includes("high") || lowerText.includes("important") || lowerText.includes("urgent")) {
    task.priority = "high";
  } else if (lowerText.includes("low") || lowerText.includes("whenever")) {
    task.priority = "low";
  }

  // 2. Extract Duration (e.g., "30 min", "2 hours", "1.5 hrs")
  const minMatch = lowerText.match(/(\d+)\s*(min|m|minutes)/);
  const hrMatch = lowerText.match(/(\d+(?:\.\d+)?)\s*(hr|hrs|hour|hours)/);
  if (minMatch) {
    task.duration = parseInt(minMatch[1], 10);
  } else if (hrMatch) {
    task.duration = parseFloat(hrMatch[1]) * 60;
  }

  // 3. Extract Energy / Time of day
  if (lowerText.includes("morning") || lowerText.includes("breakfast")) {
    task.energy = "high";
  } else if (lowerText.includes("afternoon") || lowerText.includes("lunch")) {
    task.energy = "medium";
  } else if (lowerText.includes("night") || lowerText.includes("evening")) {
    task.energy = "low";
  }

  // 4. Extract Deadline
  if (lowerText.includes("tomorrow")) {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    task.deadline = tmrw.toISOString();
  }

  // 5. Extract Category (basic keyword matching)
  if (lowerText.includes("study") || lowerText.includes("read") || lowerText.includes("learn")) {
    task.category = "study";
  } else if (lowerText.includes("gym") || lowerText.includes("workout") || lowerText.includes("run")) {
    task.category = "health";
  } else if (lowerText.includes("work") || lowerText.includes("meeting") || lowerText.includes("email")) {
    task.category = "work";
  }

  // Clean title: Remove known keywords to make it cleaner, or just use the original.
  // We'll keep it simple for MVP and just use the original text, maybe capitalize first letter.
  task.title = text.charAt(0).toUpperCase() + text.slice(1);

  return task;
};
