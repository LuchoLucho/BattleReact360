import React from 'react';
import {AppRegistry, asset, Model, Pano, PointLight, Text, View,AmbientLight,VrButton,StyleSheet,Animated,} from 'react-360';


import { connectedEvent } from './RootGameObject';
import { connectedPlayerUpdatePosition } from './RootGameObject';



const mapIncremental:Number = 10;
const floorLevel:Number = -5;

export default class Player extends React.Component {

	rotation = new Animated.Value(0);
	
  constructor() {
    super();
	this.lastUpdate = Date.now();
	this.LocalUpdateUI = this.LocalUpdateUI.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.props.current) {
      this.rotation.setValue(0);
      Animated.timing(this.rotation, {toValue: 360, duration: 20000}).start();
    }
  }
  
  LocalUpdateUI()
  {
	const now = Date.now();
    const delta = now - this.lastUpdate;
    this.lastUpdate = now;

	if (this.props.latestEvent.length>0)
	{
		console.log("Player new props Event = " + this.props.latestEvent);
		this.handlePlayerEvent(this.props.latestEvent);		
		connectedEvent("");			
	}
    this.frameHandle = requestAnimationFrame(this.LocalUpdateUI);
  }
  
  componentDidMount() { 
	console.log("Player Mounted!");
	connectedPlayerUpdatePosition(this.props.playerX,this.props.playerY,this.props.playerZ,this.props.playerRotationY);
	this.LocalUpdateUI();
  }
  
  componentDidUpdate(prevProps)
	{
		if (this.props.latestEvent.length>0)
		{
			console.log("Player new props Event = " + this.props.latestEvent);
		}
		if (!prevProps.showLevel && this.props.showLevel)//I need to force this event after the Loading screen!
		{
			this.handlePlayerEvent('PlayerLeftEvent');
		}
	}
	
	handlePlayerEvent(playerEvent)
	{
		var dx:Number = 0;
		var dz:Number = 0;
		switch (this.props.playerRotationY)
		{
			case 180:
				dx = 0;
				dz = -mapIncremental;
			break;
			case 0:
				dx = 0;
				dz = +mapIncremental;
			break;
			case 90:
				dx = +mapIncremental;
				dz = 0;
			break;
			case 270:
				dx = -mapIncremental;
				dz = 0;
			break;
		}
		if (playerEvent == 'PlayerForwardEvent')
		{
			//newPlayerX = this.props.playerX-5.0;
			//newPlayerZ = this.props.playerZ+0.0;
			connectedPlayerUpdatePosition(this.props.playerX,this.props.playerY,this.props.playerZ,/*270*/this.props.playerRotationY+90);				
		} else if (playerEvent == 'PlayerBackwardEvent')
		{
			//newPlayerX = this.props.playerX+0.0;
			//newPlayerZ = this.props.playerZ-5.0;			
			connectedPlayerUpdatePosition(this.props.playerX,this.props.playerY,this.props.playerZ,/*180*/this.props.playerRotationY-90);		
		} else if (playerEvent == 'PlayerRightEvent')
		{
			newPlayerX = this.props.playerX-dx;
			newPlayerZ = this.props.playerZ-dz;			
			connectedPlayerUpdatePosition(newPlayerX,this.props.playerY,newPlayerZ,this.props.playerRotationY);
		} else if (playerEvent == 'PlayerLeftEvent')
		{
			newPlayerX = this.props.playerX+dx;
			newPlayerZ = this.props.playerZ+dz;			
			connectedPlayerUpdatePosition(newPlayerX,this.props.playerY,newPlayerZ,this.props.playerRotationY);
		}
	}
  
  render ()
  {	  
	  if (!this.props.showLevel)
	  {
		  return (
		<View>
		</View>
		);
	  }
	return (
		<View
			style={{
				transform: [
					{translate: [this.props.playerX, this.props.playerY, this.props.playerZ]},
					{scale: 1.0},				  
				],
			  }}
		  >
			<Model
				style={{transform: [{rotateY: this.props.playerRotationY}]}}
			  source={{
				obj: asset('Tank5x5.obj'),
				mtl: asset('Tank5x5.mtl'),
			  }}
			  lit={true}
			/>
      </View>
	);
  }
}