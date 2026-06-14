import React, { useState } from 'react';
import { Mountain, MapPin, CheckSquare, Calendar } from 'lucide-react';
import Destinations from './components/Destinations';
import Checklists from './components/Checklists';
import Itineraries from './components/Itineraries';

function App() {
  const [activeTab, setActiveTab] = useState('destinations');

  const tabs = [
    { id: 'destinations', label: 'Destinations', icon: MapPin, component: Destinations },
    { id: 'checklists', label: 'Checklists', icon: CheckSquare, component: Checklists },
    { id: 'itineraries', label: 'Itineraries', icon: Calendar, component: Itineraries },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-sky-50">
      <header className="bg-forest-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Mountain className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Camping Trip Planner</h1>
          </div>
          <p className="text-forest-100 mt-2">Plan and organize your perfect outdoor adventures</p>
        </div>
      </header>

      <nav className="bg-white shadow-md border-b border-forest-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-forest-500 text-forest-600'
                    : 'border-transparent text-gray-500 hover:text-forest-600 hover:border-forest-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {ActiveComponent && <ActiveComponent />}
      </main>
    </div>
  );
}

export default App;