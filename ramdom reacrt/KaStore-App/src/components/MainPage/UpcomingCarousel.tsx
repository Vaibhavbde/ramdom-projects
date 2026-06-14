import React, { FC } from "react";
import Slider from "react-slick";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MoviesType } from "../Types/Types";
import { useNavigate } from "react-router-dom";

interface UpcomingProps {
  upcomingmovies: MoviesType[];
}
const UpcomingCarousel: FC<UpcomingProps> = ({ upcomingmovies }) => {
  const upcomingmovie = upcomingmovies.slice(0,15);
  const settings = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ], 
  }; 
  const baseImageUrl = "https://image.tmdb.org/t/p/original";

  
  const navigate = useNavigate();
  const handleCardClick = (id: number, isMovie: boolean) => {
    if (isMovie) {
      navigate(`/movie/${id}`); 
    } else {
      navigate(`/tvshow/${id}`); 
    }
  };
  return (
    <Box sx={{ width: "75%", margin: "0 auto", height:"550px",overflow:"hidden", marginBottom:"0" }}>
      <Slider {...settings}>
        {upcomingmovie.map((upcoming) => (
          <Card
          onClick={() =>
            handleCardClick(upcoming.id, "title" in upcoming)
          }
            key={upcoming.id}
            sx={{
              cursor:"pointer",
              padding: 0,
              margin: 0,
              height: "450px", 
          maxHeight: "450px", 
              opacity: "1 !important",
            }}
          >
            <CardMedia
              sx={{ height: "350px" }}
              component="img"
              image={`${baseImageUrl}${upcoming.poster_path}`}
              alt={upcoming.title}
            />
            <CardContent>
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="h4"
                component="h4"
              >
                {upcoming.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Slider>
    </Box>
  );
};

export default UpcomingCarousel;
