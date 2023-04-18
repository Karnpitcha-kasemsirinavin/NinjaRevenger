import './App.css';
import React from 'react';
// import { useRef } from 'react';  
import { Home } from './pages/Home/components.jsx';
import { MainGame } from'./pages/main-game/main-game-component.jsx';
import { JoinFriend } from './pages/JoinFriend/join-friend-components.jsx';
import Room from "./pages/JoinFriend/join-friend-components";
import { Routes, Route } from "react-router-dom";


const App = () => {
  // const windowSize = useRef([window.innerWidth, window.innerHeight])

  return (
  <div>
    {/* {<h2>Width: {windowSize.current[0]}</h2>}    */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/joinlink" element={<JoinFriend />} />
      <Route path="/room/:id" element={<MainGame />} />
    </Routes>
    {/* <MainGame/> */}
    {/* <JoinFriend/> */}
  </div>
  
  );
}

export default App;
