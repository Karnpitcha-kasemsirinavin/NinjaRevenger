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
  const [player_1, setPlayer_1] = useState("");
  const [player_2, setPlayer_2] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const socket = io('https://nostalgic-dream-93159.pktriot.net');
    setSocket(socket);

    console.log()

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
        if (play_2) {
          socket.emit('id', { from: play_1, to: play_2, id: userId })
        }
      } else {
        setPlayer_1(play_2);
        setPlayer_2(play_1);
        if (play_2) {
          socket.emit('id', { from: play_2, to: play_1, id: userId })
        }
      }

      console.log(payload.players);

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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContextProvider, SocketContext };


