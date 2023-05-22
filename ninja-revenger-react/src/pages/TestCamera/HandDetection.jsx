import React, { useEffect } from 'react';
import '../TestCamera/style.css';
import MediapipeCam from '../../Components/MediapipeCam';
import ExitButton from '../../Components/Exit_Button';

import background from "../../images/background-nolight.png";

const HandDetection = () => {
  return (
    <>
    <img src={background} alt="background" className="background" />
    <div className="testcam-container">
      <MediapipeCam/>
      <ExitButton classname='result-exit-btn' name="x"/>
    </div>
    </>
  )
};

export default HandDetection;
