import React from "react";
import CodeTrackr from "./components/code";
import RatingStatsTable from "./components/RatingStats";
import UserProblemStats from "./components/UserProblemStats";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div>
      <CodeTrackr />
      <UserProblemStats />
      <RatingStatsTable />
      <Navbar />
      <Footer />
    </div>
  );
};

export default App;
