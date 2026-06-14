import React, { useState, useEffect } from 'react';
import TabItem from './TabItem';
import { getAllTabs, closeTab, switchToTab } from '../utils/chromeAPI';

const TabList = ({ searchQuery, viewMode }) => {
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    loadTabs();
  }, []);

  const loadTabs = async () => {
    const allTabs = await getAllTabs();
    setTabs(allTabs);
  };

  const handleCloseTab = async (tabId) => {
    await closeTab(tabId);
    setTabs(tabs.filter(tab => tab.id !== tabId));
  };

  const handleSwitchTab = async (tabId) => {
    await switchToTab(tabId);
    window.close(); // Close popup after switching
  };

  const filteredTabs = tabs.filter(tab => 
    tab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
      {filteredTabs.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No tabs found</p>
        </div>
      ) : (
        filteredTabs.map(tab => (
          <TabItem 
            key={tab.id} 
            tab={tab} 
            onClose={handleCloseTab}
            onSwitch={handleSwitchTab}
          />
        ))
      )}
    </div>
  );
};

export default TabList;
