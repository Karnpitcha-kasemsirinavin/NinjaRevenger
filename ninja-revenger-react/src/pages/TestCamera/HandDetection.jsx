import React, { useEffect } from 'react';
import '../TestCamera/style.css';
import MediapipeCam from '../../Components/MediapipeCam';

import background from "../../images/background-nolight.png";

const HandDetection = () => {
  return (
    <>
    <img src={background} alt="background" className="background" />
    <div className="testcam-container">
      <MediapipeCam/>
    </div>
    </>
  )
};

export default HandDetection;
