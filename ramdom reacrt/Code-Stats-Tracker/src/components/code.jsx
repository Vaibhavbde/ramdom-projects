import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import RatingStatsTable from "./RatingStats";
import RecentSubmissions from "./RecentSubmissions";
import UserProblemStats from "./UserProblemStats"; // NEW

const rankColors = {
  newbie: "#808080",
  pupil: "#008000",
  specialist: "#03a89e",
  expert: "#0000ff",
  "candidate master": "#aa00aa",
  master: "#ff8c00",
  "international master": "#ff8c00",
  grandmaster: "#ff0000",
  "international grandmaster": "#ff0000",
  "legendary grandmaster": "#aa0000",
};

// Add rank thresholds
const rankThresholds = {
  newbie: 1200,
  pupil: 1400,
  specialist: 1600,
  expert: 1900,
  "candidate master": 2100,
  master: 2300,
  "international master": 2400,
  grandmaster: 2600,
  "international grandmaster": 3000,
};

const CodeTrackr = () => {
  const [handle, setHandle] = useState("");
  const [userData, setUserData] = useState(null);
  const [ratingData, setRatingData] = useState([]);
  const [ratingDataRaw, setRatingDataRaw] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    if (!handle.trim()) {
      setError("Please enter a Codeforces handle");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);

      const userRes = await fetch(
        `https://codeforces.com/api/user.info?handles=${handle}`
      );
      const userJson = await userRes.json();
      if (userJson.status !== "OK") throw new Error("User not found");
      setUserData(userJson.result[0]);

      const ratingRes = await fetch(
        `https://codeforces.com/api/user.rating?handle=${handle}`
      );
      const ratingJson = await ratingRes.json();
      if (ratingJson.status !== "OK")
        throw new Error("Rating data fetch error");

      const raw = ratingJson.result;
      setRatingDataRaw(raw);

      const transformed = raw.map((entry, index) => ({
        name: entry.contestName,
        rating: entry.newRating,
        index,
      }));
      setRatingData(transformed);
    } catch (err) {
      setError(err.message);
      setUserData(null);
      setRatingData([]);
      setRatingDataRaw([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchUserData();
    }
  };

  return (
    <div id="userInfo"
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <img
        src="//codeforces.org/s/18636/images/codeforces-sponsored-by-ton.png"
        alt="Codeforces Logo"
        style={{ maxWidth: "250px", display: "block", margin: "0 auto 20px",marginTop:'45px' }}
      />

      <div className="search-container" style={{ 
        display: "flex", 
        gap: "10px", 
        marginBottom: "20px",
        maxWidth: "600px",
        margin: "0 auto 30px"
      }}>
        <input
          type="text"
          placeholder="Enter Codeforces handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ 
            flex: 1, 
            padding: "12px 16px", 
            fontSize: "16px",
            borderRadius: "8px",
            border: "2px solid var(--border)",
            backgroundColor: "var(--bg-light)",
            color: "var(--text-primary)",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        />
        <button
          onClick={fetchUserData}
          disabled={isLoading}
          style={{ 
            padding: "12px 24px", 
            fontSize: "16px", 
            cursor: isLoading ? "wait" : "pointer",
            backgroundColor: "var(--accent)",
            color: "black",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "100px"
          }}
        >
          {isLoading ? (
            <div className="loading-spinner" style={{ 
              width: "20px", 
              height: "20px",
              margin: "0"
            }}></div>
          ) : "Track"}
        </button>
      </div>

      {error && (
        <div style={{ 
          color: "#e74c3c", 
          backgroundColor: "rgba(231, 76, 60, 0.1)", 
          padding: "10px 15px", 
          borderRadius: "6px",
          marginBottom: "20px",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto 20px"
        }}>
          <p style={{ margin: 0 }}>Error: {error}</p>
        </div>
      )}

      {userData && (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <img
            src={userData.titlePhoto}
            alt="User Avatar"
            style={{ width: "150px", height: "190px", borderRadius: "8px" }}
          />

          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "10px",
                color: rankColors[userData.rank] || "#000",
                textTransform: "capitalize",
              }}
            >
              {userData.rank ? userData.rank : "Unrated"}: {userData.handle}
            </h2>
            <p>
              <strong>Max Rating:</strong> {userData.maxRating}
            </p>
            <p>
              <strong>Current Rating:</strong> {userData.rating}
            </p>
            <p>
              <strong>Max Rank:</strong> {userData.maxRank}
            </p>
            <p>
              <strong>Current Rank:</strong> {userData.rank}
            </p>
            <p>
              <strong>Contribution:</strong> {userData.contribution}
            </p>
          </div>
        </div>
      )}

      {ratingData.length > 0 && (
        <div style={{ height: "400px", marginBottom: "40px" }}>
          {userData && ratingData.length > 0 && (
            <div style={{ marginTop: "30px" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", textAlign: "center" }}>
                Rating History
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={ratingData}
                  margin={{ top: 20, right: 80, left: 20, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis 
                    dataKey="index" 
                    label={{ value: 'Contests', position: 'insideBottomRight', offset: -10 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[
                      Math.max(0, Math.floor((Math.min(...ratingData.map(d => d.rating)) - 300) / 500) * 500),
                      Math.ceil((Math.max(...ratingData.map(d => d.rating)) + 300) / 500) * 500
                    ]}
                    label={{ value: 'Rating', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Rating']}
                    labelFormatter={(index) => `Contest: ${ratingData[index]?.name || index}`}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      color: '#333',
                      padding: '10px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  
                  {/* Add reference lines for each rank with improved visibility */}
                  {Object.entries(rankThresholds).map(([rank, threshold]) => (
                    <ReferenceLine 
                      key={rank} 
                      y={threshold} 
                      stroke={rankColors[rank]} 
                      strokeDasharray="3 3"
                      label={{ 
                        value: rank, 
                        position: 'right', 
                        fill: rankColors[rank],
                        fontSize: 12,
                        fontWeight: 'bold',
                        offset: 10,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        padding: 5,
                        borderRadius: 3
                      }} 
                    />
                  ))}
                  
                  {/* Add max rating reference line with improved visibility */}
                  {userData.maxRating && (
                    <ReferenceLine 
                      y={userData.maxRating} 
                      stroke="#ff7675" 
                      strokeDasharray="5 5"
                      label={{ 
                        value: `Max: ${userData.maxRating}`, 
                        position: 'left', 
                        fill: '#ff7675',
                        fontSize: 12,
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        padding: 5,
                        borderRadius: 3
                      }} 
                    />
                  )}
                  
                  <Area 
                    type="monotone" 
                    dataKey="rating" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#ratingGradient)" 
                    activeDot={{ r: 6, fill: '#ff7675', stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {ratingDataRaw.length > 0 && (
        <RatingStatsTable ratingData={ratingDataRaw} />
      )}

      {userData && (
        <>
          <RecentSubmissions handle={userData.handle} />
          <UserProblemStats handle={userData.handle} />
        </>
      )}
    </div>
  );
};

export default CodeTrackr;
