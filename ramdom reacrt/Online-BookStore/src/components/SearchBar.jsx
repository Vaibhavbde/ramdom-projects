import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="search-bar" style={{ margin: '20px 0' }}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="🔍 Search books by title or author..."
                className="search-input"
                style={{
                    width: '70%',
                    maxWidth: '400px',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    outline: 'none',
                    transition: '0.3s',
                }}
            />
        </div>
    );
};

export default SearchBar;
