import React from "react";
import { useContext } from 'react'
import Button from "../../Components/Button/index.jsx";
import styles from "./style.module.css";

import backgroundImage from "../../images/lose.jpg";
import lightImage from "../../images/light.png";
import smallImage from "../../images/winner.png";
import { SocketContext } from "../../Context/SocketThing";



function Box() {
  const { socket, room, player_1} = useContext(SocketContext);

  return (
    <>
    <div className={styles.mainCanvas}>
      <img src={backgroundImage} className={styles.bg} alt={backgroundImage} />
      <img src={lightImage} className={styles.img} />
      <div className={styles.box}>
        <img src={smallImage} className={styles.small_img} />
        {/* <Score score="500" /> */}
        <img 
            className='stars-result'
            // src={require("../../images/star"+ room.players[player_1].score +".png")}
            src={require("../../images/star"+( room.players[player_1]).score +".png")}
            alt='star0'
          />
        {/* <Button classname='result-btn' name='Play Again' type='stranger'/> */}
        <Button classname='result-btn' name='Exit' type='return' create='false'/>
      </div>
    </div>
    </>
  );
}

export default Box;
