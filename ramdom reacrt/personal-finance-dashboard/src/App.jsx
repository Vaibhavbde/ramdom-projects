import React from "react";
import AddTransaction from "./components/AddTransaction";
import TransactionList from "./components/TransactionList";
import SummaryCards from "./components/SummaryCards";
import Charts from "./components/Charts";
import { FinanceProvider } from "./context/FinanceContext";

export default function App() {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600">💰 Personal Finance Dashboard</h1>
        <SummaryCards />
        <AddTransaction />
        <Charts />
        <TransactionList />
      </div>
    </FinanceProvider>
  );
}

