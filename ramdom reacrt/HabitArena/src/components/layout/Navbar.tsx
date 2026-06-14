import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from '../ui/ThemeToggle';
import {
  Menu,
  X,
  Home,
  ListTodo,
  BarChart2,
  Award,
  Bell,
  User,
  Users,
  LogOut,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/habits', label: 'Habits', icon: <ListTodo className="w-5 h-5" /> },
    { path: '/progress', label: 'Progress', icon: <BarChart2 className="w-5 h-5" /> },
    { path: '/badges', label: 'Badges', icon: <Award className="w-5 h-5" /> },
    { path: '/reminders', label: 'Reminders', icon: <Bell className="w-5 h-5" /> },
    { path: '/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { path: '/leaderboard', label: 'Leaderboard', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700/10 fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and desktop nav */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-primary-500 font-bold text-2xl mr-1">Habit</span>
              <span className="text-gray-700 dark:text-gray-300 font-bold text-2xl">Arena</span>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                      isActive
                        ? 'text-primary-500 bg-primary-50 dark:bg-gray-700'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          
          {/* Right side menu */}
          <div className="flex items-center">
            <ThemeToggle className="mr-2" />
            
            {/* User dropdown (desktop) */}
            <div className="hidden md:ml-4 md:flex md:items-center">
              <div className="relative group">
                <button className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md">
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/40'}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="font-medium">{user?.name}</span>
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                  <div className="py-1">
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Your Profile
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <X className="block w-6 h-6" />
                ) : (
                  <Menu className="block w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 shadow-lg">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  isActive
                    ? 'text-primary-500 bg-primary-50 dark:bg-gray-700'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
              onClick={closeMenu}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          
          <hr className="my-2 border-gray-200 dark:border-gray-700" />
          
          <button
            onClick={handleLogout}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;