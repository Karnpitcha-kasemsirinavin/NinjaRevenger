const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

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
        console.log(`${hand}:`);
      }
      
      //print the landmarks position
      if (landmarks.length > 0) {
        for (let j = 0; j < landmarks.length; j++) {const landmark = landmarks[j];
          console.log(`Landmark ${j}: (${landmark.x}, ${landmark.y}, ${landmark.z})`);
        }
        //draw the connectors of landmarks and draw landmarks
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {lineWidth: 2});
        drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', radius: 1});
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