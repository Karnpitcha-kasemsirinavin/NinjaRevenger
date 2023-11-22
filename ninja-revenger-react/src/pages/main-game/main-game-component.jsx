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
import roundImg from '../../images/round-img.png';
import  BlackScreenAnimation from '../loading'
import { connect } from 'socket.io-client';
import { colorGesture , gestureName, colorCombo,
  combo3Name, combo4Name, combo5Name,comboDisplay} from './comboStyling.jsx';



export const MainGame = () => {
  const { socket, room, player_1, player_2, peer, userId, setIdEmitted, setJoined } = useContext(SocketContext);
  const { handData, socket_gest } = useContext(SocketContextGesture);

  const navigate = useNavigate();
  const location = useLocation();
  var roomId = location.pathname.split("/")[2];
  
  // connection
  const [partnerId, setPartnerId] = useState('')
  const [stream, setStream] = useState()
  const [connected, setConnected] = useState(false)
  const [countConnect, setCountConnect] = useState(0)


  const userVideo = useRef()
  const partnerVideo = useRef()
  const [renderVideo, setRenderVideo] = useState(true)
  
  const [caller, setCaller] = useState(room.players[player_1].caller)

  // animation 
  const [callLoading, setCallLoading] = useState(false)

  // ? create canvas for user? (already in mediaCam)
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
  
  
  // status of player two joining room
  const [checkJoin, setCheckJoin] = useState(false)

  // ! Generate name
	const firstnames = ['Tor', 'Foam', 'Mark', 'June', 'Nata', 'Mill'];
  const surnames = ['1nwza', 'SudLhor', 'SudSuay', 'Romanoff', 'React', 'HTML'];

  useEffect(() => {
    generateRandomName();
    selectRandomImage();
    socket.emit("room:update", room);
  }, [])

	const generateRandomName = () => {
    // console.log('passs generator')
		const randomIndexFirst1 = Math.floor(Math.random() * firstnames.length);
    const randomIndexLast1 = Math.floor(Math.random() * surnames.length);

		const name1 = firstnames[randomIndexFirst1] + " " +  surnames[randomIndexLast1];

    room.players[player_1].name = name1;	
	};

  const images = [art1, art2, art3, art4, art5, art6, art7, art8];

  const selectRandomImage = async() => {
    const randomIndexImage1 = Math.floor(Math.random() * images.length);
    
    room.players[player_1].image = randomIndexImage1;	
  }


  
  // ! identifying room and set ready status for game
  useEffect(() => {
    if (socket.id === undefined) {
      navigate(`/`);
    } else {
      // * assign video of user
      var getUserMedia = navigator.getUserMedia;
      getUserMedia({ video: true }, stream => {
        userVideo.current = stream;
        setStream(stream);
        // setTimeout(() => {
        //   captureImage()
        // }, 2000);
      });
    let roomId = location.pathname.split("/")[2];
    let size = Object.keys(socket).length;
    // ! currently set to check when stranger mode
    // if there is another person joining room
    if (size > 0 && room.type === 'stranger' && !checkJoin) {
      socket.emit("room:join", { roomId }, (err, room) => {
        if (err) navigate("/");
      });
      setCheckJoin(true)
    }

    socket.on('exited', data => {
      // peer.disconnect()
      // peer.destroy()
      setPartnerId('')
      setConnected(false)
      setIdEmitted(false)
      setJoined(false)
      navigate(`/`)
    })

    socket.on('answer', data => {
      // console.log('received your id', data, 'thanks !!!');
      setPartnerId(data.id)
      // setConnected(true);
    })
    
    socket.on("friend_disconn", () => {
        // console.log('friend bye');
        navigate(`/`);
      });
      socket.on('caller', data => {
        // console.log('turn caller on');
        setCaller(true)
        if (countConnect === 0){
          
          socket.emit('id', { from: player_1, to: player_2, id: userId })
        }
      })
      socket.on("friend_update", (data) => {
        setPartnerResult({
          shown: true,
          options: data.result,
          length: data.length,
          score: data.score,
        })
      })

    }
  }, [socket, room]);


  useEffect(() => {

    // ! establish peer connection 
    if (!connected) {
      socket.on('id', data => {
        // console.log('try to connect');
        // console.log(data);
        console.log('connecting to peer', data.id);
        socket.emit('answer', { from: player_1, to: data.from, id: userId })
        var conn = peer.connect(data.id);
        setPartnerId(data.id);
        // console.log('partnerid ', partnerId)
      });
    }

  }, [connected]);

  const [status, setStatus] = useState('finished')

  useEffect(() => {
    // ! when establish peer connection
    peer.on('connection', (err) => {
      setConnected(true);
    });

    peer.on('disconnected', () => {
      // console.log('disconnected bye see u');
    });
    
    // problem make video jerky
    peer.on('call', call => {
      var getUserMedia = navigator.getUserMedia;
      getUserMedia({ video: true }, stream => {
        call.answer(stream)
    });

    if (renderVideo) {
      call.on('stream', remote => {
        // console.log('render', renderVideo);
        if (partnerVideo.current.srcObject !== remote && renderVideo) {
        partnerVideo.current.srcObject = remote;
        console.log('i get ur video')
        // cannot get ans for this one
        // ! start round 1
        setTriggerStart(1)
        setTimeout(() => {
          socket.emit('ready', { from: player_1, to: player_2 });
        }, 5000);
        setRenderVideo(false);
        }
      })}
    });

    //! when peer connect find caller get video
    if (connected && caller) {
      const call = peer.call(partnerId, stream);
      // console.log('calling', partnerId);
      call.on('stream', remote => {
        if (partnerVideo.current !== remote && renderVideo) {
        partnerVideo.current.srcObject = remote;
        console.log('i get ur video')
        // player 1 receive form 2
        setTriggerStart(1)
        setTimeout(() => {
          socket.emit('ready', { from: player_1, to: player_2 });
        }, 5000);
        setRenderVideo(false);
        }});
    }

    socket.on('playerReady', data => {
    // console.log('receive ready status ',data)
    if (data.from !== undefined && status === 'finished') {
      setStatus('round-ready')
      // startCountdownTimer()
    }})

  }, [peer, connected])
  
  const [round, setRound] = useState(0)
  const [playerOption, setPlayerOption] = useState([])
  const [partnerOption, setPartnerOption] = useState([])
  const [preHand, setPreHand] = useState(-1) 
  const [finalList, setFinalList] = useState([])
  const [checkIndex, setCheckIndex] = useState(0)
  const [playerCombo, setPlayerCombo] = useState([])
  const [playerStar, setPlayerStar] = useState(0)
  const [partnerStar, setPartnerStar] = useState(0)
  const [triggerStart, setTriggerStart] = useState(0)

  const getColor = (text) => { 
    return colorGesture[text]
  };

  const comboColor = (text) => {
    return colorCombo[text]
  }

  useEffect(() => {
  if (status === 'finished') {
    // console.log('status from finish  ',status)
    // ! let partner know 
    socket.emit('finishedRound', 
    {from: player_1, to: player_2, 
      optionList: finalList, round: round, roomId: roomId})

    // reset all variable
    setFinalList([])
    setPlayerOption([])
    setPartnerOption([])
    setPlayerCombo([])
    setCheckIndex(0)
    setPreHand(-1)

    // ! start next round 
    socket.on('playerFinish', data => {
      console.log(data)
      if (data.result === 'win') {
        setPlayerStar(playerStar+1)
      } else if (data.result === 'draw') {
        setPlayerStar(playerStar+1)
        setPartnerStar(partnerStar+1)
      } else {
        setPartnerStar(partnerStar+1)}

    //setTriggerStart(true)
    setTimeout(() => {
      socket.emit('ready', { from: player_1, to: player_2 });
    }, 5000);
    })
  }
  // ! each round of game
  if (status === 'round-ready'  && round < 5){
      setRound(round+1)
      setTriggerStart(2)
      startCountdownTimer()}
  //console.log(status)
  if (status !== 'round-ready' && 
        status !== 'finished') {
          console.log(playerOption)
          generateOption() }
  }, [status])

  useEffect(() => {
    socket.on('partnerOption', data => {
      //console.log(data)
      if (data.optionList.length !== 0) {
        setPartnerOption(data.optionList)
      }
    })
  
  }, [])

  const addOption = (option) => {
    setPlayerOption(prevOptions => [...prevOptions, option]);
    setFinalList(prevOptions => [...prevOptions, option]);
  }

  useEffect(() => {
    // console.log('send')
    if (playerOption.length !== 0) {
      // checkCombo(playerOption[playerOption.length-1])
    }
    checkCombo()
    socket.emit('sendOption', { from: player_1, to: player_2, optionList: playerOption });
  }, [playerOption])
  
  // ! navigate after round 5
  useEffect(() => {
    if (round === 5) {
      if (playerStar === partnerStar) {
        navigate(`/win`)
      } else if (partnerStar > playerStar) {
        navigate(`/lose`)
      } else if (playerStar > partnerStar) {
        navigate(`/win`)}}

  }, [playerStar, partnerStar])

  const [triggerTest, setTriggerTest] = useState(false)

  async function generateOption() {
    console.log(handData)
    if (handData !== -1 && handData !== preHand) {
      //console.log(handData)
      // ! real
      addOption(gestureName[handData])
      // !test
      // 4-A
      // addOption('Bullet 弾丸')
      // addOption('Serpant 蛇')
      // addOption('Bomb 爆弾')
      // addOption('Rat ネズミ')
      // 5-A
      // addOption('Rat ネズミ')
      // addOption('Bird 鳥')
      // addOption('Serpant 蛇')
      // addOption('Dog 犬')
      // addOption('Dragon 竜')
      // finalList = [...finalList, gestureName[handData]];
      setPreHand(handData)
    }

    // ! test
    // const optionsToAdd = [
    //   'Rat ネズミ',
    //   'Bird 鳥',
    //   'Serpant 蛇',
    //   'Dog 犬',
    //   'Dragon 竜'
    // ];
  
    // if (handData !== -1 && handData !== preHand && triggerTest === false) {
    //   for (let i = 0; i < optionsToAdd.length; i++) {
    //     await new Promise(resolve => {
    //       setTimeout(() => {
    //         addOption(optionsToAdd[i]);
    //         resolve();
    //       }, 500 * i); // Add each option every i seconds
    //     });
    //   }
    //   setPreHand(handData);
    //   setTriggerTest(true)
    // }
  }

  function checkCombo() {
    let found = false
    let checkingLength = finalList.length - checkIndex
    //console.log(checkingLength)

    // check 5
    if (checkingLength >= 5) {
        let combo = finalList[checkIndex] + 
        finalList[checkIndex+1] + finalList[checkIndex+2]+ 
        finalList[checkIndex+3]+ finalList[checkIndex+4]
        console.log(combo)
        if (combo5Name[combo] !== undefined) {
          let newArray = finalList.filter((_, index) => index < checkIndex || index > checkIndex + 4)
          console.log(newArray)
          newArray = [...newArray, combo5Name[combo]]
          setCheckIndex(checkIndex+1)
          setFinalList(newArray)
          setPlayerCombo(currentcombo => [...currentcombo, combo5Name[combo]])
          found = true
      } else {
        setCheckIndex(checkIndex+1)
      }}
    // check 4
    if (found === false && checkingLength >= 4) {
    for (let i = 0; i< 2; i++) {
      let combo = finalList[checkIndex+i] + 
        finalList[checkIndex+1+i] + finalList[checkIndex+2+i]+ 
        finalList[checkIndex+3+i]
      if (combo4Name[combo] !== undefined
        && finalList[checkIndex+3+i] !== undefined) {
        //setCheckIndex(checkIndex+ 2+i)
        setCheckIndex(checkIndex+1+i)
        let newArray = finalList.filter((_, index) => index < checkIndex+i || index > checkIndex+3+i)
        newArray = [...newArray, combo4Name[combo]]
        setFinalList(newArray)
        setPlayerCombo(currentcombo => [...currentcombo, combo4Name[combo]])
        found = true
        break;
      }
    }}
    // check 3
    if (found === false && checkingLength >= 3) {
    for (let i = 0; i< 3; i++) {
      let combo = finalList[checkIndex+i] + 
        finalList[checkIndex+1+i] + finalList[checkIndex+2+i]
        //console.log(combo)
      if (combo3Name[combo] !== undefined 
        && finalList[checkIndex+2+i] !== undefined) {
        //setCheckIndex(checkIndex+1+i)
        setCheckIndex(checkIndex+1+i)
        let newArray = finalList.filter((_, index) => index < checkIndex+i || index > checkIndex+2+i)
        newArray = [...newArray, combo3Name[combo]]
        setFinalList(newArray)
        found = true
        setPlayerCombo(currentcombo => [...currentcombo, combo3Name[combo]])
        break;
      }
    }}
    // if (found === false) {
    //   setCheckIndex(checkIndex+1)
    // }
  }

  function startCountdownTimer() {
    let countdown = 10;
    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
      countdown--;
      //console.log('countdown: ',countdown)
      setStatus(countdown.toString())
    } else {
        setStatus('finished')
        clearInterval(countdownInterval);
      }
    }, 1000)
    return () => clearInterval(countdownInterval);
  }


  // ! now using canvas for user video
  // make streams into video element
  // let UserVideo;
  // console.log('user video', UserVideo)
  // UserVideo = (
  //   <video ref={userVideo} autoPlay/>
  // );

  let PartnerVideo;
  PartnerVideo = (
    <video ref={partnerVideo} autoPlay/>
  );

  //landmark video
  // const canvasRef = useRef();
// HTML section =========================================================================================================

  return (
  <div className='maingame-container'>
    <div className='wrapper'>
      {/* <img
        className='start-img'
        src={require("../../images/start.png")}
        id ='start_img'
        
      /> */}
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
            src={require("../../images/star"+ playerStar.toString() +".png")}
            alt='star0'
          />
        {/* {UserVideo} */}
        </div>
        <div className="comboDisplay">
        <ul>
          {playerOption.map((option, index) => (
            <p key={round.toString() + index.toString() + option} 
            style={{ color: getColor(option) }}>{option}</p>
          ))}
        </ul>
        </div>
        <div>
        <ul className='combo'>
          {playerCombo.map((option, index) => {
            const displayCombo = comboDisplay[option]
            return (
            <p key={round.toString() + index.toString() + option}
            style={{ color: comboColor(option) }}
            >{displayCombo}</p>
          )})}
        </ul>
        </div>
      </div>
      <MediapipeCam/>
      <ExitButton name="X"/>
    </div>
    {callLoading && < BlackScreenAnimation/> }
    <div className="middle-container">
    { triggerStart === 1 && <img
        className='start-img'
        src={require("../../images/start.png")}
        id ='start_img'/>}
      <div  className="round-container">
      {triggerStart === 2 && <img src={roundImg} className='round-bg'/>}
      {/* <img src={"../../images/number/" +  round.toString() + ".png"} 
      alt="rou" /> */}
      {round !== 0 && triggerStart === 2 &&
      <img src={require("../../images/number/"+ round.toString() +".png")} 
      alt="rou" className='number-img' />}
      {round === 0 && triggerStart === 2 && <img src={require("../../images/number/1.png")} 
      alt="rou" className='number-img'/>}
      </div>
      { triggerStart === 2 && <div className="time-container">
        <h className="floating-text">{status}</h>
      </div>}
    </div>
    <div className='cam-right'>
      {!connected && <h1 className='waiting-container'></h1>}
    { connected &&
      <div className='right-player-con'>
        <div>
          <p className='player-detail-right'>{room.players[player_2].name}</p>
          <img
            className='stars-r'
            src={require("../../images/star"+ partnerStar.toString() +".png")}
            alt='star0'
            />
        </div>
        <img
          className='profile-right'
          src={images[room.players[player_2].image]}
          alt="profile-right"
        />
        <PlayerTwo result={partnerResult} />
        <div className="comboDisplay">
        <ul>
          {partnerOption.map((option, index) => (
            <p key={round.toString() + index.toString() + option} 
            style={{ color: getColor(option) }}>{option}</p>
          ))}
        </ul>
        </div>
      </div>
      }
      
      <div className='partnerVideo'>
      {PartnerVideo}
      </div>
    </div>
  </div>
  )
}