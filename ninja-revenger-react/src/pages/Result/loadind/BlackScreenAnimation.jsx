import React, { useState, useEffect } from "react";
import "./BlackScreenAnimation.css";
import star from "../../images/shuriken.png";
import ninja from "../../images/ninja1.png";

function BlackScreenAnimation() {
  return (
    <div className="black-screen">
      <div className="square">
        <img src={star} className="img" />
      </div>
      <div className="box">
        <img src={ninja} className="small-img" />
      </div>
    </div>
  );
}

export default BlackScreenAnimation;
