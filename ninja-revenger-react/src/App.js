import './App.css';
import React from 'react';
import { Home } from './pages/Home/components.jsx';
import { MainGame } from'./pages/main-game/main-game-component.jsx';
import { JoinFriend } from './pages/JoinFriend/join-friend-components.jsx';
import HandDetection from './pages/TestCamera/HandDetection';
import { Routes, Route } from "react-router-dom";
import LosePage from './pages/lose-page/index.jsx'
import WinPage from './pages/win-page'
import Loading  from './pages/loading';
import Room from "./pages/JoinFriend/join-friend-components";
import TestCamera from './pages/TestCamera/HandDetection';


const App = () => {
  // const windowSize = useRef([window.innerWidth, window.innerHeight])

  return (
  <div>
    {/* {<h2>Width: {windowSize.current[0]}</h2>}    */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/joinlink" element={<JoinFriend />} />
      <Route path="/room/:id" element={<MainGame />} />
      <Route path="/test-cam" element={<HandDetection />} />
      <Route path="/win" element={<WinPage />} />
      <Route path="/lost" element={<LosePage />} />
    </Routes>
    {/* <Loading/> */}
    {/* <LosePage/> */}
    {/* <WinPage/> */}
    {/* <JoinFriend/> */}
    {/* <HandDetection/> */}
  </div>
  
  );
}

export default App;
