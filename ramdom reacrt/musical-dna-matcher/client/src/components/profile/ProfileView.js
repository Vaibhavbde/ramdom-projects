import React from "react";
import mockUsers from "../../data/mockUsers";
import MusicalDNACard from "./MusicalDNACard";
import GenreChart from "./GenreChart";
import PersonalityTraits from "./PersonalityTraits";

export default function ProfileView({ userId: propUserId, showBackButton = true, onBack }) {
  const userId = propUserId || "u1";
  const user = mockUsers.find(u => u.id === userId);

  if (!user) return <div className="p-6 text-center text-red-500">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      {/* Back Navigation */}
      {showBackButton && onBack && (
        <div className="max-w-3xl mx-auto mb-4">
          <button 
            onClick={onBack}
            className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ← Back
          </button>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        
        {/* User Info Section */}
        <div className="flex flex-col items-center text-center">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-green-400 mb-4 object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=34d399&color=fff&size=96`;
            }}
          />
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-400 mt-1">{user.listeningPattern}</p>
        </div>

        {/* Musical DNA Section */}
        <div className="mt-8 flex justify-center">
          <MusicalDNACard dna={user.musicalDNA} name={user.name} />
        </div>

        {/* Top Genres & Artists */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* Use GenreChart instead of plain list */}
            <GenreChart genres={user.topGenres} />
          </div>
          <div>
            <div className="bg-gray-700 p-4 rounded mb-4">
              <h2 className="text-lg font-bold mb-2 text-white">Top Artists</h2>
              <ul className="space-y-2">
                {user.topArtists.map((artist, idx) => (
                  <li key={idx} className="text-gray-300 flex items-center gap-2">
                    <span className="text-emerald-400">🎤</span>
                    <span>{artist}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Add Personality Traits underneath */}
            <PersonalityTraits dna={user.musicalDNA} />
          </div>
        </div>

      </div>
    </div>
  );
}
