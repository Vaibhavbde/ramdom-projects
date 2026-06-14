
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { DEFAULT_BUDGET } from '../utils/constants';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    return storage.get('transactions') || [];
  });
  
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    return storage.get('monthlyBudget') || DEFAULT_BUDGET;
  });

  useEffect(() => {
    storage.set('transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    storage.set('monthlyBudget', monthlyBudget);
  }, [monthlyBudget]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      amount: parseFloat(transaction.amount)
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const updateBudget = (budget) => {
    setMonthlyBudget(parseFloat(budget) || DEFAULT_BUDGET);
  };

  const calculateTotals = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { income, expenses, balance: income - expenses };
  };

  const getCategoryData = () => {
    const expensesByCategory = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  };

  const getMonthlyData = () => {
    const monthlyData = {};
    transactions.forEach(t => {
      const month = t.date.substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { month, income: 0, expenses: 0 };
      }
      if (t.type === 'income') {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expenses += t.amount;
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  };

  const getCurrentMonthExpenses = () => {
    const currentMonth = new Date().toISOString().substring(0, 7);
    return transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
  <FinanceContext.Provider
    value={{
      transactions,
      addTransaction,
      deleteTransaction,
      monthlyBudget,
      updateBudget,
      calculateTotals,
      getCategoryData,
      getMonthlyData,
      getCurrentMonthExpenses,
    }}
  >
    {children}
  </FinanceContext.Provider>
);

};
