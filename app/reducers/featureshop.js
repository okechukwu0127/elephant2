import createReducer, {RESET_STORE} from '../createReducer';
import {showMessage, errorHTTP} from '../utils/utils';
import {getUserFeed} from './feed';

export const GET_FEATURES = 'Featureshop.GET_FEATURES';
export const GET_SUBSCRIBES = 'Featureshop.GET_SUBSCRIBES';
export const CLEAR = 'Featureshop.CLEAR';

// ------------------------------------
// Actions
// ------------------------------------
export const getFeatureshops = param => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    return fetch(`/features${param ? '?for=' + param : ''}`, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            if (res && res.data) {
                await dispatch({type: GET_FEATURES, features: res.data});
            }
        },
        failure: err => {
            console.log('====err', err);
        },
    });
};
export const getClubFeatures = club_id => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    return fetch('/features/added-to-club', {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: {
            club_id,
        },
        success: async res => {
            if (res && res.data) {
                await dispatch({type: GET_SUBSCRIBES, subscribes: res.data});
            }
        },
        failure: err => {
            console.log('====err', err);
        },
    });
};
export const subscribePlan = (param, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    console.log('/features/zirkl-pay/subscribe', param);
    return fetch('/features/zirkl-pay/subscribe', {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: param,
        success: async res => {
            console.log('subscribePlan:', res);
            if (res && res.message) {
                callback && callback();
                showMessage(res.message);
                return;
            }
            if (res && res.data) {
                callback && callback(res.data);
                showMessage('Successfully subscribed.', true);
            } else {
                callback && callback();
            }
            dispatch(getClubFeatures(param.club_id));
            dispatch(getUserFeed());
        },
        failure: err => {
            console.log('====err', err);
            callback && callback();
            errorHTTP(err);
        },
    });
};
export const clear = () => ({type: CLEAR});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    loading: false,
    features: [],
    subscribes: [],
};

export default createReducer(initialState, {
    [GET_FEATURES]: (state, {features}) => ({
        features,
    }),
    [GET_SUBSCRIBES]: (state, {subscribes}) => ({
        subscribes,
    }),
    [CLEAR]: (state, action) => RESET_STORE,
});
