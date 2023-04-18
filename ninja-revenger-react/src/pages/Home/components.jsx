import React from 'react';
import Button from '../../Components/Button/index.jsx';
import './style.css';
import bg1 from "../../images/background-nolight.png";

export const Home = () => {
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
				<Button name='Play with Friend' type="friend"/>
				<Button name='Play with Stranger' type="stranger"/>
				<Button name='Exit'/>
			</div>
		</div>
	)
}