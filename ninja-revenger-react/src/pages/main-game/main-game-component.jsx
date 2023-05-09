import { useEffect, useContext, useState, useRef } from 'react'
import ExitButton from '../../Components/Exit_Button'
import './style.css'
import '../../Components/Button/index.jsx'
import { SocketContext } from "../../Context/SocketThing";
import { useNavigate, useLocation } from "react-router-dom";

export const MainGame = () => {
  const { socket, room, player_1, player_2, peer } = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [partnerId, setPartnerId] = useState('')
  const [stream, setStream] = useState()
  const [connected, setConnected] = useState(false)

  const userVideo = useRef()
  const partnerVideo = useRef()

  useEffect(() => {

    

    let roomId = location.pathname.split("/")[2];
    let size = Object.keys(socket).length;

    // if stranger then join room
    if (size > 0 && room.type === 'stranger') {
      socket.emit("room:join", { roomId }, (err, room) => {
        if (err) navigate("/");
      });
    }

  }, [socket]);


  // when player 2 appear
  if (connected) {
    if (room.players[player_1].caller) {

      // user video is streaming
      if (stream) {
        const call = peer.call(partnerId, stream)
        console.log('calling');

        // when player 2 stream
        call.on('stream', remote => {
          partnerVideo.current.srcObject = remote
          // partnerVideo.current.play()
          console.log('user', stream, '\npartner', remote);
          // setRemoteStream(remote)
        })
      } else {
        console.log('stream if off');
      }
    }
  }

  useEffect(() => {

    
    if (socket.id === undefined){
      navigate(`/`);
    } else {


    // user video
    var getUserMedia = navigator.getUserMedia
    getUserMedia({ video: true }, stream => {
      userVideo.current.srcObject = stream;
      // userVideo.current.play();
      setStream(stream)
    })

    // connect to player 2 by id
    socket.on('id', data => {

      console.log('pass1')      
      var conn = peer.connect(data.id);
      setPartnerId(data.id)
    })

    // connected
    peer.on('connection', (err) => {
      console.log('connected');
      setConnected(true)
    });

    peer.on('disconnect', () => {
      console.log('disconnect bye see u')
    })

    // get plyer 2 video
    peer.on('call', call => {

      getUserMedia({ video: true }, stream => {
        call.answer(stream)
        console.log('answering');
      })
      call.on('stream', remote => {

        partnerVideo.current.srcObject = remote
        // partnerVideo.current.play()
      })
    });

        
    socket.on("friend_disconn", () => {

      console.log('pass na ja')
  
      navigate(`/`);
  
    });
  };
    
  }, []);

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
    {UserVideo}
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