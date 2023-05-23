import React from "react";
import { useContext } from 'react'
import Button from "../../Components/Button";
import styles from "./style.module.css";

import lightImage from "../../images/background-nolight.png";
import smallImage from "../../images/loser.png";
import { SocketContext } from "../../Context/SocketThing";

function Box() {
  const { socket, room, player_1} = useContext(SocketContext);

  return (
    <div className={styles.bg}>
      <img src={lightImage} className={styles.img} />
      <div className={styles.box}>
        <img src={smallImage} className={styles.small_img} />
        {/* <Score  score="500" /> */}
        <img 
            className='stars-result'
            // src={require("../../images/star"+ room.players[player_1].score +".png")}
            src={require("../../images/star"+ 0 +".png")}
            alt='star0'
          />
        {/* <Button classname='result-btn' name='Play Again' type='stranger'/> */}
        {/* vvvvvvvvvv ทำfunctionให้ด้วย vvvvvvvvvvvvvv */}
        <Button classname='result-btn' name='Exit' type='return' create={false}/>
      </div>
    </div>
  );
}

export default Box;

