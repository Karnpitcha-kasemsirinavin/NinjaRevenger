import { useEffect, useContext, useState, useRef } from 'react'
import ExitButton from '../../Components/Exit_Button'
import '../main-game/style.css'
import '../../Components/Button/index.jsx'
import { SocketContext } from "../../Context/SocketThing";
import { useNavigate, useLocation } from "react-router-dom";
import CountdownTimer from '../../Components/Timer'
import PlayerOne from '../../Components/PlayerOne'
import { connect } from 'socket.io-client';


export const MainGame = () => {
  const { socket, room, player_1, player_2, peer, userId} = useContext(SocketContext);
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
  const [start, setStart] = useState(true); // Add start state
  const [displayTime, setDisplayTime] = useState(false);
  const [displayRound, setDisplayRound] = useState(false);
  const [renderVideo, setRenderVideo] = useState(true);
  

  // result
  const [result, setResult] = useState({
    show: false,
    reset: false,
    options: [],
  });

  // Option for each player
  const [play1Option, setPLay1Option] = useState(10); // each Option
  const [optionList, setOptionList] = useState([])
  const [selectOption, setSelectOption] = useState(false)
  // const [play2Option, setPLay2Option] = useState([]);
  const [resultArr, setResultarr] = useState({
    3: [],
    4: [],
    5: [],
  }); // for stacking

  const [caller, setCaller] = useState(room.players[player_1].caller)

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
    // console.log(connected, caller, stream);
    if (connected && caller && stream) {
      const call = peer.call(partnerId, stream);
      // console.log('calling', partnerId);
  
      call.on('stream', remote => {
        if (partnerVideo.current.srcObject !== remote && renderVideo) {
        partnerVideo.current.srcObject = remote;
        // console.log('user', stream, '\npartner', remote);
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
        // console.log('try to connect');
        // console.log(data);
        socket.emit('answer', { from: player_1, to: data.from, id: userId })
        var conn = peer.connect(data.id);
        setPartnerId(data.id);
      });

      socket.on('answer', data => {
        setPartnerId(data.id)
      })
  
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
        console.log('friend bye');
        navigate(`/`);
      });

      socket.on('caller', data => {
        // console.log('turn caller on');
        setCaller(true)
        socket.emit('id', { from: player_1, to: player_2, id: userId })
        // console.log(partnerId);
        // if (connected && room.players[player_1].caller && stream) {
        //   const call = peer.call(partnerId, stream);
        //   console.log('calling', partnerId);
      
        //   call.on('stream', remote => {
        //     partnerVideo.current.srcObject = remote;
        //     console.log('user', stream, '\npartner', remote);
        //   });
        // }
      })
    }

  }, [socket, navigate, peer, renderVideo]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const numberArray = [14, 5, 18, 11, 10];

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

      // generating test *********************

      if (displayTime && !selectOption && currentIndex !== numberArray - 1) {

      setTimeout(() => {
        setPLay1Option(numberArray[currentIndex]);
        setCurrentIndex(currentIndex + 1);
        setSelectOption(true);
      }, currentIndex * 1000); // 1 sec after start round

    }
  }

    if (start && currentIndex === 0) {
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


  }, [start, selectOption, displayTime]);


  useEffect(() => {
    
    if (result.options.length === 1) {
      console.log('updated', result.options)
    }

    if (play1Option !== null && play1Option !== undefined && selectOption && displayTime) {

      // setResult({
      //   show: false,
      //   reset: false,
      //   options: [... result.options, play1Option],
      // })

      // console.log(room.players[player_1].option)

      calculateResults();
      setSelectOption(false)
    }

    console.log('from play1 ', room.players[player_1].option)



  }, [play1Option, displayTime, selectOption])



const handleRoundEnd = () => {
  setCurrentRound(currentRound + 1);
  setDisplayTime(false);
  setStart(false);

}


   
  console.log('arr3', resultArr[3])
  console.log('arr4', resultArr[4])
  console.log('arr5', resultArr[5])
  console.log('Option', play1Option)

  const Combo = {
    3: ['18-7-17','15-18-13','9-13-3','11-16-8'],
    4: ['14-7-12-0','5-18-11-10','2-17-1-16','19-13-8-3'],
    5: ['16-0-17-6-7','4-14-15-12-13'],
  }

  // check if any arr is full
  if (resultArr[3].length === 3) {
    // for (i = 0; i < Combo[3])
  }

  for (let i = 3; i <= 5; i++) {
    if (resultArr[i].length === i) {
        let check_string = resultArr[i].join('-');

        console.log('check string: ', check_string)
      for (let j = 0; j < Combo[i].length; j++) {
        if (check_string === Combo[i][j]){
          console.log('check get combo', check_string);
          optionList.push([i,j].join('-'))

        }
      }
    }
  }


  console.log('list: ', optionList);

  setResult({
    show: true,
    reset: false,
    options: optionList,
  })

  console.log('result options:', result.options);

  players[player_1].option = result.options;

  // players[player_1].option = result.options;
  // console.log(result.options);
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
  <div className='maingame-container'>
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
        {/* <img
          className='combo-left'
          src={require("../..//images/combo3.png")}
          alt='combo3'
        /> */}
        <PlayerOne result={result} />
      </div>
      {UserVideo}
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
        <div>

        </div>
      </div>
      {PartnerVideo}
    </div>
  </div>
    )
}