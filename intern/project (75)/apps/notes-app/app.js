/**
 * Notes App
 * ─ Add notes via textarea + button (or Ctrl/Cmd+Enter)
 * ─ Notes persist in localStorage — survive page refresh
 * ─ Delete individual notes with animated removal
 */

const STORAGE_KEY = 'notesApp_notes';

// ── DOM refs ──────────────────────────────────────────────────────────────
const noteInput  = document.getElementById('noteInput');
const charCount  = document.getElementById('charCount');
const addBtn     = document.getElementById('addBtn');
const notesGrid  = document.getElementById('notesGrid');
const countBadge = document.getElementById('countBadge');

// ── State ─────────────────────────────────────────────────────────────────
let notes = loadNotes();

// ── Event listeners ───────────────────────────────────────────────────────
addBtn.addEventListener('click', addNote);

noteInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) addNote();
});

noteInput.addEventListener('input', () => {
  charCount.textContent = noteInput.value.length;
});

// ── Functions ─────────────────────────────────────────────────────────────
function addNote() {
  const text = noteInput.value.trim();
  if (!text) return;

  const note = {
    id:   Date.now(),
    text,
    date: new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }),
  };

  notes.unshift(note);
  saveNotes();

  noteInput.value      = '';
  charCount.textContent = '0';

  render();
}

function deleteNote(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  if (!card) return;

  card.style.transition = 'all 0.22s ease';
  card.style.transform  = 'scale(0.85)';
  card.style.opacity    = '0';

  setTimeout(() => {
    notes = notes.filter(n => n.id !== id);
    saveNotes();
    render();
  }, 220);
}

function render() {
  // Update badge
  countBadge.textContent = `${notes.length} note${notes.length !== 1 ? 's' : ''}`;

  if (notes.length === 0) {
    notesGrid.innerHTML = `
      <div class="empty-state">
        <div class="icon">📝</div>
        <p>No notes yet. Start writing above!</p>
      </div>`;
    return;
  }

  notesGrid.innerHTML = notes.map((note, i) => `
    <div class="note-card" data-id="${note.id}">
      <div class="note-accent color-${i % 6}"></div>
      <div class="note-body">${escHtml(note.text)}</div>
      <div class="note-footer">
        <span class="note-date">${note.date}</span>
        <button class="delete-btn" onclick="deleteNote(${note.id})" aria-label="Delete note">
          <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="3,4 3,13 12,13 12,4"/>
            <line x1="1" y1="4" x2="14" y2="4"/>
            <line x1="6" y1="7" x2="6" y2="11"/>
            <line x1="9" y1="7" x2="9" y2="11"/>
            <polyline points="5,4 5,2 10,2 10,4"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

// ── Storage helpers ───────────────────────────────────────────────────────
function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Initial render ────────────────────────────────────────────────────────
render();
