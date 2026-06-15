import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      alert("Time's up!");
      setIsRunning(false);
      setTimeLeft(25 * 60);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="app">
      <h1>Pomodoro Timer</h1>
      <div className="timer">{formatTime(timeLeft)}</div>
      <div className="controls">
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={() => setTimeLeft(25 * 60)}>Reset</button>
      </div>
    </div>
  );
}

export default App;
