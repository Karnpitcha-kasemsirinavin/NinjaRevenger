import React from "react";
import Button from "../../Components/Button";
import styles from "./style.module.css";

import lightImage from "../../images/background-nolight.png";
import smallImage from "../../images/loser.png";

function Score(props) {
  return <p className={styles.sc}>{props.score}</p>;
}

function Box() {
  return (
    <div className={styles.bg}>
      <img src={lightImage} className={styles.img} />
      <div className={styles.box}>
        <img src={smallImage} className={styles.small_img} />
        <Score  score="500" />
        <Button classname='red' name='friend' type='friend'/>
        <Button classname='bg-red' name='return' type='return'/>
      </div>
    </div>
  );
}

export default Box;

