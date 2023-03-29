import React from 'react'
import './style.css'

export const BigScreen = () => {
    return (
        <div className="big-screen">
            <div className='Ninja-Revengers'>
                <div className='menu container'>
                    <div className='bg-1'>
                    <img className='lightning-big' src={require("./pic/smoke_ground.png")} alt="lighning-b" />
                    <img className='lightning-small center'src={require('./pic/light_small.png')} alt="lightning" />
                    <img className='ninja-menu' src={require("./pic/ninja-1.png")} alt="ninja1" />
                    <img className='smoke-grd' src={require("./pic/smoke_ground.png")} alt="smoke-grd" />
                    <img className='game-title' src={require("./pic/ninja-title.png")} alt="title" />
                    <button class="start-bt1">start</button>
                    <button class="exit-bt1">start</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
