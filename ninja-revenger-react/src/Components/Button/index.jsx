import "./style.css";
import { useContext } from "react";
import { SocketContext } from "../../Context/SocketThing";

// type 
const Button = ({classname, name, type, create}) => {
  const { socket, navigate, setJoined} = useContext(SocketContext);

  // handle change depend on the type of the room (link with server)
  const handleChange = (type) => {
    if (create) {
      socket.emit("room:create", { type }, (err, roomId) => {
        if (type === 'stranger'){
          setJoined(true)
          navigate(`/room/${roomId}`);
        } else if (type === 'friend'){
          navigate(`/joinlink`);
        }
      });
    } else {
      if (type === 'test-cam'){
        navigate(`/test-cam`)
      } else if (type === 'return'){
        navigate(`/`)
      }
    }
  };

  return (
    <button className={`btn ${classname}`} onClick={() => handleChange(type)}>
      {name}
    </button>
  );
};


export default Button;