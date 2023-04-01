import React from "react";
import Button from "../../components/Button/Button";
import "./style.css";

import lightImage from "../../image/cloud.png";
import smallImage from "../../image/loser.png";

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
