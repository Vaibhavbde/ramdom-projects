import React from 'react';
import { NavItem } from '../types';
import Icon from './shared/Icon';

interface BottomNavProps {
  activeView: NavItem;
  setActiveView: (view: NavItem) => void;
}

const navItems: { id: NavItem; label: string }[] = [
  { id: 'symptoms', label: 'Symptoms' },
  { id: 'diagnose', label: 'Diagnose' },
  { id: 'scan', label: 'Scan' },
  { id: 'chatbot', label: 'Chatbot' },
  { id: 'hub', label: 'Hub' },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around max-w-4xl mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-sm transition-colors duration-200 ${
              activeView === item.id ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            <Icon name={item.id} className="w-6 h-6 mb-1" />
            <span className="font-medium">{item.label}</span>
            {activeView === item.id && (
              <div className="w-10 h-1 bg-blue-600 rounded-full mt-1"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
