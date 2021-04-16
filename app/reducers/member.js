import createReducer, {RESET_STORE} from '../createReducer';
import {showMessage, errorHTTP} from '../utils/utils';
import {getClubsByUser} from './club';

export const GET_CLUB_ROLES = 'Member.GET_CLUB_ROLES';
export const GET_CLUB_MEMBERS = 'Member.GET_CLUB_MEMBERS';
export const GET_BOARD_MEMBERS = 'Member.GET_BOARD_MEMBERS';
export const CLEAR = 'Member.CLEAR';

// ------------------------------------
// Actions
// ------------------------------------
export const getClubRoles = () => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    return fetch('/club-roles', {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('getClubRoles:', res);
            if (res && res.data) {
                await dispatch({type: GET_CLUB_ROLES, roles: res.data});
            }
        },
        failure: err => {},
    });
};

export const getClubMembers = (club_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    console.log('getClubMembers', getClubMembers);
    const {token} = getState().user;
    return fetch(`/clubs/${club_id}/members`, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('get club members:', res);
            if (res && res.data) {
                await dispatch({
                    type: GET_CLUB_MEMBERS,
                    club_members: res.data,
                });
                callback && callback(res.data);
            } else callback && callback(false);
        },
        failure: err => {
            console.log('err', err);
            callback && callback(false);
        },
    });
};
export const searchClubMembers = (club_id, keyword, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    console.log('searchClubMembers', searchClubMembers);
    const {token} = getState().user;
    return fetch(`/clubs/${club_id}/members?filter[name]=${keyword}`, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('searchClubMembers:', res);
            if (res && res.data) {
                if (callback) {
                    callback(res.data);
                } else
                    await dispatch({
                        type: GET_CLUB_MEMBERS,
                        club_members: res.data,
                    });
            }
        },
        failure: err => {
            console.log('searchClubMembers -> err', err);
        },
    });
};
export const getBoardMembers = (club_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch(`/clubs/${club_id}/board-members`, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('get board members:', res);
            if (res && res.data) {
                if (callback) callback(res.data);
                else
                    await dispatch({
                        type: GET_BOARD_MEMBERS,
                        board_members: res.data,
                    });
            } else callback && callback(false);
        },
        failure: err => {
            console.log('getBoardMembers -> err', err);
            callback && callback(false);
        },
    });
};
export const addMemberToClub = (club_id, user_id) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch(`/users/${user_id}/add-to-club/${club_id}`, {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async res => {
            if (res.message) showMessage(res.message, true);
            dispatch(getClubMembers(club_id));
        },
        failure: err => {
            errorHTTP(err);
        },
    });
};
export const removeMemberToClub = (club_id, user_id) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch(`/users/${user_id}/remove-from-club/${club_id}`, {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async res => {
            if (res.message) showMessage(res.message, true);
            dispatch(getClubMembers(club_id));
        },
        failure: err => {
            errorHTTP(err);
        },
    });
};
export const addClubBoardMember = (club_id, user_id, role_id) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const {board_members} = getState().member;
    const find_member = board_members.find(
        item => item.user && item.user.id == user_id,
    );
    console.log('Board member update', {
        user_id,
        role_id,
        ...(find_member ? {update: 1} : {}),
    });
    return fetch(`/clubs/${club_id}/board-members`, {
        method: 'POST',
        contentType: 'application/json',
        body: {
            user_id,
            role_id,
            ...(find_member ? {update: 1} : {}),
        },
        token,
        success: async res => {
            if (res.message) showMessage(res.message, true);
            dispatch(getBoardMembers(club_id));
        },
        failure: err => {
            errorHTTP(err);
        },
    });
};
export const requestToRemoveBoardMember = (club_id, user_id, reason) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch(`/clubs/${club_id}/request-to-remove-board-members`, {
        method: 'POST',
        contentType: 'application/json',
        body: {
            user_id,
            reason,
        },
        token,
        success: async res => {
            if (res.message) showMessage(res.message, true);
            dispatch(getBoardMembers(club_id));
        },
        failure: err => {
            errorHTTP(err);
        },
    });
};
export const removeFromClub = (club_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token, user} = getState().user;
    return fetch(`/users/${user?.id}/remove-from-club/${club_id}`, {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async res => {
            if (res.message) {
                showMessage(res.message, true);
                callback && callback();
            }
            dispatch(getClubsByUser(user?.id));
            dispatch(getBoardMembers(club_id));
        },
        failure: err => {
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
    club_members: [],
    board_members: [],
    roles: [],
};

export default createReducer(initialState, {
    [GET_CLUB_ROLES]: (state, {roles}) => ({
        roles,
    }),
    [GET_CLUB_MEMBERS]: (state, {club_members}) => ({
        club_members,
    }),
    [GET_BOARD_MEMBERS]: (state, {board_members}) => ({
        board_members,
    }),
    [CLEAR]: (state, action) => RESET_STORE,
});
