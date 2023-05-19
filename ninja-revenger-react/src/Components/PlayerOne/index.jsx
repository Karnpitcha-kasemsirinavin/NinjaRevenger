import { useEffect,  useState, useContext } from "react";
import { SocketContext } from "../../Context/SocketThing";


const PlayerOne = ({ result }) => {
    const [score, setScore] = useState(0);
    const {room, player_1} = useContext(SocketContext);
    const [option, setOption] = useState([]);

    useEffect(() => {
        if (result.show) {
            setOption(room.players[player_1].option);
            setScore(room.players[player_1].score);
        } else if (result.reset) {
            setOption([]);
        }

    }, [result])

    return (
        <div>
        {option.map((item, index) => (
        <div key={index}>{item}</div>
        ))}
        </div>
    )
}

export default PlayerOne;