import React from 'react'
import './style.css'

export const MainGame = () => {
    return (
    <div className='container'>
        <div className='cam-left'>
            <div className='wrapper'>
                <img
                    className='profile-left'
                    src={require("../../images/user-profile-example.png")}
                    alt="profile-left"
                />
                <p className='player-detail-left'>Natasha Romanoff</p>
                <img className='stars-l'
                    src={require("../../images/star0.png")}
                    alt='star0'
                    />
            </div>
        </div>
        <div className='cam-right'>
            <div className='wrapper'>
                <p className='player-detail-right'>Natasha Romanoff</p>
                <img className='stars'
                    src={require("../../images/star0.png")}
                    alt='star0'
                />
                <img
                    className='profile-right'
                    src={require("../..//images/user-profile2-example.jpg")}
                    alt="profile-right"
                />
            </div>
        </div>
    </div>

    )
    }