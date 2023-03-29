import './App.css';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useRef } from 'react';  
import { BigScreen } from "./components/big-screen/components.jsx";


function App() {
  const windowSize = useRef([window.innerWidth, window.innerHeight])

  const isLaptop = useMediaQuery({
    query: "(min-device-width: 769px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1025px)",
  });

  const isBigScreen = useMediaQuery({
    query: "(min-device-width: 1201px )",
  });

  return (
  <div>
    {/* <h2>Width: {windowSize.current[0]}</h2> */}   

    {isBigScreen && <BigScreen />}

  </div>
  );
}

export default App;
