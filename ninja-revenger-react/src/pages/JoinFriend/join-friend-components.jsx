import { React, useState,  useEffect } from 'react'
import './style.css'
import { useContext } from "react";
import { SocketContext } from "../../Context/SocketThing";
import { useNavigate } from 'react-router-dom';

export const JoinFriend = () => {
    const { socket, navigate , room} = useContext(SocketContext);
    const [linkID, setLinkID] = useState(room.roomId);

    console.log(linkID)

    const handleChange = (linkID) => {
        // Get input value from "linkID"
        
        setLinkID(linkID.target.value);
    
      };

    const joinRoom = () => {
            
        // let size = Object.keys(socket).length;

        // console.log(size)

        // if (size > 0) {
        // socket.emit("room:join", { linkID }, (err, room) => {
        //     if (err) {
        //         navigate("/");
        //         console.log('error')
        //     }
        // });
        // }

        // if (size > 0) {
        //     socket.emit("room:join", { linkID }, (err, room) => {
        //       if (err) navigate("/");
        //     });
        //   }

            navigate(`/room/่${linkID}`);
            console.log(room)
    
    };

        
    return (
    <div className="background-container">
        <div className="background-animation">
        <img
            className='join-game-title'
            src={require("../../images/jointitle.png")}
            alt='join-title'
        />
        <div>
            <input 
            type="text" 
            className="link-box" 
            id="link" 
            name='link' 
            value={linkID}
            onChange={handleChange}
            />
            <button className="bt-link" role="link-button"
            onClick={() => joinRoom()}>Join</button>
        </div>
        </div>
    </div> 
    )
}