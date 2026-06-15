// Utilities to manage My Reviews (books the user has reviewed)
// Storage shape: {
//   [userName]: Array<book>
// }

const STORAGE_KEY = "bookr_reviewed_books";

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  // notify listeners
  window.dispatchEvent(new Event("reviewedBooks:updated"));
}

export function getReviewedBooksForUser(userName) {
  if (!userName) return [];
  const store = readStore();
  return Array.isArray(store[userName]) ? store[userName] : [];
}

export function upsertReviewedBookForUser(userName, book) {
  if (!userName || !book || !book.id) return false;
  const store = readStore();
  const list = Array.isArray(store[userName]) ? store[userName] : [];
  const idx = list.findIndex((b) => b.id === book.id);
  const minimal = {
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
    genre: book.genre,
    description: book.description ?? book.review ?? "",
    rating: book.rating ?? 0,
    reviewCount: book.reviewCount ?? 0,
  };
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...minimal };
  } else {
    list.unshift(minimal);
  }
  store[userName] = list;
  writeStore(store);
  return true;
}

export function removeReviewedBookForUser(userName, bookId) {
  if (!userName || !bookId) return false;
  const store = readStore();
  const list = Array.isArray(store[userName]) ? store[userName] : [];
  const next = list.filter((b) => b.id !== bookId);
  store[userName] = next;
  writeStore(store);
  return true;
}

export function clearReviewedBooksForUser(userName) {
  if (!userName) return false;
  const store = readStore();
  delete store[userName];
  writeStore(store);
  return true;
}
