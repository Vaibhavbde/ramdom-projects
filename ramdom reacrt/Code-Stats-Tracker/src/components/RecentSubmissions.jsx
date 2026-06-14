import React, { useEffect, useState } from "react";

const RecentSubmissions = ({ handle }) => {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!handle) return;

    const fetchSubmissions = async () => {
      try {
        setError(null);
        const res = await fetch(
          `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10`
        );
        const data = await res.json();

        if (data.status !== "OK") throw new Error("Failed to fetch submissions");

        setSubmissions(data.result.slice(0, 10));
      } catch (err) {
        setError(err.message);
        setSubmissions([]);
      }
    };

    fetchSubmissions();
  }, [handle]);

  return (
    <div id="RecentSubmissions" style={{ marginTop: "40px" }}>
      <h3 style={{ 
        fontSize: "1.5rem", 
        marginBottom: "20px",
        fontWeight: "700",
        color: "var(--text-primary)",
        borderBottom: "2px solid var(--accent)",
        paddingBottom: "10px",
        textAlign: "center"
      }}>
        Recent Submissions
      </h3>

      {error && (
        <div style={{ 
          color: "#e74c3c", 
          backgroundColor: "rgba(231, 76, 60, 0.1)", 
          padding: "10px 15px", 
          borderRadius: "6px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          <p style={{ margin: 0 }}>Error: {error}</p>
        </div>
      )}

      {submissions.length > 0 && (
        <table style={{ 
          width: "100%", 
          borderCollapse: "separate",
          borderSpacing: "0 5px",
          fontFamily: "Arial, sans-serif"
        }}>
          <thead>
            <tr style={{ backgroundColor: "var(--bg-light)" }}>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Problem</th>
              <th style={thStyle}>Index</th>
              <th style={thStyle}>Verdict</th>
              <th style={thStyle}>Language</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, i) => (
              <tr key={i} style={{ 
                backgroundColor: i % 2 === 0 ? "var(--bg-dark)" : "var(--bg-light)",
                transition: "transform 0.2s",
                ":hover": { transform: "translateY(-2px)" }
              }}>
                <td style={tdStyle}>{i + 1}</td>
                <td style={tdStyle}>{sub.problem.name}</td>
                <td style={tdStyle}>{sub.problem.index}</td>
                <td style={{ 
                  ...tdStyle, 
                  color: verdictColor(sub.verdict),
                  fontWeight: "bold" 
                }}>
                  {formatVerdict(sub.verdict)}
                </td>
                <td style={tdStyle}>{sub.programmingLanguage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {submissions.length === 0 && !error && handle && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div className="loading-spinner"></div>
          <p>Loading submissions...</p>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  borderBottom: "2px solid var(--border)",
  padding: "12px 15px",
  textAlign: "center",
  color: "var(--text-primary)",
  fontWeight: "600"
};

const tdStyle = {
  padding: "12px 15px",
  borderBottom: "1px solid var(--border)",
  textAlign: "center",
};

const verdictColor = (verdict) => {
  if (verdict === "OK") return "#4caf50";
  if (verdict.includes("WRONG") || verdict.includes("FAILED")) return "#f44336";
  if (verdict.includes("TIME_LIMIT")) return "#ff9800";
  return "var(--text-primary)";
};

const formatVerdict = (verdict) => {
  if (verdict === "OK") return "OK";
  if (verdict === "WRONG_ANSWER") return "WRONG_ANSWER";
  return verdict;
};

export default RecentSubmissions;
