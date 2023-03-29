import './App.css';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useRef } from 'react';  

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

    <div className='Ninja-Revengers'>
        <div className='menu container'>
            <div className='bg-1'>
              <img className='lightning-big' src={require("./pic/light_big.png")} alt="lighning-b" />
              <img className='lightning-small center'src={require('./pic/light_small.png')} alt="lightning" />
              <img className='ninja-menu' src={require("./pic/ninja-1.png")} alt="ninja1" />
              <img className='smoke-grd' src={require("./pic/smoke_ground.png")} alt="smoke-grd" />
              <img className='game-title' src={require("./pic/ninja-title.png")} alt="title" />
              <button class="start-bt1">start</button>
              <button class="exit-bt1">start</button>
            </div>
        </div>
    </div>
  </div>
  );
}

export default App;
