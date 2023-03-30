import React from 'react'
import './style.css'

export const MainGame = () => {
	return (
        <div className='container'>
            <div className='cam left'>
                <img
                    className='profile left'
                    src={require("../../images/user-profile-example.png")}
                    alt="profile-left"
				/>
            </div>
            <div className='cam right'>
                
            </div>
            
        </div>
    )
    }