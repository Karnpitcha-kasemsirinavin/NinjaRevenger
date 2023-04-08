import styles from "./style.module.css";
import { useContext } from "react";
import { SocketContext } from "../../Context/SocketThing";

// , type 
const Button = ({ name}) => {
  const { socket, navigate } = useContext(SocketContext);

  // handle change depend on the type of the room (link with server)
  // const handleChange = (type) => {
  //   socket.emit("room:create", { type }, (err, roomId) => {
  //     navigate(`/room/${roomId}`);
  //   });
  // };

  return (
    <button className={styles.btn}>
      {name}
    </button>
  );
};


export default Button;