import { useEffect, useContext, useState, useRef } from 'react'
import ExitButton from '../../Components/Exit_Button'
import './style.css'
import '../../Components/Button/index.jsx'
import { SocketContext } from "../../Context/SocketThing";
import { useNavigate, useLocation } from "react-router-dom";
import CountdownTimer from '../../Components/Timer'
import PlayerOne from '../../Components/PlayerOne'
import { connect } from 'socket.io-client';


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
  const [displayTime, setDisplayTime] = useState(false);
  const [displayRound, setDisplayRound] = useState(false);
  const [renderVideo, setRenderVideo] = useState(true);
  

  // result
  const [result, setResult] = useState({
    show: false,
    reset: false,
  });

  // Option for each player
  const [play1Option, setPLay1Option] = useState(10);
  // const [play2Option, setPLay2Option] = useState([]);
  const [resultArr, setResultarr] = useState({
    3: [0],
    4: [],
    5: [],
  }); // for stacking
  const Combo = {
    3: [],
    4: [],
    5: [],
  }


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
        if (partnerVideo.current.srcObject !== remote && renderVideo) {
        partnerVideo.current.srcObject = remote;
        console.log('user', stream, '\npartner', remote);
        setRenderVideo(false);
        }
      });
    }

  }, [connected, room.players, player_1, stream, partnerId, peer, renderVideo]);
  
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
        // console.log('connected');
        setConnected(true);
        setStart(true);
      });
  
      peer.on('disconnect', () => {
        console.log('disconnect bye see u');
      });
      
      // problem make video jerky
      peer.on('call', call => {
        getUserMedia({ video: true }, stream => {
          call.answer(stream);
          // console.log('answering');
        });
  
        call.on('stream', remote => {
          // console.log('render', renderVideo);
          if (partnerVideo.current.srcObject !== remote && renderVideo) {
          partnerVideo.current.srcObject = remote;
          setRenderVideo(false);
          }
        });
      });
  
      socket.on("friend_disconn", () => {
        console.log('pass na ja');
        navigate(`/`);
      });
    }

  }, [socket, navigate, peer, renderVideo]);

  // for start
  useEffect(() => {
    const round_img = document.getElementById("round");
    const round_num = document.getElementById("round-num");

    // for each round
    const newRound = () => {

      setTimeout(() => {
        round_img.style.visibility = 'visible';
        round_num.style.visibility = 'visible';
        setDisplayTime(true);
      }, 2000 + 3000); // make it visible after 5 secs

      setTimeout(() => {
       setPLay1Option(14) 
      }, 2000 + 1000); // 0.5 sec after start round
    }

    if (start) {
      setTimeout(() => {
        console.log('show start img');
      }, 2000); // make it visible after 2 seconds
    }

    if (start) {
       // show each round
      newRound()
    } else {
      // when each roud end
      round_img.style.visibility = 'hidden';
      round_num.style.visibility = 'hidden';
    }


  }, [start]);

  useEffect(() => {
    const players = room?.players;

    if (play1Option !== null && displayTime) {
      room.players[player_1].option = play1Option;

      console.log(Object.values(room.players[player_1].option));

      calculateResults();
    }

  }, [play1Option, displayTime])
  


const handleRoundEnd = () => {
  setCurrentRound(currentRound + 1);
  setDisplayTime(false);
  setStart(false);

  // send info to the server

};


//================ game logic =======================
const calculateResults = async () => {
  const players = room?.players;
  let foundArr = false;
  
  // if (
  //   players &&
  //   players[player_1]?.optionLock === true &&
  //   players[player_2]?.optionLock === true
  // ) {
  // }

  // check if arr empty 
  // if empty check first patternn index 
  // if not empty add to arr



  // if (resultArr[5].length !== 0) {
  //   resultArr[5] = [...resultArr[5], play1Option]
  //   console.log('have 5')
  // } else if (!foundArr && (play1Option === 16 || play1Option === 14)) {
  //   console.log('get 5')
  //             foundArr = true;
  //             resultArr[5] = [...resultArr[5], play1Option]
  //           }

  // if (resultArr[4].length !== 0) {
  //   resultArr[4] = [...resultArr[4], play1Option]
  //   console.log('have 4')
  // } else if (!foundArr && (play1Option === 45 || 
  //   play1Option === 5 || play1Option === 2 || play1Option === 19)) {
  //     foundArr = true;
  //     resultArr[4] = [...resultArr[4], play1Option]
  //   }

  // if(resultArr[3].length !== 0){
  //   resultArr[3] = [...resultArr[3], play1Option]
  //   console.log('have 3');
  // } else {
  //   if (!foundArr && (play1Option === 18 || 
  //     play1Option === 15 || play1Option === 9 || play1Option === 11)) {
  //       foundArr = true;
  //       resultArr[3] = [...resultArr[3], play1Option]
  //     }
  // }

  for (let i = 3; i <= 5; i++) {
    console.log('test ', resultArr[i]);

    if (resultArr[i].length !== 0){
      resultArr[i] = [...resultArr[i], play1Option]
    } else if (!foundArr) {
      for (let i = 0; i <= 5; i++) {
        
      }

    }

  }

  const first_arr = [[1,2], []]


  console.log('arr3', resultArr[3])
  console.log('arr5', resultArr[5])
  console.log('start check')
  console.log('Option', play1Option)

  // check if any arr is full
  if (resultArr[3].length === 3) {

  }

  socket.emit("room:update", room);


};

//================ game logic =======================


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
      <div className='left-player-con'>
        <img
          className='profile-left'
          src={require("../../images/user-profile-example.png")}
          alt="profile-left"
        />
        <div>
        <p className='player-detail-left'>Natasha Romanoff</p>
        <img 
          className='stars-l'
          src={require("../../images/star0.png")}
          alt='star0'
        />
        </div>
        {/* combo */}
        <img
          className='combo-left'
          src={require("../..//images/combo3.png")}
          alt='combo3'
        />
      </div>
      {UserVideo}
      <div className='wrapper'>
      <ExitButton name="X"/>
      </div>
    </div>
    {displayTime && <CountdownTimer id='Timer' initialSec={10} TimerEnd={handleRoundEnd} />}
    <div className='cam-right'>
      <div className='right-player-con'>
        <div>
        <p className='player-detail-right'>Natasha Romanoff</p>
        <img
          className='stars-r'
          src={require("../../images/star0.png")}
          alt='star0'
        />
        </div>
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
    {PartnerVideo}
    </div>
  </div>
    )
}