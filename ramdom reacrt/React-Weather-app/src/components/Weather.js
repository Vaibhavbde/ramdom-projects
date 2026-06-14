import React, { useState, useEffect } from "react";
import DisplayWeather from "./DisplayWeather";
import "./weather.css";

function Weather() {
  const [weather, setWeather] = useState([]);
  const [form, setForm] = useState({
    city: "",
    country: "",
  });

  // NEW: Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("weather_app_dark_mode");
      if (saved !== null) setDarkMode(saved === "true");
    } catch (e) {
      // ignore localStorage errors (e.g. private mode)
    }
  }, []);

  // Persist theme on change
  useEffect(() => {
    try {
      localStorage.setItem("weather_app_dark_mode", darkMode ? "true" : "false");
    } catch (e) {
      // ignore localStorage errors
    }
  }, [darkMode]);

  const APIKEY = "Enter Your API Key";
  
  async function weatherData(e) {
    e.preventDefault();
    if (form.city === "") {
      alert("Add values");
    } else {
      const data = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${form.city},${form.country}&APPID=${APIKEY}`
      )
        .then((res) => res.json())
        .then((data) => data);

      setWeather({ data: data });
    }
  }

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "city") {
      setForm({ ...form, city: value });
    }
    if (name === "country") {
      setForm({ ...form, country: value });
    }
  };

  // NEW: Toggle handler
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    // NEW: Add `dark` class to root when dark mode is active
    <div className={`weather ${darkMode ? "dark" : ""}`}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span className="title">Weather App</span>

        {/* NEW: Dark mode toggle button */}
        <button
          className="theme-toggle"
          onClick={toggleDarkMode}
          aria-pressed={darkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <br />
      <form>
        <input
          type="text"
          placeholder="city"
          name="city"
          onChange={(e) => handleChange(e)}
        />
        &nbsp; &nbsp; &nbsp;&nbsp;
        <input
          type="text"
          placeholder="Country"
          name="country"
          onChange={(e) => handleChange(e)}
        />
        <button className="getweather" onClick={(e) => weatherData(e)}>
          Submit
        </button>
      </form>

      {/* {console.log(weather)} */}
      {weather.data !== undefined ? (
        <div>
          <DisplayWeather data={weather.data} />
        </div>
      ) : null}
    </div>
  );
}

export default Weather;
