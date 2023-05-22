import { useEffect, useState, createContext } from "react";
import { io } from 'socket.io-client';

const SocketContextGesture = createContext();

const SocketProviderGesture = ({ children }) => {
  const [handData, setHandData] = useState(-1);
  const [socket_gest, setSocketGest] = useState({});

  useEffect(() => {
    const socket_gest = io('https://angry-snowflake-73883.pktriot.net');
    
    setSocketGest(socket_gest);
    
    socket_gest.on('hand', data => {
      console.log("raw data", data);
      console.log("hand data", data.hand);

      setHandData(data.hand);
    });


  }, []);

  return (
    <SocketContextGesture.Provider value={{
        socket_gest,
        handData}}>
      {children}
    </SocketContextGesture.Provider>
  );
};

export { SocketProviderGesture, SocketContextGesture };
