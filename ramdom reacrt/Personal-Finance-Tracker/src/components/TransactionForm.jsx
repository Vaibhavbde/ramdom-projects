import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORIES } from '../utils/constants';

const TransactionForm = () => {
  const { addTransaction } = useFinance();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;

    addTransaction(formData);
    setFormData({
      type: 'expense',
      amount: '',
      category: formData.type === 'expense' ? 'Food' : 'Salary',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
        <PlusCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        Add Transaction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selector */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Type</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense', category: 'Food' })}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                formData.type === 'expense'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Expense
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income', category: 'Salary' })}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                formData.type === 'income'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                       dark:bg-gray-700 dark:text-white rounded-lg 
                       focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="0.00"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                       dark:bg-gray-700 dark:text-white rounded-lg 
                       focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          >
            {CATEGORIES[formData.type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                       dark:bg-gray-700 dark:text-white rounded-lg 
                       focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            placeholder="Optional"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                       dark:bg-gray-700 dark:text-white rounded-lg 
                       focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white 
                     font-semibold rounded-lg transition-colors flex items-center 
                     justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
