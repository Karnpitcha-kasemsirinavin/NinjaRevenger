import React from 'react'
import './style.css'

export const JoinFriend = () => {
    return (
    <div class="background-container">
        <div class="background-animation">
        <form action="/url" method="GET">
            <input type="text" class="link-box" id="link" name='link'/>
            <button class="bt-link" role="link-button">Link</button>
        </form>
        <form action="/url" method="GET">
            <input type="text" class="friend-box" id="friend" name='friend'/>
            <button class="bt-friend" role="friend-button">Friend</button>
        </form>
        </div>
    </div> 
    )
}