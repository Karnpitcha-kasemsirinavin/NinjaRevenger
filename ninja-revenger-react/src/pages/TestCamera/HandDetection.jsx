import React, { useEffect } from 'react';
import '../TestCamera/style.css';
import MediapipeCam from '../../Components/MediapipeCam';
import Button from '../../Components/Button';
import TestCam from '../../Components/Testcam';

import background from "../../images/background-nolight.png";

const HandDetection = () => {
  return (
    <>
    <img src={background} alt="background" className="background" />
    <div className="testcam-container">
      <div className="testcam">
      <TestCam/>
      </div>
      <Button classname='testcam-exit-btn' name="x" type="return"/>
    </div>
    </>
  )
};

export default HandDetection;
