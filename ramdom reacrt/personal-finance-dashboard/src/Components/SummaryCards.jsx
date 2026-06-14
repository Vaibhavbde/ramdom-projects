import React, { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";

export default function SummaryCards() {
  const { transactions } = useContext(FinanceContext);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-5">
      <div className="bg-green-100 p-4 rounded-lg w-40 text-center shadow">
        <h3 className="font-bold">Income</h3>
        <p>₹{income}</p>
      </div>
      <div className="bg-red-100 p-4 rounded-lg w-40 text-center shadow">
        <h3 className="font-bold">Expense</h3>
        <p>₹{expense}</p>
      </div>
      <div className="bg-blue-100 p-4 rounded-lg w-40 text-center shadow">
        <h3 className="font-bold">Balance</h3>
        <p>₹{balance}</p>
      </div>
    </div>
  );
}
