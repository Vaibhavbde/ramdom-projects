import React, { FC, useEffect, useState } from "react";
import { TVShowsType } from "../Types/Types";
import { MoviesType } from "../Types/Types";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface TVshowsProps {
  trendingmovies: MoviesType[];
  searchTerm: string;
  setSearchTerm: (e: string) => void;
  searchQuery: MoviesType[];
  searchQueryTV: TVShowsType[];
  FormSubmitHandle: (e: any) => void;
  addToFavorites: (item: any) => void;
}

const Header: FC<TVshowsProps> = ({
  trendingmovies,
  searchTerm,
  setSearchTerm,
  searchQuery,
  FormSubmitHandle,
  searchQueryTV,
  addToFavorites,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === trendingmovies.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(intervalId);
  }, [trendingmovies.length]);

  if (trendingmovies.length === 0) {
    return <div></div>;
  }

  const combinedResults = [...searchQuery, ...searchQueryTV].sort(
    (a, b) => b.vote_count - a.vote_count
  );

  const handleCardClick = (id: number, isMovie: boolean) => {
    if (isMovie) {
      navigate(`/movie/${id}`);
    } else {
      navigate(`/tvshow/${id}`);
    }
  };

  const baseImageUrl = "https://image.tmdb.org/t/p/original";

  return (
    <div>
      <section id="home" className="welcome-hero">
        <div className="container">
          <div className="welcome-hero-serch-box">
            <div className="welcome-hero-form">
              <form onSubmit={FormSubmitHandle}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search movies..."
                />
              </form>
            </div>
          </div>

          <Box
          sx={{marginTop:"0"}}
            marginTop={2}
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            gap={3}
          >
            {combinedResults
              .filter((search) => search.poster_path)
              .map((search) => (
                <Box
                sx={{marginTop:"7px"}}
                  key={search.id}
                  width={{ xs: "100%", sm: "48%", md: "30%", lg: "22%" }}
                >
                  <Card
                    onClick={() =>
                      handleCardClick(search.id, "title" in search)
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    <CardMedia
                      component="img"
                      height="300"
                      image={`${baseImageUrl}${search.poster_path}`}
                      alt={"title" in search ? search.title : search.name}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {"title" in search ? search.title : search.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {"title" in search ? "Movie" : "TV Show"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
          </Box>
          {trendingmovies[currentIndex]?.backdrop_path && (
            <div className="game-card">
              <Box sx={{ cursor: "pointer" }}>
                <img
                  onClick={() =>
                    handleCardClick(
                      trendingmovies[currentIndex].id,
                      "title" in trendingmovies[currentIndex]
                    )
                  }
                src={`  ${baseImageUrl}${trendingmovies[currentIndex].backdrop_path}`}
                  alt={trendingmovies[currentIndex]?.title || "No Title"}
                  className="game-card-image"
                />
                <div className="game-card-content">
                  <h3 className="game-title">
                    {trendingmovies[currentIndex].title} (
                    {trendingmovies[currentIndex].release_date.slice(0, 4)})
                  </h3>

                  <button
                    className="add-to-list-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToFavorites(trendingmovies[currentIndex]);
                    }}
                  >
                    Add to Favorites
                  </button>
                </div>
              </Box>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Header;
