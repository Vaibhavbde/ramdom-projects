import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Trophy, Medal, Info, User, Users, Flame, X } from 'lucide-react';
import { mockLeaderboard } from '../utils/mockData';
import { Button } from '../components/ui/Button';

const Leaderboard = () => {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<'points' | 'streak'>('points');
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Sort leaderboard data
  const sortedLeaderboard = [...mockLeaderboard].sort((a, b) => {
    return b[sortBy] - a[sortBy];
  });
  
  // Find current user's rank
  const userRank = sortedLeaderboard.findIndex(item => item.id === user?.id) + 1;
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            See how you rank among other users
          </p>
        </div>
        
        <button
          onClick={() => setShowInfoModal(true)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          aria-label="Information about leaderboard"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
      
      {/* Ranking Card */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <p className="text-primary-100">Your Current Rank</p>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold">{userRank}</span>
                <span className="text-lg font-medium">/ {sortedLeaderboard.length}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 bg-white/10 p-3 rounded-lg">
            <div className="flex-1 flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-primary-100">Total Points</p>
                <p className="text-xl font-semibold">{user?.points}</p>
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-primary-100">Current Streak</p>
                <p className="text-xl font-semibold">{user?.streak} days</p>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full"></div>
          <div className="absolute right-20 -top-10 w-20 h-20 bg-white/5 rounded-full"></div>
        </CardContent>
      </Card>
      
      {/* Sorting options */}
      <div className="flex justify-end mb-2">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setSortBy('points')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
              sortBy === 'points'
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
          >
            Sort by Points
          </button>
          <button
            onClick={() => setSortBy('streak')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
              sortBy === 'streak'
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
            }`}
          >
            Sort by Streak
          </button>
        </div>
      </div>
      
      {/* Leaderboard Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Streak</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedLeaderboard.map((userData, index) => (
                  <tr 
                    key={userData.id}
                    className={`
                      ${userData.id === user?.id ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-750'}
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {index < 3 ? (
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${index === 0 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                            index === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' :
                            'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}
                        `}>
                          <Medal className="w-5 h-5" />
                        </div>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400 font-medium">{index + 1}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={userData.avatar}
                          alt={userData.name}
                          className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-200 dark:border-gray-700"
                        />
                        <span className={`font-medium ${userData.id === user?.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-800 dark:text-gray-200'}`}>
                          {userData.name}
                          {userData.id === user?.id && <span className="text-sm text-primary-400 dark:text-primary-300 ml-2">(You)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 text-primary-500 mr-2" />
                        <span className={`font-medium ${userData.id === user?.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-800 dark:text-gray-200'}`}>
                          {userData.points}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Flame className="w-4 h-4 text-primary-500 mr-2" />
                        <span className={`font-medium ${userData.id === user?.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-800 dark:text-gray-200'}`}>
                          {userData.streak} days
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <Trophy className="w-6 h-6 text-primary-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  About the Leaderboard
                </h2>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                The leaderboard shows how you rank compared to other users based on your total points or current streak.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">How points are earned:</h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                  <li>• Easy habits: 1 point per completion</li>
                  <li>• Medium habits: 2 points per completion</li>
                  <li>• Hard habits: 3 points per completion</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">How streaks work:</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  A streak is counted as consecutive days of completing at least one habit. Missing a day will reset your streak to zero.
                </p>
              </div>
              
              <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
                <h3 className="font-medium text-primary-700 dark:text-primary-400 mb-1">Tip:</h3>
                <p className="text-primary-600 dark:text-primary-400 text-sm">
                  Focus on consistency rather than competition. Building lasting habits is more important than your position on the leaderboard!
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowInfoModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;