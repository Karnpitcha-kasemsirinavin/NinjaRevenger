import React, { useEffect } from 'react';
import '../TestCamera/style.css';
import MediapipeCam from '../../Components/MediapipeCam';
import Button from '../../Components/Button';

import background from "../../images/background-nolight.png";

const HandDetection = () => {
  return (
    <>
    <img src={background} alt="background" className="background" />
    <div className="testcam-container">
      <MediapipeCam/>
      <Button classname='result-exit-btn' name="x" type="return"/>
    </div>
    </>
  )
};

export default HandDetection;
