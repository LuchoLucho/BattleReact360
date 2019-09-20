import React from 'react';
import {NativeModules} from 'react-360';

console.log("RootGame.js");

const mapIncremental:Number = 10.0;
const floorLevel:Number = -5.0;
const BrowserInfo = NativeModules.BrowserInfo;

const miMapaRow0 = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,3];
const miMapaRow1 = [2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,3];
const miMapaRow2 = [3,3,2,2,2,2,3,3,3,3,2,2,2,1,2,3];
const miMapaRow3 = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,3];
const miMapaRow4 = [2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,3];
const miMapaRow5 = [2,1,2,3,3,3,3,3,2,2,2,3,3,1,2,3];
const miMapaRow6 = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,3];
const miMapaRow7 = [3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3];
const miMap = [miMapaRow0,miMapaRow1,miMapaRow2,miMapaRow3,miMapaRow4,miMapaRow5,miMapaRow6,miMapaRow7];

const State = {
  crypto: 'BTC',  
  index: 0,  
  otherListener : ["1"],
	playerX : 0,
	playerY : floorLevel,
	playerZ : 0*mapIncremental,
	playerRotationY: 180,
	latestEvent: "",
	showLevel: true,
	currentMap:miMap,
};

const listeners = new Set();

const valurPreviousListenerWereAdder:Number = -1;

function updateComponents() {
  for (const cb of listeners.values()) {
    cb();
  }
}

export function nextCrypto(index) {
  let cryptoIndex = index;
  let cryptos = [{ crypto: 'BTC',
                   index: 0
                 },
                 {
                   crypto: 'DASH',
                   index: 1
                 },
                 { crypto: 'XMR',
                   index: 2
                 },
                 { crypto: 'ZEN',
                   index: 3
                 }];


  if (index < 3) {
    cryptoIndex = cryptoIndex + 1;
  } else {
    cryptoIndex = 0;
  }

  State.crypto = cryptos[cryptoIndex].crypto;
  State.index = cryptos[cryptoIndex].index;  
  State.otherListener = ["nextCrypto"];
  State.latestEvent = ""
  State.showLevel = false;
  updateComponents();
}

export function connectedEvent(newEvent) {
	State.latestEvent=newEvent;
	updateComponents();
}

export function connectedPlayerUpdatePosition(newX,newY,newZ,newRotY)
{
	if (!State.showLevel)
	{
		return;
	}
	if (newRotY < 0)
	{
		newRotY +=360;
	}
	newRotY = newRotY % 360;
	BrowserInfo.connectedPlayerUpdatePosition(newX,newY,newZ,newRotY);
	State.playerX = newX;
	State.playerY = newY;
	State.playerZ = newZ;	
	State.playerRotationY = newRotY;	
	//debugger;
	updateComponents();	
}

export function rootShowLevel()
{
	State.showLevel = true;
	updateComponents();	
}


export function connect(Component) {
  return class Wrapper extends React.Component {
    state = {
      crypto: State.crypto,
      index: State.index,	  
	  otherListener: listeners,
		playerX: State.playerX,
		playerY: State.playerY,
		playerZ: State.playerZ,
		playerRotationY : State.playerRotationY,
		latestEvent:State.latestEvent,
		showLevel: State.showLevel,
		currentMap:State.currentMap,
    };

    _listener = () => {
      this.setState({
        crypto: State.crypto,
        cryptoSymbol: State.cryptoSymbol,
        index: State.index,		
		whoAmI: this,
		playerX: State.playerX,
		playerY: State.playerY,
		playerZ: State.playerZ,
		playerRotationY : State.playerRotationY,
		latestEvent:State.latestEvent,
		showLevel: State.showLevel,
		currentMap:State.currentMap,
      });
    };

    componentDidMount() {
      listeners.add(this._listener);
    }

    render() {
      return (
        <Component
          {...this.props}
          crypto={this.state.crypto}
          index={this.state.index}		  
		  otherListener = {this.state.otherListener}
		  playerX={this.state.playerX}
			playerY={this.state.playerY}
			playerZ={this.state.playerZ}
			playerRotationY={this.state.playerRotationY}
			latestEvent={this.state.latestEvent}
			showLevel={this.state.showLevel}
			currentMap={this.state.currentMap}
        />
      );
    }
  };
}