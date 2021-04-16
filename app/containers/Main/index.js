import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    Linking,
    Alert,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import {getAllClubCategories} from '../../reducers/category';
import AuthModal from '../Login';
import firebase from 'react-native-firebase';
import {PRIMARY_COLOR} from '../../themes/colors';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {withTranslation} from 'react-i18next';
import {sendFCMtoken} from '../../reducers/user';
import {setFilterType, selectClubs} from '../../reducers/feed';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomePlusIcon from '../../components/HomePlusIcon';
import {getUserFeed} from '../../reducers/feed';
import {showMessage} from '../../utils/utils';
import AsyncStorage from '@react-native-community/async-storage';

export async function request_storage_runtime_permission(t) {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: t('permission_title'),
                message: t('permission_msg'),
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //Alert.alert("Storage Permission Granted.");
        } else {
            //Alert.alert("Storage Permission Not Granted");
        }
    } catch (err) {
        console.warn(err);
    }
}

class MainScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
    });
    state = {
        openAuth: false,
        activeBtn: null,
        firstTime: true,
    };
    constructor(props) {
        super(props);
        props.getAllClubCategories();
    }
    async getToken() {
        let fcmToken = await firebase.messaging().getToken();
        this.props.sendFCMtoken(fcmToken);
        console.log('fcmToken:', fcmToken);
    }
    UNSAFE_componentWillReceiveProps(props) {
        AsyncStorage.getItem('agreed_to_terms', (err, result) => {
            if (props.user && (err || !result))
                this.props.navigation.navigate('Terms');
        });
        if (props.user && this.state.firstTime) {
            props.getUserFeed(false, data => {
                if (data && data.length > 0 && this.state.firstTime) {
                    props.navigation.navigate('Feed');
                }
                this.setState({firstTime: false});
            });
        }
    }

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            this.getToken();
        } catch (error) {
            console.log('permission rejected');
        }
    }

    async createNotificationListeners() {
        firebase.notifications().onNotification(notification => {
            notification.android.setChannelId('zirkl').setSound('default');
            notification.android.setSmallIcon('ic_notification');
            notification.android.setColor('#642fd0');
            notification &&
                notification.data &&
                notification.android.setBigText(notification.data.message);
            firebase.notifications().displayNotification(notification);
        });
    }
    componentDidMount() {
        this.unsubsribe = this.props.navigation.addListener('didBlur', () => {
            this.setState({firstTime: false});
        });
        //this.checkPermission();
        this.createNotificationListeners();
        // if (Platform.OS == 'android') {
        //     request_storage_runtime_permission(this.props.t);
        //     Linking.getInitialURL().then(url => {
        //         this.navigate(url);
        //     });
        // } else {
        //     Linking.addEventListener('url', this.handleOpenURL);
        // }
        const channel = new firebase.notifications.Android.Channel(
            'zirkl',
            'zirkl',
            firebase.notifications.Android.Importance.Max,
        );
        firebase.notifications().android.createChannel(channel);

        firebase.notifications().onNotificationOpened(({notification}) => {
            console.log(
                '🚀 ~ file: index.js ~ line 126 ~ MainScreen ~ firebase.notifications ~ notification',
                notification,
            );
            if (!notification._data) return;
            this.handleNotification(notification);
        });
        // firebase.notifications().getInitialNotification(({notification}) => {
        //     console.log(
        //         '🚀 ~ file: index.js ~ line 134 ~ MainScreen ~ firebase.notifications ~ notification',
        //         notification,
        //     );
        //     Alert.alert(
        //         'Testing notifications - getinitial',
        //         JSON.stringify(notification),
        //     );
        //     showMessage(JSON.stringify(notification));
        //     if (!notification._data) return;
        //     this.handleNotification(notification);
        // });
    }

    handleNotification(notification) {
        try {
            switch (notification._data.action) {
                case 'App\\Post':
                case 'App\\PostLike':
                case 'App\\PostComment':
                    this.props.selectClubs(
                        [parseInt(notification?._data?.club_id, 10)],
                        () => {
                            this.props.setFilterType(
                                'post',
                                this.props.navigation.navigate('Feed'),
                            );
                        },
                    );
                    break;
                case 'App\\Event':
                case 'App\\EventLike':
                case 'App\\EventComment':
                    this.props.selectClubs(
                        [parseInt(notification?._data?.club_id, 10)],
                        () => {
                            this.props.setFilterType(
                                'event',
                                this.props.navigation.navigate('Feed'),
                            );
                        },
                    );
                    break;
                case 'App\\News':
                case 'App\\NewsLike':
                case 'App\\NewsComment':
                    this.props.selectClubs(
                        [parseInt(notification?._data?.club_id, 10)],
                        () => {
                            this.props.setFilterType('news', () =>
                                this.props.navigation.navigate('Feed'),
                            );
                        },
                    );
                    break;
                case 'App\\Impression':
                case 'App\\ImpressionComment':
                case 'App\\ImpressionLike':
                    this.props.selectClubs(
                        [parseInt(notification?._data?.club_id, 10)],
                        () => {
                            this.props.setFilterType('impression', () =>
                                this.props.navigation.navigate('Feed'),
                            );
                        },
                    );
                    break;
                case 'App\\Models\\ClubFeature':
                    this.props.selectClubs(
                        [parseInt(notification?._data?.club_id, 10)],
                        () => this.props.navigation.navigate('Feed'),
                    );
                    break;
                case 'App\\Club':
                case 'App\\ClubBoardMember':
                case 'App\\ClubMember':
                case 'App\\ClubUser':
                    this.props.navigation.navigate('ClubDetail', {
                        club_id: parseInt(notification?._data?.club_id, 10),
                    });
                    break;
                case 'App\\Models\\ZirklPay\\ZirklPayInvoice':
                case 'App\\Models\\ZirklPay\\ZirklPayInvoiceMember':
                    this.props.selectClubs(
                        [parseInt(notification?._data?.club_id, 10)],
                        () => {
                            this.props.setFilterType(
                                'zirklpay',
                                this.props.navigation.navigate('Feed'),
                            );
                        },
                    );
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.error('Notification error', error);
            Alert.alert('Notification handling error', JSON.stringify(error));
        }
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
        if (this.unsubsribe && typeof this.unsubsribe === 'function') {
            this.unsubsribe();
        }
    }

    handleOpenURL = event => {
        this.navigate(event.url);
    };

    navigate = url => {
        console.log('MainScreen -> url', url);
        if (!url) return;
        const {navigate} = this.props.navigation;
        const route = url.replace(/.*?:\/\//g, '');
        const club_id = route.match(/\/([^\/]+)\/?$/)[1];
        const routeName = route.split('/')[0];

        if (routeName === 'club') {
            navigate('ClubDetail', {club_id});
        }
    };

    onSwipe(gestureName, gestureState) {
        console.log('onSwipe -> gestureName', gestureName);
        const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
        const {user} = this.props;
        switch (gestureName) {
            case SWIPE_UP:
                break;
            case SWIPE_DOWN:
                break;
            case SWIPE_LEFT:
                user && this.props.navigation.navigate('FeedTab');
                break;
            case SWIPE_RIGHT:
                break;
        }
    }
    renderButton(index, icon, text, callback, hasPlus) {
        const {activeBtn} = this.state;
        return (
            <TouchableOpacity
                style={[
                    s.btnContainer,
                    activeBtn == index ? {backgroundColor: PRIMARY_COLOR} : {},
                ]}
                onPress={() => callback && callback()}
                onPressIn={() => this.setState({activeBtn: index})}
                onPressOut={() => this.setState({activeBtn: null})}
                activeOpacity={1}>
                {icon === 'qrcode' ? (
                    <FontAwesome
                        name="qrcode"
                        size={45}
                        color={activeBtn == index ? 'white' : PRIMARY_COLOR}
                        style={s.btnIcon}
                    />
                ) : icon === 'home' ? (
                    <HomePlusIcon
                        height={45}
                        width={45}
                        color={activeBtn == index ? 'white' : PRIMARY_COLOR}
                        style={s.btnIcon}
                    />
                ) : (
                    <Icon
                        name={icon}
                        size={45}
                        color={activeBtn == index ? 'white' : PRIMARY_COLOR}
                        style={s.btnIcon}
                    />
                )}
                <Text
                    style={[
                        s.btnLabel,
                        activeBtn == index ? {color: 'white'} : {},
                    ]}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }
    render() {
        const config = {
            velocityThreshold: 0.1,
            directionalOffsetThreshold: 50,
        };
        const {user, loading} = this.props;
        const {t} = this.props;
        return (
            <GestureRecognizer
                onSwipe={(direction, state) => this.onSwipe(direction, state)}
                config={config}
                style={{flex: 1}}>
                <View style={s.container}>
                    {!loading && !user && (
                        <Text style={s.title}>{t('title')}</Text>
                    )}
                    <View style={s.btnRow}>
                        {this.renderButton(0, 'globe', t('discover'), () => {
                            this.props.navigation.navigate('Discover');
                        })}
                        {/* {this.renderButton(1, 'map-pin', t('geosearch'), () => {
                            this.props.navigation.navigate('ClubMap');
                        })} */}
                    </View>
                    <View style={s.btnRow}>
                        {this.renderButton(2, 'search', t('search'), () => {
                            this.props.navigation.navigate('SearchClub');
                        })}
                        {this.renderButton(3, 'qrcode', t('qrcode'), () => {
                            this.props.navigation.navigate('QRCode');
                        })}
                    </View>
                    {this.renderButton(
                        4,
                        'home',
                        t('feed'),
                        () => {
                            if (this.props.user)
                                this.props.navigation.navigate('CreateClub');
                            else this.setState({openAuth: true});
                        },
                        true,
                    )}
                    <AuthModal
                        isVisible={this.state.openAuth}
                        onClose={() => this.setState({openAuth: false})}
                        navigation={this.props.navigation}
                        nextAfterLogin="CreateClub"
                        nextAfterSignout="CreateClub"
                    />
                </View>
            </GestureRecognizer>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
    loading: state.user.loading,
});

const mapDispatchToProps = {
    getAllClubCategories,
    sendFCMtoken,
    setFilterType,
    selectClubs,
    getUserFeed,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation('home')(MainScreen));
