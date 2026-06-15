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

import { TVShowsDetailsType, CastType, CrewType } from "../Types/Types";

interface TVshowdetailsprops {
  addToFavorites:(item:any) => void;
}
const TVShowDetails: FC<TVshowdetailsprops> = ({addToFavorites}) => {
  const { id } = useParams<{ id: string }>();
  const [tvShowDetails, setTVShowDetails] = useState<TVShowsDetailsType | null>(
    null
  );
  const [cast, setCast] = useState<CastType[]>([]);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [director, setDirector] = useState<string | null>(null);

  const tvShowApiKey = process.env.REACT_APP_MOVIES_API_KEY;
  const movieApiUrl = process.env.REACT_APP_MOVIES_API_URL;

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      const detailsResponse = await fetch(
        `${movieApiUrl}/tv/${id}?api_key=${tvShowApiKey}`
      );
      const detailsData = await detailsResponse.json();
      setTVShowDetails(detailsData);

      const creditsResponse = await fetch(
        `${movieApiUrl}/tv/${id}/credits?api_key=${tvShowApiKey}`
      );
      const creditsData = await creditsResponse.json();
      setCast(creditsData.cast);

      const directorData = creditsData.crew.find(
        (person: CrewType) => person.department === "Production"
      );
      setDirector(directorData?.name || "N/A");

      const videosResponse = await fetch(
        `${movieApiUrl}/tv/${id}/videos?api_key=${tvShowApiKey}`
      );
      const videosData = await videosResponse.json();
      const trailer = videosData.results.find(
        (video: { type: string }) => video.type === "Trailer"
      );
      setVideoKey(trailer ? trailer.key : null);
    };

    fetchTVShowDetails();
  }, [id, tvShowApiKey, movieApiUrl]);

  if (!tvShowDetails || !cast) {
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

  const userScorePercentage = Math.round(tvShowDetails.vote_average * 10);
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
              bottom: 0,
              backgroundImage: `linear-gradient(to right, rgba(31.5, 31.5, 31.5, 1) calc((50vw - 170px) - 340px), rgba(31.5, 31.5, 31.5, 0.84) 50%, rgba(31.5, 31.5, 31.5, 0.84) 100%), url(${baseImageUrl}${tvShowDetails.backdrop_path})`,
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
                  alt={tvShowDetails.name}
                  image={`${baseImageUrl}${tvShowDetails.poster_path}`}
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
                  {tvShowDetails.name}
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
                  {tvShowDetails.tagline}
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "white",
                    textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
                  }}
                >
                  {tvShowDetails.overview}
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
                  <strong>First Air Date:</strong>
                  {`${getMonthName(
                    new Date(tvShowDetails.first_air_date).getMonth() + 1
                  )} ${new Date(
                    tvShowDetails.first_air_date
                  ).getDate()}, ${new Date(
                    tvShowDetails.first_air_date
                  ).getFullYear()}`}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "white", marginTop: "5px" }}
                >
                  <strong>Status:</strong> {tvShowDetails.status}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "white", marginTop: "5px" }}
                >
                  <strong>Genres:</strong>
                  {tvShowDetails.genres
                    .map((genre: { name: string }) => genre.name)
                    .join(", ")}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "white", marginTop: "5px" }}
                >
                  <strong>Production Countries:</strong>
                  {tvShowDetails.production_countries
                    .map((country: { name: string }) => country.name)
                    .join(", ")}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "white", marginTop: "5px" }}
                >
                  <strong>Producer:</strong> {director}
                </Typography>
                <Box mt={3}>
                  <Button
                    href={tvShowDetails.homepage}
                    target="_blank"
                    sx={{
                      marginLeft: 2,
                      fontSize:"16px",
                      padding:'10px 15px',
                      borderColor: "white",
                      color: "white",
                      backgroundColor: "#0D1470",
                      ":hover": {
                        fontSize:"16px",
                      padding:'10px 15px',
                      color:"white",
                      
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
    addToFavorites(tvShowDetails); 
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
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoKey}`}
                    title="Trailer"
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
              {cast.map((actor) => (
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

export default TVShowDetails;
