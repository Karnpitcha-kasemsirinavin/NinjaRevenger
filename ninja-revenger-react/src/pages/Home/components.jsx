import React, { useState, useContext, useEffect } from 'react';
import Button from '../../Components/Button/index.jsx';
import '../Home/style.css';
import bg1 from "../../images/background-nolight.png";
import { useNavigate, useLocation } from "react-router-dom";
import { SocketContext } from "../../Context/SocketThing";
import BlackScreenAnimation from '../loading/index.jsx';

export const Home = () => {

	const { userId } = useContext(SocketContext);
	const [ready, setReady] = useState(false)

	// TODO: have time change to connecting animaton
	useEffect(() => {
		if (userId !== '') {
			setReady(true)
		}
	}, [userId])

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
			{ready === true && <div className='button-container'>			
				<Button name='Play with Friend' type="friend" create={true}/>
				<Button name='Play with Stranger' type="stranger" create={true}/>
				<Button name='Test Camera' type="test-cam" create={false}/>
			</div>}
		</div>
	)
}