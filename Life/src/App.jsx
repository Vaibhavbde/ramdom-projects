import React from 'react';
import { TaskProvider } from './context/TaskContext';
import { UserProvider, useUser } from './context/UserContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const AppContent = () => {
  const { user } = useUser();
  return (
    <TaskProvider>
      <div className="w-screen h-screen bg-background text-gray-100 flex overflow-hidden font-sans antialiased selection:bg-primary/30">
        {user.isAuthenticated ? <Dashboard /> : <Login />}
      </div>
    </TaskProvider>
  );
};

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
