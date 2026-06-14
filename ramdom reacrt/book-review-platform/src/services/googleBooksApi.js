const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com/books/v1/volumes";

/**
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results (default: 20)
 * @param {number} startIndex - Starting index for pagination (default: 0)
 * @returns {Promise<Object>} API response with books data
 */
export const searchBooks = async (query, maxResults = 20, startIndex = 0) => {
  try {
    const params = new URLSearchParams({
      q: query,
      maxResults: maxResults.toString(),
      startIndex: startIndex.toString(),
      printType: "books",
      orderBy: "relevance",
    });

    const response = await fetch(`${GOOGLE_BOOKS_API_BASE}?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
};

/**
 * Get featured/popular books (using a default search)
 * @param {number} maxResults - Maximum number of results
 * @returns {Promise<Object>} API response with books data
 */
export const getFeaturedBooks = async (maxResults = 20) => {
  const popularQueries = [
    "bestseller fiction",
    "classic literature",
    "popular novels 2024",
    "award winning books",
  ];

  const randomQuery =
    popularQueries[Math.floor(Math.random() * popularQueries.length)];
  return searchBooks(randomQuery, maxResults);
};

/**
 * Get books by category/subject
 * @param {string} subject - Subject/category to search for
 * @param {number} maxResults - Maximum number of results
 * @returns {Promise<Object>} API response with books data
 */
export const getBooksBySubject = async (subject, maxResults = 20) => {
  return searchBooks(`subject:${subject}`, maxResults);
};

/**
 * Transform Google Books API response to our app's format
 * @param {Object} googleBook - Single book item from Google Books API
 * @returns {Object} Transformed book object
 */
export const transformGoogleBook = (googleBook) => {
  const volumeInfo = googleBook.volumeInfo || {};
  const imageLinks = volumeInfo.imageLinks || {};

  return {
    id: googleBook.id,
    title: volumeInfo.title || "Unknown Title",
    author: volumeInfo.authors
      ? volumeInfo.authors.join(", ")
      : "Unknown Author",
    cover:
      imageLinks.thumbnail ||
      imageLinks.smallThumbnail ||
      "/placeholder-book.jpg",
    rating: 0, // Start with 0, will be calculated from platform reviews
    reviewCount: 0, // Start with 0, will be counted from platform reviews
    genre: volumeInfo.categories ? volumeInfo.categories[0] : "General",
    description: volumeInfo.description || "No description available.",
    publishedDate: volumeInfo.publishedDate || "",
    pageCount: volumeInfo.pageCount || 0,
    language: volumeInfo.language || "en",
    publisher: volumeInfo.publisher || "Unknown Publisher",
    isbn: volumeInfo.industryIdentifiers
      ? volumeInfo.industryIdentifiers.find((id) => id.type === "ISBN_13")
          ?.identifier ||
        volumeInfo.industryIdentifiers.find((id) => id.type === "ISBN_10")
          ?.identifier ||
        "No ISBN"
      : "No ISBN",
    previewLink: volumeInfo.previewLink || "",
    infoLink: volumeInfo.infoLink || "",
  };
};

/**
 * Transform Google Books API response array to our app's format
 * @param {Array} googleBooks - Array of book items from Google Books API
 * @returns {Array} Array of transformed book objects
 */
export const transformGoogleBooksResponse = (googleBooksResponse) => {
  if (!googleBooksResponse?.items) {
    return [];
  }

  return googleBooksResponse.items.map(transformGoogleBook);
};

/**
 * Get book details by ID
 * @param {string} bookId - Google Books volume ID
 * @returns {Promise<Object>} Transformed book object
 */
export const getBookById = async (bookId) => {
  try {
    const response = await fetch(`${GOOGLE_BOOKS_API_BASE}/${bookId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return transformGoogleBook(data);
  } catch (error) {
    console.error("Error fetching book details:", error);
    throw error;
  }
};

/**
 * Generate mock review data for books (since Google Books doesn't provide user reviews)
 * @param {Object} book - Book object
 * @returns {Object} Book with mock review data
 */
export const addMockReviewData = (book) => {
  const mockReviewers = [
    {
      name: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b765?w=150",
    },
    {
      name: "Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    {
      name: "Emma Williams",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    },
    {
      name: "David Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    },
    {
      name: "Lisa Thompson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    },
  ];

  const mockReviews = [
    "An absolutely captivating read that kept me turning pages late into the night.",
    "Beautifully written with complex characters and an engaging plot.",
    "A thought-provoking book that offers new perspectives on familiar themes.",
    "The author's storytelling ability really shines through in this work.",
    "Couldn't put it down! Highly recommend to anyone who enjoys this genre.",
  ];

  const randomReviewer =
    mockReviewers[Math.floor(Math.random() * mockReviewers.length)];
  const randomReview =
    mockReviews[Math.floor(Math.random() * mockReviews.length)];

  return {
    ...book,
    review: book.description
      ? book.description.substring(0, 200) + "..."
      : randomReview,
    reviewer: randomReviewer.name,
    reviewerAvatar: randomReviewer.avatar,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  };
};
