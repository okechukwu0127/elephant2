import React from 'react';
import {View, Text, Platform, TouchableOpacity, TextInput} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {appleLogin, googleLogin, updateUser} from '../../reducers/user';
import {connect} from 'react-redux';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import AppConfig from '../../config/AppConfig';
import {showMessage} from '../../utils/utils';
import {withTranslation} from 'react-i18next';

class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestform: false,
            email: null,
            username: null,
            appleAuthRequestResponse: null,
        };
        GoogleSignin.configure({
            offlineAccess: true,
            webClientId: AppConfig.google_webClientId,
        });
    }
    async onAppleButtonPress() {
        const {t} = this.props;
        // performs login request
        if (appleAuth.isSupported) {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [
                    appleAuth.Scope.EMAIL,
                    appleAuth.Scope.FULL_NAME,
                ],
            });
            console.log('======performRequest', appleAuthRequestResponse);
            // get current authentication state for user
            // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
            //const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

            // get current authentication state for user
            //const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
            //console.log("======credentialState", credentialState);
            // use credentialState response to ensure the user is authenticated
            //if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
            // user is authenticated
            this.props.appleLogin(appleAuthRequestResponse, async res => {
                if (res) {
                    console.log('======res', res);
                    const {email, first_name, last_name, profile} = res;
                    if (profile.incomplete) {
                        this.setState({
                            email,
                            username:
                                first_name || last_name
                                    ? `${first_name || ''} ${last_name || ''}`
                                    : null,
                            requestform: true,
                        });
                    } else {
                        if (this.props.onClose) await this.props.onClose();
                        if (this.props.nextAfterLogin)
                            setTimeout(() => {
                                if (this.props.nextAfterLogin?.includes(':')) {
                                    this.props.navigation.navigate('Terms', {
                                        nextAfterLogin: this.props.nextAfterLogin?.split(
                                            ':',
                                        )[0],
                                        club_id: parseInt(
                                            this.props.nextAfterLogin?.split(
                                                ':',
                                            )[1],
                                            10,
                                        ),
                                    });
                                    return;
                                }
                                this.props.navigation.navigate('Terms', {
                                    nextAfterLogin: this.props.nextAfterLogin,
                                });
                            }, 10);
                    }
                }
            });
        } else {
            alert(t('supportapple'));
        }
    }
    googleSignIn = async () => {
        const {t, nextAfterLogin, onClose} = this.props;
        console.log('Auth -> googleSignIn -> nextAfterLogin', nextAfterLogin);
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('google signin:', userInfo);
            this.props.googleLogin(userInfo, res => {
                if (res) {
                    if (onClose) onClose();
                    setTimeout(() => {
                        this.props.navigation.navigate('Terms', {
                            nextAfterLogin: nextAfterLogin
                                ? nextAfterLogin
                                : 'MainScreen',
                        });
                    }, 500);
                }
            });
            //this.setState({ userInfo });
        } catch (error) {
            console.log('Auth -> googleSignIn -> error', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                //alert('user cancelled the login flow')
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                alert(t('inprogress'));
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                alert(t('outdated'));
                // play services not available or outdated
            } else {
                //alert(JSON.stringify(error))
                // some other error happened
            }
        }
    };
    async onLogout() {
        // performs logout request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGOUT,
        });

        // get current authentication state for user
        const credentialState = await appleAuth.getCredentialStateForUser(
            appleAuthRequestResponse.user,
        );

        // use credentialState response to ensure the user credential's have been revoked
        if (credentialState === AppleAuthCredentialState.REVOKED) {
            // user is unauthenticated
        }
    }
    onAppleConfirm() {
        const {t} = this.props;
        const {username, email} = this.state;
        if (email && email.length > 0) {
            if (username && username.length > 0) {
                var firstName = username
                    .split(' ')
                    .slice(0, -1)
                    .join(' ');
                var lastName = username
                    .split(' ')
                    .slice(-1)
                    .join(' ');
                if (
                    firstName &&
                    firstName.length > 0 &&
                    lastName &&
                    lastName.length > 0
                ) {
                    const {user} = this.props;
                    const param = {
                        id: user.id,
                        first_name: firstName,
                        last_name: lastName,
                        email,
                        canton: user.canton,
                        incomplete: 0,
                    };
                    this.props.updateUser(param, async res => {
                        if (res) {
                            this.setState({
                                requestform: false,
                            });
                            if (this.props.onClose) await this.props.onClose();
                        }
                    });
                } else showMessage(t('invalidname'));
            } else showMessage(t('invalidname'));
        } else {
            showMessage(t('invalidemail'));
        }
    }
    onClose() {
        if (this.state.requestform) {
            return;
        }
        this.setState({
            requestform: false,
        });
        if (this.props.onClose) this.props.onClose();
    }
    render() {
        const {requestform, username, email} = this.state;
        const {nextAfterLogin, nextAfterSignout} = this.props;
        const {t} = this.props;
        return requestform ? (
            <View
                style={[
                    s.modalContainer,
                    {
                        backgroundColor: this.props.noBackground
                            ? 'transparent'
                            : 'white',
                    },
                ]}>
                <View style={[s.inputContainer]}>
                    <FeatherIcon
                        name="user"
                        size={23}
                        color={'black'}
                        style={s.inputIcon}
                    />
                    <TextInput
                        style={[s.input]}
                        value={username}
                        placeholder="Full Name"
                        onChangeText={Username =>
                            this.setState({username: Username})
                        }
                    />
                </View>
                <View style={[s.inputContainer]}>
                    <FeatherIcon
                        name="mail"
                        size={20}
                        color={'black'}
                        style={s.inputIcon}
                    />
                    <TextInput
                        style={[s.input]}
                        value={email}
                        placeholder="E-Mail"
                        keyboardType="email-address"
                        onChangeText={Email => this.setState({email: Email})}
                    />
                </View>
                <TouchableOpacity
                    style={[
                        s.socialBtn,
                        {
                            backgroundColor: 'black',
                            marginTop: 10,
                            marginBottom: 50,
                        },
                    ]}
                    onPress={() => {
                        this.onAppleConfirm();
                    }}>
                    <Text style={s.socialBtnLabel}>
                        <Icon name="apple" size={15} color="white" />{' '}
                        {t('complete')}
                    </Text>
                </TouchableOpacity>
            </View>
        ) : (
            <View
                style={[
                    s.modalContainer,
                    {
                        backgroundColor: this.props.noBackground
                            ? 'transparent'
                            : 'white',
                        paddingTop: 20,
                    },
                ]}>
                <Text style={s.title}>{t('title')}</Text>
                {Platform.OS == 'ios' && (
                    <TouchableOpacity
                        style={[s.socialBtn, {backgroundColor: 'black'}]}
                        onPress={() => {
                            this.onAppleButtonPress();
                        }}>
                        <Text style={s.socialBtnLabel}>
                            <Icon name="apple" size={15} color="white" />{' '}
                            {t('applelogin')}
                        </Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[s.socialBtn, {backgroundColor: '#4285F4'}]}
                    onPress={async () => {
                        const isSignedIn = await GoogleSignin.isSignedIn();
                        if (isSignedIn) {
                            try {
                                await GoogleSignin.revokeAccess();
                                await GoogleSignin.signOut();
                                this.setState({user: null}); // Remember to remove the user from your app's state as well
                            } catch (error) {
                                console.error(error);
                            }
                        }
                        this.googleSignIn();
                    }}>
                    <Text style={s.socialBtnLabel}>
                        <Icon name="google" size={15} color="white" />{' '}
                        {t('googlelogin')}
                    </Text>
                </TouchableOpacity>
                <View style={s.dividerContainer}>
                    <View style={s.divider} />
                    <Text style={s.order}>{t('or')}</Text>
                    <View style={s.divider} />
                </View>
                <TouchableOpacity
                    style={[s.ghostBtn, {marginBottom: 20}]}
                    onPress={async () => {
                        if (this.props.onClose) await this.props.onClose();
                        await this.props.navigation.navigate('Signup', {
                            nextAfterSignout,
                        });
                    }}>
                    <Text style={s.emailSignup}>{t('register')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={s.haveaccountContainer}
                    onPress={async () => {
                        if (this.props.onClose) await this.props.onClose();
                        await this.props.navigation.navigate('Login', {
                            nextAfterLogin,
                        });
                    }}>
                    <Text style={s.haveaccount}>
                        {t('haveaccount')}{' '}
                        <Text style={s.Anmelden}>{t('login')}</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
});

const mapDispatchToProps = {
    appleLogin,
    googleLogin,
    updateUser,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation('authmodal')(Auth));
