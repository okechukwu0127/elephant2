import createReducer from '../createReducer';

export const GET_FEATURES = 'Featureshop.GET_FEATURES';
export const GET_SUBSCRIBES = 'Featureshop.GET_SUBSCRIBES';
export const CLEAR = 'Featureshop.CLEAR';

// ------------------------------------
// Actions
// ------------------------------------
export const getPrivacyPolicy = callback => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    return fetch('/configs/privacy_policy', {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: res => {
            console.log('getPrivacyPolicy -> res', res);
            if (res && res.data) {
                callback(res.data);
            } else callback(false);
        },
        failure: err => {
            console.log('getPrivacyPolicy -> err', err);
            callback(false);
        },
    });
};
export const getDataProcessing = callback => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    return fetch('/configs/data_processing', {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: res => {
            console.log('getDataProcessing -> res', res);
            if (res && res.data) {
                callback(res.data);
            } else callback(false);
        },
        failure: err => {
            console.log('getDataProcessing -> err', err);
            callback(false);
        },
    });
};
export const getTermsAndConditions = callback => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch('/configs/terms_conditions', {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: res => {
            console.log('getTermsAndConditions -> res', res);
            if (res && res.data) {
                callback(res.data);
            } else callback(false);
        },
        failure: err => {
            console.log('getTermsAndConditions -> err', err);
            callback(false);
        },
    });
};
export const getImpressum = callback => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    return fetch('/configs/imprint', {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: res => {
            console.log('getImpressum -> res', res);
            if (res && res.data) {
                callback(res.data);
            } else callback(false);
        },
        failure: err => {
            console.log('getImpressum -> err', err);
            callback(false);
        },
    });
};
export const getInvite = callback => (dispatch, getState, {fetch}) => {
    const {token, user} = getState().user;
    return fetch('/configs/invite2zirkl', {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: res => {
            console.log('getInvite -> res', res);
            if (res?.data?.value) {
                let value = res?.data?.value
                    .replace('[Vorname]', user.first_name)
                    .replace('[Name]', user.last_name);
                callback(value);
            } else callback(false);
        },
        failure: err => {
            console.log('getInvite -> err', err);
            callback(false);
        },
    });
};
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};

export default createReducer(initialState, {});
