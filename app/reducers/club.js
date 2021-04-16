import createReducer, {RESET_STORE} from '../createReducer';
import {showMessage, errorHTTP} from '../utils/utils';
import {DEFAULT_CLUB_PROFILE} from '../constants';
import {getUserFeed} from './feed';
import {switchAuth} from './user';
import {getClubMembers} from './member';

export const GET_CLUBS_USER = 'Club.GET_CLUBS_USER';
export const GET_CLUBS_MEMBEROF = 'Club.GET_CLUBS_MEMBEROF';
export const GET_CLUBS_BOARDOF = 'Club.GET_CLUBS_BOARDOF';
export const GET_CLUBBYID = 'Club.GET_CLUBBYID';
export const GET_CLUBS = 'Club.GET_CLUBS';
export const GET_CLUB_PROFILEBYID = 'Club.GET_CLUB_PROFILEBYID';
export const GET_CLUB_FOLLOWED = 'Club.GET_CLUB_FOLLOWED';
export const GET_CLUB_IMPRESSIONS = 'Club.GET_CLUB_IMPRESSIONS';
export const GET_CONTINENTS = 'Club.GET_CONTINENTS';
export const GET_COUNTRIES = 'Club.GET_COUNTRIES';
export const GET_CANTONS = 'Club.GET_CANTONS';
export const GET_DISTRICTS = 'Club.GET_DISTRICTS';
export const GET_MUNICIPALITIES = 'Club.GET_MUNICIPALITIES';
export const CLEAR = 'Club.CLEAR';

// ------------------------------------
// Actions
// ------------------------------------
export const createClub = (param, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    return fetch(`/users/${user.id}/clubs`, {
        method: 'POST',
        contentType: 'multipart/form-data',
        body: {
            ...param,
            //optional
            canton: 'canton',
            visibility: 1,
            user_id: user.id,
        },
        token,
        success: async res => {
            dispatch(getClubsByUser());
            showMessage(
                res && res.data
                    ? 'Created successfull!'
                    : 'creating club is failed',
                res && res.data ? true : false,
            );
            callback && callback(res && res.data ? res.data : null);
            dispatch(getUserFeed());
        },
        failure: err => {
            errorHTTP(err);
            callback && callback(null);
        },
    });
};
export const getClubsByUser = (user_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    if (!user_id && !user) return;
    dispatch(getMemberOfClubs(user_id ? user_id : user.id));
    dispatch(getBoardOfClubs(user_id ? user_id : user.id));

    return fetch(`/users/${user_id ? user_id : user.id}/clubs`, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('res', res);
            if (res && res.data) {
                dispatch({type: GET_CLUBS_USER, clubs_user: res.data});
            }
            callback && callback();
        },
        failure: err => {
            errorHTTP(err);
            callback && callback();
        },
    });
};
const CLUBS_PERPAGE = 20;
export const clearClubs = () => (dispatch, getState, {fetch}) => {
    dispatch({type: GET_CLUBS, payload: {clubs: [], meta: null}});
};
export const getClubs = (param, nextPage, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    const {clubs, clubs_meta} = getState().club;

    var page = 1;
    if (nextPage && clubs_meta) {
        page = clubs_meta.current_page + 1;
        if (page > clubs_meta.last_page) {
            callback && callback();
            return;
        }
    }
    var filter_name = param && param.name ? param.name : '';
    if (param && param['municipality_name'])
        filter_name = param['municipality_name'];
    if (param && param['district_name'])
        filter_name = param && param['district_name'];
    if (param && param['profile.zip'])
        filter_name = param && param['profile.zip'];

    const url = `/clubs/search?per_page=${CLUBS_PERPAGE}&page=${page}&filter[name]=${filter_name}&filter[canton_name]=${
        param && param.canton_name ? param.canton_name : ''
    }&filter[club_category_id]=${
        param && param.club_category_id ? param.club_category_id.join(',') : ''
    }&filter[municipality_name]=${
        param && param['municipality_name'] ? param['municipality_name'] : ''
    }&filter[district_name]=${
        param && param['district_name'] ? param['district_name'] : ''
    }&filter[profile.zip]=${
        param && param['profile.zip'] ? param['profile.zip'] : ''
    }`;
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('getclubs', url, res);
            if (res && res.data) {
                if (page > 1) {
                    dispatch({
                        type: GET_CLUBS,
                        payload: {
                            clubs: [...clubs, ...res.dFata],
                            meta: res.meta,
                        },
                    });
                } else
                    dispatch({
                        type: GET_CLUBS,
                        payload: {clubs: res.data, meta: res.meta},
                    });
            }
            callback && callback();
        },
        failure: err => {
            callback && callback();
            errorHTTP(err);
        },
    });
};
export const getFollowedClubs = (user_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;

    const url = `/users/${user_id ? user_id : user.id}/clubs-followed`;
    dispatch({type: GET_CLUB_FOLLOWED, followed_clubs: []});
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('getFollowedClubs', url, res);
            if (res && res.data) {
                dispatch({type: GET_CLUB_FOLLOWED, followed_clubs: res.data});
                callback && callback();
            }
        },
        failure: err => {
            console.log('====err', url, err);
            callback && callback();
            errorHTTP(err);
        },
    });
};
export const getMemberOfClubs = (user_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    if (callback) {
        const url = `/users/${user.id}/member-of-clubs`;
        return fetch(url, {
            method: 'GET',
            contentType: 'application/json',
            token,
            success: async res => {
                if (res && res.data) {
                    callback(res.data);
                } else callback(false);
            },
            failure: err => {
                callback(false);
                errorHTTP(err);
            },
        });
    }

    const url = `/users/${user_id ? user_id : user.id}/member-of-clubs`;
    dispatch({type: GET_CLUBS_MEMBEROF, member_of_clubs: []});
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            if (res && res.data) {
                dispatch({type: GET_CLUBS_MEMBEROF, member_of_clubs: res.data});
            }
        },
        failure: err => {
            errorHTTP(err);
        },
    });
};
export const getBoardOfClubs = (user_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token, user} = getState().user;
    const url = `/users/${user_id || user?.id}/board-member-of-clubs`;
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('getBoardOfClubs -> res', res);
            dispatch({
                type: GET_CLUBS_BOARDOF,
                board_of_clubs: res && res.data ? res.data : [],
            });
            callback && callback(res && res.data);
        },
        failure: err => {
            errorHTTP(err);
        },
    });
};
export const getClub = (club_id, callback) => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    /*
    if (user && token && !otherUser) {
        return fetch(`/users/${user.id}/clubs/${club_id}`, {
            method: 'GET',
            contentType: 'application/json',
            token,
            success: async (res) => {
                console.log("getClub with id:", club_id, res)
                if (res && res.data) {
                    dispatch({ type: GET_CLUBBYID, club: res.data })
                }
            },
            failure: (err) => {
                errorHTTP(err);
            }
        })
    }
    */
    const url = `/clubs/search?filter[id]=${club_id}`;
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('search club', url, res);
            if (res && res.data && res.data.length > 0) {
                callback && callback(res.data[0]);
                dispatch({type: GET_CLUBBYID, club: res.data[0]});
            } else {
                callback && callback({id: club_id, deleted: 1});
                dispatch({type: GET_CLUBBYID, club: {id: club_id, deleted: 1}});
            }
        },
        failure: err => {
            callback && callback({id: club_id, deleted: 1});
            errorHTTP(err);
        },
    });
};
export const updateClub = (club_id, body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    console.log('updateClub -> body', body);
    return fetch(`/users/${user.id}/clubs/${club_id}`, {
        method: 'POST',
        contentType: 'multipart/form-data',
        body: {
            ...body,
            _method: 'PUT',
        },
        token,
        success: async res => {
            console.log('updateClub -> res', res);
            if (res && res.data) {
                callback && callback(true);
                dispatch({type: GET_CLUBBYID, club: res.data});
                dispatch(getUserFeed());
                dispatch(getClubsByUser());
            } else callback && callback(false);
        },
        failure: err => {
            console.log('updateClub err:', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const getClubProfile = (club_id, param) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    return fetch(`/users/${user.id}/clubs/${club_id}/profiles`, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('getClubProfile: ', res);
            if (res && res.data && res.data.id) {
                dispatch({type: GET_CLUB_PROFILEBYID, club_profile: res.data});
            } else {
                dispatch(createClubProfile(club_id, param));
            }
        },
        failure: err => {
            errorHTTP(err);
        },
    });
};
export const createClubProfile = (club_id, body) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    return fetch(`/users/${user.id}/clubs/${club_id}/profiles`, {
        method: 'POST',
        contentType: 'application/json',
        body: {
            ...DEFAULT_CLUB_PROFILE,
            //email: user && user.email,
            ...(body ? body : {}),
        },
        token,
        success: async res => {
            console.log('createClubProfile: ', res);
            if (res && res.data) {
                dispatch({type: GET_CLUB_PROFILEBYID, club_profile: res.data});
            }
        },
        failure: err => {
            errorHTTP(err);
        },
    });
};
export const updateClubProfile = (club_id, body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    if (body.id) {
        console.log('updateClubProfile -> body', body);
        return fetch(`/users/${user.id}/clubs/${club_id}/profiles/${body.id}`, {
            method: 'POST',
            contentType: 'multipart/form-data',
            body: {
                ...body,
                _method: 'PUT',
            },
            token,
            success: async res => {
                console.log('updateClubProfile -> res', res);
                if (res && res.data) {
                    callback && callback(true);
                    dispatch({
                        type: GET_CLUB_PROFILEBYID,
                        club_profile: res.data,
                    });
                    dispatch(switchAuth());
                } else callback && callback(false);
            },
            failure: err => {
                console.log('err: ', err);
                callback && callback(false);
                errorHTTP(err);
            },
        });
    }
    return dispatch(createClubProfile(club_id));
};
export const updateUserClubSetting = (club_id, body) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    console.log(`/clubs/${club_id}/users/${user.id}/settings`, body);
    return fetch(`/clubs/${club_id}/users/${user.id}/settings/v2`, {
        method: 'POST',
        contentType: 'application/json',
        body: {
            ...body,
            user_id: user.id,
        },
        token,
        success: async res => {
            console.log('updateUserClubSetting: ', res);
            if (res && res.message) showMessage(res.message, true);
            dispatch(getClubProfile(club_id));
        },
        failure: err => {
            console.log('err: ', err);
            errorHTTP(err);
        },
    });
};
/*********************************************** Follow/unfollow *****************************************/
export const followClub = (club_id, callback, query = null) => (
    dispatch,
    getState,
    {fetch},
) => {
    console.log('query', query);
    const {user, token} = getState().user;
    return fetch(`/users/${user.id}/follows/${club_id}`, {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async res => {
            if (res.message) showMessage(res.message, true);
            dispatch(getClubs(query ? {name: query} : {}));
            callback && callback(true);
        },
        failure: err => {
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const unfollowClub = (club_id, callback, query = null) => (
    dispatch,
    getState,
    {fetch},
) => {
    console.log('query', query);
    const {user, token} = getState().user;
    return fetch(`/users/${user.id}/un-follows/${club_id}`, {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async res => {
            if (res.message) showMessage(res.message);
            dispatch(getClubs(query ? {name: query} : {}));
            callback && callback(true);
        },
        failure: err => {
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const claimClub = (club_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch(`/clubs/${club_id}/claim`, {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('====res', res);
            if (res.data)
                showMessage(
                    'Wir benötigen weitere zwei Vorstandsmitglieder, welche innerhalb von 5 Minuten Zugang beantragen.',
                    true,
                );
            callback && callback(res && res.data);
        },
        failure: err => {
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
/*********************************************** Member *****************************************/
export const addMemberToClub = (club_id, membership_plan_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    return fetch(`/users/${user.id}/add-to-club/${club_id}`, {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: {
            ...(membership_plan_id
                ? {
                      membership_plan_id,
                  }
                : {}),
        },
        success: async res => {
            if (res.message) showMessage('Du bist jetzt Mitglied', true);
            dispatch(getClubs());
            dispatch(getClubsByUser(user?.id));
            dispatch(getClubMembers(club_id));
            callback && callback(true);
        },
        failure: err => {
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const removeMemberToClub = (club_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    return fetch(`/users/${user.id}/remove-from-club/${club_id}`, {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async res => {
            if (res.message) showMessage(res.message);
            dispatch(getClubs());
            callback && callback(true);
        },
        failure: err => {
            callback && callback(false);
            errorHTTP(err);
        },
    });
};

export const deleteClub = (club_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token, user} = getState().user;
    return fetch(`/users/${user.id}/clubs/${club_id}`, {
        method: 'POST',
        contentType: 'application/json',
        body: {
            _method: 'DELETE',
        },
        token,
        success: async res => {
            console.log('deleteClub:', res);
            showMessage(
                res.message ? res.message : 'deleted club successfully',
                true,
            );
            callback && callback(true);
            dispatch(getClubsByUser());
        },
        failure: err => {
            console.log('deleteClub err:', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const castVoteForDeletion = (club_id, vote, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    console.log(`/clubs/${club_id}/cast-vote-for-deletion`, {
        vote,
    });
    return fetch(`/clubs/${club_id}/cast-vote-for-deletion`, {
        method: 'POST',
        contentType: 'application/json',
        body: {
            vote,
        },
        token,
        success: async res => {
            console.log('castVoteForDeletion res:', res);
            if (res && res.message) {
                showMessage(res.message, true);
            }
            callback && callback(true);
        },
        failure: err => {
            console.log('castVoteForDeletion err:', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const regretClub = (club_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch(`/clubs/${club_id}/regret-club-deletion`, {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('restored:', res);
            showMessage(
                res.message ? res.message : 'restored club successfully',
                true,
            );
            callback && callback(true);
            dispatch(getClub(club_id));
        },
        failure: err => {
            console.log('restored err:', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
/**********************  Impressions  ***************************** */
export const getImpressionsByClubId = club_id => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    dispatch({type: GET_CLUB_IMPRESSIONS, impressions_club: []});
    return fetch(`/clubs/${club_id}/impressions`, {
        method: 'GET',
        token,
        success: async res => {
            console.log('getImpressionsByClubId', res);
            dispatch({type: GET_CLUB_IMPRESSIONS, impressions_club: res.data});
        },
        failure: err => {
            console.log('getImpressionsByClubId err:', err);
        },
    });
};
/**********************  Club Reachability (continents, countries, cantons, districts)  ***************************** */
export const getContinents = () => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    return fetch('/continents', {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            if (res && res.data)
                dispatch({type: GET_CONTINENTS, continents: res.data});
        },
        failure: err => console.warn(err),
    });
};
export const getCountriesByContinent = continent_id => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch(`/continents/${continent_id}/countries`, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            if (res && res.data)
                dispatch({type: GET_COUNTRIES, countries: res.data});
        },
        failure: err => console.warn(err),
    });
};
export const getCantons = (continent_id = null, country_id = null) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    let url =
        !!continent_id && !!country_id
            ? `/continents/${continent_id}/countries/${country_id}/cantons`
            : '/ch-cantons';
    console.log('url', url);
    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('cantons res', res);
            if (res && res.data)
                dispatch({type: GET_CANTONS, cantons: res.data});
        },
        failure: err => console.warn(err),
    });
};
export const getDistricts = canton_id => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    return fetch(`/cantons/${canton_id}/districts`, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            if (res && res.data)
                dispatch({type: GET_DISTRICTS, districts: res.data});
        },
        failure: err => console.warn(err),
    });
};
export const getMunicipalitiesOfCities = districts => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch('/municipalities/list-by-districts', {
        method: 'POST',
        contentType: 'multipart/form-data',
        token,
        body: {
            ['districts[]']: districts,
        },
        success: async res => {
            if (res && res.data)
                dispatch({type: GET_MUNICIPALITIES, municipalities: res.data});
        },
        failure: err => console.warn(err),
    });
};

export const getMemberInfo = (member_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch(`/users/privacy/${member_id}`, {
        method: 'POST',
        token,
        success: async res => {
            console.log('🚀 ~ file: club.js ~ line 756 ~ res', res);
            if (res && res.data) callback(res.data);
            else callback(false);
        },
        failure: err => {
            console.warn(err);
            callback(false);
        },
    });
};

export const clear = () => ({type: CLEAR});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    loading: false,
    clubs_user: [],
    club: null,
    club_profile: null,
    clubs: [],
    clubs_meta: null,
    member_of_clubs: [],
    board_of_clubs: [],
    followed_clubs: [],
    impressions_club: [],

    continents: [],
    countries: [],
    cantons: [],
    districts: [],
    municipalities: [],
};

export default createReducer(initialState, {
    [GET_CLUBS_BOARDOF]: (state, {board_of_clubs}) => ({
        board_of_clubs,
    }),
    [GET_CLUBS_USER]: (state, {clubs_user}) => ({
        clubs_user,
    }),
    [GET_CLUBS_MEMBEROF]: (state, {member_of_clubs}) => ({
        member_of_clubs,
    }),
    [GET_CLUBBYID]: (state, {club}) => ({
        club,
    }),
    [GET_CLUB_PROFILEBYID]: (state, {club_profile}) => ({
        club_profile,
    }),
    [GET_CLUBS]: (state, {payload}) => ({
        clubs: payload.clubs,
        clubs_meta: payload.meta,
    }),
    [GET_CLUB_FOLLOWED]: (state, {followed_clubs}) => ({
        followed_clubs,
    }),
    [GET_CLUB_IMPRESSIONS]: (state, {impressions_club}) => ({
        impressions_club,
    }),
    [GET_CONTINENTS]: (state, {continents}) => ({
        continents,
    }),
    [GET_COUNTRIES]: (state, {countries}) => ({
        countries,
    }),
    [GET_CANTONS]: (state, {cantons}) => ({
        cantons,
    }),
    [GET_DISTRICTS]: (state, {districts}) => ({
        districts,
    }),
    [GET_MUNICIPALITIES]: (state, {municipalities}) => ({
        municipalities,
    }),
    [CLEAR]: (state, action) => RESET_STORE,
});
