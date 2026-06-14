import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import SearchIcon from "./search.svg";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); // For modal data
  const [showModal, setShowModal] = useState(false); // For modal visibility

  useEffect(() => {
    searchMovies("Batman");
  }, []);

  const searchMovies = async (title) => {
    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();

    if (data.Response === "True") {
      setMovies(data.Search);
    } else {
      setMovies([]);
    }
  };

  const fetchMovieDetails = async (id) => {
    const response = await fetch(`${API_URL}&i=${id}`);
    const data = await response.json();
    if (data.Response === "True") {
      setSelectedMovie(data);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setShowModal(false);
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);


  return (
    <div className="app">
      <h1>FilmFlix</h1>

      <div className="search">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies"
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        />
      </div>

      {movies?.length > 0 ? (
        <div className="container cursor-pointer">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              onClick={() => fetchMovieDetails(movie.imdbID)}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No movies found</h2>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedMovie && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>×</button>
            <div className="flex justify-center">
              <img
                src={
                  selectedMovie.Poster !== "N/A"
                    ? selectedMovie.Poster
                    : "https://via.placeholder.com/400"
                }
                alt={selectedMovie.Title}
                className="rounded-lg w-48 shadow-md mb-4"
              />
            </div>
            {/* Movie Info */}
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-3">
              {selectedMovie.Title}
            </h2>

            <div className="space-y-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p><strong className="text-gray-900 dark:text-white">Year:</strong> {selectedMovie.Year}</p>
              <p><strong className="text-gray-900 dark:text-white">Genre:</strong> {selectedMovie.Genre}</p>
              <p><strong className="text-gray-900 dark:text-white">Director:</strong> {selectedMovie.Director}</p>
              <p><strong className="text-gray-900 dark:text-white">Actors:</strong> {selectedMovie.Actors}</p>
              <p><strong className="text-gray-900 dark:text-white">Plot:</strong> {selectedMovie.Plot}</p>
              <p className="text-yellow-600 font-semibold">
                ⭐ IMDb Rating: {selectedMovie.imdbRating}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

