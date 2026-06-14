import React, { FC } from "react";
import { CombinedType } from "../Types/Types";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
} from "@mui/material";
 
interface FavoritesProps {
  favorites: CombinedType[];
  removeFromFavorites: (item: any) => void;
  isAuthenticated: boolean; 
}

const Favorites: FC<FavoritesProps> = ({ favorites, removeFromFavorites, isAuthenticated }) => {
  return (
    <Box>
      <Box sx={{ padding: 4 }}>
       
        {isAuthenticated ? ( 
          favorites.length > 0 ? (
            <Box display="flex" flexDirection="column" gap={2}>
               <Typography
          sx={{ color: "white", textAlign: "center" }}
          variant="h3"
          component="h2"
          gutterBottom
        >
          My Favorite Movies and TV Shows
        </Typography>
              {favorites.map((item) => (
                <Card
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    padding: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 120, height: "auto", borderRadius: 1 }}
                    image={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                    alt={item.title || item.name}
                  />
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      paddingLeft: 2,
                    }}
                  >
                    <Typography variant="h6">
                      {item.title || item.name}
                    </Typography>
                    <Typography color="textSecondary">
                      {item.release_date
                        ? `Released: ${item.release_date}`
                        : `Aired: ${item.first_air_date}`}
                    </Typography>
                  </CardContent>
                  <Button
                    onClick={() => removeFromFavorites(item.id)}
                    sx={{
                      height: "70px",
                      fontSize: "18px",
                      padding: "5px 15px",
                      borderRadius: "50%",
                      marginTop: 7,
                      backgroundColor: "#F40F22",
                      color: "white",
                      ":hover": { backgroundColor: "#860111" },
                    }}
                  >
                    Delete
                  </Button>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography variant="body1">No favorites added yet.</Typography>
          )
        ) : (
          <Typography variant="h2" sx={{ textAlign: "center", textTransform:"none", color: "rgb(200,200,200)" }}>
            You need to sign in to view your favorites.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Favorites;
