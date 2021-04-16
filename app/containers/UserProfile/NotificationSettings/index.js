import * as React from 'react';
import {View, TouchableOpacity, Text, Alert} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_TEXT_COLOR, PRIMARY_COLOR} from '../../../themes/colors';
import {connect} from 'react-redux';
import {
    updateUserProfile,
    updateUser,
    getUserProfile,
    updatePrivacySettings,
} from '../../../reducers/user';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ToggleSwitch} from '../../../components';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {isEqual} from 'lodash';
import ActionSheet from 'react-native-action-sheet';
import {PrivacyItem} from '../../../components';

const channels = ['push']; // add 'email' here for email options too
const options = [
    {
        text: 'news',
        icon: 'file-text',
    },
    {
        text: 'events',
        icon: 'calendar',
    },
    {
        text: 'members',
        icon: 'users',
    },
    {
        text: 'impressions',
        icon: 'image',
    },
    {
        text: 'reminders',
        icon: 'bell',
    },
];
const ROLES_OPTIONS = t => [
    {value: 'board-members', label: t('board')},
    {value: 'members', label: t('member')},
    {value: 'public', label: t('public')},
];

class NotificationSettings extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    constructor(props) {
        super(props);
        const {user_details_privacy} = props;
        console.log(
            '🚀 ~ file: index.js ~ line 78 ~ NotificationSettings ~ constructor ~ user_details_privacy',
            user_details_privacy,
        );
        const {notification_preferences} = props.user_profile;
        const defaultSettings = {
            events: true,
            news: true,
            members: true,
            impressions: true,
            reminders: true,
        };
        this.state = {
            user_details_privacy: user_details_privacy || {},
            push: notification_preferences
                ? notification_preferences.push
                : defaultSettings,
            email: notification_preferences
                ? notification_preferences.email
                : defaultSettings,

            originals: {
                push: notification_preferences
                    ? notification_preferences.push
                    : defaultSettings,
                email: notification_preferences
                    ? notification_preferences.email
                    : defaultSettings,
            },
        };
    }
    updateUserPrivacy(key) {
        const {t} = this.props;
        ActionSheet.showActionSheetWithOptions(
            {
                options: ROLES_OPTIONS(t).map(item => item.label),
                tintColor: 'black',
            },
            index => {
                if (index != null) {
                    const {user_details_privacy} = this.state;
                    this.setState(
                        {
                            user_details_privacy: {
                                ...user_details_privacy,
                                [key]: ROLES_OPTIONS(t)[index].value,
                            },
                        },
                        () => {
                            this.updateSettings();
                        },
                    );
                }
            },
        );
    }
    updateSettings() {
        const {user_details_privacy} = this.state;
        console.log('Sending...', user_details_privacy);
        this.props.updatePrivacySettings(user_details_privacy);
    }

    async updateUserProfile() {
        const {user, user_profile} = this.props;
        const param = {
            notification_preferences: JSON.stringify({
                push: this.state.push,
                email: this.state.email,
            }),
        };

        if (user && user.id) {
            await this.props.updateUserProfile(user.id, param);
            this.props.navigation.goBack();
        }
    }

    closeTapped = () => {
        // Check if anything has been changed
        if (
            isEqual(this.state.push, this.state.originals.push) &&
            isEqual(this.state.email, this.state.originals.email)
        )
            return this.props.navigation.goBack();
        const {t} = this.props;
        this.openCloseModal = true;
        Alert.alert(
            t('confirm'),
            t('confirmmsg'),
            [
                {
                    text: t('save'),
                    onPress: () => {
                        this.updateUserProfile();
                    },
                    style: 'cancel',
                },
                {
                    text: t('discard'),
                    onPress: () => {
                        this.props.navigation.goBack();
                    },
                },
            ],
            {cancelable: false},
        );
    };

    isChannelOn = channel => {
        const values = Object.values(this.state[channel]);
        return values.some(el => el);
    };

    setChannel = (channel, isOn) => {
        this.setState({
            [channel]: {
                events: isOn,
                news: isOn,
                members: isOn,
                impressions: isOn,
                reminders: isOn,
            },
        });
    };

    setOption = (channel, option, isOn) => {
        this.setState({
            [channel]: {
                ...this.state[channel],
                [option]: isOn,
            },
        });
    };

    render() {
        const {t, user_profile} = this.props;
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    {
                        <KeyboardAwareScrollView
                            keyboardShouldPersistTaps="handled"
                            enableOnAndroid={true}>
                            <View style={s.topBar}>
                                <TouchableOpacity
                                    style={{
                                        borderRadius: 30,
                                        overflow: 'hidden',
                                    }}
                                    onPress={this.closeTapped}>
                                    <Icon
                                        name="arrow-left"
                                        color={PRIMARY_TEXT_COLOR}
                                        size={25}
                                        style={{marginRight: 15}}
                                    />
                                </TouchableOpacity>
                                <View>
                                    <Text style={s.title}>{t('title')}</Text>
                                    <Text style={s.subTitle}>
                                        {t('interaction')}
                                    </Text>
                                </View>
                            </View>

                            <Text
                                style={[
                                    s.sectionName,
                                    {marginBottom: 0, marginTop: 30},
                                ]}>
                                {t('data-title')}
                            </Text>
                            <Text style={s.sectionSubName}>
                                {t('data-subtitle')}
                            </Text>
                            <View style={[s.section]}>
                                <PrivacyItem
                                    name="profile_picture"
                                    text={t('personpicture')}
                                    onPress={() =>
                                        this.updateUserPrivacy(
                                            'profile_picture',
                                        )
                                    }
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .profile_picture,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                                <PrivacyItem
                                    name="year_of_birth"
                                    text={t('personbirthyear')}
                                    onPress={() =>
                                        this.updateUserPrivacy('year_of_birth')
                                    }
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .year_of_birth,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                                <PrivacyItem
                                    name="date_of_birth"
                                    text={t('personbirthdate')}
                                    onPress={() =>
                                        this.updateUserPrivacy('date_of_birth')
                                    }
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .date_of_birth,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                            </View>
                            <View style={[s.section]}>
                                <PrivacyItem
                                    name="place_of_residence"
                                    text={t('personplace')}
                                    onPress={() =>
                                        this.updateUserPrivacy(
                                            'place_of_residence',
                                        )
                                    }
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .place_of_residence,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                                <PrivacyItem
                                    name="home_address"
                                    text={t('personhome')}
                                    onPress={() =>
                                        this.updateUserPrivacy('home_address')
                                    }
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .home_address,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                            </View>
                            <View style={[s.section]}>
                                <PrivacyItem
                                    name="email"
                                    text={t('personemail')}
                                    onPress={() =>
                                        this.updateUserPrivacy('email')
                                    }
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .email,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                                <PrivacyItem
                                    name="telephone"
                                    text={t('personphone')}
                                    onPress={() =>
                                        this.updateUserPrivacy('telephone')
                                    }
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .telephone,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                                <PrivacyItem
                                    name="mobile"
                                    text={t('personmobile')}
                                    onPress={() => {
                                        this.updateUserPrivacy('mobile');
                                    }}
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .mobile,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                                <PrivacyItem
                                    visible={!!user_profile.facebook}
                                    name="facebook"
                                    icon="facebook"
                                    text="Facebook"
                                    onPress={() => {
                                        this.updateUserPrivacy('facebook');
                                    }}
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .facebook,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                                <PrivacyItem
                                    visible={!!user_profile.twitter}
                                    name="twitter"
                                    icon="twitter"
                                    text="Twitter"
                                    onPress={() => {
                                        this.updateUserPrivacy('twitter');
                                    }}
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .twitter,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                                <PrivacyItem
                                    visible={!!user_profile.instagram}
                                    name="instagram"
                                    icon="instagram"
                                    text="Instagram"
                                    onPress={() => {
                                        this.updateUserPrivacy('instagram');
                                    }}
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .instagram,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                                <PrivacyItem
                                    visible={!!user_profile.xing}
                                    name="xing"
                                    icon="xing"
                                    text="xing"
                                    onPress={() => {
                                        this.updateUserPrivacy('xing');
                                    }}
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .xing,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                                <PrivacyItem
                                    visible={!!user_profile.linkedin}
                                    name="linkedin"
                                    icon="linkedin"
                                    text="LinkedIn"
                                    onPress={() => {
                                        this.updateUserPrivacy('linkedin');
                                    }}
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .linkedin,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                                <PrivacyItem
                                    visible={!!user_profile.website}
                                    name="website"
                                    icon="globe"
                                    text="Website"
                                    onPress={() => {
                                        this.updateUserPrivacy('website');
                                    }}
                                    value={
                                        t(
                                            this.state.user_details_privacy
                                                .website,
                                        ) || ROLES_OPTIONS(t)[2]?.label
                                    }
                                />
                            </View>

                            {/* NOTIFICATION */}
                            <Text
                                style={[
                                    s.sectionName,
                                    {marginBottom: 0, marginTop: 30},
                                ]}>
                                {t('notifs-title')}
                            </Text>
                            <Text style={s.sectionSubName}>
                                {t('notifs-subtitle')}
                            </Text>
                            {channels.map((channel, index) => (
                                <View
                                    key={index}
                                    style={[
                                        s.section,
                                        {
                                            marginBottom: 10,
                                            marginTop: index > 0 ? 20 : 0,
                                        },
                                    ]}>
                                    <View style={s.sectionItem}>
                                        <Text style={s.sectionItemLabel}>
                                            {t(channel)}
                                        </Text>
                                        <ToggleSwitch
                                            isOn={this.isChannelOn(channel)}
                                            onColor="#4CD964"
                                            offColor={'gray'}
                                            label={''}
                                            onToggle={isOn =>
                                                this.setChannel(channel, isOn)
                                            }
                                        />
                                    </View>
                                    {options.map((option, i) => (
                                        <View
                                            key={`${index}-${i}`}
                                            style={s.sectionItem}>
                                            <View style={s.labelCont}>
                                                <Icon
                                                    name={option.icon}
                                                    size={24}
                                                    color={PRIMARY_COLOR}
                                                />
                                                <Text
                                                    style={s.sectionItemLabel}>
                                                    {t(option.text)}
                                                </Text>
                                            </View>
                                            <ToggleSwitch
                                                isOn={
                                                    this.state[channel][
                                                        option.text
                                                    ]
                                                }
                                                onColor="#4CD964"
                                                offColor={'gray'}
                                                label={''}
                                                onToggle={isOn =>
                                                    this.setOption(
                                                        channel,
                                                        option.text,
                                                        isOn,
                                                    )
                                                }
                                            />
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </KeyboardAwareScrollView>
                    }
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    user_profile: state.user.user_profile,
    user_details_privacy:
        state.user.user?.privacy_setting?.user_details_privacy,
});

const mapDispatchToProps = {
    getUserProfile,
    updateUserProfile,
    updateUser,
    updatePrivacySettings,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    hoistStatics(
        withTranslation('usernotifications')(NotificationSettings),
        NotificationSettings,
    ),
);
