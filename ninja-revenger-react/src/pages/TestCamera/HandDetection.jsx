import React, { useEffect, useState } from 'react';
import '../TestCamera/style.css';
import MediapipeCam from '../../Components/MediapipeCam';
import Button from '../../Components/Button';
import TestCam from '../../Components/Testcam';

import background from "../../images/background-nolight.png";
import { gestureName } from '../main-game/comboStyling';
import { useContext } from 'react';
import { SocketContextGesture } from '../../Context/SocketHand';
import { colorGesture } from '../main-game/comboStyling';

const HandDetection = () => {
  const { handData } = useContext(SocketContextGesture);
  const [option, setOption] = useState('')

  const getColor = (text) => { 
    return colorGesture[text]
  };

  useEffect(() => {
    console.log(handData)
    if (handData !== -1) {
      setOption(gestureName[handData])
    } else {
      setOption('No Gesture!')
    }
  }, [handData])
  return (
    <>
    <img src={background} alt="background" className="background" />
    <div className="testcam-container">
    <div className='gesture-text'>
      {/* <p>{option}</p> */}
    <p style={{ color: getColor(option) }}>{option}</p>
    </div>
      <div className="testcam">
      <TestCam/>
      </div>
      <Button classname='testcam-exit-btn' name="x" type="return"/>
    </div>
    </>
  )
};

export default HandDetection;
