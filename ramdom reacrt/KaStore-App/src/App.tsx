import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./components/MainPage/Index";
import Movies from "./components/Movies/Movies";
import TVShows from "./components/TVshows/TvShows";
import MovieDetails from "./components/Details/MovieDetails";
import TVShowDetails from "./components/Details/TVShowDetails";
import Favorites from "./components/Favorites/Favorites";
import { Snackbar, Alert } from "@mui/material";
import Auth from "./components/SIGN_IN/SignIn";
import HeaderTop from "./components/HeaderTop";

function App() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarOpen1, setSnackbarOpen1] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarMessage1, setSnackbarMessage1] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackbarClose1 = () => {
    setSnackbarOpen1(false);
  };

  const [favorites, setFavorites] = useState<any[]>(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const savedFavorites = user
      ? localStorage.getItem(`favorites_${user.username}`)
      : null;
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("user");
  });

  const handleLogin = (user: any) => {
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(user));
    const savedFavorites = localStorage.getItem(`favorites_${user.username}`);
    setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);
    window.location.href = "/";
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    setFavorites([]); 
  };

  const handleDeleteAccount = () => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") || "{}"
    );
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const updatedUsers = users.filter(
      (user: any) => user.email !== loggedInUser.email
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers)); 
    localStorage.removeItem("loggedInUser"); 
    setIsAuthenticated(false);
    alert("Account deleted successfully!");
  };

  const addToFavorites = (item: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!isAuthenticated) {
      setSnackbarMessage1("You need to sign in");
      setSnackbarOpen1(true);
      setTimeout(() => {
        window.location.href = "/sign_in";
      }, 800); 
  
      return;
    }
 
    if (!favorites.some((fav) => fav.id === item.id)) {
      const updatedFavorites = [...favorites, item];
      setFavorites(updatedFavorites);
      localStorage.setItem(
        `favorites_${user.username}`,
        JSON.stringify(updatedFavorites)
      );
      setSnackbarMessage(`${item.title || item.name} added to favorites!`);
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage(
        `${item.title || item.name} is already in your favorites!`
      );
      setSnackbarOpen(true);
    }
  };
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const removeFromFavorites = (id: number) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const updatedFavorites = favorites.filter((item) => item.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem(
      `favorites_${user.username}`,
      JSON.stringify(updatedFavorites)
    );
    setSnackbarMessage("Item removed from favorites!");
    setSnackbarOpen(true);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <HeaderTop
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          handleDeleteAccount ={handleDeleteAccount}
          username ={user.username}

        />
        <Routes>
          <Route path="/" element={<Index addToFavorites={addToFavorites} />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tvshows" element={<TVShows />} />
          <Route
            path="/movie/:id"
            element={<MovieDetails addToFavorites={addToFavorites} />}
          />
          <Route
            path="/tvshow/:id"
            element={<TVShowDetails addToFavorites={addToFavorites} />}
          />
          <Route
            path="/favorites"
            element={
              <Favorites
                favorites={favorites}
                removeFromFavorites={removeFromFavorites}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route path="/Sign_in" element={<Auth onLogin={handleLogin} />} />
        </Routes>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ fontSize: "20px", width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={snackbarOpen1}
          autoHideDuration={800}
          onClose={handleSnackbarClose1}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose1}
            severity="warning"
            sx={{ fontSize: "30px", width: "100%" }}
          >
            {snackbarMessage1}
          </Alert>
        </Snackbar>
      </BrowserRouter>
    </div>
  );
}
export default App;
