// Utilities for saving and retrieving saved books in localStorage

const SAVED_BOOKS_KEY = "bookr_saved_books";

export function getSavedBooks() {
  try {
    const raw = localStorage.getItem(SAVED_BOOKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBook(book) {
  const books = getSavedBooks();
  if (!books.find((b) => b.id === book.id)) {
    books.push(book);
    localStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify(books));
  }
}

export function unsaveBook(bookId) {
  const books = getSavedBooks().filter((b) => b.id !== bookId);
  localStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify(books));
}

export function isBookSaved(bookId) {
  return getSavedBooks().some((b) => b.id === bookId);
}
