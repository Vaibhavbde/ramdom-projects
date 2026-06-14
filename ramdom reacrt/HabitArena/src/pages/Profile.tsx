import { useState, ChangeEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { User, Workflow, Moon, Sun, Calendar, Award, Trophy, Edit, Save, X, Bell, Lock, Download, Trash } from 'lucide-react';
import { format } from 'date-fns';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [preferences, setPreferences] = useState(user?.preferences || {
    morningPerson: true,
    notificationsEnabled: true,
    weekStartsOn: 1, // Monday
  });
  
  if (!user) return null;
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      updateUser({
        name,
        avatar,
        preferences,
      });
    }
    setIsEditing(!isEditing);
  };
  
  const handlePreferenceChange = (key: string, value: boolean | number) => {
    setPreferences({
      ...preferences,
      [key]: value,
    });
  };
  
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would handle file upload
    // For demo, we'll just use the URL directly
    if (e.target.value) {
      setAvatar(e.target.value);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account and preferences
        </p>
      </div>
      
      {/* Profile and Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            <Button
              variant={isEditing ? 'primary' : 'outline'}
              size="sm"
              onClick={handleEditToggle}
              leftIcon={isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-100 dark:border-primary-900"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <span className="text-white text-xs text-center px-2">
                        Enter new<br />avatar URL
                      </span>
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="mt-3 w-full">
                    <input
                      type="text"
                      value={avatar}
                      onChange={handleAvatarChange}
                      placeholder="Enter avatar URL"
                      className="input text-sm px-2 py-1.5"
                    />
                  </div>
                )}
                
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-200">
                    {isEditing ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input text-xl font-semibold text-center px-2 py-1.5"
                      />
                    ) : (
                      user.name
                    )}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Member since {format(new Date(user.joinedDate), 'MMMM yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-lg text-gray-800 dark:text-gray-200">
                    {user.email}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Preferences</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {preferences.morningPerson ? (
                          <Sun className="w-5 h-5 text-amber-500 mr-2" />
                        ) : (
                          <Moon className="w-5 h-5 text-indigo-400 mr-2" />
                        )}
                        <span className="text-gray-700 dark:text-gray-300">
                          I'm a {preferences.morningPerson ? 'morning' : 'night'} person
                        </span>
                      </div>
                      
                      {isEditing && (
                        <div>
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.morningPerson}
                              onChange={(e) => handlePreferenceChange('morningPerson', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500"></div>
                          </label>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bell className="w-5 h-5 text-primary-500 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Notifications {preferences.notificationsEnabled ? 'enabled' : 'disabled'}
                        </span>
                      </div>
                      
                      {isEditing && (
                        <div>
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.notificationsEnabled}
                              onChange={(e) => handlePreferenceChange('notificationsEnabled', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500"></div>
                          </label>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-primary-500 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Week starts on {preferences.weekStartsOn === 0 ? 'Sunday' : 'Monday'}
                        </span>
                      </div>
                      
                      {isEditing && (
                        <div>
                          <select
                            value={preferences.weekStartsOn}
                            onChange={(e) => handlePreferenceChange('weekStartsOn', Number(e.target.value))}
                            className="input py-1 px-2"
                          >
                            <option value={1}>Monday</option>
                            <option value={0}>Sunday</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex items-center">
                  <div className="bg-primary-100 dark:bg-primary-900/40 p-2 rounded text-primary-500">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Total Points</span>
                </div>
                <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">{user.points}</span>
              </div>
              
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex items-center">
                  <div className="bg-primary-100 dark:bg-primary-900/40 p-2 rounded text-primary-500">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Current Streak</span>
                </div>
                <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">{user.streak} days</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary-100 dark:bg-primary-900/40 p-2 rounded text-primary-500">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="ml-3 text-gray-700 dark:text-gray-300">Badges Earned</span>
                </div>
                <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {/* Count of badges that are unlocked */}
                  {3}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              fullWidth
              onClick={() => window.location.href = '/progress'}
            >
              View Detailed Stats
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Account Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Manage your password and account security settings.
            </p>
            <Button
              variant="outline"
              fullWidth
              leftIcon={<Lock className="w-5 h-5" />}
            >
              Change Password
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Export your data or delete your account.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                leftIcon={<Download className="w-5 h-5" />}
              >
                Export Data
              </Button>
              <Button
                variant="outline"
                className="text-red-500 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20"
                leftIcon={<Trash className="w-5 h-5" />}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;