import { useEffect,  useState, useContext } from "react";
import ReactDOM from 'react-dom';   
import { SocketContext } from "../../Context/SocketThing";
import styles from "./style.css";
import ComboList from "../ComboList";


const PlayerOne = ({ result }) => {
  const [score, setScore] = useState(0);
  const {room, player_1} = useContext(SocketContext);
  const [option, setOption] = useState([]);

  // data
  const gesture = {
    '0': 'Bird',
    '1': 'Bomb',
    '2': 'Bullet',
    '3': 'Butterfly',
    '4': "Cow's Blood",
    '5': 'Divine Punishment',
    '6': 'Dog',
    '7': 'Dragon',
    '8': 'Fox',
    '9': 'Full Moon',
    '10': 'Grave',
    '11': 'Hare',
    '12': 'Heart',
    '13': 'Horse',
    '14': 'Iron Wall',
    '15': 'Prevention',
    '16': 'Rat',
    '17': 'Serpant',
    '18': 'Tiger',
    '19': 'Unleash',

    '3-0': 'Serpentiger Firestorm',
    '3-1': 'Horseguard',
    '3-2': 'Moonlight Dance',
    '3-3': 'Quickhare',
    '4-0': 'Ironheart',
    '4-1': 'Celestial Judgement',
    '4-2': 'Viperblast',
    '4-3': 'Flashwing',
    '5-0': 'Draconic Venom',
    '5-1': "Heartwarden's Fortress"
  }

  useEffect(() => {
    if (result.show) {

      setScore(room.players[player_1].score);
      changeToName()
      
    } else if (result.reset) {
    }

  }, [result])

  const changeToName = () => {
    let addedGesture = []
    
    for (let i = 0; i < (result.options).length; i++) {

            // console.log(gesture[(result.options)[i]])
            addedGesture.push(gesture[(result.options)[i]])     
        }

    setOption(addedGesture);

    // console.log(option)

  }


  return (
    <div>
      {/* {option.map((item, index) => (
        <div key={index} className="custom-div">{item.value}</div>
        )).join('\n')} */}
      {/* <img
      className='combo-left'
      src={require("../../images/combo3.png")}
      alt='combo3'
    /> */}
    <ComboList option={option} />
    </div>
  );
}
    
export default PlayerOne;

