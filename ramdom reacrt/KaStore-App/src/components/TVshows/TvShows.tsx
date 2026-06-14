import React, { useState, FC, useEffect } from "react";
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import Sidebar from "./Sidebar";
import TVShowsGrid from "./TVShowsGrid";
import { TVShowsType } from "../Types/Types";
import { MovieGenreType } from "../Types/Types";
import { LanguageType } from "../Types/Types";
const TVShows: FC = () => {
  const [allTVShows, setAllTVShows] = useState<TVShowsType[]>([]);
  const [filteredTVShows, setFilteredTVShows] = useState<TVShowsType[]>([]);
  const [tvShowGenre, setTVShowGenre] = useState<MovieGenreType[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number[]>([]);
  const [releaseDateFrom, setReleaseDateFrom] = useState<string | null>(null);
  const [releaseDateTo, setReleaseDateTo] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>("popular");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [language, setLanguage] = useState<LanguageType[]>([]);
const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);


const applyFilters = (tvShows: TVShowsType[]) => {
  let filteredTVShows = tvShows;

  if (selectedGenre.length > 0) {
    filteredTVShows = filteredTVShows.filter((tvShow) =>
      selectedGenre.every((genre) => tvShow.genre_ids.includes(genre))
    );
  }

  if (releaseDateFrom || releaseDateTo) {
    filteredTVShows = filteredTVShows.filter((tvShow) => {
      const tvShowReleaseDate = new Date(tvShow.first_air_date).getTime();
      const from = releaseDateFrom ? new Date(releaseDateFrom).getTime() : 0;
      const to = releaseDateTo ? new Date(releaseDateTo).getTime() : Infinity;
      return tvShowReleaseDate >= from && tvShowReleaseDate <= to;
    });
  }

  if (selectedLanguage) {
    filteredTVShows = filteredTVShows.filter(
      (tvShow) => tvShow.original_language === selectedLanguage
    );
  }

  return filteredTVShows;
};

 const fetchData = async (sortType: string, page: number = 1) => {
  const tvKey = process.env.REACT_APP_MOVIES_API_KEY;
  const tvUrl = process.env.REACT_APP_MOVIES_API_URL;
  const tvGenreUrl = `${tvUrl}/genre/tv/list?api_key=${tvKey}`;
  const LanguageUrl = `${tvUrl}/configuration/languages?api_key=${tvKey}`;
  let tvShowsUrl = `${tvUrl}/tv/popular?api_key=${tvKey}&page=${page}`;

  if (sortType === "topRated") {
    tvShowsUrl = `${tvUrl}/tv/top_rated?api_key=${tvKey}&page=${page}`;
  }

  const [tvShowsResponse, tvGenresResponse, LanguageResponse] = await Promise.all([
    fetch(tvShowsUrl),
    fetch(tvGenreUrl),
    fetch(LanguageUrl),
  ]);

  const tvShowsData = await tvShowsResponse.json();
  const genresData = await tvGenresResponse.json();
  const LanguageData = await LanguageResponse.json();

  setTVShowGenre(genresData.genres);
  setLanguage(LanguageData);

  const newTVShows = tvShowsData.results;
  const totalPages = tvShowsData.total_pages;

  return { newTVShows, totalPages };
};


const fetchTVShowsUntil20 = async (sortType: string, page: number = 1) => {
  setLoading(true);
  setNoResults(false);
  let accumulatedTVShows: TVShowsType[] = [];
  let accumulatedFilteredTVShows: TVShowsType[] = [];
  let totalPages = 100;

  while (accumulatedFilteredTVShows.length < 20 && page <= totalPages) {
    const { newTVShows, totalPages: fetchedTotalPages } = await fetchData(
      sortType,
      page
    );
    accumulatedTVShows = [...accumulatedTVShows, ...newTVShows];

    const newlyFilteredTVShows = applyFilters(accumulatedTVShows);
    accumulatedFilteredTVShows = [...newlyFilteredTVShows];

    if (page === 1) {
      totalPages = Math.min(fetchedTotalPages, 20);
    }

    page += 1;
    
  }

  setLoading(false);

  if (accumulatedFilteredTVShows.length === 0) {
    setNoResults(true);
  }

  setAllTVShows(accumulatedTVShows);
  setFilteredTVShows(accumulatedFilteredTVShows);
  setTotalPages(totalPages);
};

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    setSelectedSort(selectedValue);
    setCurrentPage(1);
    fetchTVShowsUntil20(selectedValue, 1);
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
    fetchTVShowsUntil20(selectedSort, 1);
  };
  const handleLanguageChange = (language: string | null) => {
    setSelectedLanguage(language);
  };
  
  useEffect(() => {
    fetchTVShowsUntil20(selectedSort, currentPage);
  }, [selectedSort, currentPage]);
 
  return ( 
    <div>
      <Container sx={{ marginTop: "30px", width: "100%" }} disableGutters>
        <Box display="flex" gap={2} width="100%">
          <Box flex={{ xs: "45%",sm:"35%", md: "25%" }}>
            <Sidebar
              selectedSort={selectedSort}
              handleRadioChange={handleRadioChange}
              tvShowGenre={tvShowGenre}
              selectedGenre={selectedGenre}
              handleGenreChange={handleGenreChange}
              handleFilterClick={handleFilterClick}
              handleReleaseDateChange={handleReleaseDateChange}
              language={language}
  selectedLanguage={selectedLanguage}
  handleLanguageChange={handleLanguageChange} 

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
                <TVShowsGrid tvShows={filteredTVShows} />{" "}
                {filteredTVShows.length < 20 || currentPage >= totalPages ? (
                  <Typography variant="body1">All results loaded.</Typography>
                ) : (
                  <Button
                    sx={{
                      width: "97%",
                      fontSize: "25px",
                      marginBottom: "20px",
                      marginTop: "5px",
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

export default TVShows;
