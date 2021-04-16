import createReducer, {RESET_STORE} from '../createReducer';
import {showMessage, errorHTTP} from '../utils/utils';

export const CLEAR = 'News.CLEAR';

// ------------------------------------
// Actions
// ------------------------------------
export const getNews = (news_id, callback) => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    const url = `/news/${news_id}`;
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('===getNews', res);
            if (res && res.data) {
                callback && callback(res.data);
            } else callback && callback(false);
        },
        failure: err => {
            console.log('getNews -> err', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const likeNews = (club_id, news_id, islike, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token, user} = getState().user;
    const url = `/clubs/${club_id}/news/${news_id}/${islike ? 'like' : 'like'}`;
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async res => {
            callback && callback(res);
        },
        failure: err => {
            callback && callback();
            errorHTTP(err);
        },
    });
};
export const commentNews = (club_id, news_id, comment, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token, user} = getState().user;
    const url = `/clubs/${club_id}/news/${news_id}/comment`;
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
            if (res && callback) callback();
        },
        failure: err => {
            console.log('=====commentPost err', err);
            errorHTTP(err);
        },
    });
};

export const getNewsComments = (club_id, news_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/clubs/${club_id}/news/${news_id}/comments`;
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
export const addExtraFileToNews = (news_id, body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/news/${news_id}/add-attachments`;
    return fetch(url, {
        method: 'POST',
        contentType: 'multipart/form-data',
        token,
        body,
        success: async res => {
            console.log('===addExtraFileToNews', res);
            if (res && res.data) {
                callback && callback(res.data);
            } else callback && callback(false);
        },
        failure: err => {
            console.log('===addExtraFileToNews err:', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};

export const removeExtraFileFromNews = (news_id, extra_file_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/news/${news_id}/remove-extra-files`;
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: {
            extra_file_id,
        },
        success: async res => {
            console.log('===removeExtraFileFromEvent', res);
            if (res && res.data) {
                callback && callback(res.data);
            } else callback && callback(false);
        },
        failure: err => {
            console.log('===removeExtraFileFromEvent err:', err);
            callback && callback(false);
        },
    });
};

export const updateNews = (event_id, body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    console.log(
        'URL',
        `/users/${user.id}/clubs/${body.club_id}/{news/${event_id}`,
    );
    return fetch(`/users/${user.id}/clubs/${body.club_id}/news/${event_id}`, {
        method: 'POST',
        contentType: 'multipart/form-data',
        body: {
            ...body,
            paid: 0,
            must_register: 1,
            allow_rsvp: 1,
            _method: 'PUT',
        },
        token,
        success: async res => {
            console.log('updateNews', res);
            if (res && res.data) {
                showMessage('Updated news successful!', true);
                callback && callback(true);
            } else {
                callback && callback(false);
            }
        },
        failure: err => {
            console.log('updateNews err', err);
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
