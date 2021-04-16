import createReducer, {RESET_STORE} from '../createReducer';
import {showMessage, errorHTTP} from '../utils/utils';
import AsyncStorage from '@react-native-community/async-storage';
import {getClub, getImpressionsByClubId} from './club';

export const GET_USER_FEED = 'Feed.GET_USER_FEED';
export const GET_FEED_TIMELINE = 'Feed.GET_FEED_TIMELINE';
export const SET_FILTER_OPTION = 'Feed.SET_FILTER_OPTION';
export const SET_SELECT_CLUBS = 'Feed.SET_SELECT_CLUBS';
export const SET_FEED_SETTINGS = 'Feed.SET_FEED_SETTINGS';
export const SET_CLUB_NAME = 'Feed.SET_CLUB_NAME';
export const SET_TYPE = 'Feed.SET_TYPE';
export const CLEAR = 'Feed.CLEAR';

// ------------------------------------
// Actions
// ------------------------------------
const USER_FEED_PERPAGE = 20;
export const getUserFeed = (nextPage, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;

    const {
        user_feed,
        user_feed_meta,
        feed_options,
        selected_clubs,
        myinterest,
        selected_categories,
        nearyby,
        region,
        city,
        zip,
    } = getState().feed;
    console.log('selected_clubs', selected_clubs);
    let isAll = true;
    const includes = Object.keys(feed_options)
        .filter(key => {
            if (!feed_options[key]) {
                isAll = false;
                return false;
            }
            return true;
        })
        .join(',');

    var nearby_param = null;
    if (nearyby) {
        nearby_param = `${
            region && region.length > 0 ? '&region=' + region : ''
        }${city && city.length > 0 ? '&city=' + city : ''}${
            zip && zip.length > 0 ? '&zip=' + zip : ''
        }`;
    }

    var page = 1;
    if (nextPage && user_feed_meta) {
        page = user_feed_meta.current_page + 1;
        if (page > user_feed_meta.last_page) {
            callback && callback();
            return;
        }
    }
    const url = `/user-feed?per_page=${USER_FEED_PERPAGE}&page=${page}${
        !isAll ? '&includes=' + includes : ''
    }${selected_clubs.length > 0 ? '&clubs=' + selected_clubs.join(',') : ''}${
        myinterest && selected_categories.length > 0
            ? '&interest=' + selected_categories.join(',')
            : ''
    }${nearby_param && nearby_param.length > 0 ? nearby_param : ''}`;
    console.log('url', url);

    return fetch(url, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('getUserFeed:', res);
            if (res && res.data) {
                if (page > 1) {
                    await dispatch({
                        type: GET_USER_FEED,
                        payload: {
                            user_feed: [...user_feed, ...res.data],
                            meta: res.meta,
                        },
                    });
                } else
                    await dispatch({
                        type: GET_USER_FEED,
                        payload: {user_feed: res.data, meta: res.meta},
                    });
            }
            callback && callback(res.data);
        },
        failure: async err => {
            console.log('err', err);
            callback && callback();
            if (!nextPage)
                await dispatch({
                    type: GET_USER_FEED,
                    payload: {user_feed: [], meta: null},
                });
        },
    });
};
export const updateUserFeed = user_feed => (dispatch, getState, {fetch}) => {
    const {user_feed_meta} = getState().feed;
    dispatch({type: GET_USER_FEED, payload: {user_feed, meta: user_feed_meta}});
};
export const getFeedTimeline = (club_id, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    console.log('club_id', club_id);
    const {user, token} = getState().user;
    return fetch(`/club-feed/${club_id}?per_page=50&page=1`, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('getFeedTimeline:', res);
            if (res && res.data) {
                callback && callback(res.data);
                await dispatch({
                    type: GET_FEED_TIMELINE,
                    feed_timeline: res.data,
                });
            } else callback && callback(false);
        },
        failure: err => {
            callback && callback(err.status == 404 ? {notfound: true} : false);
            dispatch({type: GET_FEED_TIMELINE, feed_timeline: []});
            console.log('getFeedTimeline:err', err);
            if (err.status == 404) {
                dispatch(getUserFeed());
            }
        },
    });
};

/***********************************  News ***********************************/
export const createNews = (body, callback) => (dispatch, getState, {fetch}) => {
    const {user, token} = getState().user;
    console.log('create news', `/users/${user.id}/clubs/${body.club_id}/news`, {
        ...body,
        published_by: user.id,
    });
    return fetch(`/users/${user.id}/clubs/${body.club_id}/news`, {
        method: 'POST',
        contentType: 'multipart/form-data',
        body: {
            ...body,
            published_by: user.id,
        },
        token,
        success: async res => {
            console.log('createNews', res);
            if (res && res.data) {
                showMessage('Created news successful!', true);
                callback && callback(res.data);
                dispatch(getUserFeed());
            } else {
                callback && callback(false);
            }
        },
        failure: err => {
            console.log('createNews err', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
/***********************************  Event ***********************************/
export const createEvent = (body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    console.log(`/users/${user.id}/events`, body);
    try {
        return fetch(`/users/${user.id}/events`, {
            method: 'POST',
            contentType: 'multipart/form-data',
            body,
            token,
            success: async res => {
                console.log('createEvent', res);
                if (res && res.data) {
                    showMessage('Created event successful!', true);
                    callback && callback(res.data);
                    dispatch(getUserFeed());
                } else {
                    callback && callback(false);
                }
            },
            failure: err => {
                console.log('createEvent err', err);
                callback && callback(false);
                errorHTTP(err);
            },
        });
    } catch (error) {
        showMessage(JSON.stringify(error));
        callback && callback(false);
    }
};
/***********************************  Post ***********************************/
export const createPost = (body, callback) => (dispatch, getState, {fetch}) => {
    const {user, token} = getState().user;
    console.log(`/users/${user.id}/clubs/${body.club_id}/posts`, {
        ...body,
        posted_by: user.id,
        visibility: 1,
    });
    return fetch(`/users/${user.id}/clubs/${body.club_id}/posts`, {
        method: 'POST',
        contentType: 'multipart/form-data',
        body: {
            ...body,
            posted_by: user.id,
            visibility: 1,
        },
        token,
        success: async res => {
            console.log('createPost', res);
            if (res && res.data) {
                showMessage('Created event successful!', true);
                callback && callback(true);
                dispatch(getUserFeed());
            } else {
                callback && callback(false);
            }
        },
        failure: err => {
            console.log('createPost err', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
/***********************************  Impression ***********************************/
export const createImpression = (body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch(`/clubs/${body.club_id}/impressions`, {
        method: 'POST',
        contentType: 'multipart/form-data',
        body: {
            ...body,
        },
        token,
        success: async res => {
            console.log('createImpression', res);
            if (res && res.data) {
                showMessage('Created impression successful!', true);
                callback && callback(res.data);
                dispatch(getImpressionsByClubId(body.club_id));
                dispatch(getUserFeed());
            } else {
                callback && callback(false);
            }
        },
        failure: err => {
            console.log('createImpression err', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};

export const setFeedOption = values => async (dispatch, getState, {fetch}) => {
    const {feed_options} = getState().feed;
    const new_feed_options = {
        ...feed_options,
        ...values,
    };
    dispatch({type: SET_FILTER_OPTION, new_feed_options});
    try {
        await AsyncStorage.setItem(
            'feed_options',
            JSON.stringify(new_feed_options),
        );
    } catch (e) {
        alert(JSON.stringify(e));
    }
};
export const selectClubs = (selected_clubs, callback) => async (
    dispatch,
    getState,
    {fetch},
) => {
    dispatch({type: SET_SELECT_CLUBS, selected_clubs});
    if (selected_clubs[0])
        dispatch(
            getClub(selected_clubs[0], club => {
                console.log('club', club);
                dispatch({type: SET_CLUB_NAME, name: club.name});
                callback && callback();
            }),
        );
};
export const setFilterType = (type, callback) => async (
    dispatch,
    getState,
    {fetch},
) => {
    dispatch({type: SET_TYPE, name: type});
    callback && callback();
};
export const setFeedSettings = feed_settings => async (
    dispatch,
    getState,
    {fetch},
) => {
    dispatch({type: SET_FEED_SETTINGS, feed_settings});
};
export const clear = () => ({type: CLEAR});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    loading: false,
    user_feed: [],
    user_feed_meta: null,
    feed_timeline: [],
    feed_options: {
        members: false,
        event: false,
        news: false,
        finance: false,
        sponsor: false,
    },
    selected_clubs: [],
    //feed setting
    myinterest: false,
    selected_categories: [],
    club_name: null,
    filter_type: 'all',

    nearyby: false,
    zip: null,
    city: null,
    region: null,
};

export default createReducer(initialState, {
    [GET_USER_FEED]: (state, {payload}) => ({
        user_feed: payload.user_feed,
        user_feed_meta: payload.meta,
    }),
    [GET_FEED_TIMELINE]: (state, {feed_timeline}) => ({
        feed_timeline,
    }),
    [SET_FILTER_OPTION]: (state, {new_feed_options}) => ({
        feed_options: new_feed_options,
    }),
    [SET_SELECT_CLUBS]: (state, {selected_clubs}) => ({
        selected_clubs,
    }),
    [SET_CLUB_NAME]: (state, {name}) => ({
        club_name: name,
    }),
    [SET_TYPE]: (state, {name}) => ({
        filter_type: name,
    }),
    [SET_FEED_SETTINGS]: (state, {feed_settings}) => ({
        myinterest: feed_settings.hasOwnProperty('myinterest')
            ? feed_settings.myinterest
            : state.myinterest,
        selected_categories: feed_settings.hasOwnProperty('selected_categories')
            ? feed_settings.selected_categories
            : state.selected_categories,

        nearyby: feed_settings.hasOwnProperty('nearyby')
            ? feed_settings.nearyby
            : state.nearyby,
        zip: feed_settings.hasOwnProperty('zip')
            ? feed_settings.zip
            : state.zip,
        city: feed_settings.hasOwnProperty('city')
            ? feed_settings.city
            : state.city,
        region: feed_settings.hasOwnProperty('region')
            ? feed_settings.region
            : state.region,
    }),
    [CLEAR]: (state, action) => RESET_STORE,
});
