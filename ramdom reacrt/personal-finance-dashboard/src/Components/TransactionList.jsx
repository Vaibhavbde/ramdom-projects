import React, { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";

export default function TransactionList() {
  const { transactions, setTransactions } = useContext(FinanceContext);

  const deleteTxn = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-lg font-bold mb-3 text-center">Transaction History</h2>
      <ul className="space-y-2">
        {transactions.map((t) => (
          <li
            key={t.id}
            className={`flex justify-between p-3 rounded-md shadow ${
              t.type === "income" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <span>{t.category} - ₹{t.amount}</span>
            <button
              onClick={() => deleteTxn(t.id)}
              className="text-sm text-gray-500 hover:text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
