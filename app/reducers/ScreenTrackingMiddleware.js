import {NavigationActions} from 'react-navigation';

const getCurrentRouteName = (navigationState) => {
    if (!navigationState) {
        return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getCurrentRouteName(route);
    }
    return route.routeName;
};

const screenTracking = ({getState}) => (next) => (action) => {
    if (
        action.type !== NavigationActions.NAVIGATE &&
        action.type !== NavigationActions.BACK
    ) {
        return next(action);
    }

    const currentScreen = getCurrentRouteName(getState().navigation);
    const result = next(action);
    const nextScreen = getCurrentRouteName(getState().navigation);
    if (nextScreen !== currentScreen) {
    }
    return result;
};

export default screenTracking;
