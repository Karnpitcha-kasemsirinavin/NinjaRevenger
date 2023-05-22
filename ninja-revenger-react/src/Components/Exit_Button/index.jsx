import "../Exit_Button/style.css";
import { useContext } from "react";
import { SocketContext } from "../../Context/SocketThing";

const Button = ({classname, name, type}) => {
  const { socket, navigate, player_1, player_2, room, io, peer } = useContext(SocketContext);

  // handle change depend on the type of the room (link with server)
  const roomId = room.roomId

  const handleChange = () => {
    socket.emit("room:exit", { roomId, player_1, player_2 }, (err) => {
      peer.disconnect()
      peer.destroy()
      navigate(`/`);
    });
  };

  return (
    <button className={`exit-btn ${classname}`} onClick={() => handleChange()}>
      {name}
    </button>
  );
};


export default Button;