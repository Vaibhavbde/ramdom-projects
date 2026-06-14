import React from "react";

const traitInfo = {
  adventurous: { emoji: "🌎", color: "bg-blue-400", description: "Explores new sounds" },
  nostalgic: { emoji: "💭", color: "bg-yellow-400", description: "Loves classic hits" },
  social: { emoji: "🤝", color: "bg-purple-400", description: "Shares music often" },
  emotional: { emoji: "💖", color: "bg-pink-400", description: "Feels the music deeply" },
};

export default function PersonalityTraits({ dna }) {
  return (
    <div className="bg-gray-700 p-4 rounded space-y-3">
      <h3 className="font-bold mb-3 text-white">Personality Traits</h3>
      {Object.entries(dna).map(([trait, value]) => (
        <div key={trait} className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{traitInfo[trait].emoji}</span>
              <span className="text-white capitalize font-medium">{trait}</span>
            </div>
            <span className="font-mono text-sm text-gray-300">{value}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div
              className={`${traitInfo[trait].color} h-2 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${value}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 ml-6">{traitInfo[trait].description}</p>
        </div>
      ))}
    </div>
  );
}
