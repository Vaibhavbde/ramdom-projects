// src/components/Countdown.jsx
import React, { useState, useEffect, useRef } from 'react';

const isValidDate = (d) => d instanceof Date && !isNaN(d);

const Countdown = () => {
  // Use null for empty birthday (safer than empty string)
  const [birthday, setBirthday] = useState(null);
  const [name, setName] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(false);

  // keep interval id in ref to avoid stale closures
  const intervalRef = useRef(null);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('name');
      const savedBirthday = localStorage.getItem('birthday');

      if (savedName && savedBirthday) {
        const parsed = new Date(savedBirthday);
        if (isValidDate(parsed)) {
          setName(savedName);
          setBirthday(parsed);
          setIsActive(true); // auto-start if valid saved data exists
        } else {
          // Remove invalid saved data
          localStorage.removeItem('birthday');
          localStorage.removeItem('name');
        }
      }
    } catch (err) {
      // localStorage may be unavailable in some environments - ignore errors
      // console.warn('localStorage not available', err);
    }
  }, []);

  // Start/stop interval when isActive or birthday changes
  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isActive && isValidDate(birthday)) {
      // Run an initial calculation immediately
      calculateTimeLeft();

      intervalRef.current = setInterval(() => {
        calculateTimeLeft();
      }, 1000);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, birthday]);

  const calculateTimeLeft = () => {
    if (!isValidDate(birthday)) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const today = new Date();

    // Create a nextBirthday using this year's month & date (ignore stored year)
    let nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());

    // Ensure nextBirthday is strictly in the future (handles same-day/timezone issues)
    while (nextBirthday <= today) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }

    const timeDifference = nextBirthday.getTime() - today.getTime();

    if (timeDifference <= 0) {
      // defensive check: if for some reason difference is zero or negative, show zeros
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(timeDifference / (1000 * 3600 * 24));
    const hours = Math.floor((timeDifference % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeDifference % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
  };

  const handleBirthdayChange = (e) => {
    // e.target.value comes in "YYYY-MM-DD" format; convert to Date
    const val = e.target.value;
    if (!val) {
      setBirthday(null);
      return;
    }

    const dt = new Date(val + 'T00:00:00'); // make it explicit midnight local time
    if (isValidDate(dt)) {
      setBirthday(dt);
    } else {
      setBirthday(null);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleStartCountdown = (e) => {
    e.preventDefault();
    // Validate before starting
    if (!name || !isValidDate(birthday)) {
      // you could show a better UI validation, but keep alert for now
      alert('Please enter a valid name and date.');
      return;
    }

    try {
      localStorage.setItem('name', name);
      localStorage.setItem('birthday', birthday.toISOString());
    } catch (err) {
      // ignore localStorage errors
    }

    setIsActive(true);
    // calculateTimeLeft will be invoked immediately via the effect
  };

  const handleReset = () => {
    setBirthday(null);
    setName('');
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setIsActive(false);

    try {
      localStorage.removeItem('name');
      localStorage.removeItem('birthday');
    } catch (err) {
      // ignore localStorage errors
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Format number with leading zeros (optional)
  const fmt = (n) => String(n).padStart(2, '0');

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
      <h1 className="text-3xl font-bold mb-6">Countdown to Your Birthday</h1>

      {/* Show form when not active */}
      {!isActive && (
        <form onSubmit={handleStartCountdown} className="mb-6">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={handleNameChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            required
          />
          <input
            type="date"
            value={birthday ? birthday.toISOString().substring(0, 10) : ''}
            onChange={handleBirthdayChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Start Countdown
          </button>
        </form>
      )}

      {/* When active, show countdown */}
      {isActive && (
        <div className="text-2xl font-semibold">
          <p className="mb-4 text-lg text-gray-700">Hello {name}!</p>
          <div className="flex justify-around mb-4">
            <div>
              <span className="block text-blue-600 text-4xl">{timeLeft.days}</span>
              <span className="text-gray-500">Days</span>
            </div>
            <div>
              <span className="block text-blue-600 text-4xl">{fmt(timeLeft.hours)}</span>
              <span className="text-gray-500">Hours</span>
            </div>
            <div>
              <span className="block text-blue-600 text-4xl">{fmt(timeLeft.minutes)}</span>
              <span className="text-gray-500">Minutes</span>
            </div>
            <div>
              <span className="block text-blue-600 text-4xl">{fmt(timeLeft.seconds)}</span>
              <span className="text-gray-500">Seconds</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Reset
            </button>

            <button
              onClick={() => {
                // Allow pausing the countdown without clearing saved data
                if (isActive) {
                  setIsActive(false);
                } else {
                  // resume
                  if (isValidDate(birthday)) {
                    setIsActive(true);
                  }
                }
              }}
              className="mt-6 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              Pause
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Countdown;
