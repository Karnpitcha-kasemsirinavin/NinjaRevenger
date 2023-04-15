import React, { useState, useEffect } from "react";
import "./style.css";
import star from "../../../images/shuriken.png";
import ninja from "../../../images/ninja-1.png";

export const LoadingPage = () => {
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
};

