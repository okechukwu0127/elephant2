import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {PRIMARY_COLOR} from '../themes/colors';
import Icon from 'react-native-vector-icons/Feather';
import Feed from '../containers/Feed';

import UserSetting from '../containers/UserProfile/setting';
import NotificationSettings from '../containers/UserProfile/NotificationSettings';
import UserProfile from '../containers/UserProfile';
import MainScreen from '../containers/Main';
import Clubs from '../containers/Clubs';
import {SvgXml} from 'react-native-svg';

import DiscoverClub from '../containers/DiscoverClub';
import ClubMap from '../containers/ClubMap';
import QRCode from '../containers/QRCode';
import SearchClub from '../containers/SearchClub';
import CreateClub from '../containers/CreateClub';
import ConfirmClub from '../containers/CreateClub/confirm';
import ClubDetail from '../containers/ClubDetail';
import AboutUs from '../containers/UserProfile/aboutus';
import BasicSetting from '../containers/UserProfile/BasicSetting';
import UserClubSettingEdit from '../containers/UserClubSettingEdit';
import FeatureShop from '../containers/FeatureShop';
import UserFeatureShop from '../containers/UserFeatureShop';
import ClubProfile from '../containers/ClubProfile';
import ClubEditInfo from '../containers/ClubProfile/ClubEditInfo';
import ClubAddInfo from '../containers/ClubProfile/ClubAddInfo';
import EditBoard from '../containers/ClubProfile/EditBoard';
import EditMember from '../containers/ClubProfile/EditMember';
import Membership from '../containers/ClubProfile/Membership';
import Contributions from '../containers/ClubProfile/Contributions';
import ZirklPay from '../containers/ClubProfile/ZirklPay';
import MemberProfile from '../containers/MemberProfile';
import CreateNews from '../containers/News/CreateNews';
import CreateEvent from '../containers/Event/CreateEvent';
import MultipleFiles from '../containers/Event/CreateEvent/multiplefiles';
import MultipleLinks from '../containers/Event/CreateEvent/multiplelinks';
import LocationView from '../containers/Event/LocationView';
import CreatePost from '../containers/Post/CreatePost';
import MultipleImages from '../containers/Impression/CreateImpression/components/MultipleImages';
import CreateImpression from '../containers/Impression/CreateImpression';
import ZirklSelect from '../components/ZirklSelect';
import MembershipSelect from '../components/MembershipSelect';
import ImagePicker from '../components/ImagePicker';
import {HTMLText, EditMembershipCategory} from '../components';
import ClubCategoryPicker from '../components/ClubCategoryPicker';
import Comments from '../containers/Comments/Comments';
import EventDetails from '../containers/EventDetails';

const ExploreStack = createStackNavigator(
    {
        MainScreen,
        ClubMap,
        QRCode,
        Discover: DiscoverClub,
        SearchClub,
    },
    {headerMode: 'none', initialRouteName: 'MainScreen'},
);
const FeedStack = createStackNavigator(
    {
        Feed,
        AboutUs,
        Comments,
    },
    {headerMode: 'none', initialRouteName: 'Feed'},
);
const ClubsStack = createStackNavigator(
    {
        Clubs,
        CreateNews,
        CreateEvent,
        CreatePost,
        CreateImpression,
        MultipleFiles,
        MultipleLinks,
        ZirklSelect,
        ImagePicker,
        ClubCategoryPicker,
        EditMembershipCategory,
        CreateClub: {
            screen: CreateClub,
            navigationOptions: {
                gesturesEnabled: false,
            },
        },
        ConfirmClub,
        ClubDetail,
        ClubProfile,
        FeatureShop,
        ClubEditInfo,
        Membership,
        MemberProfile,
        EditBoard,
        EditMember,
        Contributions,
        ZirklPay,
        EventDetails,
        LocationView,
        MultipleImages,
    },
    {
        headerMode: 'none',
        initialRouteName: 'Clubs',
        navigationOptions: {
            gesturesEnabled: false,
        },
    },
);
const SettingsStack = createStackNavigator(
    {
        UserSetting,
        NotificationSettings,
        UserProfile,
        BasicSetting,
        UserClubSettingEdit,
        ClubAddInfo,
        HTMLText,
        MembershipSelect,
        UserFeatureShop,
    },
    {headerMode: 'none', initialRouteName: 'UserSetting'},
);

const TabNavigator = createBottomTabNavigator(
    {
        DiscoverTab: {
            screen: ExploreStack,
            navigationOptions: {
                title: 'Home',
            },
        },
        FeedTab: {
            screen: FeedStack,
            navigationOptions: {
                title: 'Feed',
            },
        },
        ClubsTab: {
            screen: ClubsStack,
            navigationOptions: {
                title: 'Vereine',
            },
        },
        SettingsTab: {
            screen: SettingsStack,
            navigationOptions: {
                title: 'Settings',
            },
        },
    },
    {
        initialRouteName: 'DiscoverTab',
        defaultNavigationOptions: props => ({
            tabBarIcon: ({focused, horizontal, tintColor}) => {
                const {routeName} = props.navigation.state;

                switch (routeName) {
                    case 'SettingsTab':
                        return (
                            <Icon name="settings" size={25} color={tintColor} />
                        );
                    case 'ClubsTab':
                        return <Icon name="grid" size={25} color={tintColor} />;
                    case 'FeedTab':
                        return (
                            <SvgXml
                                xml={focused ? active_feed_xml : feed_xml}
                                width={25}
                                height={25}
                            />
                        );
                    case 'DiscoverTab':
                        return (
                            <SvgXml
                                xml={focused ? active_home_xml : home_xml}
                                width={25}
                                height={25}
                            />
                        );

                    default:
                        break;
                }
            },

            tabBarOnPress: ({defaultHandler}) => {
                const {routeName} = props.navigation.state;
                const {user} = props.screenProps;
                console.log('tabBarOnPress -> user', user, routeName);

                if (
                    routeName !== 'DiscoverTab' &&
                    routeName !== 'SettingsTab' &&
                    !user
                ) {
                    return;
                }

                defaultHandler();
            },
        }),
        navigationOptions: {gesturesEnabled: false},
        tabBarOptions: {
            style: {
                height: 65,
                paddingVertical: 8,
            },
            // tabStyle: {paddingVertical: 10},
            activeTintColor: PRIMARY_COLOR,
            inactiveTintColor: '#C4C4C4',
            safeAreaInset: {
                bottom: 'always',
            },
        },
    },
);

export default TabNavigator;

const feed_xml = `
<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.625 22.875L4.625 13.875C4.625 12.7704 5.52043 11.875 6.625 11.875H13.625L20.625 18.875V22.875" stroke="#C4C4C4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.625 11.875V18.875H20.625" stroke="#C4C4C4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.625 2.875L4.625 5.875C4.625 6.97957 5.52043 7.875 6.625 7.875H18.625C19.7296 7.875 20.625 6.97957 20.625 5.875V2.875" stroke="#C4C4C4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const active_feed_xml = `
<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.625 22.875L4.625 13.875C4.625 12.7704 5.52043 11.875 6.625 11.875H13.625L20.625 18.875V22.875" stroke="#642FD0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.625 11.875V18.875H20.625" stroke="#642FD0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4.625 2.875L4.625 5.875C4.625 6.97957 5.52043 7.875 6.625 7.875H18.625C19.7296 7.875 20.625 6.97957 20.625 5.875V2.875" stroke="#642FD0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const home_xml = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1 8L11 1L21 8V19C21 20.1046 20.0051 21 18.7778 21H3.22222C1.99492 21 1 20.1046 1 19V8Z" stroke="#C4C4C4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
const active_home_xml = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1 8L11 1L21 8V19C21 20.1046 20.0051 21 18.7778 21H3.22222C1.99492 21 1 20.1046 1 19V8Z" stroke="#642FD0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
