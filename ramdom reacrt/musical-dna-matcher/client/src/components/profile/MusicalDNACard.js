// src/components/profile/MusicalDNACard.js
import React from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

export default function MusicalDNACard({ dna, name = "You" }) {
  // dna: {adventurous, nostalgic, social, emotional}
  const chartData = [
    { trait: "Adventurous", value: dna.adventurous },
    { trait: "Nostalgic", value: dna.nostalgic },
    { trait: "Social", value: dna.social },
    { trait: "Emotional", value: dna.emotional },
  ];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-xs mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center text-white">{name}'s Musical DNA</h2>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="trait" tick={{ fontSize: 12, fill: '#fff' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
            <Radar name="Musical DNA" dataKey="value" stroke="#34D399" fill="#34D399" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-gray-400 text-sm">
        {Object.keys(dna).map(trait => (
          <div key={trait} className="text-center">
            <div className="font-semibold text-gray-300">{trait[0].toUpperCase() + trait.slice(1)}</div>
            <div className="text-emerald-400">{dna[trait]}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
