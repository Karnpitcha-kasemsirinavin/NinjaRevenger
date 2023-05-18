import { useEffect, useContext, useState, useRef } from 'react'
import ExitButton from '../../Components/Exit_Button'
import './style.css'
import '../../Components/Button/index.jsx'
import { SocketContext } from "../../Context/SocketThing";
import { useNavigate, useLocation } from "react-router-dom";
import CountdownTimer from '../../Components/Timer'


export const MainGame = () => {
  const { socket, room, player_1, player_2, peer } = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [partnerId, setPartnerId] = useState('')
  const [stream, setStream] = useState()
  const [connected, setConnected] = useState(false)

  const userVideo = useRef()
  const partnerVideo = useRef()
  
  // time
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const [currentRound, setCurrentRound] = useState(1);
  const [start, setStart] = useState(false); // Add start state
  const [displayTIme, setDisplayTime] = useState(false);
  const [displayRound, setDisplayRound] = useState(false);

  useEffect(() => {
    let roomId = location.pathname.split("/")[2];
    let size = Object.keys(socket).length;
  
    // if stranger then join room
    if (size > 0 && room.type === 'stranger') {
      socket.emit("room:join", { roomId }, (err, room) => {
        if (err) navigate("/");
      });
    }
  }, [socket, room, location.pathname, navigate]);

  useEffect(() => {
    if (connected && room.players[player_1].caller && stream) {
      const call = peer.call(partnerId, stream);
      console.log('calling');
  
      call.on('stream', remote => {
        partnerVideo.current.srcObject = remote;
        console.log('user', stream, '\npartner', remote);
      });
    }
  }, [connected, room.players, player_1, stream, partnerId, peer]);

  useEffect(() => {
    if (socket.id === undefined) {
      navigate(`/`);
    } else {
      var getUserMedia = navigator.getUserMedia;
      getUserMedia({ video: true }, stream => {
        userVideo.current.srcObject = stream;
        setStream(stream);
      });
  
      socket.on('id', data => {
        var conn = peer.connect(data.id);
        setPartnerId(data.id);
      });
  
      peer.on('connection', (err) => {
        console.log('connected');
        setConnected(true);
        setStart(true);
      });
  
      peer.on('disconnect', () => {
        console.log('disconnect bye see u');
      });
  
      peer.on('call', call => {
        getUserMedia({ video: true }, stream => {
          call.answer(stream);
          console.log('answering');
        });
  
        call.on('stream', remote => {
          partnerVideo.current.srcObject = remote;
        });
      });
  
      socket.on("friend_disconn", () => {
        console.log('pass na ja');
        navigate(`/`);
      });
    }
  }, [socket, navigate, peer]);

  // for start
  useEffect(() => {
    const round_img = document.getElementById("round");
    const round_num = document.getElementById("round-num");

    if (connected) {
      setTimeout(() => {
        console.log('show start img');
      }, 2000); // make it visible after 2 seconds

    }

    if (start) {
       // show each round
    setTimeout(() => {
      round_img.style.visibility = 'visible';
      round_num.style.visibility = 'visible';
      setDisplayTime(true);
    }, 2000 + 3000); // make it visible after 5 secs
    }

  }, [start]);
  


const handleRoundEnd = () => {
  setCurrentRound(currentRound + 1);
  setDisplayTime(false);
  setStart(false);

}


  // make streams into video element
  let UserVideo;
    UserVideo = (
    <video ref={userVideo} autoPlay/>
  );

  let PartnerVideo;
  PartnerVideo = (
    <video ref={partnerVideo} autoPlay/>
  );

  return (
    
  <div className='container'>
    <div className='wrapper'>
    <img
          className='round'
          src={require("../../images/round-img.png")}
          alt='round-img'
          id='round'
      />
      <img
          className='round-num'
          src={require("../../images/round7.png")}
          alt='round-num'
          id='round-num'
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
    {UserVideo}
    {displayTIme && <CountdownTimer id='Timer' initialSec={10} TimerEnd={handleRoundEnd} />}
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
    {PartnerVideo}
  </div>

    )
    }