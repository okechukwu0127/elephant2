import createReducer, {RESET_STORE} from '../createReducer';
import {showMessage, errorHTTP} from '../utils/utils';

export const CLEAR = 'Impression.CLEAR';

// ------------------------------------
// Actions
// ------------------------------------
export const getImpression = (impression_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/impressions/${impression_id}`;
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('===getImpression', res);
            if (res && res.data) {
                callback && callback(res.data);
            } else callback && callback(false);
        },
        failure: err => {
            console.log('getImpression -> err', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const likeImpression = (club_id, imp_id, islike, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/clubs/${club_id}/impressions/${imp_id}/${
        islike ? 'like' : 'like'
    }`;
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('===likeImpression', res);
            if (res.data) {
                callback && callback(res.data);
            } else callback && callback();
        },
        failure: err => {
            callback && callback();
            errorHTTP(err);
        },
    });
};
export const commentImpression = (club_id, imp_id, comment, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/clubs/${club_id}/impressions/${imp_id}/comment`;
    console.log(url, comment);
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: {
            comment,
        },
        success: async res => {
            console.log('=====commentPost res', res);
            if (res && res.data) {
                showMessage('commented successfully', true);
                callback && callback();
            }
        },
        failure: err => {
            console.log('=====commentPost err', err);
            callback && callback();
            errorHTTP(err);
        },
    });
};
export const getImpressionComments = (club_id, impression_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/clubs/${club_id}/impressions/${impression_id}/comments`;
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('=====getComments res', res);
            if (res && res.data) {
                callback(res.data);
            }
        },
        failure: err => {
            console.log('=====getComments err', err);
            errorHTTP(err);
        },
    });
};
export const addExtraFileToImpression = (impression_id, body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/impressions/${impression_id}/add-photos`;
    console.log('url', url);
    console.log('body', body);
    return fetch(url, {
        method: 'POST',
        contentType: 'multipart/form-data',
        token,
        body,
        success: async res => {
            console.log('===addExtraFileToImpression', res);
            if (res && res.data) {
                callback && callback(res.data);
            } else callback && callback(false);
        },
        failure: err => {
            console.log('===addExtraFileToImpression err:', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const removeExtraFileFromNews = (impression_id, media_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/impressions/${impression_id}/remove-media`;
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: {
            media_id,
        },
        success: async res => {
            console.log('===removeExtraFileFromNews', res);
            if (res && res.data) {
                callback && callback(res.data);
            } else callback && callback(false);
        },
        failure: err => {
            console.log('===removeExtraFileFromNews err:', err);
            callback && callback(false);
        },
    });
};
export const updateImpression = (impression_id, body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch(`/clubs/${body.club_id}/impressions/${impression_id}`, {
        method: 'POST',
        contentType: 'multipart/form-data',
        body: {
            ...body,
            _method: 'PUT',
        },
        token,
        success: async res => {
            console.log('updateImpression', res);
            if (res && res.data) {
                showMessage('Updated impression successful!', true);
                callback && callback(true);
            } else {
                callback && callback(false);
            }
        },
        failure: err => {
            console.log('updateImpression err', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const clear = () => ({type: CLEAR});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};

export default createReducer(initialState, {
    [CLEAR]: (state, action) => RESET_STORE,
});
