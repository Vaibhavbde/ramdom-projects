import React from 'react';
import Icon from './shared/Icon';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-10">
      <div className="max-w-4xl mx-auto flex justify-between items-center p-3">
        <div className="flex items-center space-x-2">
            <Icon name="heart-pulse" className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">MediXplain</span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
          aria-label="Logout"
        >
          <Icon name="logout" className="w-6 h-6" />
          <span className="text-sm font-medium hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;