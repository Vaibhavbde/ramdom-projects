import React from "react";

const movies = {
  trending: [
    { title: "Extraction 2", image: "https://image.tmdb.org/t/p/w500/7gKI9hpEMcZUQpNgKrkDzJpbnNS.jpg" },
    { title: "The Gray Man", image: "https://image.tmdb.org/t/p/w500/8cXbitsS6dWQ5gfMTZdorpAAzEH.jpg" },
    { title: "Red Notice", image: "https://image.tmdb.org/t/p/w500/lAXONuqg41NwUMuzMiFvicDET9Y.jpg" },
    { title: "6 Underground", image: "https://image.tmdb.org/t/p/w500/lnWkyG3LLgbbrIEeyl5mK5VRFe4.jpg" },
  ],
  topRated: [
    { title: "The Dark Knight", image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
    { title: "Inception", image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg" },
    { title: "Fight Club", image: "https://image.tmdb.org/t/p/w500/a26cQPRhJPX6GbWfQbvZdrrp9j9.jpg" },
    { title: "Interstellar", image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
  ],
  action: [
    { title: "John Wick 4", image: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg" },
    { title: "Mad Max: Fury Road", image: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg" },
    { title: "Fast X", image: "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg" },
    { title: "Black Adam", image: "https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg" },
  ],
  tvShows: [
    { title: "Money Heist", image: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg" },
    { title: "Stranger Things", image: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg" },
    { title: "Breaking Bad", image: "https://image.tmdb.org/t/p/w500/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg" },
    { title: "Peaky Blinders", image: "https://image.tmdb.org/t/p/w500/bGZn5RVzMMXju4ev7xbl1aLdXqq.jpg" },
  ],
};

function Row({ title, movies }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-white mb-2">{title}</h2>
      <div className="flex space-x-4 overflow-x-scroll scrollbar-hide">
        {movies.map((movie, index) => (
          <div key={index} className="relative min-w-[200px] group">
            <img
              src={movie.image}
              alt={movie.title}
              className="rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center text-sm py-1 opacity-0 group-hover:opacity-100 transition">
              {movie.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 fixed w-full bg-black bg-opacity-80 z-10">
        <h1 className="text-3xl font-bold text-red-600">NETFLIX</h1>
        <ul className="flex space-x-6 text-gray-300">
          <li className="hover:text-white cursor-pointer">Home</li>
          <li className="hover:text-white cursor-pointer">TV Shows</li>
          <li className="hover:text-white cursor-pointer">Movies</li>
          <li className="hover:text-white cursor-pointer">My List</li>
        </ul>
      </nav>

      {/* Hero */}
      <div className="relative h-[75vh] w-full">
        <img
          src="https://image.tmdb.org/t/p/original/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg"
          alt="Featured"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-24 left-10">
          <h1 className="text-5xl font-bold mb-3">Extraction 2</h1>
          <p className="max-w-md text-gray-300 mb-4">
            A black ops mercenary embarks on a deadly mission in the world’s most dangerous city.
          </p>
          <div className="space-x-4">
            <button className="bg-white text-black px-6 py-2 rounded font-semibold">Play</button>
            <button className="bg-gray-700 text-white px-6 py-2 rounded font-semibold">
              More Info
            </button>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Rows */}
      <div className="mt-[-100px] px-10">
        <Row title="Trending Now" movies={movies.trending} />
        <Row title="Top Rated" movies={movies.topRated} />
        <Row title="Action Movies" movies={movies.action} />
        <Row title="TV Shows" movies={movies.tvShows} />
      </div>
    </div>
  );
}
