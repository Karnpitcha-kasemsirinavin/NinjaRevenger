import { useEffect, useContext, useState } from 'react'
import ExitButton from '../../Components/Exit_Button'
import './style.css'
import '../../Components/Button/index.jsx'
import { SocketContext } from "../../Context/SocketThing";
import { useNavigate, useLocation } from "react-router-dom";

export const MainGame = () => {
  const { socket, room, player_1, player_2 } = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();

  console.log(room)

  useEffect(() => {
    let roomId = location.pathname.split("/")[2];
    let size = Object.keys(socket).length;

    if (size > 0) {
      socket.emit("room:join", { roomId }, (err, room) => {
        if (err) navigate("/");
      });
    }
  }, [socket]);

  return (
  <div className='container'>
    <div className='wrapper'>
      <img
          className='round'
          src={require("../../images/round-img.png")}
          alt='roundbg'
      />
      <img
          className='round-num'
          src={require("../../images/round7.png")}
          alt='round7'
      />
    </div>
    <div className='cam-left'>
      <ExitButton name="X"/>
      <div className='wrapper'>
        <img
          className='profile-left'
          src={require("../../images/user-profile-example.png")}
          alt="profile-left"
        />
        <p className='player-detail-left'>Natasha Romanoff</p>
        <img 
          className='stars-l'
          src={require("../../images/star0.png")}
          alt='star0'
        />
        <img
          className='combo-left'
          src={require("../..//images/combo3.png")}
          alt='combo3'
        />
      </div>
    </div>
    <div className='cam-right'>
      <div className='wrapper'>
        <p className='player-detail-right'>Natasha Romanoff</p>
        <img
          className='stars-r'
          src={require("../../images/star0.png")}
          alt='star0'
        />
        <img
          className='profile-right'
          src={require("../..//images/user-profile2-example.jpg")}
          alt="profile-right"
      />
        <img
          className='combo-right'
          src={require("../..//images/combo2.png")}
          alt='combo2'
        />
      </div>
    </div>
  </div>

    )
    }