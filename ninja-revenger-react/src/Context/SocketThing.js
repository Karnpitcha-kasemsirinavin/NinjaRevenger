import { io } from 'socket.io-client';
import { useEffect, useState, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

var peer = new window.Peer();
let userId
peer.on('open', id => {
  userId = id
})

var isIdEmitted = false

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'https://nostalgic-dream-93159.pktriot.net';

const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState({});
  const [room, setRoom] = useState({});
  // const [partnerId, setPartnerId] = useState('')
  const [player_1, setPlayer_1] = useState("");
  const [player_2, setPlayer_2] = useState("");
  const navigate = useNavigate();
  const location = useLocation();


  
	// if (window.performance.navigation) {
	// 	console.info("window.performance works fine on this browser");
	//   }
	//   console.info(window.performance.getEntriesByType("navigation")[0].type);
	//   if (performance.TYPE_NAVIGATE == 1) {
	// 	console.info( "This page is reloaded" );
	//   } else {
	// 	console.info( "This page is not reloaded");
	//   }

  useEffect(() => {
    const socket = io('https://relaxed-bush-92325.pktriot.net',
    {
      reconnectionDelayMax: 10000,
      auth: {
        token: "123"
      },
      query: {
        "my-key": "my-value"
      }
    });
    setSocket(socket);
    

    socket.on("room:get", (payload) => {
      setRoom(payload);
      let play_1 = Object.keys(payload.players)[0];
      let play_2 = Object.keys(payload.players)[1];

      // console.log(play_1.id)

      if (play_1 === socket.id) {
        setPlayer_1(play_1);
        setPlayer_2(play_2);
      } else {
        setPlayer_1(play_2);
        setPlayer_2(play_1);
      }

      if (play_1 === socket.id) {
        setPlayer_1(play_1);
        setPlayer_2(play_2);
        if (play_2 && !room.private) {
          if (!isIdEmitted) {
            // fix stranger but private cannot
            console.log('yang pass yuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu ')
            socket.emit('id', { from: play_2, to: play_1, id: userId });
            isIdEmitted = true; 
          }
          
          // console.log('doing connection');
        }
      } else {
        setPlayer_1(play_2);
        setPlayer_2(play_1);
        if (play_2 && !room.private) {
          if (!isIdEmitted) {
            console.log('yang pass yuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu jaaaaaaaaaa')
            socket.emit('id', { from: play_2, to: play_1, id: userId });
            isIdEmitted = true; 
        }}
      }

      // console.log(payload.players);

      // if (
      //   payload?.players[play_1]?.score === 1 ||
      //   payload?.players[play_2]?.score === 1
      // ) {
      //   if ( payload?.players[play_1]?.score === 1){
      //     console.log('score win as play 1: ')
      //   let pathname = "/win";
      //   if (pathname !== location.pathname) navigate(pathname);
      //   } else if (payload?.players[play_2]?.score === 1){
      //     console.log('score win as play 2: ')
      //     let pathname = "/win";
      //     if (pathname !== location.pathname) navigate(pathname);
      //   } else {
      //     console.log('lose: ')
      //     let pathname = "/lost";
      //     if (pathname !== location.pathname) navigate(pathname);
      //   }
      // }

    });

  }, []);


  return (
    <SocketContext.Provider
      value={{
        socket,
        room,
        setRoom,
        player_1,
        player_2,
        navigate,
        peer,
        userId,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContextProvider, SocketContext };


