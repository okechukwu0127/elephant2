import createReducer, {RESET_STORE} from '../createReducer';
import {showMessage, errorHTTP} from '../utils/utils';

export const GET_MEMBERSHIP = 'Membership.GET_MEMBERSHIP';
export const CLEAR = 'Membership.CLEAR';

// ------------------------------------
// Actions
// ------------------------------------
export const getMembership = (club_id, callback, include_all = false) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/clubs/${club_id}/plans${include_all ? '?include_all' : ''}`;
    console.log('url', url);
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('=============res', res);
            if (res.data) {
                await dispatch({type: GET_MEMBERSHIP, memberships: res.data});
                callback && callback(res.data);
            } else callback && callback();
        },
        failure: err => {
            console.log('err', err);
            callback && callback();
        },
    });
};
export const getJoiningYear = (club_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token, user} = getState().user;
    const url = `/users/${user?.id}/clubs/${club_id}/membership`;
    console.log('url', url);
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: res => {
            console.log('joiningYear Result:', res);
            if (res.data) {
                callback && callback(res.data);
            } else callback && callback();
        },
        failure: err => {
            console.log('joiningYear Error:', err);
            callback && callback();
        },
    });
};

export const updateUserMembership = (club_id, body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token, user} = getState().user;
    const url = `/clubs/${club_id}/users/${user?.id}/membership`;
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        body,
        token,
        success: res => {
            console.log('update updateMembership Result:', res);
            if (res?.success) {
                callback && callback(res?.data);
                showMessage('Ihre Mitgliedschaft wurde aktualisiert!', true);
            } else callback && callback();
        },
        failure: err => {
            console.log('updateMembership Error:', err);
            callback && callback();
        },
    });
};
export const createMembership = (club_id, param, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/clubs/${club_id}/plans`;
    if (!param.invoice_period) param.invoice_period = '1';
    if (!param.invoice_interval) param.invoice_interval = 'month';
    if (param.active === undefined) param.active = 1;
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: {
            ...param,
        },
        success: async res => {
            console.log('=====createmembership', res);
            if (res.data) {
                dispatch(getMembership(club_id));
                callback && callback(res.data);
            } else callback && callback();
        },
        failure: err => {
            callback && callback();
            errorHTTP(err);
        },
    });
};
export const updateMembership = (club_id, param, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/clubs/${club_id}/plans/${param.id}`;
    if (!param.invoice_period) param.invoice_period = '1';
    if (!param.invoice_interval) param.invoice_interval = 'month';
    if (param.active === undefined) param.active = 1;
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: {
            ...param,
            _method: 'PUT',
        },
        success: async res => {
            console.log('=====updatemembership', res);
            if (res.data) {
                dispatch(getMembership(club_id));
                callback && callback(res.data);
            } else callback && callback();
        },
        failure: err => {
            callback && callback();
            errorHTTP(err);
        },
    });
};
export const deleteMembership = (club_id, plan_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/clubs/${club_id}/plans/${plan_id}`;
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: {
            _method: 'DELETE',
        },
        success: async res => {
            console.log('=====deleteMembership', res);
            if (res.message) {
                showMessage('Mitgliedschaftskategorie gelöscht!');
                dispatch(getMembership(club_id));
                callback && callback(res.data);
            } else callback && callback();
        },
        failure: err => {
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
    memberships: [],
};

export default createReducer(initialState, {
    [GET_MEMBERSHIP]: (state, {memberships}) => ({
        memberships,
    }),
    [CLEAR]: (state, action) => RESET_STORE,
});
