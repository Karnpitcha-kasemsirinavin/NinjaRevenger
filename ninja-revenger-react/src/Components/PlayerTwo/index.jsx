import { useEffect,  useState, useContext } from "react";
import ReactDOM from 'react-dom';   
import { SocketContext } from "../../Context/SocketThing";
import styles from "./style.css";
import ComboList from "../ComboList";


const PlayerTwo = ({ result }) => {
    const [score, setScore] = useState(0);
    const {room, player_2} = useContext(SocketContext);
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

            // setScore(room.players[player_2].score);
            changeToName()

    }, [result])

    const changeToName = () => {
        let addedGesture = []
        
        console.log('result length', result.length)
        if (result.length > 0) {
          console.log('passs update friend')
        for (let i = 0; i < (result.options).length; i++) {

            // console.log(gesture[(result.options)[i]])
            addedGesture.push(gesture[(result.options)[i]])     
        }

        setOption(addedGesture);
      } else {
        setOption([])
      }
      
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
        {result.shown && <ComboList option={option} />}
        </div>
      );
}
      
export default PlayerTwo;

