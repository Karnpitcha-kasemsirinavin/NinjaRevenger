import { io } from 'socket.io-client';
import { useEffect, useState, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

var peer = new window.Peer();
let userId
peer.on('open', id => {
  userId = id
})

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
    const socket = io('https://black-breeze-48357.pktriot.net',
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

    console.log(socket)

    socket.on("room:get", (payload) => {
      setRoom(payload);
      let play_1 = Object.keys(payload.players)[0];
      let play_2 = Object.keys(payload.players)[1];

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
          socket.emit('id', { from: play_1, to: play_2, id: userId })
          console.log('doing connection');
        }
      } else {
        setPlayer_1(play_2);
        setPlayer_2(play_1);
        if (play_2 && !room.private) {
          socket.emit('id', { from: play_2, to: play_1, id: userId })
          console.log('doing connection');
        }
      }

      console.log(payload.players);

    });

    socket.on("room:bye", (payload) => {
      
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


