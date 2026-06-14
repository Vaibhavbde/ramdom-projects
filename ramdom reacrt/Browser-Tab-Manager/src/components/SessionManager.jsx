import React, { useState, useEffect } from 'react';
import { getAllTabs, saveSession, getSessions, restoreSession, deleteSession } from '../utils/chromeAPI';

const SessionManager = () => {
  const [sessions, setSessions] = useState([]);
  const [sessionName, setSessionName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const savedSessions = await getSessions();
    setSessions(savedSessions);
  };

  const handleSaveSession = async () => {
    if (!sessionName.trim()) return;
    const tabs = await getAllTabs();
    await saveSession(sessionName, tabs);
    setSessionName('');
    setShowSaveForm(false);
    loadSessions();
  };

  const handleRestoreSession = (session) => {
    restoreSession(session);
    window.close();
  };

  const handleDeleteSession = async (sessionId) => {
    await deleteSession(sessionId);
    loadSessions();
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        {!showSaveForm ? (
          <button
            onClick={() => setShowSaveForm(true)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Save Current Session
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Session name..."
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveSession}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No saved sessions</p>
        ) : (
          sessions.map(session => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{session.name}</h4>
                  <p className="text-xs text-gray-500">{formatDate(session.timestamp)}</p>
                  <p className="text-xs text-gray-600 mt-1">{session.tabCount} tabs</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestoreSession(session)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionManager;
