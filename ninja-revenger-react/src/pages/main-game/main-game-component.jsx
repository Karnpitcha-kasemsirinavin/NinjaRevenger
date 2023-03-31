import React from 'react'
import './style.css'

export const MainGame = () => {
	return (
    <div className='container'>
        <div className='cam-left'>
            <div className='profile-con'>
                <img
                    className='profile-left'
                    src={require("../../images/user-profile-example.png")}
                    alt="profile-left"
                />
            </div>
            <div className='player-detail'>
                <p>Natasha Romanoff</p>
            </div>
        </div>
        <div className='cam-right'>
            <img
                className='profile-right'
                src={require("../..//images/user-profile2-example.jpg")}
                alt="profile-right"
            />
            
        </div>
    </div>

    )
    }