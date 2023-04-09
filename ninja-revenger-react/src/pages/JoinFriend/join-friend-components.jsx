import React from 'react'
import './style.css'

export const JoinFriend = () => {
    return (
    <div className="background-container">
        <div className="background-animation">
        <img
            className='join-game-title'
            src={require("../../images/jointitle.png")}
            alt='join-title'
        />
        <form action="/url" method="GET">
            <input type="text" className="link-box" id="link" name='link'/>
            <button className="bt-link" role="link-button">Link</button>
        </form>
        </div>
    </div> 
    )
}