import React from 'react';

const TabItem = ({ tab, onClose, onSwitch }) => {
  const getFavicon = (tab) => {
    return tab.favIconUrl || `https://www.google.com/s2/favicons?domain=${new URL(tab.url).hostname}`;
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 group">
      <div 
        className="flex items-center gap-3 flex-1 cursor-pointer"
        onClick={() => onSwitch(tab.id)}
      >
        <img 
          src={getFavicon(tab)} 
          alt="" 
          className="w-5 h-5"
          onError={(e) => e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="%23ccc"/></svg>'}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {truncateText(tab.title, 40)}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {truncateText(tab.url, 50)}
          </p>
        </div>
      </div>
      <button
        onClick={() => onClose(tab.id)}
        className="ml-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default TabItem;
