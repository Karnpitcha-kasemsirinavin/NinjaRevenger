import React from "react";
import Button from "../../../Components/Button/index.jsx";
import "./style.css";

import lightImage from "../../../images/background-nolight.png";
import smallImage from "../../../images/loser.png";

function Score(props) {
  return <p className="sc">{props.score}</p>;
}

function Box() {
  return (
    <div className="bg">
      <div className="img-box">
        <img src={lightImage} className="img" />
      </div>
      <div className="box">
        <img src={smallImage} className="small-img" />
        <Score score="500" />
        <Button />
        <Button />
      </div>
    </div>
  );
}

export default Box;
