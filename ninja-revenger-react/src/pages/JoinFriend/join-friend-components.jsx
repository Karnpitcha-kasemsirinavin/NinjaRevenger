import { React, useState,  useEffect } from 'react'
import './style.css'
import { useContext } from "react";
import { SocketContext } from "../../Context/SocketThing";
import { Link, useNavigate } from 'react-router-dom';

export const JoinFriend = () => {
    const { socket, navigate , room, rooms} = useContext(SocketContext);
    const [roomId, setroomId] = useState(room.roomId);
    const [warning, setWarning] = useState('');


    // console.log(roomId)

    const handleChange = (roomId) => {
        // Get input value from "linkID"
        
        setroomId(roomId.target.value);

      };

    const joinRoom = (socket) => {

            
        socket.emit("room:check" ,{roomId}, (err) => {
            if (err) {
            }
        });

    };

    socket.on("error", (err) => {
        setWarning(err);
        console.log("warn ", warning)
    })


        
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

