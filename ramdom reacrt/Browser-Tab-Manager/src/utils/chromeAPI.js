// Get all open tabs
export const getAllTabs = () => {
    return new Promise((resolve) => {
      chrome.tabs.query({}, (tabs) => {
        resolve(tabs);
      });
    });
  };
  
  // Close a specific tab
  export const closeTab = (tabId) => {
    return new Promise((resolve) => {
      chrome.tabs.remove(tabId, () => {
        resolve();
      });
    });
  };
  
  // Switch to a tab
  export const switchToTab = (tabId) => {
    return new Promise((resolve) => {
      chrome.tabs.update(tabId, { active: true }, () => {
        resolve();
      });
    });
  };
  
  // Group tabs by domain
  export const groupTabsByDomain = (tabs) => {
    return tabs.reduce((groups, tab) => {
      try {
        const url = new URL(tab.url);
        const domain = url.hostname;
        if (!groups[domain]) {
          groups[domain] = [];
        }
        groups[domain].push(tab);
      } catch (e) {
        // Handle chrome:// and other special URLs
        if (!groups['Other']) groups['Other'] = [];
        groups['Other'].push(tab);
      }
      return groups;
    }, {});
  };
  
  // Save session to chrome storage
  export const saveSession = (sessionName, tabs) => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['sessions'], (result) => {
        const sessions = result.sessions || [];
        const newSession = {
          id: Date.now(),
          name: sessionName,
          tabs: tabs.map(t => ({ url: t.url, title: t.title, favIconUrl: t.favIconUrl })),
          timestamp: Date.now(),
          tabCount: tabs.length
        };
        sessions.push(newSession);
        chrome.storage.local.set({ sessions }, () => {
          resolve(newSession);
        });
      });
    });
  };
  
  // Get all saved sessions
  export const getSessions = () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['sessions'], (result) => {
        resolve(result.sessions || []);
      });
    });
  };
  
  // Restore a session
  export const restoreSession = (session) => {
    session.tabs.forEach(tab => {
      chrome.tabs.create({ url: tab.url, active: false });
    });
  };
  
  // Delete a session
  export const deleteSession = (sessionId) => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['sessions'], (result) => {
        const sessions = result.sessions || [];
        const filtered = sessions.filter(s => s.id !== sessionId);
        chrome.storage.local.set({ sessions: filtered }, () => {
          resolve();
        });
      });
    });
  };
  