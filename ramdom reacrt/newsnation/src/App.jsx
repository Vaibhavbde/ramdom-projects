import { Routes, Route } from 'react-router-dom';
import NavBar from "./component/NavBar.jsx";
import News from "./component/News.jsx";
import LoadingBar from "react-top-loading-bar";
import React, { Component } from 'react';

export default class App extends Component {
  state = {
    progress: 0,
    apikey: import.meta.env.VITE_NEWS_API || "fallback_dummy_key"
  };

  setProgress = (progress) => {
    this.setState({ progress: progress });
  };

  render() {
    return (
      <div className="flex flex-col min-h-screen font-sora text-white">
        <Routes>
          {[
            { path: "/", category: "general" },
            { path: "/general", category: "general" },
            { path: "/business", category: "business" },
            { path: "/technology", category: "technology" },
            { path: "/entertainment", category: "entertainment" },
            { path: "/sports", category: "sports" },
            { path: "/science", category: "science" },
            { path: "/health", category: "health" },
          ].map(({ path, category }, index) => (
            <Route
              key={index}
              path={path}
              element={
                <>
                  <NavBar category={category} />
                  <LoadingBar
                    color="purple"
                    progress={this.state.progress}
                    height={3}
                  />
                  <main className="flex-grow">
                    <News
                      setProgress={this.setProgress}
                      category={category}
                      apikey={this.state.apikey}
                    />
                  </main>
                </>
              }
            />
          ))}
        </Routes>

        
      </div>
    );
  }
}
