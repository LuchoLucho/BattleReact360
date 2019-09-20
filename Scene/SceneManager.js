import React from 'react';
import {AppRegistry, asset, Model, Pano, PointLight, Text, View,AmbientLight,VrButton,StyleSheet,} from 'react-360';

import MapManager from './MapManager';
import Player from '../Player';

import { Surface } from "react-360-web";

export default class SceneManager extends React.Component {	
	
	
  constructor() {
    super();
	this.floorLevel = -5;
  }
  
  componentDidMount() {	 
	//console.log(ConnectedRootGameObject.GetMainCameraController());
  }

  componentWillUnmount() {
	  /*
    if (this.frameHandle) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = null;
    }*/
  }  
  
  componentDidUpdate(prevProps)
	{
		/*if (prevProps.crypto !== this.props.crypto) {
		  this.fetchCryptoData(this.props.crypto);
		}*/
		//debugger;
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
		<View>
			<MapManager floorLevel={this.floorLevel} currentMap={this.props.currentMap}/>
			
			<AmbientLight intensity={ 0.25 } />
			
			<PointLight style={
				{
					color: 'yellow', transform: [{translate: [0, 400, 700]}],
				}
			} />
			
			<PointLight style={
				{
					color: 'red', transform: [{translate: [0, 50, 20]}],
				}
			} />
			
		</View>
	);
  }


  
}
