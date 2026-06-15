// Utilities for managing book reviews and ratings in localStorage

const REVIEWS_KEY = "bookr_reviews";

/**
 * Get all reviews from localStorage
 * @returns {Object} Object with bookId as keys, array of reviews as values
 */
export function getAllReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Get reviews for a specific book
 * @param {string|number} bookId - The book ID
 * @returns {Array} Array of review objects
 */
export function getBookReviews(bookId) {
  const allReviews = getAllReviews();
  return allReviews[bookId] || [];
}

/**
 * Add or update a review for a book
 * @param {string|number} bookId - The book ID
 * @param {Object} review - Review object with rating, text, userName, etc.
 * @returns {boolean} Success status
 */
export function addReview(bookId, review) {
  try {
    const allReviews = getAllReviews();
    if (!allReviews[bookId]) {
      allReviews[bookId] = [];
    }

    const userName = review.userName || "Anonymous";

    // Check if user already reviewed this book
    const existingReviewIndex = allReviews[bookId].findIndex(
      (r) => r.userName === userName
    );

    if (existingReviewIndex !== -1) {
      // Update existing review
      allReviews[bookId][existingReviewIndex] = {
        ...allReviews[bookId][existingReviewIndex],
        rating: review.rating,
        text: review.text || "",
        userAvatar: review.userAvatar || "",
        date: new Date().toISOString(), // Update timestamp
        ...review,
      };
    } else {
      // Add new review
      const newReview = {
        id: Date.now() + Math.random(), // unique ID
        rating: review.rating,
        text: review.text || "",
        userName: userName,
        userAvatar: review.userAvatar || "",
        date: new Date().toISOString(),
        ...review,
      };

      allReviews[bookId].push(newReview);
    }

    localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));

    // Dispatch event to notify components
    window.dispatchEvent(
      new CustomEvent("reviews:updated", { detail: { bookId } })
    );
    return true;
  } catch (e) {
    console.error("Error adding review:", e);
    return false;
  }
}

/**
 * Calculate average rating for a book
 * @param {string|number} bookId - The book ID
 * @returns {number} Average rating (0-5)
 */
export function getBookAverageRating(bookId) {
  const reviews = getBookReviews(bookId);
  if (reviews.length === 0) return 0;

  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Get review count for a book
 * @param {string|number} bookId - The book ID
 * @returns {number} Number of reviews
 */
export function getBookReviewCount(bookId) {
  const reviews = getBookReviews(bookId);
  return reviews.length;
}

/**
 * Get book statistics (rating and count)
 * @param {string|number} bookId - The book ID
 * @returns {Object} Object with rating and reviewCount
 */
export function getBookStats(bookId) {
  return {
    rating: getBookAverageRating(bookId),
    reviewCount: getBookReviewCount(bookId),
  };
}

/**
 * Get user's review for a specific book
 * @param {string|number} bookId - The book ID
 * @param {string} userName - The user's name
 * @returns {Object|null} User's review or null if not found
 */
export function getUserReview(bookId, userName) {
  const reviews = getBookReviews(bookId);
  return reviews.find((review) => review.userName === userName) || null;
}

/**
 * Check if current user has already reviewed a book
 * @param {string|number} bookId - The book ID
 * @param {string} userName - The user's name
 * @returns {boolean} True if user has reviewed
 */
export function hasUserReviewed(bookId, userName) {
  return getUserReview(bookId, userName) !== null;
}

/**
 * Delete a review
 * @param {string|number} bookId - The book ID
 * @param {string|number} reviewId - The review ID
 * @returns {boolean} Success status
 */
export function deleteReview(bookId, reviewId) {
  try {
    const allReviews = getAllReviews();
    if (!allReviews[bookId]) return false;

    allReviews[bookId] = allReviews[bookId].filter(
      (review) => review.id !== reviewId
    );
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));

    window.dispatchEvent(
      new CustomEvent("reviews:updated", { detail: { bookId } })
    );
    return true;
  } catch (e) {
    console.error("Error deleting review:", e);
    return false;
  }
}

/**
 * Clear all reviews by a specific user across all books.
 * Also dispatches reviews:updated for each affected book so UI can refresh stats.
 * @param {string} userName - The user's name
 * @returns {{removed:number, affectedBookIds:Array<string>}} Summary of deletions
 */
export function clearReviewsByUser(userName) {
  const summary = { removed: 0, affectedBookIds: [] };
  if (!userName) return summary;
  try {
    const allReviews = getAllReviews();
    let changed = false;
    for (const bookId of Object.keys(allReviews)) {
      const before = allReviews[bookId] || [];
      const after = before.filter((r) => r.userName !== userName);
      const removedCount = before.length - after.length;
      if (removedCount > 0) {
        allReviews[bookId] = after;
        summary.removed += removedCount;
        summary.affectedBookIds.push(bookId);
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));
      // Dispatch individual events so listening BookCards recalc
      for (const bookId of summary.affectedBookIds) {
        window.dispatchEvent(
          new CustomEvent("reviews:updated", { detail: { bookId } })
        );
      }
    }
  } catch (e) {
    console.error("Error clearing reviews by user:", e);
  }
  return summary;
}
