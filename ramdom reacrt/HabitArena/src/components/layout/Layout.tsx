import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 pb-10 px-4 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-gray-800 py-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} HabitArena. All rights reserved.</p>
          <p className="mt-1">Developed by <a href="https://mahyudeen.me/" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-600">Mahyudeen Shahid</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;