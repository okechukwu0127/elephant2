import createReducer, {RESET_STORE} from '../createReducer';
import {showMessage, errorHTTP} from '../utils/utils';
import {getUserFeed} from './feed';
export const CLEAR = 'Event.CLEAR';

// ------------------------------------
// Actions
// ------------------------------------
export const getEvent = (event_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/events/${event_id}`;
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('===getEvent', res);
            if (res && res.data) {
                callback && callback(res.data);
            } else callback && callback(false);
        },
        failure: err => {
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const getEvents = callback => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    const url = '/events';
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('===getEvents', res);
            if (res && res.data) {
                callback && callback(res.data);
            } else callback && callback(false);
        },
        failure: err => {
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const addExtraFileToEvent = (event_id, body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/events/${event_id}/add-extra-files`;
    return fetch(url, {
        method: 'POST',
        contentType: 'multipart/form-data',
        token,
        body,
        success: async res => {
            console.log('===addExtraFileToEvent', res);
            if (res && res.data) {
                callback && callback(res.data);
            } else callback && callback(false);
        },
        failure: err => {
            console.log('===addExtraFileToEvent err:', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const removeExtraFileFromEvent = (event_id, extra_file_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/events/${event_id}/remove-extra-files`;
    console.log(`/events/${event_id}/remove-extra-files:`, extra_file_id);
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
export const updateEvent = (event_id, body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    console.log(`/users/${user.id}/events/${event_id}`, {
        ...body,
        paid: 0,
        must_register: 1,
        allow_rsvp: 1,
        _method: 'PUT',
    });
    return fetch(`/users/${user.id}/events/${event_id}`, {
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
            console.log('updateEvent', res);
            if (res && res.data) {
                showMessage('Updated event successful!', true);
                callback && callback(true);
                dispatch(getUserFeed());
            } else {
                callback && callback(false);
            }
        },
        failure: err => {
            console.log('updateEvent err', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const getAttendance = (event_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/events/${event_id}/attendees`;
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('===getAttendance', res);
            if (res && res.data) {
                callback && callback(res.data);
            } else callback && callback(false);
        },
        failure: err => {
            callback && callback(false);
            errorHTTP(err);
        },
    });
};

export const addAttendeeToEvent = (event_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/events/${event_id}/attend`;
    console.log('===addAttendeeToEvent:', url);
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('===addAttendeeToEvent', res);
            if (res && res.data) {
                callback && callback(true);
            } else {
                callback && callback(false);
            }
        },
        failure: err => {
            console.log('===addAttendeeToEvent err', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const confirmAttendance = (event_id, ticket_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/events/${event_id}/confirm-attendance`;
    console.log('===confirmAttendance:', url);
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: {
            ...(ticket_id ? {ticket_id} : {}),
        },
        success: async res => {
            console.log('===confirmAttendance', res);
            if (res && res.qr) {
                callback && callback(res);
            } else {
                callback && callback(false);
            }
        },
        failure: err => {
            console.log('===confirmAttendance err', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const getTicketsOfEvent = (event_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/events/${event_id}/tickets`;
    console.log('===getTicketsOfEvent:', url);
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('===getTicketsOfEvent', res);
            if (res && res.data) {
                callback && callback(res.data);
            } else {
                callback && callback();
            }
        },
        failure: err => {
            console.log('===getTicketsOfEvent err', err);
            callback && callback();
            errorHTTP(err);
        },
    });
};
export const createNewTicket = (param, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/events/${param.event_id}/tickets`;
    console.log('===createNewTicket:', url);
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: param,
        success: async res => {
            console.log('===createNewTicket', res);
            if (res && res.data) {
                showMessage('created new ticket successfully', true);
                callback && callback(res.data);
            } else {
                callback && callback();
            }
        },
        failure: err => {
            console.log('===createNewTicket err', err);
            callback && callback();
            errorHTTP(err);
        },
    });
};
export const removeAttendeeToEvent = (event_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/events/${event_id}/remove-attendance`;
    return fetch(url, {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('===addAttendeeToEvent', res);
            if (res && res.message) {
                showMessage(res.message, true);
                callback && callback(true);
            } else callback && callback(false);
        },
        failure: err => {
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const likeEvent = (club_id, event_id, islike, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/clubs/${club_id}/events/${event_id}/${
        islike ? 'like' : 'like'
    }`;
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
export const commentEvent = (club_id, event_id, comment, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/clubs/${club_id}/events/${event_id}/comment`;
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

export const getEventComments = (club_id, event_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = `/clubs/${club_id}/events/${event_id}/comments`;
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
export const getWhereToPay = callback => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const url = '/events/where-to-pay';
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('=====getWhereToPay res', res);
            if (res && res.data) {
                callback(res.data);
            }
        },
        failure: err => {
            console.log('=====getWhereToPay err', err);
            callback(false);
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
