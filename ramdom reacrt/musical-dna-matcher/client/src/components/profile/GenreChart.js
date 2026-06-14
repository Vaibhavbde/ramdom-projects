import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function GenreChart({ genres = [] }) {
  // Create chartData: [{ name: "Pop", value: 60 }]
  const chartData = genres.map((name, i) => ({
    name,
    value: Math.round(80 - i * 13 + Math.random() * 10), // mock values for demo
  }));

  return (
    <div className="bg-gray-700 p-4 rounded mb-4">
      <h3 className="font-bold mb-2 text-white">Top Genres</h3>
      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 12, fill: '#fff' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#374151', 
                border: 'none', 
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value) => [`${value}%`, 'Preference']}
            />
            <Bar dataKey="value" fill="#34D399" radius={[0, 8, 8, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
