import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CommanToAllState from './context/CommanToAllState';
import HomePage from './components/HomePage';
import SpaceInformation from './components/SpaceInformation';
import Navbar from './components/Navbar';
import Chat from './components/Chat';
import Events from './components/Events';

function App() {
  return (
    <CommanToAllState>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/information" element={<SpaceInformation />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </Router>
    </CommanToAllState>
  );
}

export default App;