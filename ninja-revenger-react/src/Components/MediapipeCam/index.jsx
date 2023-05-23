import React, { useEffect, useState, useContext, createContext } from 'react';
import '../MediapipeCam/style.css'
import { SocketContextGesture } from "../../Context/SocketHand";

const { io } = require('socket.io-client')
const url = 'https://peaceful-snow-18663.pktriot.net'

const MediapipeCam = () => {
  const { socket_gest } = useContext(SocketContextGesture);

  // const { socket } = useContext(SocketContext);


  useEffect(() => {
    // const socket = io(url)

    console.log("socket_gest from Mediapipe:", socket_gest)

    // socket_gest.on('hand', data => {
    //   console.log("raw data", data)
    //   console.log("hand data", data.hand);
    // })

    const videoElement = document.getElementsByClassName('input-video')[0];
    const canvasElement = document.getElementsByClassName('output-canvas')[0];
    const canvasCtx = canvasElement.getContext('2d');

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        await Promise.all([
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3.1632795355/hands.js'),
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'),
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js'),
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js'),
        ]);
        
        // Code to execute after all scripts are loaded
        const { Hands, Camera, drawConnectors, drawLandmarks, HAND_CONNECTIONS } = window;
  
        // Define the desired frame rate (e.g., 0.2 FPS)
        const desiredFrameRate = (1/2);
        const frameInterval = 1000 / desiredFrameRate;
        let lastCaptureTime = 0;

        // Function to capture an image
        function captureImage(landmarks) {

          const currentTime = performance.now();
          const elapsedTime = currentTime - lastCaptureTime;

          // Check if the desired frame rate interval has passed
          if (elapsedTime >= frameInterval) {
            // Capture the canvas image data
            const imageData = canvasElement.toDataURL('image/webp');
            const img = new Image();
            img.src = imageData;
            // console.log(imageData);
            // console.log(socket_gest.id);
            socket_gest.emit('data', { from: socket_gest.id, image: imageData })

            

            // Append the image element to the body
            // document.body.appendChild(img);

            // Update the last capture time
            lastCaptureTime = currentTime;
            // console.log(lastCaptureTime)
          }

          

          // Request the next frame
          if (landmarks.length > 0){
            requestAnimationFrame(captureImage);
          }
          else {
            cancelAnimationFrame(captureImage)
          }
          }

    //function for hands appearing on cam
    function onResults(results) {
      //setting the canvas
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    
      //if there is hand detected
      if (results.multiHandLandmarks) {
        //detect how many there are label hand 1 and 2
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
          const landmarks = results.multiHandLandmarks[i];
          if (results.multiHandedness) {
            let hand;
            if (i == 0) {
              hand = 'Hand 1';
            } else {
              hand = 'Hand 2';
            }
            // console.log(`${hand}:`);
          }
      
        //print the landmarks position
        if (landmarks.length > 0) {
          // for (let j = 0; j < landmarks.length; j++) {const landmark = landmarks[j];
          //   console.log(`Landmark ${j}: (${landmark.x}, ${landmark.y}, ${landmark.z})`);
          // }
          //draw the connectors of landmarks and draw landmarks
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {lineWidth: 2});
          drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', radius: 1});
          
          // Start capturing images
          requestAnimationFrame(captureImage);
        }
      }       
    }

    canvasCtx.restore();
    }
    // using the hand object from mediapipe
    const hands = new Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3.1632795355/${file}`;
    }});
    hands.setOptions({
      maxNumHands: 2,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    //execute onResults function if hand is detected
    hands.onResults(onResults);
    
    //set the camera settings and send images
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({image: videoElement});
      },
      width: 1280,
      height: 720
    });
    camera.start();
  } catch (error) {
    console.error('Failed to load scripts:', error);
  }
};

loadScripts();
}, []);

  return (
    <>
      <video hidden className="input-video"></video>
      <canvas className="output-canvas" width="1300px" height="700px">
      </canvas>
    </>
  )
};

export default MediapipeCam;
