import { useState } from 'react';
import { useHabits, Habit } from '../hooks/useHabits';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Plus, Edit, Trash2, MoreVertical, CheckCircle2, Clock, Tag, Bell, X } from 'lucide-react';
import { format } from 'date-fns';

const difficultyLabels: Record<string, { label: string, color: string }> = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  hard: { label: 'Hard', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
};

const frequencyLabels: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

const daysOfWeek = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

const HabitManager = () => {
  const { habits, addHabit, updateHabit, deleteHabit } = useHabits();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentHabit, setCurrentHabit] = useState<Habit | null>(null);
  const [activeHabit, setActiveHabit] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    daysOfWeek: [] as number[],
    difficulty: 'easy',
    color: '#4F46E5',
    reminder: '',
  });
  
  const handleOpenForm = () => {
    setIsFormOpen(true);
    setIsEditing(false);
    setFormData({
      name: '',
      description: '',
      frequency: 'daily',
      daysOfWeek: [],
      difficulty: 'easy',
      color: '#4F46E5',
      reminder: '',
    });
  };
  
  const handleEditHabit = (habit: Habit) => {
    setIsFormOpen(true);
    setIsEditing(true);
    setCurrentHabit(habit);
    setFormData({
      name: habit.name,
      description: habit.description || '',
      frequency: habit.frequency,
      daysOfWeek: habit.daysOfWeek || [],
      difficulty: habit.difficulty,
      color: habit.color || '#4F46E5',
      reminder: habit.reminder || '',
    });
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setCurrentHabit(null);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleDayToggle = (day: number) => {
    setFormData(prev => {
      const daysOfWeek = [...prev.daysOfWeek];
      if (daysOfWeek.includes(day)) {
        return {
          ...prev,
          daysOfWeek: daysOfWeek.filter((d) => d !== day),
        };
      } else {
        return {
          ...prev,
          daysOfWeek: [...daysOfWeek, day],
        };
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const habitData = {
      name: formData.name,
      description: formData.description,
      frequency: formData.frequency as 'daily' | 'weekly' | 'monthly',
      daysOfWeek: formData.frequency === 'weekly' ? formData.daysOfWeek : undefined,
      difficulty: formData.difficulty as 'easy' | 'medium' | 'hard',
      color: formData.color,
      reminder: formData.reminder,
    };
    
    if (isEditing && currentHabit) {
      updateHabit(currentHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
    
    handleCloseForm();
  };
  
  const handleDeleteHabit = (id: string) => {
    deleteHabit(id);
    setShowConfirmDelete(null);
  };
  
  const toggleHabitActions = (id: string) => {
    setActiveHabit(activeHabit === id ? null : id);
    setShowConfirmDelete(null);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Habits</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your habits and track your progress
          </p>
        </div>
        <Button 
          onClick={handleOpenForm}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          New Habit
        </Button>
      </div>
      
      {/* Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You haven't created any habits yet.
                </p>
                <Button
                  onClick={handleOpenForm}
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  Create Your First Habit
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          habits.map((habit) => (
            <Card 
              key={habit.id} 
              className="relative overflow-hidden border-l-4"
              style={{ borderLeftColor: habit.color || '#4F46E5' }}
            >
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{habit.name}</h3>
                    {habit.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{habit.description}</p>
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => toggleHabitActions(habit.id)}
                      className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    {/* Dropdown menu */}
                    {activeHabit === habit.id && (
                      <div className="absolute z-10 right-0 mt-1 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 border border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => handleEditHabit(habit)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setShowConfirmDelete(habit.id);
                            setActiveHabit(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                    
                    {/* Confirm delete dialog */}
                    {showConfirmDelete === habit.id && (
                      <div className="absolute z-20 -right-32 md:right-0 mt-1 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-md p-3 border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          Are you sure you want to delete this habit?
                        </p>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowConfirmDelete(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleDeleteHabit(habit.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {frequencyLabels[habit.frequency]}
                      {habit.frequency === 'weekly' && habit.daysOfWeek && (
                        <span className="ml-1">
                          ({habit.daysOfWeek.map(day => daysOfWeek[day].label).join(', ')})
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Tag className="w-4 h-4 mr-2 text-gray-500" />
                    <span className={`px-2 py-0.5 rounded-full text-xs ${difficultyLabels[habit.difficulty].color}`}>
                      {difficultyLabels[habit.difficulty].label}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Current streak: <span className="font-medium text-primary-500">{habit.streak} days</span>
                    </span>
                  </div>
                </div>
                
                {habit.reminder && (
                  <div className="mt-2 text-sm flex items-center text-gray-600 dark:text-gray-400">
                    <Bell className="w-4 h-4 mr-1 text-gray-500" />
                    Reminder: {habit.reminder}
                  </div>
                )}
                
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                  Created on {format(new Date(habit.createdAt), 'MMM d, yyyy')}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Habit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {isEditing ? 'Edit' : 'Create'} Habit
                </h2>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Habit Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="input"
                    placeholder="e.g., Morning Exercise"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    className="input min-h-[80px]"
                    placeholder="Add details about your habit..."
                  />
                </div>
                
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Frequency*
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleFormChange}
                    className="input"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                {formData.frequency === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Days of Week
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => handleDayToggle(day.value)}
                          className={`px-3 py-1.5 rounded-full text-sm ${
                            formData.daysOfWeek.includes(day.value)
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                    {formData.daysOfWeek.length === 0 && formData.frequency === 'weekly' && (
                      <p className="text-red-500 text-sm mt-1">
                        Please select at least one day
                      </p>
                    )}
                  </div>
                )}
                
                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleFormChange}
                    className="input"
                  >
                    <option value="easy">Easy (1 point)</option>
                    <option value="medium">Medium (2 points)</option>
                    <option value="hard">Hard (3 points)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleFormChange}
                      className="w-10 h-10 rounded border border-gray-300 dark:border-gray-700 p-0.5"
                    />
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      Choose a color for your habit
                    </span>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reminder (Optional)
                  </label>
                  <input
                    type="time"
                    id="reminder"
                    name="reminder"
                    value={formData.reminder}
                    onChange={handleFormChange}
                    className="input"
                  />
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    Set a time for daily reminders
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseForm}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={(formData.frequency === 'weekly' && formData.daysOfWeek.length === 0) || !formData.name}
                  >
                    {isEditing ? 'Update' : 'Create'} Habit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitManager;