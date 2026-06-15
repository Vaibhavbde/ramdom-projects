import React, { FC } from "react";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";
import { TVShowsType } from "../Types/Types";
import { useNavigate } from "react-router-dom";

interface TVShowsGridProps {
  tvShows: TVShowsType[];
}

const TVShowsGrid: FC<TVShowsGridProps> = ({ tvShows }) => {
  const navigate= useNavigate();
const handleCardClick = (id: number, isMovie: boolean) => {
  if (isMovie) {
    navigate(`/movie/${id}`); 
  } else {
    navigate(`/tvshow/${id}`);
  }
}; 
  return (
    <Box display="flex" flexWrap="wrap" gap={2}> 
      {tvShows.map((tvShow) => (
        <Box
          key={tvShow.id}
          sx={{ width: { 
            xs: "100%", 
            sm: "47%", 
            "@media (max-width: 600px)": {
              width: "95%",  
            },
            "@media (max-width: 350px)": {
              width: "90%", 
            },
            md: "30%",
           } }} 
        >
          <Card
              onClick={() => handleCardClick(tvShow.id, "title" in tvShow)}
              sx={{cursor:"pointer"}}
 
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
             
              image={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
              alt={tvShow.name}
            />
            <CardContent>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, 
                  transition: "color 0.3s ease",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
              variant="h5">{tvShow.name}</Typography>
              <Typography variant="body2">{tvShow.first_air_date}</Typography>
           
              <Typography
          variant="body1"
          fontSize={{ xs: "0.875rem", sm: "1rem", md: "1.125rem" }}
        >
          {Math.round(tvShow.vote_average * 10)}%
        </Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default TVShowsGrid;
