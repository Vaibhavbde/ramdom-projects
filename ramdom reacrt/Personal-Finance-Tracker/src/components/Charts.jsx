import React from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { CHART_COLORS } from '../utils/constants';

const Charts = () => {
  const { getCategoryData, getMonthlyData } = useFinance();
  const { isDark } = useTheme();
  
  const categoryData = getCategoryData();
  const monthlyData = getMonthlyData();

  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  return (
    <div className="grid gap-8 md:grid-cols-2 mt-6">
      {/* Pie Chart - Expenses by Category */}
      {categoryData.length > 0 && (
        <div className="p-4 rounded-2xl shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
            Expenses by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', color: textColor }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bar Chart - Monthly Overview */}
      {monthlyData.length > 0 && (
        <div className="p-4 rounded-2xl shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
            Monthly Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke={textColor} />
              <YAxis stroke={textColor} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', color: textColor }} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Charts;
