//PlayerControl

import * as React from 'react';
import {StyleSheet, Text, VrButton,} from 'react-360';
import {AppRegistry, asset, Model, Pano, PointLight, View,AmbientLight, Image, Background} from 'react-360';

import {NativeModules} from 'react-360';

const BrowserInfo = NativeModules.BrowserInfo;
import { rootShowLevel } from './RootGameObject';


export default class MenuComponent extends React.Component
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
		
	}
  
	componentDidUpdate(prevProps)
	{
		
	}
	
	loadLevel()
	{
		console.log("Load level!");
		rootShowLevel();
	}
	
	render()
	{    
		if (this.props.showLevel)
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
			height: 400,
			width: 600,
		  }} >
			<Image source={asset('tankMenu.png')} style={styles.switchEnvironment}/>
			<View>
				<Text style={styles.title}>{'Welcome to Battle360!'}</Text>				
				<View style={styles.controls}>
				  <VrButton onClick={this.loadLevel} style={styles.button}>
					<Text style={styles.buttonText}>{'Press here to START...'}</Text>
				  </VrButton>		  
				</View>
			</View>		
			
		  </View>
		);
	}
}

const styles = StyleSheet.create({
	switchEnvironment: {
	  height: 240, 
	  width: 320
	},
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 200,
    padding: 10,
  },
  title: {
    color: '#ffffff',
    textAlign: 'left',
    fontSize: 64,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#00c000',
    borderRadius: 5,
    width: 250,
    height: 100,
	padding: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 30,
    fontWeight: 'bold',
  },
});