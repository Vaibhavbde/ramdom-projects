import React, { FC } from "react";
import Slider from "react-slick";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TVShowsType } from "../Types/Types";
import { useNavigate } from "react-router-dom";

interface RatedTVshowsProps {
  ratedtvshows: TVShowsType[];
}
const MovieCarousel: FC<RatedTVshowsProps> = ({ ratedtvshows }) => {
 const ratedshows =  ratedtvshows.slice(0,15);
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
    <Box sx={{ width: "75%", margin: "0 auto", height:"500px", overflow:"hidden", }}>
      <Slider {...settings}>
        {ratedshows.map((tvshows) => (
          <Card
          onClick={() =>
            handleCardClick(tvshows.id, "title" in tvshows)
          }
            key={tvshows.id}
            sx={{
              cursor:"pointer",
              padding: 0,
              margin: 0,
              height: "430px",
              opacity: "1 !important",
            }}
          >
            <CardMedia
              sx={{ height: "350px" }}
              component="img"
              image={`${baseImageUrl}${tvshows.poster_path}`}
              alt={tvshows.name}
            />
            <CardContent>
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="h4"
                component="h4"
              >
                {tvshows.name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Slider>
    </Box>
  );
};

export default MovieCarousel;
