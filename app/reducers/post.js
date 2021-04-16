import createReducer, {RESET_STORE} from '../createReducer';
import {showMessage, errorHTTP} from '../utils/utils';

export const CLEAR = 'Post.CLEAR';

// ------------------------------------
// Actions
// ------------------------------------
export const likePost = (club_id, post_id, islike, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token, user} = getState().user;
    const url = `/clubs/${club_id}/posts/${post_id}/${
        islike ? 'like' : 'like'
    }`;
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async (res) => {
            console.log('======res', res);
            if (res.data) {
                callback && callback(res.data);
            } else callback && callback();
        },
        failure: (err) => {
            callback && callback();
            errorHTTP(err);
        },
    });
};
export const commentPost = (club_id, post_id, comment) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token, user} = getState().user;
    const url = `/clubs/${club_id}/posts/${post_id}/comment`;
    console.log(url, comment);
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: {
            comment,
        },
        success: async (res) => {
            console.log('=====commentPost res', res);
            if (res && res.data) {
                showMessage('commented successfully', true);
            }
        },
        failure: (err) => {
            console.log('=====commentPost err', err);
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
