import {combineReducers} from 'redux';
import configureStore from '../createStore';

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
    nav: require('./nav').default,
    global: require('./global').default,
    user: require('./user').default,
    category: require('./category').default,
    club: require('./club').default,
    member: require('./member').default,
    feed: require('./feed').default,
    post: require('./post').default,
    imporession: require('./impression').default,
    event: require('./event').default,
    membership: require('./membership').default,
    featureshop: require('./featureshop').default,
    invoices: require('./invoices').default,
    news: require('./news').default,
    info: require('./info').default,
});

export default helpersConfig => {
    let finalReducers = reducers;
    let {store} = configureStore(finalReducers, helpersConfig);

    if (module.hot) {
        module.hot.accept(() => {
            const nextRootReducer = require('.').reducers;
            store.replaceReducer(nextRootReducer);
        });
    }
    return store;
};
