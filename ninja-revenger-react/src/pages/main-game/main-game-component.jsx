import { useEffect, useContext, useState, useRef } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import ExitButton from '../../Components/Exit_Button'
import '../main-game/style.css'
import '../../Components/Button/index.jsx'
import { SocketContext } from "../../Context/SocketThing";
import MediapipeCam from '../../Components/MediapipeCam';
import { SocketContextGesture } from '../../Context/SocketHand';
import CountdownTimer from '../../Components/Timer';
import PlayerOne from '../../Components/PlayerOne';
import PlayerTwo from '../../Components/PlayerTwo';
import art1 from '../../images/art1.png';
import art2 from '../../images/art2.png';
import art3 from '../../images/art3.png';
import art4 from '../../images/art4.png';
import art5 from '../../images/art5.png';
import art6 from '../../images/art6.png';
import art7 from '../../images/art7.png';
import art8 from '../../images/art8.png';
import  BlackScreenAnimation from '../loading'
import { connect } from 'socket.io-client';


export const MainGame = () => {
  const { socket, room, player_1, player_2, peer, userId} = useContext(SocketContext);
  const { handData, socket_gest } = useContext(SocketContextGesture);

  const navigate = useNavigate();
  const location = useLocation();
  
  // connection
  const [partnerId, setPartnerId] = useState('')
  const [stream, setStream] = useState()
  const [connected, setConnected] = useState(false)
  const [countConnect, setCountConnect] = useState(0)


  const userVideo = useRef(null)
  const partnerVideo = useRef(null)
  const [renderVideo, setRenderVideo] = useState(true)
  
  const [caller, setCaller] = useState(room.players[player_1].caller)

  // animation 
  const [callLoading, setCallLoading] = useState(false)


 // Game var =======================================================

    // time
    const [currentRound, setCurrentRound] = useState(0);
    const [start, setStart] = useState(false); // Add start
    const [displayTime, setDisplayTime] = useState(false);

  const captureImage = () => {
    const video = userVideo.current
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const data = canvas.toDataURL("image/webp");
    // console.log(data);
    // photo.setAttribute("src", data);
  }
  
    // result
    const [result, setResult] = useState({
      shown: true,
      options: [],
    });
  
    const [partnerResult, setPartnerResult] = useState({
      shown: true,
      options: [],
      length: 0
    });
  
    // Option for each player
    const [play1Option, setPLay1Option] = useState(null); // each Option
    const [optionList, setOptionList] = useState([]) // list for option
    const [selectOption, setSelectOption] = useState(false)
    // const [play2Option, setPLay2Option] = useState([]);
    const [resultArr, setResultArr] = useState({
      3: [],
      4: [],
      5: [],
    });
  
    const [finishResult, setFinishResult] = useState(false);
    const [partnerReady, setPartnerReady] = useState(false);

     // Game var =======================================================

  const [checkJoin, setCheckJoin] = useState(false)
  

  useEffect(() => {
    let roomId = location.pathname.split("/")[2];
    let size = Object.keys(socket).length;
  
    // if stranger then join room
    if (size > 0 && room.type === 'stranger' && !checkJoin) {
      socket.emit("room:join", { roomId }, (err, room) => {
        if (err) navigate("/");
      });
      setCheckJoin(true)
    }
    

  }, [socket, room, location.pathname, navigate]);

  useEffect(() => {
    // console.log(connected, caller, stream);
    if (connected && caller && stream && countConnect === 0) {
      const call = peer.call(partnerId, stream);
      // console.log('calling', partnerId);
      setCountConnect(1);
  
      call.on('stream', remote => {
        if (partnerVideo.current.srcObject !== remote && renderVideo) {
        partnerVideo.current.srcObject = remote;
        // console.log('user', stream, '\npartner', remote);
        socket.emit('ready', {from: player_1, to: player_2})
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
        userVideo.current = stream;
        setStream(stream);
        // setTimeout(() => {
        //   captureImage()
        // }, 2000);
      });
    
    
      socket.on('id', data => {
        // console.log('try to connect');
        // console.log(data);
        socket.emit('answer', { from: player_1, to: data.from, id: userId })
        var conn = peer.connect(data.id);
        setPartnerId(data.id);
        // console.log('partnerid ', partnerId)
      });

      socket.on('exited', data => {
        peer.disconnect()
        peer.destroy()
        navigate(`/`)
      })

      socket.on('answer', data => {
        setPartnerId(data.id)
      })
  
      peer.on('connection', (err) => {
        // console.log('connected');
        setConnected(true);
        // if (currentRound === 0){
        // setCurrentRound(currentRound + 1)
        // }

        // console.log('current round from connection: ', currentRound)
        socket.emit('ready', {from: player_1, to: player_2})
        
      });

      //console.log('current round from outside connection: ', currentRound)
  
      peer.on('disconnect', () => {
        //console.log('disconnect bye see u');
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
          socket.emit('ready', {from: player_1, to: player_2})
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
        if (countConnect === 0){
          
          socket.emit('id', { from: player_1, to: player_2, id: userId })
        }
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

      socket.on("friend_update", (data) => {

        //console.log('get friend data', data)
        setPartnerResult({
          shown: true,
          options: data.result,
          length: data.length,
          score: data.score,
        })
        // setStartCalculate(true);
      })

    }

  }, [socket, navigate, peer, partnerId]);

	// Generate name =====================================================================================================
	const firstnames = ['Tor', 'Foam', 'Mark', 'June', 'Nata', 'Mill'];
  const surnames = ['1nwza', 'SudLhor', 'SudSuay', 'Romanoff', 'React', 'HTML'];
	const [randomName1, setRandomName1] = useState('');
  const [randomName2, setRandomName2] = useState('');

  useEffect(() => {
    generateRandomName();
    selectRandomImage();
    socket.emit("room:update", room);
  }, [player_1])

	const generateRandomName = () => {
		const randomIndexFirst1 = Math.floor(Math.random() * firstnames.length);
    const randomIndexLast1 = Math.floor(Math.random() * surnames.length);

		const name1 = firstnames[randomIndexFirst1] + " " +  surnames[randomIndexLast1];

    room.players[player_1].name = name1;	
    
		;
	};

  // Random Profile
  const images = [art1, art2, art3, art4, art5, art6, art7, art8];
  // const [randomImage1, setRandomImage1] = useState('');


  const selectRandomImage = () => {
    const randomIndexImage1 = Math.floor(Math.random() * images.length);
    
    room.players[player_1].image = randomIndexImage1;	
    // const image1 = images[randomIndexImage1]
    // const image2 = images[randomIndexImage1]
    
  }


  // Game secton ========================================================================================================

  // const [playerStar, setPlayerStar] = useState(0);
  // const [partnerStar, setPartnerStar] = useState(0);
  // const [playerWin, setPlayerWin] = useState(0);
  let partnerStar = 0;
  let playerStar = 0;
  let playerWin = 0;
  // const [partnerWin, setPartnerWin] = useState(0);

  useEffect(() => {
    if (connected) {

      if (playerStar === 3 || partnerStar === 3){
        let roomId = location.pathname.split("/")[2];
        socket.emit('room:delete', { roomId })
        if (playerStar === 3) {
          navigate(`/win`);
        } else {
          navigate(`/lost`);
        }
      }
  }
}, [navigate, playerStar, partnerStar, connected]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const numberArray1 = room.players[player_1].caller?
          // [2,17,1,16,15,18,13]:[11,16,8,14,7,12,0]
      // [0,0]: []
      // [15, 18, 13, 2, 17, 1, 16, 9, 13, 3]: [4, 14, 15, 12, 13, 18, 7, 17, 5, 18, 11, 10]
      [15, 18, 13, 5, 18, 11, 10, 9, 13, 3, 0]: [16, 0, 17, 6, 7, 9, 13, 3, 15, 18, 13]

  const numberArray2 = room.players[player_1].caller?
  [2,17,1,16,15,18,13]:[11,16,8,14,7,12,0]

  const [preHandData, setPreHandData] = useState(null)



  // show start image
  useEffect(() => {
    const round_img = document.getElementById("round");
    const round_num = document.getElementById("round-num");
    const start_img = document.getElementById("start_img");
    
    if (connected && currentRound === 1) {
      setTimeout(() => {
        start_img.style.visibility = 'visible';
      }, 2000); // make it visible after 2 seconds
        
      setTimeout(() => {
        start_img.style.visibility = 'hidden';
        round_img.style.visibility = 'visible';
        round_num.style.visibility = 'visible';
      }, 2000 + 3000); // make it visible after 5 secs
      
    }
  }, [connected, currentRound])
  
  const [getOption, setGetOption] = useState(true)
  const [countRound, setCountRound] = useState(false)
  // for start
  useEffect(() => {
    // for each round
    const newRound = () => {
    // generating test ********************
      if (currentRound === 1) {
      setTimeout(() => {
        setDisplayTime(true);
      }, 2000 + 3000); // make it visible after 5 secs
    } else {
      console.log('initialize display time')
      setTimeout(() => {
        setDisplayTime(true);
      }, 2000); // make it visible after 5 secs
    }

    // console.log('get current index for arr: ', currentIndex)
    // if (displayTime && !selectOption && (currentIndex < (numberArray1.length - 1))) {
    // setTimeout(() => {
    //   // console.log('generate number')

    //   setPLay1Option(numberArray1[currentIndex]);
    //   setCurrentIndex(currentIndex + 1);
    //   setSelectOption(true);
    // }, currentIndex * 500); // 1 sec after start round

    //console.log('pregesture: ', play1Option)
   //console.log('current gesture: ', preHandData)

    // socket.emit("room:update", room)

    if (displayTime && !selectOption && preHandData !== handData){

      console.log("check optionList: ", optionList, "check friendList: ", room.players[player_2].option )
      
      setPLay1Option(handData)
      setSelectOption(true)
      setPreHandData(handData)
      // socket.emit("friend_result", {from: player_1, to: player_2, result: result.options, length: (result.options).length})
      // socket.emit("room:update", room)

      // // console.log('gesture from model: ', play1Option)
  } 

  }

  // start game
    //// console.log('start status:', start)

    if (start && partnerReady && finishResult) {

      // // console.log('partner ready?', partnerReady, ' round: ', currentRound)

      newRound()
      
    } else if (currentRound === 1){

      if (start && partnerReady) {
      // // console.log('partner ready?', partnerReady, ' round: ', currentRound)

      newRound()

      }
    }
    

  }, [selectOption, partnerReady, start, handData, finishResult]);

// const [preHandData, setPreHandData] = useState(null)

  useEffect(() => {

    // console.log('result ', result.options)

    if (selectOption && displayTime) {
      if (play1Option !== null && play1Option !== undefined && play1Option !== -1 ){
        // console.log('gesture from model: ', play1Option)
      calculateCombo();
      socket.emit("friend_result", {from: player_1, 
        to: player_2, 
        result: result.options, 
        length: (result.options).length,
        score: playerWin
      })
      socket.emit("room:update", room);
      // setPreHandData(play1Option).
      }
      setSelectOption(false);
      // update when player have new option
      
    }

    if (connected){
      // setPartnerStar((room.players[player_2].score));
      playerStar = playerWin;
      if (partnerResult.score !== undefined){
      partnerStar = partnerResult.score;
      }
    
   
  }


  }, [play1Option, displayTime, selectOption, start, connected, playerStar, partnerStar, player_2, result])

   // check ready status for next round 

   const [plusRound, setPlusRound] = useState(true)

    useEffect(() => {
    
    socket.on('partnerReady', () => {
      setPartnerReady(true);
      //console.log('partnerReady')

      // if (currentRound === 1) {
      //   setFinishResult(true)
      // }
      
    });

    socket.on('startTime', () => {
      // setCallLoading(false);
      setStart(true);

      if (plusRound){
        setCurrentRound(currentRound + 1)
        setPlusRound(false)

        setPartnerResult({
          shown: true,
          options: [],
          length: 0,
        })
  
        setResult({
          shown: false,
          options: [],
        });
  
        setOptionList([]);
  
        room.players[player_1].option = []; 
        // socket.emit("room:update");
      }
      //console.log('start time , round: ', currentRound)

      
      
    });

    socket.on("friend_update", (data) => {
      console.log(data);
      setPartnerResult({
        shown: true,
        options: data.result,
        length: data.length,
        score: data.score,
      })
      // console.log("check if updated================", partnerResult.options)
    });


   
  }, [start,finishResult, partnerReady, room, currentRound, player_1, player_2, currentRound]);


  useEffect(() => {
    if (start && !displayTime && !partnerReady && !finishResult) {
     // // console.log('Starting a new round');
      
      // setPartnerStar(partnerWin.toString())

      // setStart(false)
      setCurrentIndex(0) // generate test
      setSelectOption(false);
      setOptionList([]);
      // room.players[player_1].option = [];
      // socket.emit("room:update", room);
    }

    if (connected) {

      room.players[player_1].option = result.options;

    }

  }, [start, displayTime, playerStar, connected, finishResult, partnerReady, player_1, player_2, play1Option]);

  // finishResult', 'partnerReady', 'player_1', 'player_2', 'room', and 'socket'

  // time over for each round

const [startCalculate, setStartCalculate] = useState(false)

const handleRoundEnd = async () => {
  // // console.log('Round End');
  setFinishResult(false)
  setPreHandData(null)
  setDisplayTime(false);


  socket.emit("friend_result", { 
    to: player_2, 
    result: result.options, 
    length: (result.options).length,
    score: playerWin
  })


  console.log('countcalculate', countCalculate)
  if (!finishResult && (countCalculate === currentRound)){
   // console.log('pass calculate result')
   calculateResult();
   setCountCalculate(countCalculate + 1)

   setPartnerReady(false)
   setFinishResult(true);
   setPlusRound(true);
   setStart(false);
  //  setStartCalculate(false);
  
   if (finishResult) {
    socket.emit('ready', {from: player_1, to: player_2})
    await wait(5000);

   }

   console.log('finish round')
   }


};

const [countCalculate, setCountCalculate] = useState(1)



//================ game logic ======================= (start)
// calculate gesture and combo for each player
const calculateCombo = async () => {
  let added_arr = {s:false ,4:false ,5:false}
  const players = room?.players;

  optionList.push(play1Option.toString());

  //console.log('i try calculate combo')

  for (let i = 3; i <= 5; i++) {

    if (resultArr[i].length !== 0){
      resultArr[i] = [...resultArr[i], play1Option]
      added_arr[i] = true;
    }}
    
    // add arr5
    if (!added_arr[5] && (play1Option === 16 || play1Option === 4)) {
        // // console.log('get 5')
          resultArr[5] = [...resultArr[5], play1Option]
      // add arr4
    } else if (!added_arr[4]  && (play1Option === 14 || 
        play1Option === 5 || play1Option === 2 || play1Option === 19)) {
          resultArr[4] = [...resultArr[4], play1Option]

          // add arr3
      } else if (!added_arr[3]  && (play1Option === 18 || 
            play1Option === 15 || play1Option === 9 || play1Option === 11)) {
              resultArr[3] = [...resultArr[3], play1Option]
      }
  
  // // console.log('arr3', resultArr[3])
  // // console.log('arr4', resultArr[4])
  // // console.log('arr5', resultArr[5])
  // // console.log('Option', play1Option)

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

        // // console.log('check string: ', check_string)
      for (let j = 0; j < Combo[i].length; j++) {
        if (check_string === Combo[i][j]){
          // // console.log('check get combo', check_string);

          // change to combo
          let position = (i-1 + (2*i-1)*(-1))
          // // console.log('position ', position)
          optionList.splice(position);
          optionList.push([i,j].join('-'));

          resultArr[3].length = 0
          resultArr[4].length = 0
          resultArr[5].length = 0
          break

        }
      }
    }
  }
  // console.log('list: ', optionList);
  setResult({
    shown: true,
    options: optionList,
  })
  // console.log('result options:', result.options);
  room.players[player_1].option = result.options;
};

// calculate the result between 2 players

const wait = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

const calculateResult = () => {
  const comboList = {
    '3-0': '3A-1',
    '3-1': '3P',
    '3-2': '3C',
    '3-3': '3A-2',
    '4-0': '4P',
    '4-1': '4C',
    '4-2': '4A-1',
    '4-3': '4A-2',
    '5-0': '5A',
    '5-1': '5P'
  };

  let playerList = [];
  let partnerList = [];
  let playerScore = 0;
  let partnerScore = 0;

  const maxLength = Math.max((partnerResult.options).length, (result.options).length);

  //console.log('before calculate result')
  //// console.log('Last result:\nPlayer:', result.options, '\nPartner:', partnerResult.options);

 // change into combo type

  for (let i = 0; i < maxLength; i++) {
    if (i < (result.options).length) {

      if ((result.options[i]).length > 2){
      playerList.push(comboList[(result.options[i])])
      } else {
        playerScore += 50;
      }
    }
    if (i < (partnerResult.options).length) {

      if ((partnerResult.options[i]).length > 2){
        partnerList.push(comboList[(partnerResult.options[i])])
        } else {
          partnerScore += 50;
        }
    }
  }

  // const removeCombo = (combo, list) => {
  //   list.splice(list.findIndex((str) => str === combo), 1);
  // };

  
  // console.log('Player result:', playerList);
  // console.log('Partner result:', partnerList);

  const processCombos = (list1, list2) => {
    const deleteCombo = [];
    
    list1.forEach((combo) => {

      if (combo[1] === 'P') {
        // prevention
        const counterString = combo[0] + 'C';
        const index = list2.findIndex((str) => str.startsWith(combo[0]) 
                                                && !str.startsWith(counterString));
        if (index >= 0) {
          list2.splice(index, 1);
          deleteCombo.push(combo);
        }
      } else if (combo[1] === 'C') {
        //counter attack

        const loopNum = 5 - parseInt(combo[0]) + 1;
        for (let j = 1; j < loopNum; j++) {

          const attackCombo = (parseInt(combo[0]) + j).toString() + 'A';
          const index = list2.findIndex((str) => str.startsWith(attackCombo));

          if (index >= 0) {
            list2.splice(index, 1);
            deleteCombo.push(combo);
            break;
          }
        }
      }
    });

    for (let i = 0; i < deleteCombo.length; i++){
        list1 = list1.filter(combo => combo !== deleteCombo[i])
      }

      return [list1, list2]

  };

  const comboScore =  (list1, added_score) => {

    let count = list1.filter(item => item.startsWith("3")).length;
    added_score += count * 50;
    count = list1.filter(item => item.startsWith("4")).length;
    added_score += count * 75;
    count = list1.filter(item => item.startsWith("5")).length;
    added_score += count * 100;

    return added_score

  }
    
  [playerList, partnerList] = processCombos(playerList, partnerList);
  [partnerList, playerList] = processCombos(partnerList, playerList);

  // process the left combo score
  if (playerList.length !== 0) {
    playerScore = comboScore(playerList, playerScore);
  }

  if (partnerList.length !== 0) {
    partnerScore = comboScore(partnerList, partnerScore);
  }

  // calculate winner
  if (partnerScore > playerScore) {
    // setPartnerWin(partnerWin + 1)

    // room.players[player_2].score += 1;

  } else if (partnerScore === playerScore) {
    playerWin += 1
    // setPartnerWin(partnerWin + 1)

    room.players[player_1].score = playerWin;

  } else {
    playerWin += 1
    room.players[player_1].score = playerWin;

  }

  // socket.emit('room:update', room);

  console.log('after calculate result')
  console.log('Player result:', playerList, "score: ", playerWin);
  console.log('Partner result:', partnerList, "score: ", partnerResult.score);

  playerStar = playerWin;
  partnerStar = partnerResult.score

  playerScore = 0;
  partnerScore = 0;

  // console.log('check round in calfunction:', currentRound)


}

//================ game logic ======================= (end)

  // make streams into video element
  let UserVideo;
    UserVideo = (
    <video ref={userVideo} autoPlay/>
  );

  let PartnerVideo;
  PartnerVideo = (
    <video ref={partnerVideo} autoPlay/>
  );
  
  //landmark video
  const canvasRef = useRef();

// HTML section =========================================================================================================

  return (
  <div className='maingame-container'>
    <div className='wrapper'>
      <img
        className='start-img'
        src={require("../../images/start.png")}
        id ='start_img'
        
      />
      <img
        className='round'
        src={require("../../images/round-img.png")}
        alt='round-img'
        id='round'
      />
      {currentRound !== 0 && <img
          className='round-num'
          src={require("../../images/number/" + currentRound + ".png")}
          alt='round-num'
          id='round-num'
      />}
    </div>
    <div className='cam-left'>
      <div className='left-player-con'>
        <img
          className='profile-left'
          src={images[room.players[player_1].image]}
          alt="profile-left"
        />
        <div>
          <p className='player-detail-left'>{room.players[player_1].name}</p>
          <img 
            className='stars-l'
            src={require("../../images/star"+ playerStar +".png")}
            alt='star0'
          />
        </div>
        {/* combo */}
        <PlayerOne result={result} />
      </div>
      {/* {UserVideo} */}
      <div className="mediacam">
      <MediapipeCam/>
      </div>
      <ExitButton name="X"/>
    </div>
    {callLoading && < BlackScreenAnimation/> }
    <div className="middle-container">
      {displayTime && <CountdownTimer className='Timer' initialSec={5} TimerEnd={handleRoundEnd} />}
    </div>
    <div className='cam-right'>
      {!connected && <h1 className='waiting-container'></h1>}
    { connected &&
      <div className='right-player-con'>
        <div>
          <p className='player-detail-right'>{room.players[player_2].name}</p>
          <img
            className='stars-r'
            src={require("../../images/star"+ partnerStar +".png")}
            alt='star0'
            />
        </div>
        <img
          className='profile-right'
          src={images[room.players[player_2].image]}
          alt="profile-right"
        />
        <PlayerTwo result={partnerResult} />
      </div>}
      {PartnerVideo}
    </div>
  </div>
  )
}