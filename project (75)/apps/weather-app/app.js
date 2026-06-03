/**
 * Skycast Weather App
 * APIs used (both 100% free, no key required):
 *   Geocoding : https://geocoding-api.open-meteo.com
 *   Forecast  : https://api.open-meteo.com
 * Listed at  : https://github.com/public-apis/public-apis (Weather section)
 */

// ── WMO weather-code → [description, emoji] ──────────────────────────────
const WMO_CODES = {
  0:  ['Clear Sky',            '☀️'],
  1:  ['Mainly Clear',         '🌤️'],
  2:  ['Partly Cloudy',        '⛅'],
  3:  ['Overcast',             '☁️'],
  45: ['Fog',                  '🌫️'],
  48: ['Icy Fog',              '🌫️'],
  51: ['Light Drizzle',        '🌦️'],
  53: ['Drizzle',              '🌦️'],
  55: ['Heavy Drizzle',        '🌧️'],
  61: ['Slight Rain',          '🌧️'],
  63: ['Rain',                 '🌧️'],
  65: ['Heavy Rain',           '🌧️'],
  71: ['Slight Snow',          '🌨️'],
  73: ['Snow',                 '❄️'],
  75: ['Heavy Snow',           '❄️'],
  77: ['Snow Grains',          '🌨️'],
  80: ['Slight Showers',       '🌦️'],
  81: ['Showers',              '🌧️'],
  82: ['Violent Showers',      '⛈️'],
  85: ['Snow Showers',         '🌨️'],
  86: ['Heavy Snow Showers',   '❄️'],
  95: ['Thunderstorm',         '⛈️'],
  96: ['Thunderstorm + Hail',  '⛈️'],
  99: ['Thunderstorm + Heavy Hail', '⛈️'],
};

function getWmo(code) {
  return WMO_CODES[code] ?? ['Unknown', '🌡️'];
}

// ── DOM refs ──────────────────────────────────────────────────────────────
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const resultEl  = document.getElementById('result');

// ── Event listeners ───────────────────────────────────────────────────────
searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') fetchWeather();
});

// ── Main fetch function ───────────────────────────────────────────────────
async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  showSpinner();

  try {
    // Step 1 — Geocode city name → lat / lon
    const geoURL =
      `https://geocoding-api.open-meteo.com/v1/search` +
      `?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoRes  = await fetch(geoURL);
    if (!geoRes.ok) throw new Error(`Geocoding error (${geoRes.status})`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found — check the spelling and try again');
    }

    const { latitude, longitude, name, country, country_code } = geoData.results[0];

    // Step 2 — Fetch current weather
    const wxURL =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
      `&wind_speed_unit=kmh&timezone=auto`;

    const wxRes  = await fetch(wxURL);
    if (!wxRes.ok) throw new Error(`Weather API error (${wxRes.status})`);
    const wxData = await wxRes.json();

    const c = wxData.current;
    const [desc, emoji] = getWmo(c.weather_code);

    showCard({
      name, country, country_code,
      temp:      Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      humidity:  c.relative_humidity_2m,
      wind:      Math.round(c.wind_speed_10m),
      desc, emoji,
    });

  } catch (err) {
    showError(err.message);
  }
}

// ── Render helpers ────────────────────────────────────────────────────────
function showSpinner() {
  resultEl.innerHTML = `<div class="spinner"></div>`;
}

function showError(msg) {
  resultEl.innerHTML = `<div class="error-box">❌ ${msg}</div>`;
}

function showCard({ name, country_code, country, temp, feelsLike, humidity, wind, desc, emoji }) {
  const badge = country_code || country || '';
  resultEl.innerHTML = `
    <div class="card">
      <div>
        <span class="city-name">${escHtml(name)}</span>
        ${badge ? `<span class="country-badge">${escHtml(badge)}</span>` : ''}
      </div>

      <div class="main-info">
        <div>
          <div class="temp">${temp}°C</div>
          <div class="description">${escHtml(desc)}</div>
        </div>
        <div class="weather-emoji" role="img" aria-label="${escHtml(desc)}">${emoji}</div>
      </div>

      <div class="divider"></div>

      <div class="stats">
        <div class="stat">
          <div class="stat-label">Feels Like</div>
          <div class="stat-value">${feelsLike}°</div>
        </div>
        <div class="stat">
          <div class="stat-label">Humidity</div>
          <div class="stat-value">${humidity}%</div>
        </div>
        <div class="stat">
          <div class="stat-label">Wind</div>
          <div class="stat-value">${wind} km/h</div>
        </div>
      </div>
    </div>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
