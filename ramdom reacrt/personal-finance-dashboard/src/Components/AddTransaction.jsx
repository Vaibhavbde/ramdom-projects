import React, { useContext, useState } from "react";
import { FinanceContext } from "../context/FinanceContext";

export default function AddTransaction() {
  const { transactions, setTransactions } = useContext(FinanceContext);
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    note: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return alert("All fields required");

    const newTxn = {
      id: Date.now(),
      ...form,
      amount: Number(form.amount),
      date: new Date().toLocaleDateString(),
    };

    setTransactions([newTxn, ...transactions]);
    setForm({ type: "expense", category: "", amount: "", note: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-2xl shadow-md flex flex-col gap-3 max-w-md mx-auto mt-5"
    >
      <h2 className="text-xl font-bold text-center">Add Transaction</h2>

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="text"
        placeholder="Category (e.g., Food, Salary)"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="border p-2 rounded"
      />

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        className="border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Note"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
        className="border p-2 rounded"
      />

      <button className="bg-blue-500 text-white rounded py-2 hover:bg-blue-600">
        Add
      </button>
    </form>
  );
}
