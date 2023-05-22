// HandDetection.jsx

import React, { useEffect } from 'react';
import { Hands, Camera } from '@mediapipe/hands';

const HandDetection = ({ Input_Video }) => {
  useEffect(() => {
    const videoElement = Input_Video.current;
    const canvasElement = document.querySelector('.output_canvas');
    
    if (!videoElement || !canvasElement) {
      console.error('Video or canvas element not found');
      return;
    }

    const canvasCtx = canvasElement.getContext('2d');
    const framesArray = [];

    // function for hands appearing on cam
    function onResults(results) {
      // setting the canvas
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // if there is a hand detected
      if (results.multiHandLandmarks) {
        // Return the canvas image data
        const imageData = canvasElement.toDataURL();
        const img = new Image();
        img.src = imageData;
      }
      canvasCtx.restore();
    }

    // using the hand object from mediapipe
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3.1632795355/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    // execute onResults function
    hands.onResults(onResults);

    // set the camera settings and send images
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 1280,
      height: 720,
    });
    camera.start();
  }, [Input_Video]);

  return console.log("cannot use")
};
export default HandDetection;
