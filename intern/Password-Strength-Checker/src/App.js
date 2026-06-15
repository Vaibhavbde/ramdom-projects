import React, { useState } from 'react';
import './App.css';

function App() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Check individual requirements
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  // Calculate strength score
  const calculateStrength = () => {
    let score = 0;
    if (hasMinLength) score++;
    if (hasUpperCase) score++;
    if (hasLowerCase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    return score;
  };

  const strength = calculateStrength();

  // Get strength level and color
  const getStrengthInfo = () => {
    if (password.length === 0) return { level: 'None', color: '#e0e0e0' };
    if (strength <= 2) return { level: 'Weak', color: '#ff4757' };
    if (strength === 3) return { level: 'Fair', color: '#ffa502' };
    if (strength === 4) return { level: 'Good', color: '#2ed573' };
    return { level: 'Strong', color: '#1e90ff' };
  };

  const strengthInfo = getStrengthInfo();

  return (
    <div className="app">
      <div className="container">
        <h1>🔐 Password Strength Checker</h1>
        <p className="subtitle">Create a strong and secure password</p>

        <div className="input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="password-input"
          />
          <button
            className="toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>

        {password && (
          <>
            <div className="strength-bar-container">
              <div
                className="strength-bar"
                style={{
                  width: `${(strength / 5) * 100}%`,
                  backgroundColor: strengthInfo.color,
                }}
              ></div>
            </div>

            <div className="strength-label" style={{ color: strengthInfo.color }}>
              Password Strength: <strong>{strengthInfo.level}</strong>
            </div>
          </>
        )}

        <div className="requirements">
          <h3>Password Requirements:</h3>
          <ul>
            <li className={hasMinLength ? 'met' : ''}>
              {hasMinLength ? '✓' : '○'} At least 8 characters
            </li>
            <li className={hasUpperCase ? 'met' : ''}>
              {hasUpperCase ? '✓' : '○'} One uppercase letter
            </li>
            <li className={hasLowerCase ? 'met' : ''}>
              {hasLowerCase ? '✓' : '○'} One lowercase letter
            </li>
            <li className={hasNumber ? 'met' : ''}>
              {hasNumber ? '✓' : '○'} One number
            </li>
            <li className={hasSpecialChar ? 'met' : ''}>
              {hasSpecialChar ? '✓' : '○'} One special character (!@#$%^&*)
            </li>
          </ul>
        </div>

        {strength === 5 && (
          <div className="success-message">
            🎉 Excellent! Your password is very strong!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
