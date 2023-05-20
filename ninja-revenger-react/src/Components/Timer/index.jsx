import { useState, useEffect } from 'react';

const CountdownTimer = ({ initialSec , TimerEnd }) => {
    const [seconds, setSeconds] = useState(initialSec);
    const [roundEnded, setRoundEnded] = useState(false);

    useEffect(() => {
      if (seconds > 0) {
        const timer = setTimeout(() => {
            setSeconds(seconds - 1); // countdown
        }, 1000); // update the state every 1 sec

        return () => clearTimeout(timer); // clear pending time

      } else {
        setRoundEnded(true);

        const endTimer = setTimeout(() => {
            setRoundEnded(false);
            TimerEnd();
        }, 5000); // 5 secs

        return () => clearTimeout(endTimer); // clear pending time
      }


    }, [seconds, TimerEnd]);

    return (
        <div>
          {roundEnded ? (
            <div>Round End</div>
          ) : (
            <div>{seconds}</div>
          )}
        </div>
      );
    
}

export default CountdownTimer;