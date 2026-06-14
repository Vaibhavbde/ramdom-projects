import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { getRandomQuote } from '../utils/mockData';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Bell, Clock, BellOff, Quote } from 'lucide-react';
import toast from 'react-hot-toast';

const Reminders = () => {
  const { habits, updateHabit } = useHabits();
  const [motivationalQuote] = useState(getRandomQuote());

  // Handle setting a reminder
  const handleSetReminder = (habitId: string, time: string) => {
    updateHabit(habitId, { reminder: time });
    toast.success('Reminder time updated!');
  };

  // Handle removing a reminder
  const handleRemoveReminder = (habitId: string) => {
    updateHabit(habitId, { reminder: '' });
    toast.success('Reminder removed!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reminders</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Set reminders for your habits to stay on track
        </p>
      </div>

      {/* Quote Card */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Quote className="w-10 h-10 text-primary-300 flex-shrink-0" />
            <div>
              <p className="text-xl italic">"{motivationalQuote.quote}"</p>
              <p className="text-primary-200 mt-2 text-right">— {motivationalQuote.author}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reminders List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Habits</h2>
        </div>

        <div className="space-y-4">
          {habits.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You haven't created any habits yet.
                </p>
                <Button
                  onClick={() => window.location.href = '/habits'}
                  leftIcon={<Bell className="w-5 h-5" />}
                >
                  Create Habits
                </Button>
              </CardContent>
            </Card>
          ) : (
            habits.map((habit) => (
              <Card key={habit.id} className="animate-slide-up">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{habit.name}</h3>
                      {habit.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{habit.description}</p>
                      )}
                      
                      <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1 text-gray-500" />
                        {habit.frequency === 'daily' 
                          ? 'Daily habit' 
                          : habit.frequency === 'weekly'
                            ? 'Weekly habit'
                            : 'Monthly habit'
                        }
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {habit.reminder ? (
                        <>
                          <div className="flex items-center bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-md">
                            <Bell className="w-4 h-4 mr-2" />
                            <span>{habit.reminder}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveReminder(habit.id)}
                            leftIcon={<BellOff className="w-4 h-4" />}
                          >
                            Remove
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            className="input px-2 py-1 text-sm h-9"
                            onChange={(e) => handleSetReminder(habit.id, e.target.value)}
                          />
                          <Button
                            size="sm"
                            onClick={() => {
                              const timeInput = document.querySelector(`input[type="time"]`) as HTMLInputElement;
                              if (timeInput.value) {
                                handleSetReminder(habit.id, timeInput.value);
                              } else {
                                toast.error('Please select a time');
                              }
                            }}
                            leftIcon={<Bell className="w-4 h-4" />}
                          >
                            Set
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Setting reminders can help you stay consistent with your habits. You'll receive notifications at the specified times to remind you to complete your habits.
          </p>
          
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md flex items-start">
            <div className="bg-amber-100 dark:bg-amber-800 p-1 rounded text-amber-700 dark:text-amber-300 mr-2 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <p className="text-sm">
              <strong>Note:</strong> This is a demo app. In a real application, reminders would send actual notifications to your device at the specified times.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reminders;