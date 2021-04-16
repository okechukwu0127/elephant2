import createReducer, {RESET_STORE} from '../createReducer';
import {errorHTTP} from '../utils/utils';

export const GET_CATEGORIES = 'Category.GET_CATEGORIES';
export const GET_ALL_CATEGORIES = 'Category.GET_ALL_CATEGORIES';
export const GET_CATEGORIES_EVENTNEWS = 'Category.GET_CATEGORIES_EVENTNEWS';
export const GET_VENUES = 'Category.GET_VENUES';
export const LOADING_ALL_CATEGORIES = 'Category.LOADING_ALL_CATEGORIES';
export const CLEAR = 'Category.CLEAR';

// ------------------------------------
// Actions
// ------------------------------------
export const getCategoriesForNewsEvent = club_id => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch(`/club/${club_id}/event-news-categories`, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('getCategoriesForNewsEvent:', res);
            if (res && res.data) {
                await dispatch({
                    type: GET_CATEGORIES_EVENTNEWS,
                    event_categories: res.data,
                });
            }
        },
        failure: err => {
            console.log('=====err', err);
        },
    });
};
export const createCategoriesForNewsEvent = (club_id, name, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token} = getState().user;
    return fetch(`/club/${club_id}/event-news-categories`, {
        method: 'POST',
        contentType: 'application/json',
        token,
        body: {
            name,
        },
        success: async res => {
            console.log('createCategoriesForNewsEvent:', res);
            if (res && res.data) {
                await dispatch(getCategoriesForNewsEvent(club_id));
                callback && callback(true);
                //await dispatch({ type: GET_CATEGORIES_EVENTNEWS, event_categories: res.DATA })
            } else callback && callback(null);
        },
        failure: err => {
            errorHTTP(err);
            callback && callback(null);
        },
    });
};
export const getClubCategories = page => (dispatch, getState, {fetch}) => {
    return fetch(
        `/club-categories/search?filter[only_parent]=1&page=${
            page != null ? page : 1
        }`,
        {
            method: 'GET',
            contentType: 'application/json',
            success: async res => {
                console.log('getClubCategories:', res);
                if (res && res.data) {
                    await dispatch({type: GET_CATEGORIES, categories: res});
                }
            },
            failure: err => console.warn(err),
        },
    );
};
export const searchClubCategories = (keyword, page) => (
    dispatch,
    getState,
    {fetch},
) => {
    if (keyword && keyword.length > 0) {
        return fetch(`/club-categories/search/${keyword}`, {
            method: 'GET',
            contentType: 'application/json',
            success: async res => {
                console.log('searchClubCategories:', res);
                if (res && res.data) {
                    await dispatch({type: GET_CATEGORIES, categories: res});
                }
            },
            failure: err => console.warn(err),
        });
    } else dispatch(getClubCategories(page));
};
export const getAllClubCategories = () => (dispatch, getState, {fetch}) => {
    dispatch({type: LOADING_ALL_CATEGORIES, loadingAllCategories: true});
    return fetch('/club-categories?all=', {
        method: 'GET',
        contentType: 'application/json',
        success: async res => {
            console.log('getAllClubCategories:', res);
            if (res && res.data) {
                await dispatch({
                    type: GET_ALL_CATEGORIES,
                    all_categories: res.data,
                });
            }
        },
        failure: err => console.warn(err),
    });
};
export const getVenueCategoires = () => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    return fetch('/venue-categories', {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('getVenueCategoires:', res);
            if (res && res.data) {
                await dispatch({type: GET_VENUES, venues: res.data});
            }
        },
        failure: err => {
            console.log('getVenueCategoires: err', err);
        },
    });
};
export const clear = () => ({type: CLEAR});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    loading: false,
    categories: [],
    event_categories: [],
    links: null,
    meta: null,
    venues: [],
    all_categories: [],
    loadingAllCategories: true,
};

export default createReducer(initialState, {
    [GET_CATEGORIES]: (state, {categories}) => ({
        categories: categories.data.sort(function(a, b) {
            return ('' + a.name).localeCompare(b.name);
        }),
        links: categories.links,
        meta: categories.meta,
    }),
    [GET_CATEGORIES_EVENTNEWS]: (state, {event_categories}) => ({
        event_categories,
    }),
    [GET_VENUES]: (state, {venues}) => ({
        venues,
    }),
    [GET_ALL_CATEGORIES]: (state, {all_categories}) => ({
        all_categories,
        loadingAllCategories: false,
    }),
    [LOADING_ALL_CATEGORIES]: (state, {loadingAllCategories}) => ({
        loadingAllCategories,
    }),
    [CLEAR]: (state, action) => RESET_STORE,
});
