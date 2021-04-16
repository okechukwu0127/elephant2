import createReducer, {RESET_STORE} from '../createReducer';
import {NavigationActions as navigation} from 'react-navigation';
import {showMessage, errorHTTP} from '../utils/utils';
import AsyncStorage from '@react-native-community/async-storage';
import {getClubsByUser} from './club';
import {setFeedOption, clear as clear_feed} from './feed';
import {clear as clear_clubs} from './club';
import firebase from 'react-native-firebase';

export const UPDATE_USER = 'User.UPDATE_USER';
export const SET_TOKEN = 'User.SET_TOKEN';
export const SET_LOCATION = 'User.SET_LOCATION';
export const SET_USER_PROFILE = 'User.SET_USER_PROFILE';
export const SWITCH_AUTH = 'User.SWITCH_AUTH';
export const SET_FCMTOKEN = 'User.SET_FCMTOKEN';
export const CLEAR = 'User.CLEAR';
export const SET_LOADING = 'User.SET_LOADING';
export const SET_LOADING_PROFILE = 'User.SET_LOADING_PROFILE';

// ------------------------------------
// Actions
// ------------------------------------
export const createUser = (
    {first_name, last_name, email, password, phone},
    callback,
) => (dispatch, getState, {fetch}) => {
    dispatch({type: SET_LOADING, isLoadingUser: true});
    return fetch('/users', {
        method: 'POST',
        contentType: 'application/json',
        body: {
            first_name,
            last_name,
            email,
            password,
            phone,
            password_confirmation: password,
        },
        success: async res => {
            console.log('🚀 ~ file: user.js ~ line 56 ~ res', res);

            if (res && res.accessToken && res.user) {
                const user = res.user;
                await dispatch(setToken(res.accessToken));
                await dispatch({type: UPDATE_USER, user});
                dispatch(getUserProfile(user.id));
                dispatch(getClubsByUser());
                showMessage('Registration successful!', true);
                //dispatch(switchAuth());
                callback && callback(user);
            } else {
                showMessage('Registration is failed');
                callback && callback(null);
            }
        },
        failure: err => {
            console.log('🚀 ~ file: user.js ~ line 58 ~ err', err);

            dispatch({type: SET_LOADING, isLoadingUser: false});
            dispatch({type: SET_LOADING_PROFILE, isLoadingProfile: false});
            errorHTTP(err);
            callback && callback(null);
        },
    });
};
export const googleLogin = (body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    dispatch({type: SET_LOADING, isLoadingUser: true});
    console.log('/login/google/callback', body);
    return fetch('/login/google/callback', {
        method: 'POST',
        contentType: 'application/json',
        body,
        success: async res => {
            console.log('/login/google/callback', res);
            if (res && res.accessToken && res.user) {
                console.log('user', res);
                const user = res.user;
                await dispatch(setToken(res.accessToken));
                await dispatch({type: UPDATE_USER, user});
                showMessage('Login successful!', true);
                dispatch(getUserProfile(user.id));
                dispatch(getClubsByUser());
                dispatch(switchAuth());
                callback && callback(true);
            } else {
                showMessage('Login is failed');
                callback && callback(false);
            }
        },
        failure: err => {
            console.log('/login/google/callback err', err);
            errorHTTP(err);
            callback && callback(false);
        },
    });
};
export const appleLogin = (body, callback) => (dispatch, getState, {fetch}) => {
    console.log('/login/apple/callback', body);
    dispatch({type: SET_LOADING, isLoadingUser: true});
    return fetch('/login/apple/callback', {
        method: 'POST',
        contentType: 'application/json',
        body,
        success: async res => {
            console.log('/login/apple/callback', res);
            if (res && res.accessToken && res.user) {
                console.log('user', res);
                const user = res.user;
                await dispatch(setToken(res.accessToken));
                await dispatch({type: UPDATE_USER, user});
                showMessage('Login successful!', true);
                dispatch(getUserProfile(user.id));
                dispatch(getClubsByUser());
                dispatch(switchAuth());
                callback && callback(user);
            } else {
                showMessage('Login is failed');
                callback && callback(false);
            }
        },
        failure: err => {
            console.log('/login/apple/callback err', err);
            errorHTTP(err);
            callback && callback(false);
        },
    });
};
export const login = ({email, password}, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    return fetch('/auth/login', {
        method: 'POST',
        contentType: 'application/json',
        body: {
            email,
            password,
        },
        success: async res => {
            if (res && res.accessToken && res.user) {
                console.log('user', res);
                const user = res.user;
                await dispatch(setToken(res.accessToken));
                await dispatch({type: UPDATE_USER, user});
                showMessage('Login successful!', true);
                callback && callback(true);
                dispatch(getUserProfile(user.id));
                dispatch(getClubsByUser());
                dispatch(switchAuth());
            } else {
                showMessage('E-Mail, Passwort oder beides stimmen nicht.');
                callback && callback(false);
            }
        },
        failure: err => {
            errorHTTP(err);
            callback && callback(false);
        },
    });
};

export const getUser = () => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    dispatch({type: SET_LOADING, isLoadingUser: true});
    return fetch('/user', {
        method: 'POST',
        contentType: 'application/json',
        token,
        success: async res => {
            if (res && res.data) {
                console.log('user:', res);
                await dispatch({type: UPDATE_USER, user: res.data});
                dispatch(getUserProfile(res.data.id));
                dispatch(getClubsByUser());
            }
        },
        failure: err => {
            console.log('getUser -> err', err);
        },
    });
};
export const updateUser = (user, callback) => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    dispatch({type: SET_LOADING, isLoadingUser: true});
    console.log(`/users/${user.id}`, {
        _method: 'PUT',
        ...user,
        canton: user && user.canton ? user.canton : 'canton',
    });
    return fetch(`/users/${user.id}`, {
        method: 'POST',
        contentType: 'application/json',
        body: {
            _method: 'PUT',
            ...user,
            canton: user && user.canton ? user.canton : 'canton',
        },
        token,
        success: async res => {
            if (res && res.user) dispatch({type: UPDATE_USER, user: res.user});
            callback && callback(res && res.success);
        },
        failure: err => {
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const logout = () => async (dispatch, getState, {fetch}) => {
    await dispatch({type: SET_TOKEN, token: null});
    await dispatch({type: UPDATE_USER, user: null});
    await dispatch({type: SET_USER_PROFILE, user_profile: null});
    await dispatch(clear_feed());
    await dispatch(clear_clubs());
    try {
        await AsyncStorage.clear();
    } catch (e) {
        alert(JSON.stringify(e));
    }
};
export const setToken = token => async (dispatch, getState, {fetch}) => {
    try {
        console.log('accesstoken', token);
        await AsyncStorage.setItem('accesstoken', token);
    } catch (e) {
        alert(JSON.stringify(e));
    }
    await dispatch({type: SET_TOKEN, token});
};
export const loadToken = () => async (dispatch, getState, {fetch}) => {
    try {
        dispatch({type: SET_LOADING, isLoadingUser: true});
        const feed_options = await AsyncStorage.getItem('feed_options');
        console.log('feed_options', feed_options);
        if (feed_options != null) {
            await dispatch(setFeedOption(JSON.parse(feed_options)));
        }
        const token = await AsyncStorage.getItem('accesstoken');
        console.log('access token', token);
        if (token != null) {
            await dispatch({type: SET_TOKEN, token});
            await dispatch(getUser());
        }
        dispatch({type: SET_LOADING, isLoadingUser: false});
    } catch (e) {
        alert(JSON.stringify(e));
    }
};
export const getUserProfile = user_id => (dispatch, getState, {fetch}) => {
    const {token} = getState().user;
    dispatch({type: SET_LOADING_PROFILE, isLoadingProfile: true});
    console.log(`/users/${user_id}/profiles`);
    return fetch(`/users/${user_id}/profiles`, {
        method: 'GET',
        contentType: 'application/json',
        token,
        success: async res => {
            console.log('getUserProfile:', res);
            dispatch({type: SET_LOADING_PROFILE, isLoadingProfile: false});
            if (res && res.data) {
                await dispatch({
                    type: SET_USER_PROFILE,
                    user_profile: res.data,
                });
            }
        },
        failure: err => {
            console.log('getUserProfile err:', err);
        },
    });
};
export const createUserProfile = (user_id, body) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {token, user} = getState().user;
    dispatch({type: SET_LOADING_PROFILE, isLoadingProfile: true});
    console.log(`create /users/${user_id}/profiles`, {
        paypal_email: user.email,
        ...body,
    });
    return fetch(`/users/${user_id}/profiles`, {
        method: 'POST',
        contentType: 'application/json',
        body: {
            paypal_email: user.email,
            ...body,
        },
        token,
        success: async res => {
            dispatch({type: SET_LOADING_PROFILE, isLoadingProfile: false});
            console.log('createUserProfile:', res);
            if (res && res.data) {
                await dispatch({
                    type: SET_USER_PROFILE,
                    user_profile: res.data,
                });
            }
        },
        failure: err => {
            dispatch({type: SET_LOADING, isLoadingUser: false});
            console.log('createUserProfile err:', err);
            errorHTTP(err);
        },
    });
};
export const updateUserProfile = (user_id, body, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    dispatch({type: SET_LOADING_PROFILE, isLoadingProfile: true});
    const {token, user_profile} = getState().user;
    if (user_profile && user_profile.id) {
        console.log(`update /users/${user_id}/profiles/${user_profile.id}`, {
            ...body,
            _method: 'PUT',
        });
        return fetch(`/users/${user_id}/profiles/${user_profile.id}`, {
            method: 'POST',
            contentType: 'multipart/form-data',
            body: {
                ...body,
                _method: 'PUT',
            },
            token,
            success: async res => {
                dispatch({type: SET_LOADING_PROFILE, isLoadingProfile: false});
                console.log('updateUserProfile:', res);
                if (res && res.data) {
                    callback && callback(true);
                    await dispatch({
                        type: SET_USER_PROFILE,
                        user_profile: res.data,
                    });
                    dispatch(getUserProfile(user_id));
                } else callback && callback(false);
            },
            failure: err => {
                dispatch({type: SET_LOADING_PROFILE, isLoadingProfile: false});
                console.log('updateUserProfile err:', err);
                callback && callback(false);
                errorHTTP(err);
            },
        });
    }
    return dispatch(createUserProfile(user_id, body));
};
export const resetPassword = (email, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    return fetch('/password/email', {
        method: 'POST',
        contentType: 'application/json',
        body: {
            email,
        },
        success: async res => {
            console.log('resetPassword:', res);
            showMessage(res.message ? res.message : 'sent reset email', true);
            callback && callback(true);
        },
        failure: err => {
            console.log('resetPassword err:', err);
            callback && callback(false);
            errorHTTP(err);
        },
    });
};
export const setLocation = location => async (dispatch, getState, {fetch}) => {
    await dispatch({type: SET_LOCATION, location});
};
export const switchAuth = () => async (dispatch, getState, {fetch}) => {
    let fcmToken = null;
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        fcmToken = await firebase.messaging().getToken();
    } else {
        try {
            await firebase.messaging().requestPermission();
            fcmToken = await firebase.messaging().getToken();
        } catch (error) {
            console.log('permission rejected');
        }
    }

    const {switchAuth, fcm_token} = getState().user;
    await dispatch({type: SWITCH_AUTH, switchAuth: !switchAuth});
    fcmToken && dispatch(sendFCMtoken(fcmToken));
};
export const sendFCMtoken = fcm_token => (dispatch, getState, {fetch}) => {
    const {token, user} = getState().user;
    dispatch({type: SET_FCMTOKEN, fcm_token});
    if (user && user.id && fcm_token) {
        return fetch(`/users/${user.id}/set-fcm-token`, {
            method: 'POST',
            contentType: 'application/json',
            body: {
                fcm_token,
            },
            token,
            success: async res => {
                console.log('sendFCMtoken:', res);
            },
            failure: err => {
                console.log('sendFCMtoken err:', err);
            },
        });
    }
};
export const navigateScreen = (screen, params) => (
    dispatch,
    getState,
    {fetch},
) => {
    dispatch(
        navigation.navigate({
            routeName: screen,
            ...(params ? {params} : {}),
        }),
    );
};

export const updatePrivacySettings = (user_details_privacy, callback) => (
    dispatch,
    getState,
    {fetch},
) => {
    const {user, token} = getState().user;
    console.log('url', `/user/${user?.id}/settings`);
    return fetch(`/user/${user?.id}/settings`, {
        method: 'POST',
        contentType: 'application/json',
        body: {
            user_details_privacy: JSON.stringify(user_details_privacy),
        },
        token,
        success: async res => {
            console.log('🚀 ~ file: user.js ~ line 442 ~ res', res);
            dispatch(getUser());
        },
        failure: err => {
            console.log('🚀 ~ file: user.js ~ line 445 ~ err', err);
            errorHTTP(err);
            callback && callback(false);
        },
    });
};

export const clear = () => ({type: CLEAR});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    loading: true,
    user: null,
    token: null,
    user_profile: null,
    location: null,
    switchAuth: false,
    fcm_token: null,
    isLoadingUser: false,
    isLoadingProfile: false,
};

export default createReducer(initialState, {
    [SET_LOADING]: (state, {isLoadingUser}) => ({
        isLoadingUser: isLoadingUser,
    }),
    [SET_LOADING_PROFILE]: (state, {isLoadingProfile}) => ({
        isLoadingProfile: isLoadingProfile,
    }),
    [SET_FCMTOKEN]: (state, {fcm_token}) => ({
        fcm_token,
    }),
    [UPDATE_USER]: (state, {user}) => ({
        isLoadingUser: false,
        user,
    }),
    [SET_TOKEN]: (state, {token}) => ({
        token,
    }),
    [SET_USER_PROFILE]: (state, {user_profile}) => ({
        isLoadingUser: false,
        user_profile,
    }),
    [SET_LOCATION]: (state, {location}) => ({
        location,
    }),
    [SWITCH_AUTH]: (state, {switchAuth}) => ({
        switchAuth,
    }),
    [CLEAR]: (state, action) => RESET_STORE,
});
