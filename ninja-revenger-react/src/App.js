import './App.css';
import React from 'react';
// import { useRef } from 'react';  
import { MainGame } from'./pages/main-game/main-game-component.jsx'
import { Home } from './pages/Home/components.jsx';



function App() {
  // const windowSize = useRef([window.innerWidth, window.innerHeight])

  return (
  <div>
    {/* {<h2>Width: {windowSize.current[0]}</h2>}    */}
    {/* <Home/> */}
    <MainGame/>
  </div>
  );
}

export default App;
