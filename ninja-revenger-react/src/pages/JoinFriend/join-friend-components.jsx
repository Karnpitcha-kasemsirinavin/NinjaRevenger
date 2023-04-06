import React from 'react'
import './style.css'

export const JoinFriend = () => {
    return (
    <div class="background-container">
        <div class="background-animation">
        <img
            className='join-game-title'
            src={require("../../images/jointitle.png")}
            alt='join-title'
        />
        <form action="/url" method="GET">
            <input type="text" class="link-box" id="link" name='link'/>
            <button class="bt-link" role="link-button">Link</button>
        </form>
        </div>
    </div> 
    )
}