import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import ScreenTracking from './reducers/ScreenTrackingMiddleware';
import createHelpers from './createHelpers';
import {navigationMiddleware} from './navigation/AppNavigator';

// creates the store
export default (rootReducer, helpersConfig) => {
    /* ------------- Redux Configuration ------------- */

    const middleware = [];
    const enhancers = [];

    middleware.push(navigationMiddleware);

    /* ------------- Analytics Middleware ------------- */
    middleware.push(ScreenTracking);
    /* ------------- Thunk Middleware ------------- */
    const helpers = createHelpers(helpersConfig);
    middleware.push(thunk.withExtraArgument(helpers));

    /* ------------- Assemble Middleware ------------- */
    enhancers.push(applyMiddleware(...middleware));
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
        enhancers.push(
            // eslint-disable-next-line no-underscore-dangle
            window.__REDUX_DEVTOOLS_EXTENSION__(),
        );

    // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
    // const createAppropriateStore = Config.useReactotron ? console.tron.createStore : createStore
    const store = createStore(rootReducer, compose(...enhancers));
    return {
        store,
    };
};
