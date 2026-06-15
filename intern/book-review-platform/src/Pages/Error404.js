import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainContent.css";

const Error404 = () => {
  const navigate = useNavigate();
  const handleBackToHome = () => navigate("/");

  return (
    <div className="main-content">
      <div className="error-hero">
        <div className="error-illustration" aria-hidden>
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="180" height="180" rx="16" fill="#f4faf6" />
            <path
              d="M30 130 L150 50"
              stroke="#e6f0ec"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <circle cx="60" cy="60" r="26" fill="#ffffff" stroke="#dfeee6" />
            <circle cx="120" cy="120" r="26" fill="#ffffff" stroke="#dfeee6" />
            <text
              x="90"
              y="98"
              textAnchor="middle"
              fontSize="56"
              fill="#cfe3d6"
              fontFamily="Arial"
            >
              404
            </text>
          </svg>
        </div>

        <div className="error-copy">
          <h1>Page not found</h1>
          <p className="muted">
            The page you're looking for doesn't exist or hasn't been built yet.
          </p>
          <div className="error-actions">
            <button className="btn-primary" onClick={handleBackToHome}>
              Back to Home
            </button>
            <button
              className="btn-ghost"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error404;
