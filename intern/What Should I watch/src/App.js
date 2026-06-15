import React, { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  WATCHLIST: 'watchlist',
  HISTORY: 'pickHistory'
};

function App() {
  const [watchlist, setWatchlist] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [currentPick, setCurrentPick] = useState(null);
  const [pickHistory, setPickHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);

    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }

    if (savedHistory) {
      setPickHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(pickHistory));
  }, [pickHistory]);

  const addToWatchlist = () => {
    if (newItem.trim() && !watchlist.includes(newItem.trim())) {
      setWatchlist([...watchlist, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeFromWatchlist = (item) => {
    setWatchlist(watchlist.filter(movie => movie !== item));
  };

  const getRandomPick = () => {
    if (watchlist.length === 0) return;

    const randomIndex = Math.floor(Math.random() * watchlist.length);
    const pick = watchlist[randomIndex];
    const timestamp = new Date().toLocaleString();

    setCurrentPick(pick);
    setPickHistory([{ item: pick, timestamp }, ...pickHistory.slice(0, 9)]); // Keep last 10
  };

  const clearHistory = () => {
    setPickHistory([]);
    setCurrentPick(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addToWatchlist();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/temp.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-2xl mx-auto"></div>
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎬 What Should I Watch?</h1>
          <p className="text-purple-200">Can't decide? Let us pick for you!</p>
        </header>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Add to Watchlist</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter movie or show name..."
              className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-purple-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={addToWatchlist}
              className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-cyan-500/25"
            >
              Add
            </button>
          </div>
        </div>
        {currentPick && (
          <div className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-lg p-6 mb-6 text-center shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">🎯 You Should Watch:</h2>
            <p className="text-3xl font-bold text-white drop-shadow-lg">{currentPick}</p>
          </div>
        )}

        <div className="text-center mb-6">
          <button
            onClick={getRandomPick}
            disabled={watchlist.length === 0}
            className="px-8 py-4 bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 hover:from-orange-500 hover:via-pink-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-bold text-xl transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-2xl hover:shadow-pink-500/30 border border-white/20"
          >
            🎲 Decide for Me!
          </button>
          {watchlist.length === 0 && (
            <p className="text-purple-200 mt-2">Add some movies or shows first!</p>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Your Watchlist ({watchlist.length})
          </h2>
          {watchlist.length === 0 ? (
            <p className="text-purple-200 text-center py-4">Your watchlist is empty</p>
          ) : (
            <div className="space-y-2">
              {watchlist.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/10 rounded-lg p-3"
                >
                  <span className="text-white">{item}</span>
                  <button
                    onClick={() => removeFromWatchlist(item)}
                    className="text-red-400 hover:text-red-200 font-bold text-lg hover:bg-red-500/20 rounded px-2 py-1 transition-all"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Pick History</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg text-sm transition-all shadow-lg hover:shadow-blue-500/25"
              >
                {showHistory ? 'Hide' : 'Show'}
              </button>
              {pickHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg text-sm transition-all shadow-lg hover:shadow-red-500/25"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {showHistory && (
            <div className="space-y-2">
              {pickHistory.length === 0 ? (
                <p className="text-purple-200 text-center py-4">No picks yet</p>
              ) : (
                pickHistory.map((pick, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/10 rounded-lg p-3"
                  >
                    <span className="text-white font-medium">{pick.item}</span>
                    <span className="text-purple-200 text-sm">{pick.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;