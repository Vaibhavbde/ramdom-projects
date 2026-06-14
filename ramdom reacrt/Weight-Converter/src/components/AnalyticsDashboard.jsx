// src/components/AnalyticsDashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AnalyticsDashboard({ stats }) {
  const data = [
    { name: "Kg → Lb", value: stats.kgToLb || 0 },
    { name: "Lb → Kg", value: stats.lbToKg || 0 },
  ];

  return (
    <motion.div
      className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36 }}
    >
      <div className="mb-4">
        <div className="text-sm text-gray-500">Conversions</div>
        <div className="text-lg font-semibold text-gray-800">{stats.total}</div>
      </div>

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
