import { useState } from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <main className="main-container">
        <img src="/avatar-jessica.jpeg" alt="Profile PFP" className="img-pfp" />
        <h1>Jessica Randall</h1>
        <h2>London, United Kingdom</h2>
        <p>Front-end developer and avid reader.</p>
        <a href="#">GitHub</a>
        <a href="#">Frontend Mentor</a>
        <a href="#">LinkedIn</a>
        <a href="#">Twitter</a>
        <a href="#">Instagram</a>
      </main>
    </div>
  );
}

export default App;
