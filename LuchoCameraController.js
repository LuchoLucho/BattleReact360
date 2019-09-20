/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

import {type Quaternion, type Vec3} from 'react-360-web';
import {type CameraController} from 'react-360-web';
import * as THREE from 'three';

const DEFAULT_FOV = Math.PI / 6;	
const HALF_PI = Math.PI / 2;

const State = {
  cameraDx: 0,  
};


function quaternionMultiply(a: Quaternion, b: Quaternion) {
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const aw = a[3];
  const bx = b[0];
  const by = b[1];
  const bz = b[2];
  const bw = b[3];

  a[0] = ax * bw + aw * bx + ay * bz - az * by;
  a[1] = ay * bw + aw * by + az * bx - ax * bz;
  a[2] = az * bw + aw * bz + ax * by - ay * bx;
  a[3] = aw * bw - ax * bx - ay * by - az * bz;
}

function rotateQuaternionOnYAxis(toRotate: Quaternion,angleRotY:Number)
{
  var quaternion = new THREE.Quaternion();
	quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), angleRotY );
	quaternionMultiply(toRotate, [quaternion.x,quaternion.y,quaternion.z,quaternion.w]);//[0,0,1,0]:RotZ
}

function rotateQuaternionInXZPlane(toRotate: Quaternion,angleRotY:Number)
{
	debugger;
	/*var quaternion = new THREE.Quaternion(toRotate[0],toRotate[1],toRotate[2],toRotate[3]);
	var vector = new THREE.Vector3( 0, 0, -1);
	vector.applyQuaternion( quaternion );
	var vx = vector.x;
	var vz = vector.z;
	var v2d = new THREE.Vector2( vx, vz );
	var angleXZ = v2d.angle();
	while (angleXZ>2*Math.PI)
	{
		angleXZ-=2*Math.PI;
	}
	angleXZ += angleRotY+Math.PI/2;
	var module = v2d.length();
	vx = module*Math.cos(angleXZ);
	vz = module*Math.sin(angleXZ);
	var vectorWithRotation = new THREE.Vector3( vx, vector.y, vz);
	var vectorCross = new THREE.Vector3( 0, 0, 1);
	vectorCross = vectorCross.cross(vector,vectorWithRotation);
	var vW = Math.sqrt(vector.length()*vector.length() * vectorWithRotation.length()*vectorWithRotation.length()) + vector.dot(vectorWithRotation);
	quaternion = new THREE.Quaternion(vectorCross.x,vectorCross.y,vectorCross.z,vW);
	quaternion.normalize();
	toRotate = [quaternion.x, quaternion.y, quaternion.z, quaternion.w];
	*/
	// RotationAngle is in radians
	var RotationAxis = new THREE.Vector3( 0, 1, 0);
	var x = RotationAxis.x * Math.sin(angleRotY / 2);
	var y = RotationAxis.y * Math.sin(angleRotY / 2);
	var z = RotationAxis.z * Math.sin(angleRotY / 2);
	var w = Math.cos(angleRotY / 2);
	toRotate = [x,y,z,w];
}

export default class LuchoCameraController implements CameraController {
  _deltaYaw: number;
  _deltaPitch: number;
  
  _frame: HTMLElement;
  _lastX: number;
  _lastY: number;
  _verticalFov: number;
  
  newX:Number;
  newY:Number;
  newZ:Number;
  rotY:Number;
  rotDy:Number;
  
  
  lastPosition: Vec3;
  lastRotation: Quaternion;
  
  childCameraControllers: Array<CameraController>;

  constructor(frame: HTMLElement, initialPosition: Vec3,initialQuaternion: Quaternion, newObserver) {
	  
    this._deltaYaw = 0;
    this._deltaPitch = 0;

    this._frame = frame;
    this._lastX = 0;
    this._lastY = 0;
    this._verticalFov = DEFAULT_FOV;//fov;

    (this: any)._onWheel = this._onWheel.bind(this);
    //this._frame.addEventListener('wheel', this._onWheel);
	State.cameraDx = 0.1;
	this.newX=0;
	this.newY=0;
	this.newZ=0;
	this.rotY=0;
	this.rotDy=0;
	this.initialPosition = initialPosition;
	this.initialQuaternion = initialQuaternion;
	this.initialValuesWereSet = false;
	this.cameraObserver = newObserver;
	this.lastRotation = [0,0,0,0];
	this.childCameraControllers = [];
  }
  
  addChildController(newChild:CameraController)
  {
	  this.childCameraControllers.push(newChild);
  }
      

  _onWheel(e: WheelEvent) {
    
    const width = this._frame.clientWidth;
    const height = this._frame.clientHeight;
    const aspect = width / height;
    const deltaX = e.deltaX;
    const deltaY = e.deltaY;
    this._deltaPitch += deltaX / width * this._verticalFov * aspect;
    this._deltaYaw += deltaY / height * this._verticalFov;
    this._deltaYaw = Math.max(-HALF_PI, Math.min(HALF_PI, this._deltaYaw));
    e.preventDefault();
  }  

  fillCameraProperties(position: Vec3, rotation: Quaternion): boolean
  {  
	  if (!this.initialValuesWereSet)
	  {
		  position[0]=this.initialPosition[0];
		  position[1]=this.initialPosition[1];
		  position[2]=this.initialPosition[2];		  
		  //----
		  rotation[0]=this.initialQuaternion[0];
		  rotation[1]=this.initialQuaternion[1];
		  rotation[2]=this.initialQuaternion[2];
		  rotation[3]=this.initialQuaternion[3];
		  this.initialValuesWereSet = true;
		  return true;
	  }
	  for (let i = 0; i < this.childCameraControllers.length; i++)
	  {
		  const controller = this.childCameraControllers[i];		  
		  controller.fillCameraProperties(position,rotation);		
	  }
	  //debugger;
	  if (this.lastRotation[0]!=rotation[0] || this.lastRotation[1]!=rotation[1] || this.lastRotation[2]!=rotation[2] || this.lastRotation[3]!=rotation[3])
	  {
		  this.lastRotation[0] = rotation[0];
		  this.lastRotation[1] = rotation[1];
		  this.lastRotation[2] = rotation[2];
		  this.lastRotation[3] = rotation[3];
		  //bugger;
		  if (this.cameraObserver != null)
			{
				//debugger;
				this.cameraObserver.cameraNotify(position,rotation);
			}	
		  
	  }
	  
	  if (!State.enabled)
	  {
		  return false;
	  }
	  
	  State.enabled = false;
	/*rotation[0] = 0;
    rotation[1] = 0;
    rotation[2] = 1;
    rotation[3] = 0;*/	
	console.log("To Cam rot Absolute: "+this.rotY+" To Cam rotDy: " + this.rotDy);	
	rotateQuaternionOnYAxis(rotation,this.rotDy);//The POTATO of rotatation!	
	//rotateQuaternionInXZPlane(rotation,this.rotY);//The POTATO of rotatation!		
	//----	 
	this.childCameraControllers[0]._offsetYaw += this.rotDy; //<<<<<<<<<<<<<<<<<<<<<<<<< Important Bug Fix, Now DeviceController rotates as I want!!!
	this.rotDy = 0;
	
	console.log("Rotation Quaternion: " + rotation);
	
	position[0] = this.newX;//State.cameraDx;
    position[1] = this.newY;//this._deltaYaw*100;
    position[2] = this.newZ;//this._deltaYaw*100;	

	console.log("Camera position: " + position);
	//State.enabled = false;
	this.lastPosition=position;
	//debugger;
	if (this.cameraObserver != null)
	{
		//debugger;
		this.cameraObserver.cameraNotify(position,rotation);
	}	
	  
    return true;
  }  
  
  moveCamera(aX,aY,aZ,rotYRad,rotDyRad)
  {
	  //debugger;
	this.newX=aX;
	this.newY=aY;
	this.newZ=aZ;
	//debugger;
	this.rotY=rotYRad; //The differential of the current angle to apply
	this.rotDy = rotDyRad;
	  State.enabled = true;
	  //State.cameraDx = newCameraDx;
	  //State.enabled = true;
	  //enable();
	  console.log('LuchoCameraController ' + this.lastPosition + " newX = " + this.newX + " - newY = " + this.newY + " - newZ = " + this.newZ + " RotY: " + this.rotY);
		//return this.lastPosition;
		//debugger;	
  }
  
}