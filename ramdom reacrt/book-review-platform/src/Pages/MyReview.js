import React, { useEffect, useState } from "react";
import { getUser } from "../utils/auth";
import {
  getReviewedBooksForUser,
  clearReviewedBooksForUser,
} from "../utils/reviewedBooks";
import { getAllReviews, clearReviewsByUser } from "../utils/reviews";
import { getSavedBooks } from "../utils/savedBooks";
import { getBookById } from "../services/googleBooksApi";
import { BookCard } from "../components/BookCard";

const MyReview = () => {
  const [books, setBooks] = useState([]);

  const load = async () => {
    const user = getUser();
    if (!user) {
      setBooks([]);
      return;
    }
    // Migration: Ensure previously-reviewed books are included
    try {
      const all = getAllReviews();
      const userBookIds = Object.keys(all).filter((bookId) =>
        Array.isArray(all[bookId])
          ? all[bookId].some((r) => r?.userName === user.name)
          : false
      );

      if (userBookIds.length > 0) {
        const existing = getReviewedBooksForUser(user.name);
        const existingIds = new Set(existing.map((b) => String(b.id)));
        const savedMap = new Map(getSavedBooks().map((b) => [String(b.id), b]));
        const tasks = userBookIds
          .filter((bid) => !existingIds.has(String(bid)))
          .map(async (bid) => {
            let bookObj = savedMap.get(String(bid));
            if (!bookObj) {
              try {
                bookObj = await getBookById(bid);
              } catch {
                bookObj = {
                  id: bid,
                  title: "Book",
                  author: "",
                  cover: "/placeholder-book.jpg",
                  genre: "General",
                  description: "",
                  rating: 0,
                  reviewCount: 0,
                };
              }
            }
            // Only upsert if bookObj is valid
            if (bookObj && bookObj.id) {
              getReviewedBooksForUser(user.name).unshift(bookObj);
            }
          });
        if (tasks.length) await Promise.all(tasks);
      }
    } catch (e) {
      // Non-blocking; continue with what we have
      console.warn("MyReview migration warning:", e);
    }

    // Step 2: Load consolidated list
    setBooks(getReviewedBooksForUser(user.name));
  };

  useEffect(() => {
    // initial load and migration
    load();
    const onUser = () => load();
    const onReviewed = () => load();
    const onReviews = () => load();
    window.addEventListener("user:updated", onUser);
    window.addEventListener("reviewedBooks:updated", onReviewed);
    window.addEventListener("reviews:updated", onReviews);
    return () => {
      window.removeEventListener("user:updated", onUser);
      window.removeEventListener("reviewedBooks:updated", onReviewed);
      window.removeEventListener("reviews:updated", onReviews);
    };
  }, []);

  const handleClearAll = async () => {
    const user = getUser();
    if (!user) return;
    if (!books.length) return;
    const confirmClear = window.confirm(
      "This will remove all your reviews and ratings and clear My Reviews. Continue?"
    );
    if (!confirmClear) return;
    clearReviewsByUser(user.name);
    clearReviewedBooksForUser(user.name);
    await load();
  };

  return (
    <main
      style={{
        padding: "2rem",
        marginLeft: "280px",
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <h1 style={{ margin: 0, color: "var(--foreground)" }}>My Reviews</h1>
        <button
          onClick={handleClearAll}
          className="btn-ghost"
          style={{
            borderColor: "var(--destructive)",
            color: "var(--destructive)",
            backgroundColor: "transparent",
            padding: "0.5rem 0.9rem",
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: "8px",
            cursor: books.length ? "pointer" : "not-allowed",
            opacity: books.length ? 1 : 0.6,
          }}
          disabled={!books.length}
          aria-disabled={!books.length}
          title={books.length ? "Clear all reviews" : "No reviews to clear"}
        >
          Clear all reviews
        </button>
      </div>

      {books.length === 0 ? (
        <p style={{ marginTop: "2rem", color: "var(--muted-foreground)" }}>
          You haven't reviewed any books yet. Click Review on a book to add your
          rating and text.
        </p>
      ) : (
        <div className="reviews-container">
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      )}
    </main>
  );
};

export default MyReview;
