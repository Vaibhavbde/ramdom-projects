import React, { useEffect, useState, FC } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Divider,
} from "@mui/material";

import { MovieDetailsType, CastType, CrewType } from "../Types/Types";


interface MovieDetailsProps {
  addToFavorites:(e:any) => void;
}
const MovieDetails: FC<MovieDetailsProps> = ({addToFavorites}) => {
  const { id } = useParams<{ id: string }>();
  const [movieDetails, setMovieDetails] = useState<MovieDetailsType | null>(
    null
  );
  const [cast, setCast] = useState<CastType[]>([]);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [director, setDirector] = useState<string | null>(null);

  const movieApiKey = process.env.REACT_APP_MOVIES_API_KEY;
  const movieApiUrl = process.env.REACT_APP_MOVIES_API_URL;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const detailsResponse = await fetch(
        `${movieApiUrl}/movie/${id}?api_key=${movieApiKey}`
      );
      const detailsData = await detailsResponse.json();
      setMovieDetails(detailsData);

      const creditsResponse = await fetch(
        `${movieApiUrl}/movie/${id}/credits?api_key=${movieApiKey}`
      );
      const creditsData = await creditsResponse.json();
      setCast(creditsData.cast);

      const directorData = creditsData.crew.find(
        (person: CrewType) => person.job === "Director"
      );
      setDirector(directorData?.name || "N/A");

      const videosResponse = await fetch(
        `${movieApiUrl}/movie/${id}/videos?api_key=${movieApiKey}`
      );
      const videosData = await videosResponse.json();
      const trailer = videosData.results.find(
        (video: { type: string }) => video.type === "Trailer"
      );
      setVideoKey(trailer ? trailer.key : null);
    };

    fetchMovieDetails();
  }, [id, movieApiKey, movieApiUrl]);

  if (!movieDetails || !cast) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const userScorePercentage = Math.round(movieDetails.vote_average * 10);
  const baseImageUrl = "https://image.tmdb.org/t/p/original";
  const getMonthName = (monthNumber: number): string => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return monthNames[monthNumber - 1];
  };
  return (
    <Box>
      <Box>
        <Box
          sx={{
            position: "relative",
            padding: 4,
            color: "white",
            overflow: "hidden",
            "::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: "0%",
              backgroundImage: `linear-gradient(to right, rgba(31.5, 31.5, 31.5, 1) calc((50vw - 170px) - 340px), rgba(31.5, 31.5, 31.5, 0.84) 50%, rgba(31.5, 31.5, 31.5, 0.84) 100%), url(${baseImageUrl}${movieDetails.backdrop_path})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 1,
              zIndex: -1,
            },
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
              }}
            >
              <Box
                sx={{
                  flex: "0.9 1 0px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CardMedia
                  component="img"
                  alt={movieDetails.title}
                  image={`${baseImageUrl}${movieDetails.poster_path}`}
                  sx={{ borderRadius: 2, maxWidth: "100%" }}
                />
              </Box>

              <Box sx={{ flex: 2, display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="h2"
                  gutterBottom
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textShadow: "2px 2px 5px rgba(0,0,0,0.7)",
                  }}
                >
                  {movieDetails.title}
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "#fff134",
                    fontStyle: "italic",
                    fontWeight: "bold",
                    textShadow: "2px 2px 5px rgba(0,0,0,0.7)",
                  }}
                >
                  {movieDetails.tagline}
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "white",
                    textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
                  }}
                >
                  {movieDetails.overview}
                </Typography>
                <Divider sx={{ my: 4, borderColor: "gray" }} />
                <Typography
                  variant="h5"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
                  }}
                >
                  {userScorePercentage}% User Score
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "white", marginTop: "5px" }}
                >
                  <strong>Release Date:</strong>
                  {`${getMonthName(
                    new Date(movieDetails.release_date).getMonth() + 1
                  )} ${new Date(
                    movieDetails.release_date
                  ).getDate()}, ${new Date(
                    movieDetails.release_date
                  ).getFullYear()}`}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "white", marginTop: "5px" }}
                >
                  <strong>Status:</strong> {movieDetails.status}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "white", marginTop: "5px" }}
                >
                  <strong>Genres:</strong>
                  {movieDetails.genres
                    .map((genre: { name: string }) => genre.name)
                    .join(", ")}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "white", marginTop: "5px" }}
                >
                  <strong>Production Countries:</strong>
                  {movieDetails.production_countries
                    .map((country: { name: string }) => country.name)
                    .join(", ")}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ color: "white", marginTop: "5px" }}
                >
                  <strong>Director:</strong> {director}
                </Typography>
                <Box mt={3}>
                  <Button
                    href={movieDetails.homepage}
                    target="_blank"
                    sx={{
                      marginLeft: 0,
                      fontSize: "15px",
                      padding: "7px 12px",
                      borderColor: "white",
                      color: "white",
                      backgroundColor: "#0D1470",
                      textTransform: "capitalize",
                      ":hover": {
                        fontSize: "15px",
                        padding: "7px 12px",
                        color: "white",
                        backgroundColor: "#0E0A30", 
                        borderColor: "white", 
                      },
                    }}
                  >
                    Visit Homepage
                  </Button>
                  <Button
  onClick={(e) => {
    e.stopPropagation();
    addToFavorites(movieDetails); 
  }}
  sx={{
    marginLeft: 2,
    fontSize: "15px",
    padding: "7px 12px",
    borderColor: "white",
    color: "white",
    textTransform: "capitalize",
    backgroundColor: "#F40F22",
    transition: "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
    ":hover": {
      transform: "scale(1.05)", 
      backgroundColor: "#860111", 
    },
    ":active": {
      transform: "scale(0.98)",
    },
  }}
>
  Add to Favorites
</Button>

                </Box>
              </Box>
            </Box>

            {videoKey && (
              <Box mt={6}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                    color: "#ffcc00",
                  }}
                >
                  Watch Trailer
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <iframe
                    title="Video"
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoKey}`}
                    name="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </Box>
              </Box>
            )}
          </Container>
        </Box>
        <Container maxWidth="lg">
          <Box mt={6}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: "bold",
                textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
                color: "#ffcc00",
              }}
            >
              Cast
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {cast
                .filter((actor) => actor.profile_path)
                .map((actor) => (
                  <Card
                    key={actor.id}
                    sx={{
                      background: "#2a2a2a",
                      borderRadius: 2,
                      width: "150px",
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt={actor.name}
                      image={`${baseImageUrl}${actor.profile_path}`}
                      height="200"
                      sx={{ borderRadius: 1 }}
                    />
                    <CardContent>
                      <Typography
                        variant="body1"
                        align="center"
                        sx={{ fontWeight: "bold", color: "#ffcc00" }}
                      >
                        {actor.name}
                      </Typography>
                      <Typography variant="body1" align="center" color="white">
                        {actor.character}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default MovieDetails;
