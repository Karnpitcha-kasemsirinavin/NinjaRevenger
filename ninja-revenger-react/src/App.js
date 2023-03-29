import './App.css';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useRef } from 'react';  
import { BigScreen } from "./home/big-screen/components.jsx";



function App() {
  const windowSize = useRef([window.innerWidth, window.innerHeight])

  return (
  <div>
    {/* {<h2>Width: {windowSize.current[0]}</h2>}    */}
      <BigScreen/>
  </div>
  );
}

export default App;
