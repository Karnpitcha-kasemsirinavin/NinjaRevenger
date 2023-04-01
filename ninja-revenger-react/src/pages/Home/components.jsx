import React from 'react'
import './style.css'
import bg1 from "../../images/background-nolight.png"

export const BigScreen = () => {
	return (
		<div className='container'>
			<img 
				className='bg-1'
				src={bg1}
				alt="bg-1"
			/>
			<img
				className='lightning-big'
				src={require("../../images/Group 3.png")}
				alt="lighning-b"
			/>
			<img
				className='lightning-small center'
				src={require('../../images/light_small.png')}
				alt="lightning"
			/>
			<img
				className='ninja-menu'
				src={require("../../images/ninja-1.png")}
				alt="ninja1"
			/>
			<img
				className='smoke-grd'
				src={require("../../images/smoke_ground.png")}
				alt="smoke-grd"
			/>
			<img
				className='game-title'
				src={require("../../images/ninja-title.png")}
				alt="title"
			/>
			<div className='button-container'>
				<button class="start-bt1">Play with Friend</button>
				<button class="start-bt2" onClick={toMain}>Play with Stranger</button>
				<button class="exit-bt1">Exit</button>
			</div>
		</div>
	)
}
