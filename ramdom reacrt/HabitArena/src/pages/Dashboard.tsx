import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import { useHabits } from '../hooks/useHabits';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import {
  CheckCircle2,
  XCircle,
  Award,
  TrendingUp,
  Calendar,
  Quote,
  ExternalLink,
} from 'lucide-react';
import { getRandomQuote } from '../utils/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    todaysHabits, 
    getCompletedHabits, 
    getPendingHabits, 
    toggleHabitCompletion, 
    getStreak, 
    getTotalPoints 
  } = useHabits();
  
  const [quote, setQuote] = useState({ quote: '', author: '' });
  const todayFormatted = format(new Date(), 'EEEE, MMMM do, yyyy');
  const completedHabits = getCompletedHabits();
  const pendingHabits = getPendingHabits();

  // Set a random quote on component mount
  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {getGreeting()}, <span className="text-primary-500">{user?.name.split(' ')[0]}</span>!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          {todayFormatted}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100">Current Streak</p>
                <h3 className="text-3xl font-bold mt-1">{getStreak()} days</h3>
              </div>
              <TrendingUp className="w-10 h-10 text-primary-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary-500 to-secondary-600 text-white">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-100">Habits Completed</p>
                <h3 className="text-3xl font-bold mt-1">{completedHabits.length}/{todaysHabits.length}</h3>
              </div>
              <CheckCircle2 className="w-10 h-10 text-secondary-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent-500 to-accent-600 text-white">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-100">Total Points</p>
                <h3 className="text-3xl font-bold mt-1">{getTotalPoints()}</h3>
              </div>
              <Award className="w-10 h-10 text-accent-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quote Card */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-start gap-4">
            <Quote className="w-8 h-8 text-primary-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-lg italic">"{quote.quote}"</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-right">— {quote.author}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Habits */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Habits</h2>
        </div>
        
        {todaysHabits.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">You don't have any habits for today.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* Completed Habits */}
            {completedHabits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-success-500" />
                  Completed
                </h3>
                {completedHabits.map((habit) => (
                  <Card key={habit.id} className="border-l-4 border-success-500 animate-slide-up">
                    <CardContent className="py-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">{habit.name}</h4>
                        {habit.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{habit.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleHabitCompletion(habit.id)}
                        className="p-2 rounded-full text-success-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Pending Habits */}
            {pendingHabits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <XCircle className="w-5 h-5 mr-2 text-gray-500" />
                  Pending
                </h3>
                {pendingHabits.map((habit) => (
                  <Card key={habit.id} className="border-l-4 border-gray-300 dark:border-gray-700 animate-slide-up">
                    <CardContent className="py-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">{habit.name}</h4>
                        {habit.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{habit.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => toggleHabitCompletion(habit.id)}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Recent Achievements or Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="bg-primary-100 dark:bg-primary-900/40 p-1 rounded text-primary-500 mt-0.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">Complete daily habits to increase your streak</p>
            </li>
            <li className="flex items-start gap-2">
              <div className="bg-primary-100 dark:bg-primary-900/40 p-1 rounded text-primary-500 mt-0.5">
                <Award className="w-4 h-4" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">Earn badges by consistently maintaining your habits</p>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <a href="#" className="text-primary-500 hover:text-primary-600 inline-flex items-center text-sm">
            Learn more about building better habits
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;