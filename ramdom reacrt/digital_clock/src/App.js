import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // State to hold current time
  const [time, setTime] = useState(new Date());

  // useEffect runs once when the component mounts
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date()); // update time every second
    }, 1000);

    // Cleanup interval when component unmounts
    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    // Add leading zero if < 10
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="App">
      <h1>🕒 Digital Clock</h1>
      <div className="clock">{formatTime(time)}</div>
      <p>{time.toDateString()}</p>
    </div>
  );
}

export default App;
