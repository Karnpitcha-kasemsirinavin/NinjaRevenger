import { useEffect, useContext, useState, useRef } from 'react'
import ExitButton from '../../Components/Exit_Button'
import '../main-game/style.css'
import '../../Components/Button/index.jsx'
import { SocketContext } from "../../Context/SocketThing";
import { useNavigate, useLocation } from "react-router-dom";
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
import { connect } from 'socket.io-client';


export const MainGame = () => {
  const { socket, room, player_1, player_2, peer, userId} = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // connection
  const [partnerId, setPartnerId] = useState('')
  const [stream, setStream] = useState()
  const [connected, setConnected] = useState(false)
  const [countConnect, setCountConnect] = useState(0)


  const userVideo = useRef()
  const partnerVideo = useRef()
  
  // time
  const [currentRound, setCurrentRound] = useState(1);
  const [start, setStart] = useState(false); // Add start
  const [displayTime, setDisplayTime] = useState(false);
  const [displayRound, setDisplayRound] = useState(false);
  const [renderVideo, setRenderVideo] = useState(true);
  

  // result
  const [result, setResult] = useState({
    shown: true,
    options: [],
  });

  const [partnerResult, setPartnerResult] = useState({
    shown: true,
    options: [],
  });


  // Option for each player
  const [play1Option, setPLay1Option] = useState(0); // each Option
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
    if (connected && caller && stream && countConnect === 0) {
      const call = peer.call(partnerId, stream);
      // console.log('calling', partnerId);
      setCountConnect(1);
  
      call.on('stream', remote => {
        if (partnerVideo.current.srcObject !== remote && renderVideo) {
        partnerVideo.current.srcObject = remote;
        // console.log('user', stream, '\npartner', remote);
        setStart(true);
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
        // console.log('partnerid ', partnerId)
      });

      socket.on('answer', data => {
        setPartnerId(data.id)
      })
  
      peer.on('connection', (err) => {
        // console.log('connected');
        setConnected(true);
        
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
          setStart(true);
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
    }


  }, [socket, navigate, peer, partnerId]);

  // check ready status for next round 

  useEffect(() => {
    
    socket.on('partnerReady', () => {
      setPartnerReady(true);
      console.log('partnerReady')
    });

    if (partnerReady && finishResult){
      setStart(true);
      setPartnerReady(false);
      setFinishResult(false);
      setCurrentRound(currentRound + 1);
      setDisplayTime(false);
      setOptionList([])
    }

    console.log('round ', currentRound)

    // Clean up the event listener on unmount
    return () => {
      socket.off('partnerReady');
    };



  }, [start,finishResult, partnerReady]);


	// Generate name =====================================================================================================

	const firstnames = ['Tor', 'Foam', 'Mark', 'June', 'Nata', 'Mill'];
  const surnames = ['1nwza', 'SudLhor', 'SudSouy', 'SecretService', 'React', 'HTML'];
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const numberArray = room.players[player_1].caller?

          [2,17,1,16,15,18,13]:[11,16,8,14,7,12,0]
      // [0,0]: []
      // [15,18,13,2,17,1,16,9,13,3]: [4,14,15,12,13,18,7,17,5,18,11,10]
      // [15, 18, 13, 5, 18, 11, 10, 9, 13, 3, 0]: [16, 0, 17, 6, 7, 9, 13, 3, 15, 18, 13]

  // for start
  useEffect(() => {
    const round_img = document.getElementById("round");
    const round_num = document.getElementById("round-num");

    // for each round
    const newRound = () => {

      if (currentRound === 1) {

      setTimeout(() => {
        setDisplayTime(true);
      }, 2000 + 3000); // make it visible after 5 secs
    } else {
      setTimeout(() => {
        setDisplayTime(true);
      }, 2000); // make it visible after 5 secs
    }

      // generating test *********************

      if (displayTime && !selectOption && currentIndex !== numberArray - 1) {

      setTimeout(() => {
        setPLay1Option(numberArray[currentIndex]);
        setCurrentIndex(currentIndex + 1);
        setSelectOption(true);
      }, currentIndex * 200); // 1 sec after start round

    }
  }

  // start game


    if (connected && currentRound === 1) {
      setTimeout(() => {
        console.log('show start img');
      }, 2000); // make it visible after 2 seconds

      setTimeout(() => {
        round_img.style.visibility = 'visible';
        round_num.style.visibility = 'visible';
      }, 2000 + 3000); // make it visible after 5 secs
      
    }

    if (start) {
       // show each round
      newRound()

    }

  }, [start, selectOption, displayTime]);



  useEffect(() => {
    

    if (play1Option !== null && play1Option !== undefined && selectOption && displayTime) {

      calculateCombo();
      setSelectOption(false)

      // update when player have new option
      socket.emit("room:update", room);


    }

    if (connected && displayTime){

    setPartnerResult({
      shown: true,
      options: room.players[player_2].option,
    })

    
  }
    // console.log('from play1 ', room.players[player_1].option)

  }, [play1Option, displayTime, selectOption, room])

  // time over for each round

const handleRoundEnd = () => {
  setStart(false);
  console.log('Round End');

  socket.emit("room:update", room);

  if ((room.players[player_2].option).length !== 0){
  setPartnerResult({
    options: room.players[player_2].option,
  }) 
 }

 // calculate result 
  calculateResult();
  setFinishResult(true);

  console.log('player ready')
  // check partner status
  socket.emit('ready', { from: player_1, to: player_2})

  // setResult({
  //   shown: false,
  //   options: []
  // })

  // setPartnerResult({
  //   shown: false,
  //   options: room.players[player_2].option,
  // })


  socket.emit("room:update", room);

    
};


//================ game logic ======================= (start)

// calculate gesture and combo for each player
const calculateCombo = async () => {
  let added_arr = {s:false ,4:false ,5:false}
  const players = room?.players;

  optionList.push(play1Option.toString());

  for (let i = 3; i <= 5; i++) {

    if (resultArr[i].length !== 0){
      resultArr[i] = [...resultArr[i], play1Option]
      added_arr[i] = true;
    }}
    
    // add arr5
    if (!added_arr[5] && (play1Option === 16 || play1Option === 4)) {
        // console.log('get 5')
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
  
  // console.log('arr3', resultArr[3])
  // console.log('arr4', resultArr[4])
  // console.log('arr5', resultArr[5])
  // console.log('Option', play1Option)

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

        // console.log('check string: ', check_string)
      for (let j = 0; j < Combo[i].length; j++) {
        if (check_string === Combo[i][j]){
          // console.log('check get combo', check_string);

          // change to combo
          let position = (i-1 + (2*i-1)*(-1))
          // console.log('position ', position)
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

  players[player_1].option = result.options;

};

// calculate the result between 2 players

const calculateResult = async () => {
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

  const maxLength = Math.max(partnerResult.options.length, result.options.length);

  console.log('Last result:\nPlayer:', result.options, '\nPartner:', partnerResult.options);

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

  
  console.log('Player result:', playerList);
  console.log('Partner result:', partnerList);

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

  [playerList, partnerList] = processCombos(playerList, partnerList);
  [partnerList, playerList] = processCombos(partnerList, playerList);

  console.log('Player result:', playerList);
  console.log(playerScore);
  console.log('Partner result:', partnerList);
  console.log(partnerScore);

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

// HTML section =========================================================================================================

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
          src={require("../../images/number/" + currentRound.toString() + ".png")}
          alt='round-num'
          id='round-num'
      />
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
          src={require("../../images/star0.png")}
          alt='star0'
        />
        </div>
        {/* combo */}
        <PlayerOne result={result} />
      </div>
      {UserVideo}
      <ExitButton name="X"/>
      </div>
    {displayTime && <CountdownTimer id='Timer' initialSec={10} TimerEnd={handleRoundEnd} />}
    
    <div className='cam-right'>
    { connected &&
      <div className='right-player-con'>
        <div>
        <p className='player-detail-right'>{room.players[player_2].name}</p>
        <img
          className='stars-r'
          src={require("../../images/star0.png")}
          alt='star0'
        />
        </div>
        <img
          className='profile-right'
          src={images[room.players[player_2].image]}
          alt="profile-right"
        />
        <div>
          {/* combo */}
        <PlayerTwo result={partnerResult} />
        </div>
      </div>}
      {PartnerVideo}
    </div>
  </div>
    )
}