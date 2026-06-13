/**
 * ScreenVault — Movie & TV Search
 *
 * APIs used (both free, no key required):
 *   Movies  → TVmaze API  https://api.tvmaze.com  (filtered to movie types)
 *   TV Shows → TVmaze API  https://api.tvmaze.com
 *
 * Open index.html in your browser and search!
 */

// ── State ────────────────────────────────────────────────────────────────
let currentMode = 'movie'; // 'movie' | 'tv'

// ── DOM refs ──────────────────────────────────────────────────────────────
const input   = document.getElementById('q');
const metaEl  = document.getElementById('meta');
const results = document.getElementById('results');

// ── Mode toggle ───────────────────────────────────────────────────────────
function setMode(mode, btn) {
  currentMode = mode;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const q = input.value.trim();
  if (q) doSearch();
}

// ── Main search ───────────────────────────────────────────────────────────
async function doSearch() {
  const q = input.value.trim();
  if (!q) return;

  showSpinner();

  try {
    const items = currentMode === 'movie'
      ? await searchMovies(q)
      : await searchTV(q);

    renderResults(items, q);
  } catch (err) {
    showMsg('⚠️', 'Search Failed',
      'Something went wrong — check your internet connection.', true);
    console.error(err);
  }
}

// ── TVmaze helper — shared fetch & map ───────────────────────────────────
async function tvmazeFetch(q) {
  const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error(`TVmaze error (${res.status})`);
  const data = await res.json();

  return (data || []).map(item => {
    const s = item.show;
    return {
      title:  s.name || 'Untitled',
      year:   s.premiered ? s.premiered.slice(0, 4) : '—',
      poster: s.image ? s.image.medium : null,
      type:   s.type || 'Show',
      rating: s.rating && s.rating.average
                ? s.rating.average.toFixed(1)
                : null,
      extra:  (s.genres || []).slice(0, 2).join(', ')
    };
  });
}

// ── Movies — TVmaze filtered to movie/animation types ────────────────────
async function searchMovies(q) {
  const all = await tvmazeFetch(q);
  const MOVIE_TYPES = ['movie', 'animation', 'short'];
  const movies = all.filter(m => MOVIE_TYPES.includes(m.type.toLowerCase()));
  // Fall back to all results if nothing matches movie types
  return movies.length ? movies : all;
}

// ── TV Shows — TVmaze filtered to scripted/reality/documentary etc. ──────
async function searchTV(q) {
  const all = await tvmazeFetch(q);
  const MOVIE_TYPES = ['movie'];
  const shows = all.filter(m => !MOVIE_TYPES.includes(m.type.toLowerCase()));
  return shows.length ? shows : all;
}

// ── Render ────────────────────────────────────────────────────────────────
function renderResults(items, q) {
  if (!items.length) {
    metaEl.style.display = 'none';
    showMsg('🎬', 'Nothing Found',
      `No results for "<strong>${escHtml(q)}</strong>" — try a different title.`);
    return;
  }

  metaEl.style.display = 'flex';
  metaEl.innerHTML =
    `<strong>${items.length}</strong>
     <span class="meta-dot">·</span>
     results for "<strong>${escHtml(q)}</strong>"`;

  results.innerHTML = `<div class="grid">${items.map(renderCard).join('')}</div>`;
}

function renderCard(item) {
  const posterHtml = item.poster
    ? `<img
         src="${escHtml(item.poster)}"
         alt="${escHtml(item.title)}"
         loading="lazy"
         onerror="this.parentNode.innerHTML = noPosterHTML()">`
    : noPosterHTML();

  const starSVG = `<svg viewBox="0 0 10 10">
    <polygon points="5,0.5 6.5,3.5 9.8,4 7.4,6.3 7.9,9.5 5,8 2.1,9.5 2.6,6.3 0.2,4 3.5,3.5"/>
  </svg>`;

  const ratingHtml = item.rating
    ? `<div class="rating-pill">${starSVG}${escHtml(String(item.rating))}</div>`
    : '';

  const sub = item.year + (item.extra ? ' · ' + item.extra : '');

  return `
    <div class="card">
      <div class="poster">
        ${posterHtml}
        <div class="type-pill">${escHtml(item.type)}</div>
        ${ratingHtml}
      </div>
      <div class="card-body">
        <div class="card-title">${escHtml(item.title)}</div>
        <div class="card-sub">${escHtml(sub)}</div>
      </div>
    </div>`;
}

// Must be global so inline onerror can call it
function noPosterHTML() {
  return `
    <div class="no-art">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="3" width="20" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <span>No image</span>
    </div>`;
}

// ── UI helpers ─────────────────────────────────────────────────────────────
function showSpinner() {
  metaEl.style.display = 'none';
  results.innerHTML = `<div class="spinner-wrap"><div class="spinner"></div></div>`;
}

function showMsg(icon, title, body, isError = false) {
  metaEl.style.display = 'none';
  results.innerHTML = `
    <div class="msg${isError ? ' err' : ''}">
      <div class="icon">${icon}</div>
      <h3>${title}</h3>
      <p>${body}</p>
    </div>`;
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

// ── Welcome state ──────────────────────────────────────────────────────────
showMsg('🎥', 'Find Your Film',
  'Search movies or TV shows — just type a title above.');
