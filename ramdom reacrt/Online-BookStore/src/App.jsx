import { useState } from 'react';
import './App.css';
import BookList from './components/BookList';
import ThemeToggle from './components/ThemeToggle';
import SearchBar from './components/SearchBar'; // ✅ new component

function App() {
  const [searchTerm, setSearchTerm] = useState(''); // ✅ state for search

  return (
    <div className="App">
      <header>
        <h1>My Online Bookstore</h1>
        <ThemeToggle />
      </header>

      {/* ✅ Search bar below header */}
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* ✅ Pass searchTerm as a prop */}
      <BookList searchTerm={searchTerm} />
    </div>
  );
}

export default App;
