import { React, useState,  useEffect } from 'react'
import './style.css'
import { useContext } from "react";
import { SocketContext } from "../../Context/SocketThing";
import { Link, useNavigate } from 'react-router-dom';

export const JoinFriend = () => {

    const { socket , room, player_1, player_2} = useContext(SocketContext);
    const [roomId, setroomId] = useState(room.roomId);
    const [warning, setWarning] = useState('');
    const oriRoomId = room.roomId;
    const navigate = useNavigate();
    
    // const player_1 = Object.keys(room.players)[0]
    // console.log(roomId)

            
    useEffect(() => {

        // for user reconnect
        if (socket.id === undefined){
          navigate(`/`);
        }
    }, [socket]);


    const handleChange = (roomId) => {
        // Get input value from "linkID"
        
        setroomId(roomId.target.value);
        console.log('change')

      };

    const joinRoom = (socket) => {

        // console.log(room);
        // if (Object.keys(room.players).length == 2) {
        //     room.players[player_1].caller = true
            
        // }
        socket.emit("room:check" , { roomId } , () => {});
        socket.on("errorMsg", (index) => {

            if (index < 0){
                setWarning("THERE IS NO ROOM WITH THAT CODE!\n PLEASE ENTER NEW CODE.");
            } else if (index >= 0){
                
                let size = Object.keys(socket).length;

                setWarning("");
                if (size > 0) {
                    socket.emit("room:join", { roomId }, (err, room) => {
                        console.log('joined', room);
                    if (err) navigate("/");
                  });
                }
                socket.emit("room:destroy" , { roomId, oriRoomId, player_1 } , () => {});
                console.log('warped');
                navigate(`/room/${roomId}`);
            }
        })

    };


        
    return (
    <div className="background-container">
        <div className="background-animation">
        <img
            className='join-game-title'
            src={require("../../images/jointitle.png")}
            alt='join-title'
        />
        <h1>{warning}</h1>
        <div>
            <input 
            type="text" 
            className="link-box" 
            id="link" 
            name='link' 
            value={roomId}
            onChange={handleChange}
            />
            <button className="bt-link" role="link-button"
            onClick={() => joinRoom(socket)}>Join</button>
        </div>
        </div>
    </div> 
    )
}

