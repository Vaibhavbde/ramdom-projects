import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

export const SearchBar = ({
  onSearch,
  placeholder = "Search for books, authors, or reviews...",
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={`search-bar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-input-container">
          <Search className="search-icon" />
          <input
            type="search"
            placeholder={placeholder}
            className="search-input"
            value={searchQuery}
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
};
