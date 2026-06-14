import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const TransactionList = () => {
  const { transactions, deleteTransaction } = useFinance();
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter((t) =>
    filter === 'all' ? true : t.type === filter
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Recent Transactions
        </h2>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter('income')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Income
          </button>

          <button
            onClick={() => setFilter('expense')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-6">
          No transactions yet. Add your first transaction above!
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredTransactions.map((transaction) => (
            <li
              key={transaction.id}
              className="flex items-center justify-between py-4"
            >
              {/* Icon + Details */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === 'income'
                      ? 'bg-green-100 dark:bg-green-900'
                      : 'bg-red-100 dark:bg-red-900'
                  }`}
                >
                  {transaction.type === 'income' ? (
                    <TrendingUp className="text-green-600 dark:text-green-400 w-6 h-6" />
                  ) : (
                    <TrendingDown className="text-red-600 dark:text-red-400 w-6 h-6" />
                  )}
                </div>

                <div>
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    {transaction.category}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.description || 'No description'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {transaction.date}
                  </p>
                </div>
              </div>

              {/* Amount + Delete */}
              <div className="flex items-center gap-4">
                <p
                  className={`text-lg font-bold ${
                    transaction.type === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}$
                  {transaction.amount.toFixed(2)}
                </p>

                <button
                  onClick={() => deleteTransaction(transaction.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  title="Delete transaction"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
