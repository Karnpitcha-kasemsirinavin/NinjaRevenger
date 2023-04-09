import { React, useState } from 'react'
import './style.css'
import { useContext } from "react";
import { SocketContext } from "../../Context/SocketThing";
import { useNavigate } from 'react-router-dom';

export const JoinFriend = () => {
    const { socket, navigate , room} = useContext(SocketContext);
    const [linkID, setLink] = useState(room.roomId);

    console.log(room.roomId)

    const handleChange = (linkID) => {
        // 👇 Get input value from "link"
        setLink(linkID.target.value);
      };

        
    return (
    <div className="background-container">
        <div className="background-animation">
        <img
            className='join-game-title'
            src={require("../../images/jointitle.png")}
            alt='join-title'
        />
        <form action="/url" method="GET">
            <input 
            type="text" 
            className="link-box" 
            id="link" 
            name='link' 
            value={linkID}
            onChange={handleChange}
            />
            <button className="bt-link" role="link-button">Join</button>
        </form>
        </div>
    </div> 
    )
}