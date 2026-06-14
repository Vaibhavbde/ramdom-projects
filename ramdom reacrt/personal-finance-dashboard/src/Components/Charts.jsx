import React, { useContext } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FinanceContext } from "../context/FinanceContext";

export default function Charts() {
  const { transactions } = useContext(FinanceContext);

  const expenses = transactions.filter((t) => t.type === "expense");
  const grouped = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({ name, value }));
  const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28"];

  if (data.length === 0) return null;

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-lg font-bold mb-3 text-center">Expense Breakdown</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" label>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
