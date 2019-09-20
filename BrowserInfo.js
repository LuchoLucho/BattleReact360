/**
 * The examples provided by Oculus are for non-commercial testing and
 * evaluation purposes only.
 *
 * Oculus reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * OCULUS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import * as THREE from 'three';
import {Module} from 'react-360-web';

// Native Modules subclass `Module` from the npm package.
//
// This example module will demonstrate how to expose constants, methods,
// methods with callbacks, and methods that return Promises.

import {ReactInstance} from 'react-360-web';

import LuchoCameraController from './LuchoCameraController';
import { Surface } from "react-360-web";
import {SurfaceManager} from "react-360-web";

const EPSILON: Number = 0.0001;

export default class BrowserInfo extends Module {
	
	myReact:ReactInstance;
	myCameraController:LuchoCameraController;
	myControlPanel: Surface;
	
	playerRotY:Number;
	
		
  constructor() {
    // Pass the module's name to the superclass constructor
    // On the React side, this module will be available at
    // `NativeModules.BrowserInfo`
    super('BrowserInfo');

    // Expose constant values
    this.userAgent = navigator.userAgent;
	this.controlRotY = 0;
	this.controlRotX = 0;
	this.playerRotY = 180;
  }

  // To trigger events or method calls on the React side, we need a reference
  // to our application's React Native Context.
  // This information is not available until the vr instance has been created,
  // so we need to pass it to our native module after the fact.
  _setRNContext(rnctx) {
    this._rnctx = rnctx;
  }
  
  _setNewReactInstance(newRInstance)
  {
	 this.myReact = newRInstance;
  }
  
  _setCamController(newCamController)
  {
	 this.myCameraController = newCamController;
  }
  
  _setControlPanel(newPanel)
  {
	 this.myControlPanel = newPanel;
  }

  // Class methods can be called from the React side

  // Some methods require no feedback when they are done.
  // These are the simplest to implement.
  //
  // This method takes a string, and sets the browser's title bar to that value
  setTitle(title) {
    document.title = title;
  }

  // Some methods trigger a callback method on the React side when complete.
  // When the method is called from React, it passes a callback identifier as
  // an argument. This can be used to trigger the callback on the React side.
  // Note: a callback can only be called once. Triggering it more than once will
  // throw an exception.
  //
  // This method attempts to get the battery level via a browser API, and sends
  // it back to the callback when ready.
  getBatteryLevel(cb) {
    const getBattery = navigator.mozGetBattery || navigator.getBattery;
    getBattery
      .call(navigator)
      .then(
        battery => {
          // extract the level and return it
          return battery.level;
        },
        e => {
          // if an error occurs, return null
          return null;
        }
      )
      .then(level => {
        if (this._rnctx) {
          // trigger the callback
          // the first argument is the callback identifier,
          // the second is an array of arguments
          this._rnctx.invokeCallback(cb, [level]);
        }
      });
  }

  // Methods prefixed with a $ return a Promise on the React side.
  // Here in the native module, the last two arguments are callback identifiers
  // to resolve or reject that Promise.
  //
  // This method creates an annoying confirmation dialog that will resolve the
  // Promise if you accept it, and reject it if you cancel the dialog.
  // It is available at `NativeModules.BrowserInfo.getConfirmation()`
  $getConfirmation(message, resolve, reject) {
    const result = window.confirm(message);
    if (this._rnctx) {
      if (result) {
        this._rnctx.invokeCallback(resolve, []);
      } else {
        // When rejecting a Promise, a message should be provided to populate
        // the Error object on the React side
        this._rnctx.invokeCallback(reject, [{message: 'Canceled the dialog'}]);
      }
    }
  }
  
  
  connectedPlayerUpdatePosition(aX,aY,aZ,newPlayerRotY)
  {	  	
	return;
	var rotYCamDiff:Number = newPlayerRotY-this.playerRotY;
	var rotYCamDiffRad:Number = Math.PI*rotYCamDiff/180;
	this.playerRotY = newPlayerRotY;
	console.log("BrowserInfo connectedPlayerUpdatePosition " + aX + ", " + aY + ", " + aZ + " PlayerRotY = "+ newPlayerRotY + " , RotYCamDiff: " + rotYCamDiff);
	if (Math.abs(this.playerRotY-180) < EPSILON)
	{		
		this.myCameraController.moveCamera(aX,-2,aZ+4,Math.PI*newPlayerRotY/180,rotYCamDiffRad); //Camera should be a little away from player!!!	
	} else if (Math.abs(this.playerRotY-270) < EPSILON)
	{		
		this.myCameraController.moveCamera(aX+4,-2,aZ+0,Math.PI*newPlayerRotY/180,rotYCamDiffRad); //Camera should be a little away from player!!!	
	} else if (Math.abs(this.playerRotY-0) < EPSILON)
	{		
		this.myCameraController.moveCamera(aX,-2,aZ-4,Math.PI*newPlayerRotY/180,rotYCamDiffRad); //Camera should be a little away from player!!!	
	}
	else if (Math.abs(this.playerRotY-90) < EPSILON)
	{		
		this.myCameraController.moveCamera(aX-4,-2,aZ+0,Math.PI*newPlayerRotY/180,rotYCamDiffRad); //Camera should be a little away from player!!!	
	}
  }
  
  cameraNotify(camPos: Vec3, camRot: Array)
  {
	  if (!this.myControlPanel)//We are in the welcome screen
	  {
		  return;
	  }
	  //Amazing! it worked! the control actually should be updated ONLY ONCE the camera actually moved! 
	
		var quaternion = new THREE.Quaternion(camRot[0],camRot[1],camRot[2],camRot[3]);
		var vector = new THREE.Vector3( 0, 0, -2);
		vector.applyQuaternion( quaternion );
		var vZ = new THREE.Vector3( 0, 0, 1);
		var vectorToXZ = new THREE.Vector3( vector.x, 0, vector.z);
		var angleVxz = vectorToXZ.angleTo(vZ);
		//----
		if (vector.x<0)
		{
			angleVxz = 2*Math.PI-angleVxz;
		}
		this.myControlPanel._mesh.position.y = -3;		
		if ((angleVxz<Math.PI/4 )||(angleVxz>=(7*Math.PI/4 + Math.PI/8)) )
		{
			//console.log("Controls at 12!");
			this.myControlPanel._mesh.position.x = camPos[0];
			this.myControlPanel._mesh.position.z = camPos[2] + 3;
			this.myControlPanel._mesh.rotateY(this.controlRotY-(Math.PI));
			this.controlRotY = Math.PI;
		} else if (angleVxz>=Math.PI/4 && angleVxz<Math.PI/2)
		{
			//console.log("Controls at 10");
			this.myControlPanel._mesh.position.x = camPos[0]+2;
			this.myControlPanel._mesh.position.z = camPos[2]+2;
			this.myControlPanel._mesh.rotateY(this.controlRotY-(-Math.PI/4+Math.PI));
			this.controlRotY = -Math.PI/4+Math.PI;
		} else if (angleVxz>=Math.PI/2 && angleVxz<Math.PI/2+Math.PI/4)
		{
			//console.log("Controls at 9!");
			this.myControlPanel._mesh.position.x = camPos[0]+3;
			this.myControlPanel._mesh.position.z = camPos[2]+0;
			this.myControlPanel._mesh.rotateY(this.controlRotY-Math.PI/2);
			this.controlRotY = Math.PI/2;
		} else if (angleVxz>=Math.PI/2+Math.PI/4 && angleVxz<Math.PI)
		{
			//console.log("Controls at 7!");
			this.myControlPanel._mesh.position.x = camPos[0]+2;
			this.myControlPanel._mesh.position.z = camPos[2]-2;
			this.myControlPanel._mesh.rotateY(this.controlRotY-(Math.PI/4));
			this.controlRotY = Math.PI/4;
		} else if (angleVxz>=Math.PI && angleVxz<Math.PI+Math.PI/4)
		{
			//console.log("Controls at 6!");
			this.myControlPanel._mesh.position.x = camPos[0]+0;
			this.myControlPanel._mesh.position.z = camPos[2]-3;
			this.myControlPanel._mesh.rotateY(this.controlRotY-(0));
			this.controlRotY = 0;
		} else if (angleVxz>=Math.PI+Math.PI/4 && angleVxz<Math.PI+Math.PI/2)
		{
			//console.log("Controls at 4!");
			this.myControlPanel._mesh.position.x = camPos[0]-2;
			this.myControlPanel._mesh.position.z = camPos[2]-2;
			this.myControlPanel._mesh.rotateY(this.controlRotY-(-Math.PI/4));
			this.controlRotY = -Math.PI/4;
		} else if (angleVxz>=Math.PI+Math.PI/2 && angleVxz<7*Math.PI/4)
		{
			//console.log("Controls at 3!");
			this.myControlPanel._mesh.position.x = camPos[0]-3;
			this.myControlPanel._mesh.position.z = camPos[2]+0;
			this.myControlPanel._mesh.rotateY(this.controlRotY-(-Math.PI/2));
			this.controlRotY = -Math.PI/2;
		} else if (angleVxz>=7*Math.PI/4 && angleVxz<2*Math.PI)
		{
			//console.log("Controls at 2!");
			this.myControlPanel._mesh.position.x = camPos[0]-2;
			this.myControlPanel._mesh.position.z = camPos[2]+2;
			this.myControlPanel._mesh.rotateY(this.controlRotY-(-3*Math.PI/4));
			this.controlRotY = -3*Math.PI/4;
		}
  }
  
  cameraNotify1(camPos: Vec3, camRot: Array)
  {
	  //Amazing! it worked! the control actually should be updated ONLY ONCE the camera actually moved!
	  //vectorLooking = [1,0,0];
	  
	  console.log("rotation quaternion: " + camRot);
	  
		var quaternion = new THREE.Quaternion(camRot[0],camRot[1],camRot[2],camRot[3]);
		//quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
		//console.log("example quaternion: " + quaternion);

		var vector = new THREE.Vector3( 0, 0, -2);
		console.log("Vector previous: " + vector.x + ", " + vector.y + ", " + vector.z);
		vector.applyQuaternion( quaternion );
		console.log("Vector post: " + vector.x + ", " + vector.y + ", " + vector.z);
	  //debugger;
		var controlPositionVec = new THREE.Vector3( 0, 0, -2);
		this.myControlPanel._mesh.getWorldPosition(controlPositionVec);
		console.log("control panel pos: " + controlPositionVec.x + ", " + controlPositionVec.y + ", " + controlPositionVec.z);
		var dx = (vector.x - controlPositionVec.x);
		var dy = (vector.y - controlPositionVec.y);
		var dz = (vector.z - controlPositionVec.z);
	  //debugger;
		this.myControlPanel._mesh.translateX(dx);
		this.myControlPanel._mesh.translateY(dy);
		this.myControlPanel._mesh.translateZ(dz);
		
		console.log("dx : "+(dx));
		console.log("dy : "+(dy));
		console.log("dz : "+(dz));
		
		//Rotation of the plane:
		var vZ = new THREE.Vector3( 0, 0, 1);
		var vectorToXZ = new THREE.Vector3( vector.x, 0, vector.z);
		var vectorToYZ = new THREE.Vector3( 0, vector.y, vector.z);
		var angleVxz = vectorToXZ.angleTo(vZ);
		var angleVyz = vectorToYZ.angleTo(vZ);
		console.log("angle between vector and vxz : "+angleVxz);
		console.log("angle between vector and vtz : "+angleVyz);
		console.log("ROTATE Y : "+(angleVxz-this.controlRotY));
		//debugger;
		
		this.myControlPanel._mesh.rotateY(angleVxz-this.controlRotY);
		this.myControlPanel._mesh.rotateX(angleVyz-this.controlRotX);
		
		//this.myControlPanel._mesh.rotateX(angleVyz-this.controlRotX);
		this.controlRotY = angleVxz;
		this.controlRotX = angleVyz;
		
		
		//this.myControlPanel._mesh.lookAt (new THREE.Vector3(camPos[0],camPos[1],camPos[2]));
		
		
	 
  } 
  
  updateUI(ms:Number)
  {
	  /*console.log("BrowserInfo update UI");
	  if (this.aCallBackUpdater)
	  {
		  //debugger;
		  this._rnctx.invokeCallback(this.aCallBackUpdater, 123);
		  //this.aCallBackUpdater.updateUI(ms);
	  }*/
  }	
}