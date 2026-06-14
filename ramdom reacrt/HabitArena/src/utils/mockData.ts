// Mock user data
export const mockUser = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
  points: 320,
  streak: 15,
  joinedDate: '2023-02-15T08:00:00.000Z',
  preferences: {
    morningPerson: true,
    notificationsEnabled: true,
    weekStartsOn: 1, // Monday
  },
};

// Mock habits data
export const mockHabits = [
  {
    id: 'habit1',
    name: 'Morning Exercise',
    description: 'Do 30 minutes of workout each morning',
    frequency: 'daily',
    difficulty: 'medium',
    createdAt: '2023-03-01T08:00:00.000Z',
    completedDates: [
      '2023-07-01',
      '2023-07-02',
      '2023-07-03',
      '2023-07-04',
      '2023-07-05',
    ],
    streak: 5,
    points: 2,
    color: '#4F46E5',
    reminder: '07:00',
  },
  {
    id: 'habit2',
    name: 'Read Books',
    description: 'Read at least 20 pages of any book',
    frequency: 'daily',
    difficulty: 'easy',
    createdAt: '2023-03-15T10:30:00.000Z',
    completedDates: [
      '2023-07-01',
      '2023-07-02',
      '2023-07-03',
    ],
    streak: 3,
    points: 1,
    color: '#0D9488',
    reminder: '20:00',
  },
  {
    id: 'habit3',
    name: 'Weekly Planning',
    description: 'Plan the next week on Sunday',
    frequency: 'weekly',
    daysOfWeek: [0], // Sunday
    difficulty: 'medium',
    createdAt: '2023-04-02T18:00:00.000Z',
    completedDates: [
      '2023-07-02',
    ],
    streak: 1,
    points: 2,
    color: '#9333EA',
  },
  {
    id: 'habit4',
    name: 'Drink 8 Glasses of Water',
    description: 'Stay hydrated throughout the day',
    frequency: 'daily',
    difficulty: 'easy',
    createdAt: '2023-05-10T09:15:00.000Z',
    completedDates: [
      '2023-07-01',
      '2023-07-02',
      '2023-07-03',
      '2023-07-04',
    ],
    streak: 4,
    points: 1,
    color: '#0D9488',
    reminder: '10:00',
  },
  {
    id: 'habit5',
    name: 'Meditate',
    description: '10 minutes of mindful meditation',
    frequency: 'daily',
    difficulty: 'easy',
    createdAt: '2023-06-05T21:00:00.000Z',
    completedDates: [
      '2023-07-01',
      '2023-07-02',
    ],
    streak: 2,
    points: 1,
    color: '#9333EA',
    reminder: '21:30',
  },
];

// Mock quotes
export const mockQuotes = [
  {
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    quote: "Motivation is what gets you started. Habit is what keeps you going.",
    author: "Jim Ryun"
  },
  {
    quote: "Habits are first cobwebs, then cables.",
    author: "Spanish Proverb"
  },
  {
    quote: "The secret of your future is hidden in your daily routine.",
    author: "Mike Murdock"
  },
  {
    quote: "Champions don't do extraordinary things. They do ordinary things, but they do them without thinking, too fast for the other team to react.",
    author: "Tony Dungy"
  },
  {
    quote: "You'll never change your life until you change something you do daily. The secret of your success is found in your daily routine.",
    author: "John C. Maxwell"
  },
  {
    quote: "Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones.",
    author: "Benjamin Franklin"
  },
  {
    quote: "First we make our habits, then our habits make us.",
    author: "Charles C. Noble"
  },
  {
    quote: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln"
  },
  {
    quote: "Small changes eventually add up to huge results.",
    author: "Unknown"
  }
];

// Mock badges data
export const mockBadges = [
  {
    id: 'badge1',
    name: 'Early Bird',
    description: 'Complete morning habits for 7 consecutive days',
    icon: 'Sunrise',
    category: 'achievement',
    requiredValue: 7,
    currentValue: 5,
    unlocked: false,
  },
  {
    id: 'badge2',
    name: 'Bookworm',
    description: 'Read books for 10 days',
    icon: 'BookOpen',
    category: 'achievement',
    requiredValue: 10,
    currentValue: 12,
    unlocked: true,
  },
  {
    id: 'badge3',
    name: 'Mindfulness Master',
    description: 'Meditate for 15 days',
    icon: 'BrainCircuit',
    category: 'achievement',
    requiredValue: 15,
    currentValue: 8,
    unlocked: false,
  },
  {
    id: 'badge4',
    name: '100 Point Club',
    description: 'Earn 100 points',
    icon: 'Trophy',
    category: 'milestone',
    requiredValue: 100,
    currentValue: 320,
    unlocked: true,
  },
  {
    id: 'badge5',
    name: 'Habit Enthusiast',
    description: 'Create 5 habits',
    icon: 'Star',
    category: 'milestone',
    requiredValue: 5,
    currentValue: 5,
    unlocked: true,
  },
  {
    id: 'badge6',
    name: '10-Day Streak',
    description: 'Maintain any habit for 10 days in a row',
    icon: 'Flame',
    category: 'streak',
    requiredValue: 10,
    currentValue: 15,
    unlocked: true,
  },
  {
    id: 'badge7',
    name: '30-Day Streak',
    description: 'Maintain any habit for 30 days in a row',
    icon: 'Zap',
    category: 'streak',
    requiredValue: 30,
    currentValue: 15,
    unlocked: false,
  },
  {
    id: 'badge8',
    name: 'Perfect Week',
    description: 'Complete all habits for 7 consecutive days',
    icon: 'CheckCircle',
    category: 'achievement',
    requiredValue: 7,
    currentValue: 5,
    unlocked: false,
  },
];

// Mock leaderboard data
export const mockLeaderboard = [
  {
    id: 'user1', // This is the current user
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    points: 320,
    streak: 15,
  },
  {
    id: 'user2',
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400',
    points: 445,
    streak: 20,
  },
  {
    id: 'user3',
    name: 'Michael Chen',
    avatar: 'https://images.pexels.com/photos/769745/pexels-photo-769745.jpeg?auto=compress&cs=tinysrgb&w=400',
    points: 380,
    streak: 18,
  },
  {
    id: 'user4',
    name: 'Emily Rodriguez',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    points: 356,
    streak: 12,
  },
  {
    id: 'user5',
    name: 'David Kim',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    points: 325,
    streak: 8,
  },
  {
    id: 'user6',
    name: 'Jennifer Lee',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    points: 315,
    streak: 14,
  },
  {
    id: 'user7',
    name: 'Daniel Smith',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    points: 290,
    streak: 11,
  },
  {
    id: 'user8',
    name: 'Lisa Wong',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
    points: 275,
    streak: 9,
  },
  {
    id: 'user9',
    name: 'Jason Brown',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    points: 260,
    streak: 7,
  },
  {
    id: 'user10',
    name: 'Sophie Martinez',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    points: 245,
    streak: 6,
  },
];

// Get a random quote from the array
export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * mockQuotes.length);
  return mockQuotes[randomIndex];
};