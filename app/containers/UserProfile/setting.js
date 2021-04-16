import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    Platform,
    Image,
    ActivityIndicator,
    Linking,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import {logout, updateUserProfile} from '../../reducers/user';
import {getInvite} from '../../reducers/info';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-action-sheet';
import {BTN_IMAGE_PICKER, BTN_SELECTED_IMAGE_PICKER} from '../../constants';
import {AvatarImage} from '../../components';
import {getClub, getClubProfile} from '../../reducers/club';
import DynamicCropper from 'react-native-dynamic-cropper';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import Auth from '../Login/auth';
import {getUserName} from '../../utils/utils';
import {GRAY_COLOR, PRIMARY_COLOR} from '../../themes/colors';
import IconShop from '../../assets/icon_shop.png';
import Share from 'react-native-share';
import {
    getPrivacyPolicy,
    getDataProcessing,
    getTermsAndConditions,
    getImpressum,
} from '../../reducers/info';
import {getVersion, getBuildNumber} from 'react-native-device-info';
import {StackActions, NavigationActions} from 'react-navigation';

class UserSetting extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    state = {
        avatar: null,
        showAuth: false,
        invite2zirkl: '',
    };
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.unsubsribe = this.props.navigation.addListener('willFocus', () => {
            this.getInviteData();
        });
    }
    componentWillUnmount() {
        if (this.unsubsribe && typeof this.unsubsribe === 'function') {
            this.unsubsribe();
        }
    }
    getInviteData() {
        if (!this.props.user) return;
        this.props.getInvite(inviteData =>
            this.setState({
                invite2zirkl: inviteData
                    ?.replace(/<br>/g, '\n')
                    .replace(/<[^>]+>/g, ''),
            }),
        );
    }
    openActionSheet() {
        const options = this.state.avatar
            ? BTN_SELECTED_IMAGE_PICKER
            : BTN_IMAGE_PICKER;

        ActionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex: options.length - 1,
                ...(this.state.avatar ? {destructiveButtonIndex: 0} : {}),
                tintColor: 'black',
            },
            index => {
                switch (index) {
                    case 0: {
                        this.setImage(null);
                        break;
                    }
                    case 1: {
                        ImagePicker.openPicker({
                            width: 300,
                            height: 300,
                            cropping: true,
                            mediaType: 'photo',
                            cropperChooseText: 'Wählen Sie',
                            cropperCancelText: 'Abbrechen',
                        }).then(image => {
                            this.setImage({
                                uri: image.path,
                                width: image.width,
                                height: image.height,
                                mime: image.mime,
                            });
                        });
                        break;
                    }
                    case 2: {
                        ImagePicker.openCamera({
                            width: 300,
                            height: 300,
                            cropping: true,
                            mediaType: 'photo',
                            cropperChooseText: 'Wählen Sie',
                            cropperCancelText: 'Abbrechen',
                        }).then(image => {
                            this.setImage({
                                uri: image.path,
                                width: image.width,
                                height: image.height,
                                mime: image.mime,
                            });
                        });
                        break;
                    }
                    case 3: {
                        if (this.state.avatar) {
                            if (Platform.OS == 'ios') {
                                DynamicCropper.cropImage(
                                    this.state.avatar.uri.replace(
                                        'file://',
                                        '',
                                    ),
                                    {},
                                ).then(newlyCroppedImagePath => {
                                    if (
                                        newlyCroppedImagePath &&
                                        newlyCroppedImagePath.length > 0
                                    ) {
                                        this.setState({
                                            avatar: {
                                                ...this.state.avatar,
                                                uri: newlyCroppedImagePath,
                                            },
                                        });
                                    }
                                });
                            } else {
                                ImagePicker.openCropper({
                                    path: this.state.avatar.uri,
                                    width: 300,
                                    height: 300,
                                    freeStyleCropEnabled: true,
                                    cropperChooseText: 'Wählen Sie',
                                    cropperCancelText: 'Abbrechen',
                                }).then(image => {
                                    this.setImage({
                                        uri: image.path,
                                        width: image.width,
                                        height: image.height,
                                        mime: image.mime,
                                    });
                                });
                            }
                        }
                        break;
                    }
                    case 4: {
                        break;
                    }
                }
            },
        );
    }
    setImage(avatar) {
        this.setState({avatar});
    }
    renderContent() {
        const {
            t,
            clubs_user,
            user,
            user_profile,
            isLoadingUser,
            isLoadingProfile,
        } = this.props;
        if (isLoadingUser || isLoadingProfile)
            return (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                </View>
            );
        return user && user_profile ? (
            <ScrollView>
                <View style={s.topBar}>
                    <Text style={s.title}>{t('title')}</Text>
                </View>
                <View style={s.header}>
                    <TouchableOpacity
                        onPress={() =>
                            this.props.navigation.navigate('UserProfile')
                        }
                        style={[s.avatar, {width: 100, height: 100}]}>
                        <AvatarImage
                            uri={
                                user_profile &&
                                user_profile.avatar &&
                                user_profile.avatar.original
                            }
                            width={100}
                            user={user}
                        />
                    </TouchableOpacity>
                    <Text style={s.name}>{getUserName(user)}</Text>
                </View>
                <View style={s.section}>
                    <Text style={s.sectionName}>{t('profile')}</Text>
                    <TouchableOpacity
                        style={[s.sectionItem, s.justifyBetween]}
                        onPress={() =>
                            this.props.navigation.navigate('BasicSetting')
                        }>
                        <View style={s.clubItemLeft}>
                            <Icon
                                name="user"
                                size={17}
                                color="#642FD0"
                                style={s.icon}
                            />
                            <Text style={s.sectionItemLabel}>
                                {t('personal')}
                            </Text>
                        </View>
                        <Icon
                            name="chevron-right"
                            size={20}
                            color={GRAY_COLOR}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[s.sectionItem, s.justifyBetween]}
                        onPress={() =>
                            this.props.navigation.navigate(
                                'NotificationSettings',
                            )
                        }>
                        <View style={s.clubItemLeft}>
                            <Icon
                                name="shuffle"
                                size={17}
                                color="#642FD0"
                                style={s.icon}
                            />
                            <Text style={s.sectionItemLabel}>
                                {t('interaction')}
                            </Text>
                        </View>
                        <Icon
                            name="chevron-right"
                            size={20}
                            color={GRAY_COLOR}
                        />
                    </TouchableOpacity>
                </View>
                <View style={s.section}>
                    <Text style={s.sectionName}>{t('club')}</Text>
                    {clubs_user.map(item => {
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={s.clubItem}
                                onPress={async () => {
                                    this.setState({
                                        loadingClubID: item.id,
                                    });
                                    await this.props.getClub(item.id);
                                    await this.props.getClubProfile(item.id);
                                    this.setState({
                                        loadingClubID: null,
                                    });
                                    this.props.navigation.navigate(
                                        'ClubAddInfo',
                                        {club_id: item.id},
                                    );
                                }}>
                                <View style={s.clubItemLeft}>
                                    {this.state.loadingClubID === item?.id ? (
                                        <ActivityIndicator
                                            color={PRIMARY_COLOR}
                                            size="large"
                                        />
                                    ) : (
                                        <AvatarImage
                                            uri={
                                                item.photo &&
                                                item.photo.original
                                            }
                                            width={32}
                                            user={{
                                                first_name: item.name,
                                            }}
                                        />
                                    )}
                                    <Text style={s.sectionItemLabel}>
                                        {item.name}
                                    </Text>
                                </View>
                                <Icon
                                    name="chevron-right"
                                    size={20}
                                    color={GRAY_COLOR}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <View style={s.section}>
                    <Text style={s.sectionName}>
                        {t('additional-functions')}
                    </Text>
                    <TouchableOpacity
                        style={[s.sectionItem, s.justifyBetween]}
                        onPress={() =>
                            this.props.navigation.navigate('UserFeatureShop')
                        }>
                        <View style={s.clubItemLeft}>
                            <Image
                                source={IconShop}
                                style={{
                                    width: 20,
                                    height: 20,
                                    resizeMode: 'contain',
                                }}
                            />
                            <Text
                                style={[
                                    s.sectionItemLabel,
                                    {fontWeight: 'bold'},
                                ]}>
                                {t('shop')}
                            </Text>
                        </View>
                        <Icon
                            name="chevron-right"
                            size={20}
                            color={GRAY_COLOR}
                        />
                        {/* <Text
                            style={{
                                color: SUCCESS_COLOR,
                                fontSize: 12,
                            }}>
                            2/5 {t('active')}
                        </Text> */}
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        style={[s.sectionItem, s.justifyBetween]}
                        onPress={() => {}}>
                        <View style={s.clubItemLeft}>
                            <Icon
                                name="message-circle"
                                size={17}
                                color="#642FD0"
                                style={s.icon}
                            />
                            <Text style={s.sectionItemLabel}>
                                {t('notif-sms')}
                            </Text>
                        </View>
                        <Icon
                            name="chevron-right"
                            size={20}
                            color={GRAY_COLOR}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[s.sectionItem, s.justifyBetween]}
                        onPress={() => {}}>
                        <View style={s.clubItemLeft}>
                            <Icon
                                name="log-out"
                                size={17}
                                color="#642FD0"
                                style={s.icon}
                            />
                            <Text style={s.sectionItemLabel}>
                                {t('stealth')}
                            </Text>
                        </View>
                        <Icon
                            name="chevron-right"
                            size={20}
                            color={GRAY_COLOR}
                        />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={[s.sectionItem, s.justifyBetween]}
                        onPress={() => {}}>
                        <View style={s.clubItemLeft}>
                            <Icon
                                name="refresh-cw"
                                size={17}
                                color="#642FD0"
                                style={s.icon}
                            />
                            <Text style={s.sectionItemLabel}>
                                {t('restore-purchases')}
                            </Text>
                        </View>
                        <Icon
                            name="chevron-right"
                            size={20}
                            color={GRAY_COLOR}
                        />
                    </TouchableOpacity>
                </View>
                <View style={s.section}>
                    <Text style={s.sectionName}>{t('account')}</Text>
                    <TouchableOpacity
                        style={s.sectionItem}
                        onPress={() => {
                            this.props.logout();
                            this.props.navigation.dispatch(
                                StackActions.reset({
                                    index: 0,
                                    key: null,
                                    actions: [
                                        NavigationActions.navigate({
                                            routeName: 'Tabs',
                                        }),
                                    ],
                                }),
                            );
                        }}>
                        <Icon
                            name="log-out"
                            size={17}
                            color="#642FD0"
                            style={s.icon}
                        />
                        <Text style={s.sectionItemLabel}>{t('logout')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.sectionItem}>
                        <Icon
                            name="x"
                            size={17}
                            color="#642FD0"
                            style={s.icon}
                        />
                        <Text style={s.sectionItemLabel}>
                            {t('deletedata')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={s.section}>
                    <Text style={s.sectionName}>{t('legal')}</Text>
                    <TouchableOpacity
                        style={s.sectionItem}
                        onPress={() => {
                            this.props.navigation.navigate('HTMLText', {
                                title: t('impressum'),
                                getData: this.props.getImpressum,
                            });
                        }}>
                        <Icon
                            name="clipboard"
                            size={17}
                            color="#642FD0"
                            style={s.icon}
                        />
                        <Text style={s.sectionItemLabel}>{t('impressum')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={s.sectionItem}
                        onPress={() => {
                            this.props.navigation.navigate('HTMLText', {
                                title: t('privacy'),
                                getData: this.props.getPrivacyPolicy,
                            });
                        }}>
                        <Icon
                            name="clipboard"
                            size={17}
                            color="#642FD0"
                            style={s.icon}
                        />
                        <Text style={s.sectionItemLabel}>{t('privacy')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={s.sectionItem}
                        onPress={() => {
                            this.props.navigation.navigate('HTMLText', {
                                title: t('order-process'),
                                getData: this.props.getDataProcessing,
                            });
                        }}>
                        <Icon
                            name="clipboard"
                            size={17}
                            color="#642FD0"
                            style={s.icon}
                        />
                        <Text style={s.sectionItemLabel}>
                            {t('order-process')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={s.sectionItem}
                        onPress={() => {
                            this.props.navigation.navigate('HTMLText', {
                                title: t('terms'),
                                getData: this.props.getTermsAndConditions,
                            });
                        }}>
                        <Icon
                            name="clipboard"
                            size={17}
                            color="#642FD0"
                            style={s.icon}
                        />
                        <Text style={s.sectionItemLabel}>{t('terms')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={s.section}>
                    <Text style={[s.sectionName, {marginBottom: 0}]}>
                        zirkl
                    </Text>
                    <Text style={s.sectionSubName}>
                        Version {getVersion()} - Build {getBuildNumber()}
                    </Text>
                    <TouchableOpacity
                        style={s.sectionItem}
                        onPress={() =>
                            Linking.openURL('https://twitter.com/zirkl_app')
                        }>
                        <Icon
                            name="twitter"
                            size={17}
                            color="#642FD0"
                            style={s.icon}
                        />
                        <Text style={s.sectionItemLabel}>{t('twitter')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.sectionItem}>
                        <Icon
                            name="thumbs-up"
                            size={17}
                            color="#642FD0"
                            style={s.icon}
                        />
                        <Text style={s.sectionItemLabel}>
                            {t('rateus')}
                            {Platform.select({
                                android: 'Playstore',
                                ios: 'App Store',
                            })}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={s.sectionItem}
                        onPress={() => {
                            const options = {
                                title: 'Invite to zirkl',
                                message: this.state.invite2zirkl,
                            };

                            Share.open(options);
                        }}>
                        <Icon
                            name="user-plus"
                            size={17}
                            color="#642FD0"
                            style={s.icon}
                        />
                        <Text style={s.sectionItemLabel}>{t('invite')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        ) : (
            <View style={s.connectContainer}>
                <Auth
                    navigation={this.props.navigation}
                    nextAfterLogin="SettingsTab"
                    nextAfterSignout="SettingsTab"
                    noBackground
                />
            </View>
        );
    }
    render() {
        return (
            <View style={s.container}>
                <View style={s.wrapper}>{this.renderContent()}</View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
    isLoadingUser: state.user.isLoadingUser,
    isLoadingProfile: state.user.isLoadingProfile,
    user_profile: state.user.user_profile,
    clubs_user: state.club.clubs_user,
});

const mapDispatchToProps = {
    logout,
    updateUserProfile,
    getClub,
    getClubProfile,
    getPrivacyPolicy,
    getDataProcessing,
    getTermsAndConditions,
    getImpressum,
    getInvite,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('usersetting')(UserSetting), UserSetting));
