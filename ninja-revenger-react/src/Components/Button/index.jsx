import styles from "./style.module.css";

// , type 
const Button = ({ name}) => {
  // const { socket, navigate } = useContext(SocketContext);

  // const handleChange = (type) => {
  //   socket.emit("room:create", { type }, (err, roomId) => {
  //     navigate(`/room/${roomId}`);
  //   });
  // };

  // onClick={() => handleChange(type)}

  return (
    <button className={styles.btn}>
      {name}
    </button>
  );
};


export default Button;