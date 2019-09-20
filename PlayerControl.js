//PlayerControl

import * as React from 'react';
import {StyleSheet, Text, View, VrButton,} from 'react-360';

import LuchoCameraController from './LuchoCameraController'

import { nextCrypto } from './RootGameObject';
import { connectedEvent } from './RootGameObject';

// Extract our custom native module

const df = 1.5;

/**
 * Render a description of the currently-selected model.
 * Connected to the global store to receive inputs.
 */
export default class PlayerControl extends React.Component
{	

	
	titleCount:Number;
	
	_prevPhoto = () => {
			//debugger;

			//this.cameraController.setCameraDx(0.1);
			nextCrypto(1);
			
			this.titleCount = 0;
			
	};	
	
	componentDidMount() 
	{
		//debugger;
		//ConnectedRootGameObject(this);
		//this.SetRootGo(window.RootGo);

		console.log("PlayerControl Mounted");
		
		/*BrowserInfo.getBatteryLevel(level => {
			this.setState({batteryLevel: level});
		});
		*/
		//BrowserInfo.setUpdateCallback(ms=>{this.updateUI(ms);});
	}
  
	componentDidUpdate(prevProps)
	{
		/*if (prevProps.crypto !== this.props.crypto) {
		  this.fetchCryptoData(this.props.crypto);
		}*/
		//debugger;
	}
	
	incrementTitle()
	{
		//debugger;
		this.titleCount++;
		// Set the window title to reflect the latest count		
	}
	
	moveCameraNegativeX()
	{
			connectedEvent("PlayerForwardEvent");
	}
	
	moveCameraPositiveX()
	{		

		connectedEvent("PlayerBackwardEvent");		
	}
	
	moveCameraNegativeZ()
	{		

		connectedEvent("PlayerRightEvent");		
	}
	
	moveCameraPositiveZ()
	{		
	
		connectedEvent("PlayerLeftEvent");		
	}
	
	updateUI(ms:Number)	
	{
		console.log("PlayerContrl updateUI " + ms);
	}
	
	render()
	{    
		if (!this.props.showLevel)
		  {
			  return (
			<View>
			</View>
			);
		  }
		return (
		  <View style={{
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			height: 600,
			width: 600,
		  }} >
			<View>
				<Text style={styles.title}>{'Controls:'}</Text>
			</View>
			<View style={styles.controls}>
			  <VrButton onClick={this.moveCameraNegativeX} style={styles.button}>
				<Text style={styles.buttonText}>{'<'}</Text>
			  </VrButton>			  
			  <VrButton onClick={this.moveCameraPositiveX} style={styles.button}>
				<Text style={styles.buttonText}>{'>'}</Text>
			  </VrButton>
			  <VrButton onClick={this.moveCameraPositiveZ} style={styles.button}>
				<Text style={styles.buttonText}>{'U'}</Text>
			  </VrButton>			  
			  <VrButton onClick={this.moveCameraNegativeZ} style={styles.button}>
				<Text style={styles.buttonText}>{'D'}</Text>
			  </VrButton>
			  
		  
			</View>
		  </View>
		);
	}
}

const styles = StyleSheet.create({  
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 450,
    padding: 10,
  },
  title: {
    color: '#ffffff',
    textAlign: 'left',
    fontSize: 36,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#c0c0d0',
    borderRadius: 5,
    width: 80,
    height: 44,
  },
  buttonText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 30,
    fontWeight: 'bold',
  },
});