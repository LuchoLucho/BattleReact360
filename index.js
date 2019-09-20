import {AppRegistry} from 'react-360';

import {connect} from './RootGameObject.js';
import PlayerControl from './PlayerControl';
import SceneManager from './Scene/SceneManager';
import Player from './Player';
import MenuComponent from './MenuComponent';

const ConnectedPlayerControl = connect(PlayerControl);
const ConnectedPlayer = connect(Player);
const ConnectedScene = connect(SceneManager);

AppRegistry.registerComponent('ConnectedPlayerControl', () => ConnectedPlayerControl);
AppRegistry.registerComponent('ConnectedPlayer', () => ConnectedPlayer);
AppRegistry.registerComponent('ConnectedSceneManager', () => ConnectedScene);
AppRegistry.registerComponent('ConnectedMenuComponent', () => MenuComponent);
