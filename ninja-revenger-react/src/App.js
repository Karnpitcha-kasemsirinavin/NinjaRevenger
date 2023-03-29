import './App.css';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useRef } from 'react';  
import { BigScreen } from "./components/big-screen/components.jsx";


function App() {
  const windowSize = useRef([window.innerWidth, window.innerHeight])

  const isLaptop = useMediaQuery({
    query: "(min-device-width: 1024px)",
  });

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1200px)",
  });

  const isBigScreen = useMediaQuery({
    query: "(min-device-width: 1201px )",
  });

  return (
  <div>
    {/* <h2>Width: {windowSize.current[0]}</h2> */}
    
    <h1>React Responsive - a guide</h1>      

    {isBigScreen && <BigScreen />}

  </div>
  );
}

export default App;
