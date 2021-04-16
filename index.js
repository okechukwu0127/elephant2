if (__DEV__) {
    import('./ReactotronConfig').then(() =>
        console.log('Reactotron Configured'),
    );
}
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings(['Require cycle']);
AppRegistry.registerComponent(appName, () => App);
