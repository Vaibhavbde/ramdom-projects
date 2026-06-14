
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { MatchProvider } from "./context/MatchContext";
import Layout from "./components/layout/Layout";
import DiscoverPage from "./pages/DiscoverPage";
import MusicDiscoveryPage from "./pages/MusicDiscoveryPage";
import MatchesPage from "./pages/MatchesPage";
import ProfilePage from "./pages/ProfilePage";
import MyProfile from "./pages/MyProfile";
import ChatPage from "./pages/ChatPage";
import DiscoveryPage from "./pages/DiscoveryPage";

function App() {
  return (
    <ThemeProvider>
      <MatchProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Default route redirects to discover */}
              <Route path="/" element={<Navigate to="/discover" replace />} />
              
              {/* Main app routes */}
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/music" element={<MusicDiscoveryPage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/my-profile" element={<MyProfile />} />
              
              {/* Legacy routes for backward compatibility */}
              <Route path="/discovery" element={<DiscoveryPage />} />
              
              {/* Dynamic routes */}
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/chat/:id" element={<ChatPage />} />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/discover" replace />} />
            </Routes>
          </Layout>
        </Router>
      </MatchProvider>
    </ThemeProvider>
  );
}

export default App;
