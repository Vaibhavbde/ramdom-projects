import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { format, subDays, startOfWeek, addDays, parseISO } from 'date-fns';
import Button from '../components/ui/Button';
import { Calendar, PieChart as PieChartIcon, BarChart2, LineChart as LineChartIcon } from 'lucide-react';

// Types for chart data
interface DailyCompletionData {
  date: string;
  completed: number;
  total: number;
}

interface DifficultyData {
  name: string;
  value: number;
  color: string;
}

interface StreakData {
  name: string;
  streak: number;
}

const Progress = () => {
  const { habits } = useHabits();
  const [chartType, setChartType] = useState<'week' | 'month'>('week');
  
  // Prepare data for the weekly completion chart
  const getCompletionData = (): DailyCompletionData[] => {
    // Get first day of current week
    const firstDay = startOfWeek(new Date(), { weekStartsOn: 1 }); // Week starts on Monday
    
    // Create an array of dates for the last 7 days or 30 days depending on the chart type
    const daysToShow = chartType === 'week' ? 7 : 30;
    const startDate = chartType === 'week' ? firstDay : subDays(new Date(), 29);
    
    const dates = Array.from({ length: daysToShow }, (_, i) => 
      format(addDays(startDate, i), 'yyyy-MM-dd')
    );
    
    // Count completed habits for each date
    return dates.map(date => {
      // For each date, filter habits that should be completed on that day
      const dayOfWeek = new Date(date).getDay(); // 0 = Sunday, 6 = Saturday
      const habitsForDay = habits.filter(habit => {
        if (habit.frequency === 'daily') return true;
        if (habit.frequency === 'weekly' && habit.daysOfWeek?.includes(dayOfWeek)) return true;
        // For monthly habits, check if it's the same day of month as creation date
        if (habit.frequency === 'monthly') {
          const habitCreationDay = new Date(habit.createdAt).getDate();
          const currentDay = new Date(date).getDate();
          return habitCreationDay === currentDay;
        }
        return false;
      });
      
      const completedCount = habitsForDay.filter(habit => 
        habit.completedDates.includes(date)
      ).length;
      
      return {
        date: format(new Date(date), 'MMM d'),
        completed: completedCount,
        total: habitsForDay.length,
      };
    });
  };
  
  // Prepare data for the difficulty spread chart
  const getDifficultyData = (): DifficultyData[] => {
    const difficulties: Record<string, { count: number, color: string }> = {
      easy: { count: 0, color: '#22C55E' },
      medium: { count: 0, color: '#3B82F6' },
      hard: { count: 0, color: '#9333EA' },
    };
    
    habits.forEach(habit => {
      difficulties[habit.difficulty].count += 1;
    });
    
    return Object.entries(difficulties).map(([name, { count, color }]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: count,
      color,
    }));
  };
  
  // Prepare data for the streak chart
  const getStreakData = (): StreakData[] => {
    return habits
      .filter(habit => habit.streak > 0)
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5)
      .map(habit => ({
        name: habit.name,
        streak: habit.streak,
      }));
  };
  
  const completionData = getCompletionData();
  const difficultyData = getDifficultyData();
  const streakData = getStreakData();
  
  // Custom tooltip for the completion chart
  const CompletionTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-2 shadow rounded border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{data.date}</p>
          <p className="text-sm">
            Completed: <span className="text-primary-500">{data.completed}</span> / {data.total}
          </p>
          <p className="text-sm">
            Rate: {data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0}%
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Progress</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your habit completion and progress over time
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={chartType === 'week' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChartType('week')}
            leftIcon={<Calendar className="w-4 h-4" />}
          >
            Week
          </Button>
          <Button
            variant={chartType === 'month' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setChartType('month')}
            leftIcon={<Calendar className="w-4 h-4" />}
          >
            Month
          </Button>
        </div>
      </div>
      
      {habits.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Create some habits to see your progress charts.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Completion Rate Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center">
                <LineChartIcon className="w-5 h-5 text-primary-500 mr-2" />
                <CardTitle>Habit Completion Rate</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={completionData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#6B7280' }}
                      tickMargin={10}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280' }}
                      tickMargin={10}
                    />
                    <Tooltip content={<CompletionTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      name="Completed Habits"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total Habits"
                      stroke="#9CA3AF"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Difficulty Distribution */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <PieChartIcon className="w-5 h-5 text-primary-500 mr-2" />
                <CardTitle>Habit Difficulty Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} habits`, name]}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        padding: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-center gap-4 mt-4">
                {difficultyData.map((entry) => (
                  <div key={entry.name} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Longest Streaks */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <BarChart2 className="w-5 h-5 text-primary-500 mr-2" />
                <CardTitle>Top Habit Streaks</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {streakData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={streakData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                      <XAxis type="number" tick={{ fill: '#6B7280' }} />
                      <YAxis 
                        dataKey="name" 
                        type="category"
                        width={100}
                        tick={{ fill: '#6B7280' }}
                        tickFormatter={(value) => 
                          value.length > 15 ? `${value.substring(0, 15)}...` : value
                        }
                      />
                      <Tooltip
                        formatter={(value) => [`${value} days`, 'Current Streak']}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          padding: '8px',
                        }}
                      />
                      <Bar dataKey="streak" fill="#4F46E5" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No streak data available yet.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Progress;