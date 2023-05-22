import styles from "./style.module.css";
import { useContext } from "react";
import { SocketContext } from "../../Context/SocketThing";

const Button = ({ name, type}) => {
  const { socket, navigate } = useContext(SocketContext);

  // handle change depend on the type of the room (link with server)
  const handleChange = (type) => {
    socket.emit("room:create", { type }, (err, roomId) => {
      navigate(`/`);
    });
  };

  return (
    <button className={styles.btn} onClick={() => handleChange(type)}>
      {name}
    </button>
  );
};


export default Button;