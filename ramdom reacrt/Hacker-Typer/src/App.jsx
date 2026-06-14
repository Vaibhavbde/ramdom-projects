import React, { useState, useEffect, useCallback } from 'react';
import { hackerScript } from './code'; // Import the new single script
import MatrixRain from './matrixrain';
import './App.css';

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedCode, setTypedCode] = useState('');
  const [showAccessGranted, setShowAccessGranted] = useState(false);

  const codeToType = hackerScript;

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setTypedCode('');
    setShowAccessGranted(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = () => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= codeToType.length) {
          setShowAccessGranted(true);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    };

    if (!showAccessGranted) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [codeToType.length, showAccessGranted]);

  useEffect(() => {
    setTypedCode(codeToType.substring(0, currentIndex));
  }, [currentIndex, codeToType]);

  if (showAccessGranted) {
    return (
      <div className="matrix-container">
        <MatrixRain />
        <div className="access-granted-overlay">
          <h2>ACCESS GRANTED</h2>
          <button onClick={reset}>Re-initialize Terminal</button>
        </div>
      </div>
    );
  }

  return (
    <div className="hacker-typer-container">
      <div className="code-display">
        <pre>{typedCode}</pre>
        <span className="cursor"></span>
      </div>
    </div>
  );
}

export default App;