import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import star from "../../images/shuriken.png";
import ninja from "../../images/ninja-1.png";

const BlackScreenAnimation = () => {
  return (
    <div className={styles.black_screen}>
      <div className={styles.square}>
        <img src={star} className={styles.img}/>
      </div>
      <div className={styles.box}>
        <img src={ninja} className={styles.small_img} />
      </div>
    </div>
  );
}


export default BlackScreenAnimation;
