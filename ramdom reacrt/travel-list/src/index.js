// Import React library - needed to use React features
import React from "react";
// Import ReactDOM to render our React app to the browser
import ReactDOM from "react-dom/client";
// Import CSS styles for the application
import "./index.css";
// Import the main App component that contains all our application logic
import App from "./components/App";

// Get the root element from the HTML file (usually a div with id="root")
// This is where our React app will be displayed
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component inside React.StrictMode
// StrictMode helps identify potential problems in the application during development
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
