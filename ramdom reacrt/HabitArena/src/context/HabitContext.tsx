import { createContext, useState, useEffect } from 'react';
import { mockHabits } from '../utils/mockData';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// Types
export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  daysOfWeek?: number[]; // 0 = Sunday, 6 = Saturday
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  completedDates: string[]; // ISO date strings
  streak: number;
  color?: string; // For UI customization
  reminder?: string; // Time string: "HH:MM"
  points: number;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // ISO date string
  completed: boolean;
}

interface HabitContextType {
  habits: Habit[];
  todaysHabits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak' | 'points'>) => void;
  updateHabit: (id: string, habitData: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date?: string) => void;
  getCompletedHabits: (date?: string) => Habit[];
  getPendingHabits: (date?: string) => Habit[];
  getStreak: (habitId?: string) => number;
  getTotalPoints: () => number;
}

// Create context
export const HabitContext = createContext<HabitContextType>({
  habits: [],
  todaysHabits: [],
  addHabit: () => {},
  updateHabit: () => {},
  deleteHabit: () => {},
  toggleHabitCompletion: () => {},
  getCompletedHabits: () => [],
  getPendingHabits: () => [],
  getStreak: () => 0,
  getTotalPoints: () => 0,
});

// Provider component
export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todaysHabits, setTodaysHabits] = useState<Habit[]>([]);

  // Load habits from localStorage
  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    } else {
      // Use mock data for demo
      setHabits(mockHabits);
      localStorage.setItem('habits', JSON.stringify(mockHabits));
    }
  }, []);

  // Update today's habits whenever habits change
  useEffect(() => {
    const today = new Date();
    const todayString = format(today, 'yyyy-MM-dd');
    const day = today.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Filter habits for today based on frequency and days of week
    const filtered = habits.filter(habit => {
      if (habit.frequency === 'daily') {
        return true;
      }
      if (habit.frequency === 'weekly' && habit.daysOfWeek?.includes(day)) {
        return true;
      }
      // For monthly habits, check if it's the same day of month
      if (habit.frequency === 'monthly' && today.getDate() === new Date(habit.createdAt).getDate()) {
        return true;
      }
      return false;
    });
    
    setTodaysHabits(filtered);
  }, [habits]);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  // Add a new habit
  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'streak' | 'points'>) => {
    const now = new Date();
    const id = `habit_${Date.now()}`;
    
    // Calculate points based on difficulty
    let points = 0;
    switch (habit.difficulty) {
      case 'easy': points = 1; break;
      case 'medium': points = 2; break;
      case 'hard': points = 3; break;
    }
    
    const newHabit: Habit = {
      ...habit,
      id,
      createdAt: now.toISOString(),
      completedDates: [],
      streak: 0,
      points
    };
    
    setHabits(prevHabits => [...prevHabits, newHabit]);
    toast.success(`Habit "${habit.name}" created successfully!`);
  };

  // Update an existing habit
  const updateHabit = (id: string, habitData: Partial<Habit>) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === id ? { ...habit, ...habitData } : habit
      )
    );
    toast.success('Habit updated successfully!');
  };

  // Delete a habit
  const deleteHabit = (id: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
    toast.success('Habit deleted successfully!');
  };

  // Toggle habit completion for a specific date (defaults to today)
  const toggleHabitCompletion = (id: string, date = format(new Date(), 'yyyy-MM-dd')) => {
    setHabits(prevHabits => {
      return prevHabits.map(habit => {
        if (habit.id !== id) return habit;
        
        // Check if the habit is already completed for this date
        const isCompleted = habit.completedDates.includes(date);
        let completedDates;
        
        if (isCompleted) {
          // If already completed, remove this date
          completedDates = habit.completedDates.filter(d => d !== date);
          toast.error(`"${habit.name}" marked as incomplete!`);
        } else {
          // If not completed, add this date
          completedDates = [...habit.completedDates, date];
          toast.success(`"${habit.name}" completed! +${habit.points} points`);
        }
        
        // Calculate new streak
        const calculateStreak = (dates: string[]): number => {
          if (dates.length === 0) return 0;
          
          // Sort dates in ascending order
          const sortedDates = [...dates].sort();
          let currentStreak = 1;
          
          for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(sortedDates[i]);
            
            // Check if dates are consecutive
            const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              currentStreak++;
            } else {
              currentStreak = 1; // Reset streak if there's a gap
            }
          }
          
          return currentStreak;
        };
        
        return {
          ...habit,
          completedDates,
          streak: calculateStreak(completedDates)
        };
      });
    });
  };

  // Get completed habits for a specific date (defaults to today)
  const getCompletedHabits = (date = format(new Date(), 'yyyy-MM-dd')): Habit[] => {
    return todaysHabits.filter(habit => habit.completedDates.includes(date));
  };

  // Get pending habits for a specific date (defaults to today)
  const getPendingHabits = (date = format(new Date(), 'yyyy-MM-dd')): Habit[] => {
    return todaysHabits.filter(habit => !habit.completedDates.includes(date));
  };

  // Get streak for a specific habit or overall
  const getStreak = (habitId?: string): number => {
    if (habitId) {
      const habit = habits.find(h => h.id === habitId);
      return habit ? habit.streak : 0;
    }
    
    // Calculate overall streak as the max streak among all habits
    return habits.reduce((max, habit) => Math.max(max, habit.streak), 0);
  };

  // Get total points
  const getTotalPoints = (): number => {
    return habits.reduce((total, habit) => {
      // Each completed date adds points based on difficulty
      return total + (habit.completedDates.length * habit.points);
    }, 0);
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        todaysHabits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        getCompletedHabits,
        getPendingHabits,
        getStreak,
        getTotalPoints,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};