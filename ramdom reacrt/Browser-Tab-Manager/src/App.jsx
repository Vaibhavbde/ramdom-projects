import { useState } from 'react';
import SearchBar from './components/SearchBar';
import TabList from './components/TabList';
import GroupView from './components/GroupView';
import SessionManager from './components/SessionManager';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'grouped', 'sessions'

  return (
    <div className="w-[600px] bg-white">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 text-white p-4">
        <h1 className="text-xl font-bold">Tab Manager Pro</h1>
        <p className="text-sm opacity-90">Organize your browsing experience</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Tabs
        </button>
        <button
          onClick={() => setActiveTab('grouped')}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === 'grouped'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Grouped
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 py-3 text-sm font-medium transition ${
            activeTab === 'sessions'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sessions
        </button>
      </div>

      {/* Search Bar (only for All Tabs and Grouped views) */}
      {activeTab !== 'sessions' && (
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      )}

      {/* Content */}
      {activeTab === 'all' && <TabList searchQuery={searchQuery} />}
      {activeTab === 'grouped' && <GroupView searchQuery={searchQuery} />}
      {activeTab === 'sessions' && <SessionManager />}
    </div>
  );
}

export default App;
