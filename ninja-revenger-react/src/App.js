import './App.css';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useRef } from 'react';  
import { BigScreen } from "./pages/Home/components.jsx";
import { MainGame } from'./pages/main-game/main-game-component.jsx'



function App() {
  const windowSize = useRef([window.innerWidth, window.innerHeight])

  return (
  <div>
    {/* {<h2>Width: {windowSize.current[0]}</h2>}    */}
    {/* <BigScreen/> */}
    <MainGame/>
  </div>
  );
}

export default App;
