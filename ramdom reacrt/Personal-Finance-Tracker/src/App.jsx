import React from 'react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400">
          💰 Finance Tracker
        </h1>

        <Dashboard />
        <TransactionForm />
        <TransactionList />
      </div>
    </div>
  );
};

export default App;
