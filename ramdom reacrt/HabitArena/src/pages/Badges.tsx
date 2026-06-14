import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockBadges } from '../utils/mockData';
import { 
  Award, 
  Star, 
  CheckCircle, 
  Lock, 
  Sunrise, 
  BookOpen, 
  Flame, 
  Trophy, 
  BrainCircuit, 
  Zap
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requiredValue: number;
  currentValue: number;
  unlocked: boolean;
}

// Map of icon names to components
const iconMap: Record<string, React.ReactNode> = {
  Award: <Award />,
  Star: <Star />,
  CheckCircle: <CheckCircle />,
  Sunrise: <Sunrise />,
  BookOpen: <BookOpen />,
  Flame: <Flame />,
  Trophy: <Trophy />,
  BrainCircuit: <BrainCircuit />,
  Zap: <Zap />,
};

const Badges = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>('all');
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);
  
  // Filter badges based on category and unlock status
  const filteredBadges = mockBadges.filter(badge => {
    if (filter === 'all') return true;
    if (filter === 'locked') return !badge.unlocked;
    if (filter === 'unlocked') return badge.unlocked;
    return badge.category === filter;
  });
  
  // Get badge icon component
  const getBadgeIcon = (iconName: string) => {
    return iconMap[iconName] || <Award />;
  };
  
  // Get badge progress percentage
  const getBadgeProgress = (badge: Badge) => {
    return Math.min(100, Math.round((badge.currentValue / badge.requiredValue) * 100));
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievements</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track your progress and earn badges
        </p>
      </div>
      
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'unlocked' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('unlocked')}
        >
          Unlocked
        </Button>
        <Button
          variant={filter === 'locked' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('locked')}
        >
          Locked
        </Button>
        <Button
          variant={filter === 'achievement' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('achievement')}
        >
          Achievements
        </Button>
        <Button
          variant={filter === 'milestone' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('milestone')}
        >
          Milestones
        </Button>
        <Button
          variant={filter === 'streak' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('streak')}
        >
          Streaks
        </Button>
      </div>
      
      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => (
          <Card 
            key={badge.id}
            hoverEffect
            onClick={() => setActiveBadge(badge)}
            className={`${
              badge.unlocked 
                ? 'border-2 border-primary-500/30 dark:border-primary-500/40' 
                : 'opacity-70 dark:opacity-50'
            }`}
          >
            <CardContent className="p-4 text-center">
              <div className={`
                mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-3
                ${badge.unlocked 
                  ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-500' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }
              `}>
                {badge.unlocked ? (
                  <span className="w-8 h-8">{getBadgeIcon(badge.icon)}</span>
                ) : (
                  <Lock className="w-6 h-6" />
                )}
              </div>
              
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                {badge.name}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {badge.description}
              </p>
              
              <div className="mt-3">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 w-full">
                  <div 
                    className={`h-2 rounded-full ${badge.unlocked ? 'bg-primary-500' : 'bg-gray-400'}`}
                    style={{ width: `${getBadgeProgress(badge)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {badge.currentValue} / {badge.requiredValue}
                </p>
              </div>
              
              <div className="mt-2">
                <span className={`
                  text-xs px-2 py-1 rounded-full
                  ${badge.unlocked 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }
                `}>
                  {badge.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Badge Detail Modal */}
      {activeBadge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className={`
                mx-auto w-20 h-20 flex items-center justify-center rounded-full mb-4
                ${activeBadge.unlocked 
                  ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-500' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }
              `}>
                {activeBadge.unlocked ? (
                  <span className="w-10 h-10">{getBadgeIcon(activeBadge.icon)}</span>
                ) : (
                  <Lock className="w-8 h-8" />
                )}
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {activeBadge.name}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {activeBadge.description}
              </p>
              
              <div className="mt-4">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 w-full">
                  <div 
                    className={`h-3 rounded-full ${activeBadge.unlocked ? 'bg-primary-500' : 'bg-gray-400'}`}
                    style={{ width: `${getBadgeProgress(activeBadge)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Progress: {activeBadge.currentValue} / {activeBadge.requiredValue}
                  {activeBadge.unlocked ? ' (Completed)' : ''}
                </p>
              </div>
              
              <div className="mt-3">
                <span className={`
                  text-sm px-2 py-1 rounded-full
                  ${activeBadge.unlocked 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }
                `}>
                  {activeBadge.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
              
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>Category: {activeBadge.category.charAt(0).toUpperCase() + activeBadge.category.slice(1)}</p>
              </div>
              
              {!activeBadge.unlocked && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Tip:</strong> {(
                      activeBadge.category === 'streak'
                        ? 'Maintain your habit streak consistency to unlock this badge.'
                        : activeBadge.category === 'milestone'
                          ? 'Keep using the app and completing habits to reach this milestone.'
                          : 'Complete specific habit challenges to earn this achievement.'
                    )}
                  </p>
                </div>
              )}
              
              <div className="mt-6">
                <Button onClick={() => setActiveBadge(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Badges;