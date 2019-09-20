import * as THREE from 'three';

import {ReactInstance,Location, Math as VRMath} from 'react-360-web';

//import RootGameObject from './RootGameObject'; 

import { Surface } from "react-360-web";
import { React360Event } from "react-360-web";

import BrowserInfo from './BrowserInfo.js';

import {SurfaceManager} from "react-360-web";

import {type Quaternion, type Vec3} from 'react-360-web';

import LuchoCameraController from './LuchoCameraController';

import DeviceOrientationCameraController from 'react-360-web';



function init(bundle, parent, options = {}) {
		
		//debugger;
	const browserInfo = new BrowserInfo();
	
	const r360 = new ReactInstance(bundle, parent, {
		fullScreen: true,
		frame: (ms)=> {
			//console.log(ms);
			//debugger;
			browserInfo.updateUI(ms);
		},
		nativeModules: [browserInfo],
		...options,
	  });
	  
	  
	const myCamaraController = new LuchoCameraController (r360._eventLayer,[30,50,30],[0,-1,0,0],browserInfo);
	
	//const myCamaraController = new LuchoCameraController (r360._eventLayer,[0,0,-2],[0,0,0,1],browserInfo);
	
	//debugger;
	const deviceController = r360.controls.getCameraControllers()[0];//This is the DeviceOrientationCameraController
	const mouseController = r360.controls.getCameraControllers()[1];//This is the MouseController

	
	//I had to add childControllers since my controller in a device was not running.
	//Since device controller is the first in the array and it's continuesly throwing events, the rest in the list never get attention
	//because the controller goes one by one BUT if one has data IGNORES the resT!
	myCamaraController.addChildController(deviceController);
	myCamaraController.addChildController(mouseController);
	
	r360.controls.cameraControllers = [];
	
	r360.controls.addCameraController(myCamaraController);	

	browserInfo._setRNContext(r360.runtime.context);
	browserInfo._setNewReactInstance(r360);
	browserInfo._setCamController(myCamaraController);
	
	//Welcome screen!
	const menuPanel = new Surface(800, 600, Surface.SurfaceShape.Flat);
	  menuPanel.setAngle(0, 0);	  
	  r360.renderToSurface(
		r360.createRoot('ConnectedMenuComponent'),
		menuPanel,	  );		
	  
	  
	
	 
	  // Create three roots: two flat panels on the left and the right, and a Location
	  // to mount rendered models in 3D space
	 const leftPanel = new Surface(800, 600, Surface.SurfaceShape.Flat);
	  leftPanel.setAngle(0, 0);	  
	  r360.renderToSurface(
		r360.createRoot('ConnectedPlayerControl'),
		leftPanel,	  );		
	  
	  browserInfo._setControlPanel(leftPanel);
	  
	  r360.renderToLocation(
		r360.createRoot('ConnectedSceneManager'),
		new Location([0,0,0]),
	  );
	  
	  const rootViewPlayer = r360.createRoot('ConnectedPlayer');
	  r360.renderToLocation(rootViewPlayer,
		new Location([0,0,0]),
	  );
	  
	  r360.compositor.setBackground('./static_assets/360_world.jpg');
	  
}

window.React360 = {init};


