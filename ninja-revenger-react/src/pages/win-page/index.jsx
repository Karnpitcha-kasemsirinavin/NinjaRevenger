import React from "react";
import Button from "../../Components/Button/index.jsx";
import styles from "./style.module.css";

import backgroundImage from "../../images/lose.jpg";
import lightImage from "../../images/light.png";
import smallImage from "../../images/winner.png";

function Score(props) {
  return <p className={styles.sc}>{props.score}</p>;
}

function Box() {
  return (
    <>
    <div className={styles.mainCanvas}>
      <img src={backgroundImage} className={styles.bg} alt={backgroundImage} />
      <img src={lightImage} className={styles.img} />
      <div className={styles.box}>
        <img src={smallImage} className={styles.small_img} />
        <Score score="500" />
        <Button name='friend' type='friend'/>
        <Button name='return' type='return'/>
      </div>
    </div>
    </>
  );
}

export default Box;
