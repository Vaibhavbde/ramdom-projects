import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const Dashboard = () => {
  const { monthlyBudget, updateBudget, calculateTotals, getCurrentMonthExpenses } = useFinance();

  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [budgetInput, setBudgetInput] = useState(monthlyBudget);

  const totals = calculateTotals();
  const currentMonthExpenses = getCurrentMonthExpenses();
  const budgetPercentage = (currentMonthExpenses / monthlyBudget) * 100;

  const handleBudgetSave = () => {
    const budget = parseFloat(budgetInput);
    if (budget && budget > 0) {
      updateBudget(budget);
    } else {
      setBudgetInput(monthlyBudget);
    }
    setShowBudgetInput(false);
  };

  return (
    <div className="space-y-8 mt-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Income */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex flex-col items-center">
          <TrendingUp className="text-green-500 w-8 h-8 mb-2" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Income</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
            ${totals.income.toFixed(2)}
          </p>
        </div>

        {/* Total Expenses */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex flex-col items-center">
          <TrendingDown className="text-red-500 w-8 h-8 mb-2" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
            ${totals.expenses.toFixed(2)}
          </p>
        </div>

        {/* Balance */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex flex-col items-center">
          <DollarSign className="text-indigo-500 w-8 h-8 mb-2" />
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Balance</h3>
          <p
            className={`text-2xl font-bold mt-2 ${
              totals.balance >= 0
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            ${totals.balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Monthly Budget Section */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Monthly Budget</h3>
          {showBudgetInput ? (
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onBlur={handleBudgetSave}
              onKeyDown={(e) => e.key === 'Enter' && handleBudgetSave()}
              className="text-xl font-bold text-indigo-600 dark:text-indigo-400 dark:bg-gray-700 border-b-2 border-indigo-600 w-24 focus:outline-none text-right"
              autoFocus
            />
          ) : (
            <p
              className="text-xl font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:text-indigo-700 dark:hover:text-indigo-300"
              onClick={() => setShowBudgetInput(true)}
            >
              ${monthlyBudget.toFixed(2)}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-4 rounded-full ${
              budgetPercentage >= 100
                ? 'bg-red-600'
                : budgetPercentage > 80
                ? 'bg-yellow-500'
                : 'bg-green-600'
            }`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-right">
          {budgetPercentage.toFixed(1)}% used this month
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
