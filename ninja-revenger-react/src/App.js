import './App.css';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useRef } from 'react';  
import { BigScreen } from "./home/big-screen/components.jsx";
import { Desktop } from "./home/desktop/components.jsx";


function App() {
  const windowSize = useRef([window.innerWidth, window.innerHeight])


  const isBigScreen = useMediaQuery({
    query: "(min-device-width: 1201px )",
  });

  return (
  <div>
    <BigScreen />
  </div>
  );
}

export default App;
