import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import SymptomChecker from './components/SymptomChecker';
import ImageDiagnosis from './components/ImageDiagnosis';
import RecordScanner from './components/RecordScanner';
import Chatbot from './components/Chatbot';
import HealthHub from './components/HealthHub';
import Auth from './components/Auth';
import Header from './components/Header';
import { NavItem } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('loggedInUser'));
  const [activeView, setActiveView] = useState<NavItem>('symptoms');

  const handleLogin = (username: string) => {
    sessionStorage.setItem('loggedInUser', username);
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'symptoms':
        return <SymptomChecker />;
      case 'diagnose':
        return <ImageDiagnosis />;
      case 'scan':
        return <RecordScanner />;
      case 'chatbot':
        return <Chatbot />;
      case 'hub':
        return <HealthHub />;
      default:
        return <SymptomChecker />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-50 text-gray-800">
      <Header onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto pt-16 pb-24">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          {renderContent()}
        </div>
      </main>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;