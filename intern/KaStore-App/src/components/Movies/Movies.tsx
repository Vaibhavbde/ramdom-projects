import React, { useState, FC, useEffect } from "react";
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import Sidebar from "./Sidebar";
import MoviesGrid from "./MoviesGrid";
import { MoviesType } from "../Types/Types";
import { MovieGenreType } from "../Types/Types";
import { LanguageType } from "../Types/Types";
const Movies: FC = () => {
  const [allMovies, setAllMovies] = useState<MoviesType[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<MoviesType[]>([]);
  const [movieGenre, setMovieGenre] = useState<MovieGenreType[]>([]);
  const [language, setLanguage] = useState<LanguageType[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number[]>([]);
  const [releaseDateFrom, setReleaseDateFrom] = useState<string | null>(null);
  const [releaseDateTo, setReleaseDateTo] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>("popular");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const applyFilters = (movies: MoviesType[]) => {
    let filteredMovies = movies;

    if (selectedGenre.length > 0) {
      filteredMovies = filteredMovies.filter((movie) =>
        selectedGenre.every((genre) => movie.genre_ids.includes(genre))
      );
    }

    if (releaseDateFrom || releaseDateTo) {
      filteredMovies = filteredMovies.filter((movie) => {
        const movieReleaseDate = new Date(movie.release_date).getTime();
        const from = releaseDateFrom ? new Date(releaseDateFrom).getTime() : 0;
        const to = releaseDateTo ? new Date(releaseDateTo).getTime() : Infinity;
        return movieReleaseDate >= from && movieReleaseDate <= to;
      });
    }

    if (selectedLanguage) {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.original_language === selectedLanguage
      );
    }

    return filteredMovies;
  };

  const fetchData = async (sortType: string, page: number = 1) => {
    const movieKey = process.env.REACT_APP_MOVIES_API_KEY;
    const movieurl = process.env.REACT_APP_MOVIES_API_URL;
    const movieGenreUrl = `${movieurl}/genre/movie/list?api_key=${movieKey}`;
    let movieUrl = `${movieurl}/movie/popular?api_key=${movieKey}&page=${page}`;
    let LanguageUrl = `${movieurl}/configuration/languages?api_key=${movieKey}`;
    if (sortType === "topRated") {
      movieUrl = `${movieurl}/movie/top_rated?api_key=${movieKey}&page=${page}`;
    }

    const [moviesResponse, movieGenresResponse, LanguageResponse] =
      await Promise.all([
        fetch(movieUrl),
        fetch(movieGenreUrl),
        fetch(LanguageUrl),
      ]);

    const moviesData = await moviesResponse.json();

    const genresData = await movieGenresResponse.json();
    const LanguageData = await LanguageResponse.json();
    setMovieGenre(genresData.genres);
    setLanguage(LanguageData);
    const newMovies = moviesData.results;
    const totalPages = moviesData.total_pages;

    return { newMovies, totalPages };
  };

 

  const fetchMoviesUntil20 = async (
    sortType: string,
    page: number = 1,
    append: boolean = false
  ) => {
    setLoading(true);
    setNoResults(false);
    let accumulatedMovies: MoviesType[] = append ? allMovies : []; 
    let accumulatedFilteredMovies: MoviesType[] = append ? filteredMovies : []; 
    let totalPages = 100;

    while (accumulatedFilteredMovies.length < 20 && page <= totalPages) {
      const { newMovies, totalPages: fetchedTotalPages } = await fetchData(
        sortType,
        page
      );
      accumulatedMovies = [...accumulatedMovies, ...newMovies];

      const newlyFilteredMovies = applyFilters(accumulatedMovies);
      accumulatedFilteredMovies = [...newlyFilteredMovies];

      if (page === 1) {
        totalPages = Math.min(fetchedTotalPages, 100);
      }

      page += 1;
    }

    setLoading(false);

    if (accumulatedFilteredMovies.length === 0) {
      setNoResults(true);
    }

    setAllMovies(accumulatedMovies);
    setFilteredMovies(accumulatedFilteredMovies);
    setTotalPages(totalPages);
  };


  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMoviesUntil20(selectedSort, nextPage, true);
    }
  };
  
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    setSelectedSort(selectedValue);
    setCurrentPage(1);
    fetchMoviesUntil20(selectedValue, 1);
  };

  const handleGenreChange = (genre: number) => {
    setSelectedGenre((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleReleaseDateChange = (from: string, to: string) => {
    setReleaseDateFrom(from);
    setReleaseDateTo(to);
  };
  const handleFilterClick = () => {
    setCurrentPage(1);
    setAllMovies([]);
    setFilteredMovies([]);
    fetchMoviesUntil20(selectedSort, 1);
  };

  useEffect(() => {
    fetchMoviesUntil20(selectedSort, currentPage);
  }, [selectedSort, currentPage]);
  return (
    <div>
      <Container sx={{ marginTop: "30px", width: "100%" }} disableGutters>
        <Box display="flex" gap={2} width="100%">
          <Box flex={{ xs: "45%",sm:"35%", md: "25%" }}>
          <Sidebar
  selectedSort={selectedSort} 
  handleRadioChange={handleRadioChange}
  movieGenre={movieGenre}
  selectedGenre={selectedGenre}
  handleGenreChange={handleGenreChange}
  handleFilterClick={handleFilterClick}
  handleReleaseDateChange={handleReleaseDateChange}
  language={language}
  selectedLanguage={selectedLanguage}
  handleLanguageChange={setSelectedLanguage} 
/>

          </Box>
          <Box flex={{ xs: "60%", sm:"65%", md: "75%" }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
              </Box>
            ) : noResults ? (
              <Typography variant="h6">No matches were found.</Typography>
            ) : (
              <>
                <MoviesGrid movie={filteredMovies} />
                {filteredMovies.length < 20 || currentPage >= totalPages ? (
                  <Typography variant="body1">All results loaded.</Typography>
                ) : (
                  <Button
                    sx={{
                      width: "97%",
                      fontSize: "25px",
                      marginBottom: "20px",
                    }}
                    onClick={handleLoadMore}
                    variant="contained"
                  >
                    Load More
                  </Button>
                )}
              </>
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Movies;
