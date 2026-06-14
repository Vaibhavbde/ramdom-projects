import React from 'react';
import BookCard from './BookCard';
import { motion, AnimatePresence } from 'framer-motion';

function BookList({ searchTerm }) {
  const books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 10.99 },
    { id: 2, title: '1984', author: 'George Orwell', price: 12.5 },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 9.75 },
  ];

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="book-list">
      <AnimatePresence>
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))
        ) : (
          <motion.p
            key="no-books"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: '20px', color: '#666' }}
          >
            No books found 📚
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BookList;
