import {
    createReduxContainer,
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import {connect} from 'react-redux';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {BACKGROUND_COLOR} from '../themes/colors';

import TabNavigator from './TabNavigator';


//Auth flow
//
import LetsScreen from '../containers/Lets';
import IntroScreen from '../containers/Introduction';

import SignupScreen from '../containers/Login/signup';
import LoginScreen from '../containers/Login/login';
import ForgotPassword from '../containers/Login/forgotpassword';
import TermsScreen from '../containers/Login/terms';

import {createStackNavigator} from 'react-navigation-stack';

export const commonOptions = {
    defaultNavigationOptions: {
        headerTitleContainerStyle: {
            justifyContent: 'center',
        },
        headerStyle: {
            backgroundColor: BACKGROUND_COLOR,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
        },
        //gesturesEnabled: false,
    },
};

const MainStack = createStackNavigator(
    {
        Tabs: TabNavigator,

        Signup: SignupScreen,
        Login: LoginScreen,
        Forgot: ForgotPassword,
        Terms: TermsScreen,
    },
    {headerMode: 'none', initialRouteName: 'Tabs'},
);

const AppNavigator = createAppContainer(
    createSwitchNavigator(
        {
            //AuthLoading: AuthLoadingScreen,
            //Auth: AuthStack,
            Lets: LetsScreen,
            Intro: IntroScreen,
            App: MainStack,
        },
        {
            initialRouteName: 'Lets',
        },
    ),
);

const navigationMiddleware = createReactNavigationReduxMiddleware(
    state => state.nav,
);

const App = createReduxContainer(AppNavigator);

const mapStateToProps = state => ({
    state: state.nav,
});
const RootNavigator = connect(mapStateToProps)(App);

export {RootNavigator, AppNavigator, navigationMiddleware};
