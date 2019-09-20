import React from 'react';
import {AppRegistry, asset, Model, Pano, PointLight, Text, View,AmbientLight,VrButton,StyleSheet,} from 'react-360';

import { Surface } from "react-360-web";

const mapIncremental:Number = 10;
const floorLevel:Number = -5;

export default class MapManager extends React.Component {

	
  constructor() {
    super();	
  }
  
  componentDidMount() { 
	console.log("Scene Mounted!");
  }

  componentWillUnmount() {
	  /*
    if (this.frameHandle) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = null;
    }*/
  }
  
  
	getTile(aX,aY,aZ,tileType)
	{
		modelName = 'calle5x5';
		if (tileType === 2 )
		{
			modelName = 'vereda5x5';
		} else if (tileType === 3 )
		{
			modelName = 'edificio5x5';
		} 		
		return (	
			<Model
			  style={{
				transform: [
				  {translate: [aX, aY, aZ]},
				  {scale: 1.0},				  
				],
			  }}
			  source={{
				obj: asset(modelName+'.obj'),
				mtl: asset(modelName+'.mtl'),
			  }}
			  lit={true}
			/>			
		);		
	}	
  
	getComponentWithArray(element, index,rowNumber) 
	{
		//console.log(index);
		return (
		
			this.getTile(rowNumber,floorLevel,-index*mapIncremental,element)		
		);	
	}
	
	getComponentFromRow(myArray, indexRow) 
	{
		//console.log(index);
		return (
		
			myArray.map((item,indexColumn)=>this.getComponentWithArray(item,indexColumn,indexRow*mapIncremental))	
		);	
	}
  
  render ()
  {	  
	return (
		<View>	
			{this.props.currentMap.map((row,indexR)=>this.getComponentFromRow(row,indexR))}
      </View>
	);
  }


  
}
