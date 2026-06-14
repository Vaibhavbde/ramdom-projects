import CommanToAll from '../context/CommanToAllContext'
import Navbar from './Navbar'
import React from 'react';
import { useContext } from 'react';
function HomePage() {
  const context = useContext(CommanToAll);

  return (
      <iframe
        src="WebGL-Solar-System/index1.html"
        title="WebGL Model"
        style={{ width: '100%', height: 'calc(100vh - 50px)', border: 'none', top: '60px' }}
      ></iframe>
  );
}

export default HomePage;
