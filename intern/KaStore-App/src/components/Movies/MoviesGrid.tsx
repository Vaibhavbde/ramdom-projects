import React, { FC } from "react";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";
import { MoviesType } from "../Types/Types";
import { useNavigate } from "react-router-dom";

interface MovieProps {
  movie: MoviesType[];
}
const MoviesGrid: FC<MovieProps> = ({ movie }) => {
  const navigate = useNavigate();
  const handleCardClick = (id: number, isMovie: boolean) => {
    if (isMovie) {
      navigate(`/movie/${id}`); 
    } else {
      navigate(`/tvshow/${id}`); 
    }
  }; 
  const baseImageUrl = "https://image.tmdb.org/t/p/original";

  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {movie.map((movie, index) => (
        <Box
          key={`${movie.id}-${index}`}
          sx={{
            boxShadow: "1px 2px 5px 2px rgba(50,50,50,0.2)",
            width: {
              xs: "100%", 
              sm: "47%", 
              "@media (max-width: 600px)": {
                width: "95%",  
              },
              "@media (max-width: 350px)": {
                width: "90%", 
              },
              md: "30%",
             
            },
            marginBottom: 2,
          }} 
        >
          <Card
            onClick={() => handleCardClick(movie.id, "title" in movie)}
            sx={{ cursor: "pointer" }}
          >
            <CardMedia
              sx={{
                width: { 
                  xs: "100%", 
                  sm: "100%", 
                  "@media (max-width: 600px)": {
                    width: "100%",  
                  },
                  "@media (max-width: 350px)": {
                    width: "90%", 
                  },
                  md: "100%",
                 },
                borderBottom: "1px solid black",
                height: { 
                  xs: "80%", 
                  sm: "100%", 
                  "@media (max-width: 600px)": {
                    width: "100%",  
                  },
                  "@media (max-width: 350px)": {
                    width: "100%", 
                  },
                  md: "100%",
                
                 },
              }}
              component="img"
              image={`${baseImageUrl}${movie.poster_path}`}
              alt={movie.title}
            />
            <CardContent>
              <a href="#">
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, 
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                  variant="h5"
                >
                  {movie.title}
                </Typography>
              </a>
              <Typography
                fontWeight={"bold"}
                fontSize={{ xs: "0.875rem", sm: "1rem", md: "1.125rem" }} 
                color="text.secondary"
              >
                {movie.release_date}
              </Typography>
              <Typography
                variant="body1"
                fontSize={{ xs: "0.875rem", sm: "1rem", md: "1.125rem" }} 
              >
                {Math.round(movie.vote_average * 10)}%
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default MoviesGrid;
