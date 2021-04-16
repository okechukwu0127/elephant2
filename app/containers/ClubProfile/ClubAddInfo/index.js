import * as React from 'react';
import {View, TouchableOpacity, Text, ScrollView, Alert} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {
    GRAY_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../../themes/colors';
import {ToggleSwitch, PrivacyItem} from '../../../components';
import {connect} from 'react-redux';
import {updateUserClubSetting} from '../../../reducers/club';
import ActionSheet from 'react-native-action-sheet';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {
    getClubMembers,
    getBoardMembers,
    requestToRemoveBoardMember,
    removeFromClub,
} from '../../../reducers/member';
import {
    getJoiningYear,
    updateUserMembership,
} from '../../../reducers/membership';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';

var ROLES_OPTIONS = t => [
    {value: 'board-members', label: t('board')},
    {value: 'members', label: t('member')},
    {value: 'public', label: t('public')},
];

class ClubAddInfo extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    state = {
        membership: null,
        general_email: true,
        general_push: true,
        settings: {
            notification_preferences,
            user_details_privacy,
        },
    };
    datePickerStyles = {
        dateText: {
            fontFamily: 'Rubik-Regular',
            color: GRAY_COLOR,
        },
        dateIcon: {
            width: 0,
        },
        dateInput: {
            marginLeft: 36,
            borderWidth: 0,
            textAlign: 'right',
            alignItems: 'flex-end',
        },
        disabled: {
            backgroundColor: 'transparent',
        },
    };
    constructor(props) {
        super(props);
        if (props.club_profile && props.club_profile.user_club_settings_v2) {
            this.state = {
                general_email: true,
                general_push: true,
                settings: props.club_profile.user_club_settings_v2,
            };
        }
    }
    UNSAFE_componentWillMount() {
        this.refresh();
    }

    refresh() {
        this.props.getJoiningYear(this.props.club.id, data => {
            if (data) {
                console.log('UNSAFE_componentWillMount -> data', data);
                this.setState({
                    membership: data?.club_membership,
                    joiningYear: data?.joining_year
                        ? moment(data?.joining_year, 'YYYY-MM-DD')
                        : moment(data?.subscribed_at, 'YYYY-MM-DD'),
                });
            } else {
                console.log('No data :(');
            }
        });
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (
            nextProps.club_profile &&
            nextProps.club_profile.user_club_settings_v2 != this.state.settings
        ) {
            if (nextProps.club_profile.user_club_settings_v2)
                this.setState({
                    settings: nextProps.club_profile.user_club_settings_v2,
                });
        }
    }
    updateSettings() {
        const {club} = this.props;
        const {settings} = this.state;
        if (club.id)
            this.props.updateUserClubSetting(club.id, {
                notification_preferences: JSON.stringify(
                    settings.notification_preferences,
                ),
                user_details_privacy: JSON.stringify(
                    settings.user_details_privacy,
                ),
            });
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
                    const {settings} = this.state;
                    this.setState(
                        {
                            settings: {
                                ...settings,
                                user_details_privacy: {
                                    ...settings.user_details_privacy,
                                    [key]: ROLES_OPTIONS(t)[index].value,
                                },
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
    updateNotification(field, key, value) {
        const {settings} = this.state;
        let notification_preferences = settings.notification_preferences;
        notification_preferences[field][key] = value;
        this.setState(
            {
                settings: {
                    ...settings,
                    notification_preferences,
                },
            },
            () => {
                this.updateSettings();
            },
        );
    }
    isAllChecked(key) {
        const {settings} = this.state;
        let notification_preferences = settings.notification_preferences;
        if (notification_preferences) {
            const {
                news,
                events,
                members,
                impressions,
                reminders,
            } = notification_preferences[key];
            if (news || events || members || impressions || reminders)
                return true;
        }
        return false;
    }
    render() {
        const {
            settings,
            membership,
            general_email,
            general_push,
            joiningYear,
        } = this.state;
        const {t, club, user_profile} = this.props;
        const {notification_preferences, user_details_privacy} = settings;

        const club_profile = club.profile;
        const profile_picture =
            user_details_privacy && user_details_privacy.profile_picture
                ? ROLES_OPTIONS(t).find(
                      item =>
                          item.value === user_details_privacy.profile_picture,
                  )
                : null;
        const year_of_birth =
            user_details_privacy && user_details_privacy.year_of_birth
                ? ROLES_OPTIONS(t).find(
                      item => item.value === user_details_privacy.year_of_birth,
                  )
                : null;
        const date_of_birth =
            user_details_privacy && user_details_privacy.date_of_birth
                ? ROLES_OPTIONS(t).find(
                      item => item.value === user_details_privacy.date_of_birth,
                  )
                : null;
        const place_of_residence =
            user_details_privacy && user_details_privacy.place_of_residence
                ? ROLES_OPTIONS(t).find(
                      item =>
                          item.value ===
                          user_details_privacy.place_of_residence,
                  )
                : null;
        const home_address =
            user_details_privacy && user_details_privacy.home_address
                ? ROLES_OPTIONS(t).find(
                      item => item.value === user_details_privacy.home_address,
                  )
                : null;
        const email =
            user_details_privacy && user_details_privacy.email
                ? ROLES_OPTIONS(t).find(
                      item => item.value === user_details_privacy.email,
                  )
                : null;
        const telephone =
            user_details_privacy && user_details_privacy.telephone
                ? ROLES_OPTIONS(t).find(
                      item => item.value === user_details_privacy.telephone,
                  )
                : null;

        const mobile =
            user_details_privacy && user_details_privacy.mobile
                ? ROLES_OPTIONS(t).find(
                      item => item.value === user_details_privacy.mobile,
                  )
                : null;

        const xing =
            user_details_privacy && user_details_privacy.xing
                ? ROLES_OPTIONS(t).find(
                      item => item.value === user_details_privacy.xing,
                  )
                : null;
        const linkedin =
            user_details_privacy && user_details_privacy.linkedin
                ? ROLES_OPTIONS(t).find(
                      item => item.value === user_details_privacy.linkedin,
                  )
                : null;
        const facebook =
            user_details_privacy && user_details_privacy.facebook
                ? ROLES_OPTIONS(t).find(
                      item => item.value === user_details_privacy.facebook,
                  )
                : null;
        const twitter =
            user_details_privacy && user_details_privacy.twitter
                ? ROLES_OPTIONS(t).find(
                      item => item.value === user_details_privacy.twitter,
                  )
                : null;
        const instagram =
            user_details_privacy && user_details_privacy.instagram
                ? ROLES_OPTIONS(t).find(
                      item => item.value === user_details_privacy.instagram,
                  )
                : null;
        const website =
            user_details_privacy && user_details_privacy.website
                ? ROLES_OPTIONS(t).find(
                      item => item.value === user_details_privacy.website,
                  )
                : null;

        const noti_push =
            notification_preferences && notification_preferences.push;
        const noti_email =
            notification_preferences && notification_preferences.email;
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <ScrollView>
                        <View style={s.topBar}>
                            <TouchableOpacity
                                style={{borderRadius: 30, overflow: 'hidden'}}
                                onPress={() => this.props.navigation.goBack()}>
                                <Icon
                                    name="arrow-left"
                                    color={PRIMARY_TEXT_COLOR}
                                    size={30}
                                    style={{marginRight: 15}}
                                />
                            </TouchableOpacity>
                            <View>
                                <Text style={s.title}>{t('title')}</Text>
                                <Text style={s.name}>{club && club.name}</Text>
                            </View>
                        </View>
                        {membership && (
                            <>
                                <Text style={s.sectionName}>
                                    {t('membership')}
                                </Text>
                                <View style={[s.section]}>
                                    <TouchableOpacity
                                        style={s.sectionItem}
                                        onPress={() => {
                                            this.props.navigation.navigate(
                                                'MembershipSelect',
                                                {
                                                    selected: membership?.id,
                                                    club_id: this.props.club.id,
                                                    onSave: membership_id => {
                                                        this.props.updateUserMembership(
                                                            this.props.club.id,
                                                            {
                                                                membership_id,
                                                            },
                                                            () =>
                                                                this.refresh(),
                                                        );
                                                    },
                                                },
                                            );
                                        }}>
                                        <Text style={s.sectionItemLabel}>
                                            {t('membercategory')}
                                        </Text>
                                        <View style={s.sectionRight}>
                                            <Text style={s.sectionRightLabel}>
                                                {membership.title?.toLowerCase() ===
                                                'free membership'
                                                    ? 'Mitglied'
                                                    : membership.title}
                                            </Text>
                                            <Icon
                                                name="chevron-right"
                                                size={20}
                                                color="#C7C7CC"
                                                style={{marginLeft: 10}}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <View style={s.sectionItem}>
                                        <Text style={s.sectionItemLabel}>
                                            {t('membersince')}
                                        </Text>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}>
                                            <DatePicker
                                                locale="de"
                                                date={
                                                    joiningYear
                                                        ? new Date(joiningYear)
                                                        : null
                                                }
                                                confirmBtnText="Bestätigen Sie"
                                                cancelBtnText="Abbrechen"
                                                customStyles={
                                                    this.datePickerStyles
                                                }
                                                placeholder="Wählen Sie ein Datum und eine Uhrzeit"
                                                mode="date"
                                                format="MMM Do YYYY"
                                                onDateChange={date => {
                                                    console.log(
                                                        'ClubAddInfo -> render -> date',
                                                        date,
                                                    );
                                                    this.setState({
                                                        joiningYear: moment(
                                                            date,
                                                            'MMM Do YYYY',
                                                        ),
                                                    });
                                                    this.props.updateUserMembership(
                                                        this.props.club.id,
                                                        {
                                                            joining_year: moment(
                                                                date,
                                                                'MMM Do YYYY',
                                                            ).format(
                                                                'YYYY-MM-DD',
                                                            ),
                                                        },
                                                    );
                                                }}
                                            />
                                            <Text
                                                style={
                                                    this.datePickerStyles
                                                        .dateText
                                                }>
                                                {`\(${moment(new Date()).diff(
                                                    joiningYear,
                                                    'years',
                                                )} Jahre)`}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={s.exitButton}
                                        onPress={() => {
                                            Alert.alert(
                                                'Leave club?',
                                                '',
                                                [
                                                    {
                                                        text: 'Cancel',
                                                        onPress: () => {},
                                                        style: 'cancel',
                                                    },
                                                    {
                                                        text: 'Ok',
                                                        onPress: () => {
                                                            this.props.removeFromClub(
                                                                club.id,
                                                                () =>
                                                                    this.props.navigation.goBack(),
                                                            );
                                                        },
                                                    },
                                                ],
                                                {cancelable: true},
                                            );
                                        }}>
                                        <Text style={s.exitButtonLabel}>
                                            {t('memberexit')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                        <Text style={s.sectionName}>{t('personaldata')}</Text>
                        <View style={[s.section]}>
                            <PrivacyItem
                                name="profile_picture"
                                text={t('personpicture')}
                                onPress={() =>
                                    this.updateUserPrivacy('profile_picture')
                                }
                                value={
                                    profile_picture
                                        ? profile_picture.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                            <PrivacyItem
                                name="year_of_birth"
                                text={t('personbirthyear')}
                                onPress={() =>
                                    this.updateUserPrivacy('year_of_birth')
                                }
                                value={
                                    year_of_birth
                                        ? year_of_birth.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                            <PrivacyItem
                                name="date_of_birth"
                                text={t('personbirthdate')}
                                onPress={() =>
                                    this.updateUserPrivacy('date_of_birth')
                                }
                                value={
                                    date_of_birth
                                        ? date_of_birth.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                        </View>
                        <View style={[s.section]}>
                            <PrivacyItem
                                name="place_of_residence"
                                text={t('personplace')}
                                onPress={() =>
                                    this.updateUserPrivacy('place_of_residence')
                                }
                                value={
                                    place_of_residence
                                        ? place_of_residence.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                            <PrivacyItem
                                name="home_address"
                                text={t('personhome')}
                                onPress={() =>
                                    this.updateUserPrivacy('home_address')
                                }
                                value={
                                    home_address
                                        ? home_address.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                        </View>
                        <View style={[s.section]}>
                            <PrivacyItem
                                name="email"
                                text={t('personemail')}
                                onPress={() => this.updateUserPrivacy('email')}
                                value={
                                    email
                                        ? email.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                            <PrivacyItem
                                name="telephone"
                                text={t('personphone')}
                                onPress={() =>
                                    this.updateUserPrivacy('telephone')
                                }
                                value={
                                    telephone
                                        ? telephone.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                            <PrivacyItem
                                name="mobile"
                                text={t('personmobile')}
                                onPress={() => this.updateUserPrivacy('mobile')}
                                value={
                                    mobile
                                        ? mobile.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                        </View>
                        <View style={[s.section]}>
                            <PrivacyItem
                                visible={!!user_profile.xing}
                                name="xing"
                                icon="xing"
                                text="xing"
                                onPress={() => this.updateUserPrivacy('xing')}
                                value={
                                    xing
                                        ? xing.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                            <PrivacyItem
                                visible={!!user_profile.facebook}
                                name="facebook"
                                icon="facebook"
                                text="facebook.com"
                                onPress={() =>
                                    this.updateUserPrivacy('facebook')
                                }
                                value={
                                    facebook
                                        ? facebook.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                            <PrivacyItem
                                visible={!!user_profile.linkedin}
                                name="linkedin"
                                icon="linkedin"
                                text="linkedin.com"
                                onPress={() =>
                                    this.updateUserPrivacy('linkedin')
                                }
                                value={
                                    linkedin
                                        ? linkedin.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                            <PrivacyItem
                                visible={!!user_profile.twitter}
                                name="twitter"
                                icon="twitter"
                                text="twitter.com"
                                onPress={() =>
                                    this.updateUserPrivacy('twitter')
                                }
                                value={
                                    twitter
                                        ? twitter.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                            <PrivacyItem
                                visible={!!user_profile.instagram}
                                name="instagram"
                                icon="instagram"
                                text="instagram.com"
                                onPress={() =>
                                    this.updateUserPrivacy('instagram')
                                }
                                value={
                                    instagram
                                        ? instagram.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                            <PrivacyItem
                                visible={!!user_profile.website}
                                name="website"
                                icon="globe"
                                text="website"
                                onPress={() =>
                                    this.updateUserPrivacy('website')
                                }
                                value={
                                    website
                                        ? website.label
                                        : ROLES_OPTIONS(t)[2].label
                                }
                            />
                        </View>
                        <Text style={s.sectionName}>{t('notifications')}</Text>
                        {/* <View style={[s.section, {marginVertical: 0}]}>
                            <View style={s.sectionItem}>
                                <Text style={s.sectionItemLabel}>
                                    {t('viaemail')}
                                </Text>
                                <ToggleSwitch
                                    isOn={general_email}
                                    onColor={PRIMARY_COLOR}
                                    offColor={'gray'}
                                    label={''}
                                    onToggle={isOn => {
                                        this.setState({general_email: isOn});
                                        // this.setState({
                                        //     settings: {
                                        //         ...settings,
                                        //         notification_preferences: {
                                        //             ...notification_preferences,
                                        //             email: {
                                        //                 news: isOn,
                                        //                 events: isOn,
                                        //                 members: isOn,
                                        //                 impressions: isOn,
                                        //                 reminders: isOn
                                        //             }
                                        //         }
                                        //     }
                                        // }, () => {
                                        //     this.updateSettings()
                                        // })
                                    }}
                                />
                            </View>
                            <View style={s.sectionItem}>
                                <View style={s.textwithitcon}>
                                    <Icon
                                        name="file-text"
                                        size={18}
                                        color="#642FD0"
                                        style={s.icon}
                                    />
                                    <Text style={s.sectionItemLabel}>
                                        {t('news')}
                                    </Text>
                                </View>
                                <ToggleSwitch
                                    isOn={general_email && !!noti_email.news}
                                    onColor={PRIMARY_COLOR}
                                    offColor={'gray'}
                                    label={''}
                                    onToggle={isOn => {
                                        this.updateNotification(
                                            'email',
                                            'news',
                                            isOn,
                                        );
                                    }}
                                    disabled={!general_email}
                                />
                            </View>
                            <View style={s.sectionItem}>
                                <View style={s.textwithitcon}>
                                    <Icon
                                        name="calendar"
                                        size={18}
                                        color="#642FD0"
                                        style={s.icon}
                                    />
                                    <Text style={s.sectionItemLabel}>
                                        {t('events')}
                                    </Text>
                                </View>
                                <ToggleSwitch
                                    isOn={general_email && !!noti_email.events}
                                    onColor={PRIMARY_COLOR}
                                    offColor={'gray'}
                                    label={''}
                                    onToggle={isOn => {
                                        this.updateNotification(
                                            'email',
                                            'events',
                                            isOn,
                                        );
                                    }}
                                    disabled={!general_email}
                                />
                            </View>
                            <View style={s.sectionItem}>
                                <View style={s.textwithitcon}>
                                    <Icon
                                        name="users"
                                        size={18}
                                        color="#642FD0"
                                        style={s.icon}
                                    />
                                    <Text style={s.sectionItemLabel}>
                                        {t('member')}
                                    </Text>
                                </View>
                                <ToggleSwitch
                                    isOn={general_email && !!noti_email.members}
                                    onColor={PRIMARY_COLOR}
                                    offColor={'gray'}
                                    label={''}
                                    onToggle={isOn => {
                                        this.updateNotification(
                                            'email',
                                            'members',
                                            isOn,
                                        );
                                    }}
                                    disabled={!general_email}
                                />
                            </View>
                            <View style={s.sectionItem}>
                                <View style={s.textwithitcon}>
                                    <Icon
                                        name="image"
                                        size={18}
                                        color="#642FD0"
                                        style={s.icon}
                                    />
                                    <Text style={s.sectionItemLabel}>
                                        {t('impresses')}
                                    </Text>
                                </View>
                                <ToggleSwitch
                                    isOn={
                                        general_email &&
                                        !!noti_email.impressions
                                    }
                                    onColor={PRIMARY_COLOR}
                                    offColor={'gray'}
                                    label={''}
                                    onToggle={isOn => {
                                        this.updateNotification(
                                            'email',
                                            'impressions',
                                            isOn,
                                        );
                                    }}
                                    disabled={!general_email}
                                />
                            </View>
                            <View
                                style={[s.sectionItem, {borderBottomWidth: 0}]}>
                                <View style={s.textwithitcon}>
                                    <Icon
                                        name="bell"
                                        size={18}
                                        color="#642FD0"
                                        style={s.icon}
                                    />
                                    <Text style={s.sectionItemLabel}>
                                        {t('memories')}
                                    </Text>
                                </View>
                                <ToggleSwitch
                                    isOn={
                                        general_email && !!noti_email.reminders
                                    }
                                    onColor={PRIMARY_COLOR}
                                    offColor={'gray'}
                                    label={''}
                                    onToggle={isOn => {
                                        this.updateNotification(
                                            'email',
                                            'reminders',
                                            isOn,
                                        );
                                    }}
                                    disabled={!general_email}
                                />
                            </View>
                        </View> */}
                        <View style={[s.section, {marginVertical: 0}]}>
                            <View style={s.sectionItem}>
                                <Text style={s.sectionItemLabel}>
                                    {t('viapush')}
                                </Text>
                                <ToggleSwitch
                                    isOn={general_push}
                                    onColor={PRIMARY_COLOR}
                                    offColor={'gray'}
                                    label={''}
                                    onToggle={isOn => {
                                        this.setState({general_push: isOn});
                                        // this.setState({
                                        //     settings: {
                                        //         ...settings,
                                        //         notification_preferences: {
                                        //             ...notification_preferences,
                                        //             push: {
                                        //                 news: isOn,
                                        //                 events: isOn,
                                        //                 members: isOn,
                                        //                 impressions: isOn,
                                        //                 reminders: isOn
                                        //             }
                                        //         }
                                        //     }
                                        // }, () => {
                                        //     this.updateSettings()
                                        // })
                                    }}
                                />
                            </View>
                            <View style={s.sectionItem}>
                                <View style={s.textwithitcon}>
                                    <Icon
                                        name="file-text"
                                        size={18}
                                        color="#642FD0"
                                        style={s.icon}
                                    />
                                    <Text style={s.sectionItemLabel}>
                                        {t('news')}
                                    </Text>
                                </View>
                                <ToggleSwitch
                                    isOn={general_push && noti_push?.news}
                                    onColor={PRIMARY_COLOR}
                                    offColor={'gray'}
                                    label={''}
                                    onToggle={isOn => {
                                        this.updateNotification(
                                            'push',
                                            'news',
                                            isOn,
                                        );
                                    }}
                                    disabled={!general_push}
                                />
                            </View>
                            <View style={s.sectionItem}>
                                <View style={s.textwithitcon}>
                                    <Icon
                                        name="calendar"
                                        size={18}
                                        color="#642FD0"
                                        style={s.icon}
                                    />
                                    <Text style={s.sectionItemLabel}>
                                        {t('events')}
                                    </Text>
                                </View>
                                <ToggleSwitch
                                    isOn={general_push && noti_push?.events}
                                    onColor={PRIMARY_COLOR}
                                    offColor={'gray'}
                                    label={''}
                                    onToggle={isOn => {
                                        this.updateNotification(
                                            'push',
                                            'events',
                                            isOn,
                                        );
                                    }}
                                    disabled={!general_push}
                                />
                            </View>
                            <View style={s.sectionItem}>
                                <View style={s.textwithitcon}>
                                    <Icon
                                        name="users"
                                        size={18}
                                        color="#642FD0"
                                        style={s.icon}
                                    />
                                    <Text style={s.sectionItemLabel}>
                                        {t('member')}
                                    </Text>
                                </View>
                                <ToggleSwitch
                                    isOn={general_push && noti_push?.members}
                                    onColor={PRIMARY_COLOR}
                                    offColor={'gray'}
                                    label={''}
                                    onToggle={isOn => {
                                        this.updateNotification(
                                            'push',
                                            'members',
                                            isOn,
                                        );
                                    }}
                                    disabled={!general_push}
                                />
                            </View>
                            <View style={s.sectionItem}>
                                <View style={s.textwithitcon}>
                                    <Icon
                                        name="image"
                                        size={18}
                                        color="#642FD0"
                                        style={s.icon}
                                    />
                                    <Text style={s.sectionItemLabel}>
                                        {t('impresses')}
                                    </Text>
                                </View>
                                <ToggleSwitch
                                    isOn={
                                        general_push && noti_push?.impressions
                                    }
                                    onColor={PRIMARY_COLOR}
                                    offColor={'gray'}
                                    label={''}
                                    onToggle={isOn => {
                                        this.updateNotification(
                                            'push',
                                            'impressions',
                                            isOn,
                                        );
                                    }}
                                    disabled={!general_push}
                                />
                            </View>
                            <View
                                style={[s.sectionItem, {borderBottomWidth: 0}]}>
                                <View style={s.textwithitcon}>
                                    <Icon
                                        name="bell"
                                        size={18}
                                        color="#642FD0"
                                        style={s.icon}
                                    />
                                    <Text style={s.sectionItemLabel}>
                                        {t('memories')}
                                    </Text>
                                </View>
                                <ToggleSwitch
                                    isOn={general_push && noti_push?.reminders}
                                    onColor={PRIMARY_COLOR}
                                    offColor={'gray'}
                                    label={''}
                                    onToggle={isOn => {
                                        this.updateNotification(
                                            'push',
                                            'reminders',
                                            isOn,
                                        );
                                    }}
                                    disabled={!general_push}
                                />
                            </View>
                        </View>
                        {/* <View style={[s.section, { marginVertical: 30 }]}>
                            <View style={[s.sectionItem, { borderBottomWidth: 0 }]}>
                                <Text style={s.sectionItemLabel}>
                                    {t('viasms')}
                                </Text>
                                <ToggleSwitch
                                    isOn={!!settings.push_notifications}
                                    onColor={PRIMARY_COLOR}
                                    offColor={'gray'}
                                    label={''}
                                    onToggle={isOn => {
                                    }}
                                />
                            </View>
                        </View> */}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({
    club: state.club.club,
    club_profile: state.club.club_profile,
    user: state.user.user,
    user_profile: state.user.user_profile,
});

const mapDispatchToProps = {
    updateUserClubSetting,
    getClubMembers,
    getBoardMembers,
    getJoiningYear,
    updateUserMembership,
    requestToRemoveBoardMember,
    removeFromClub,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('clubaddinfo')(ClubAddInfo), ClubAddInfo));

const Init_settings = {
    user_id: null,
    profile_picture_visibility: 'public',
    location_visibility: 'public',
    social_profile_visibility: 'public',
    email_notifications: 1,
    push_notifications: 1,
    email_notifications_for_news: 1,
    email_notifications_for_members: 1,
    push_notifications_for_news: 1,
    push_notifications_for_members: 1,
};

const notification_preferences = {
    push: {
        events: true,
        news: true,
        members: true,
        impressions: true,
        reminders: true,
    },
    email: {
        events: true,
        news: true,
        members: true,
        impressions: true,
        reminders: true,
    },
};

const user_details_privacy = {
    profile_picture: 'public',
    year_of_birth: 'public', // missing
    date_of_birth: 'public',
    place_of_residence: 'public',
    home_address: 'public',
    email: 'public',
    telephone: 'public',
    mobile: 'public',
    xing: 'public', // missing
    linkedin: 'public', // missing
};
