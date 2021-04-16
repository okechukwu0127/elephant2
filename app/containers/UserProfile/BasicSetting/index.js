import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    Alert,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {
    PRIMARY_TEXT_COLOR,
    PRIMARY_COLOR,
    GRAY_COLOR,
} from '../../../themes/colors';
import {connect} from 'react-redux';
import {
    updateUserProfile,
    updateUser,
    getUserProfile,
} from '../../../reducers/user';
import ActionSheet from 'react-native-action-sheet';
import {BTN_IMAGE_PICKER, BTN_SELECTED_IMAGE_PICKER} from '../../../constants';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
    getExtFromMime,
    showMessage,
    formatPhoneNumber,
} from '../../../utils/utils';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import iban from 'iban';
import {isEqual} from 'lodash';
import SocialProfile from './socialProfile';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import CustomFocusInput from '../../../components/CustomFocusInput/CustomFocusInput';
import MiniMap from '../../../components/MiniMap/MiniMap';
import {getFormatAddress} from '../../../utils/utils';

const FE_DATE_FORMAT = 'DD.MM.YYYY';
const BE_DATE_FORMAT = 'YYYY-MM-DD';

class BasicSetting extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    constructor(props) {
        super(props);
        const defaultUserProfile = {
            push_notifications: 1,
            news_notifications: 1,
            members_notifications: 1,
            /////////////////
            sms: 1,
            news_sms: 1,
            members_sms: 1,

            isPublic: 0,
            //////////////////
            events_notifications: 1,
            registered_with_tool: '',
        };
        this.state = {
            addressFocused: false,
            avatar: null,
            originalAvatar: null,
            validation: [],
            user_profile: props.user_profile
                ? {
                      ...props.user_profile,
                      date_of_birth: moment(
                          props.user_profile.date_of_birth,
                          BE_DATE_FORMAT,
                      ).isValid()
                          ? moment(
                                props.user_profile.date_of_birth,
                                BE_DATE_FORMAT,
                            ).format(FE_DATE_FORMAT)
                          : null,
                  }
                : defaultUserProfile,
            user: props.user,
            original_user_profile: props.user_profile
                ? props.user_profile
                : defaultUserProfile,
            original_user: props.user,
            mapAddress: props.user_profile ? props.user_profile.address : null,
        };
        if (props.user) props.getUserProfile(props.user.id);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (
            nextProps.user_profile &&
            nextProps.user_profile != this.state.user_profile
        ) {
            const {user_profile} = nextProps;
            const date_of_birth = moment(
                user_profile.date_of_birth,
                BE_DATE_FORMAT,
            );
            this.setState({
                user_profile: {
                    ...user_profile,
                    date_of_birth: date_of_birth.isValid()
                        ? date_of_birth.format(FE_DATE_FORMAT)
                        : null,
                },
            });
        }
        if (nextProps.user && nextProps.user != this.state.user) {
            this.setState({user: nextProps.user});
        }
    }

    onValidate() {
        const validation = [];
        const {user, user_profile} = this.state;
        let phoneRegex = /\+41 [0-9]{3} [0-9]{3} [0-9]{3}/g;
        let mobileRegex = /\+41 [0-9]{3} [0-9]{3} [0-9]{3}/g;
        const userRequiredFields = ['first_name', 'last_name'];
        const userProfileRequiredFields = ['address', 'date_of_birth'];

        for (const field of userRequiredFields) {
            if (!user[field] || user[field].length === 0)
                validation.push(field);
        }

        for (const field of userProfileRequiredFields) {
            if (!user_profile[field] || user_profile[field].length === 0)
                validation.push(field);
        }

        if (user_profile.phone && !phoneRegex.test(user_profile.phone))
            validation.push('phone');

        if (user_profile.mobile && !mobileRegex.test(user_profile.mobile))
            validation.push('mobile');

        if (
            user_profile.iban &&
            !iban.isValid(user_profile.iban.replace(' ', ''))
        )
            validation.push('iban');

        this.setState({validation});
        return validation;
    }

    async updateProfile(callback) {
        const {user, t} = this.props;
        const {user_profile, avatar} = this.state;
        const validation = this.onValidate();

        if (validation.includes('iban')) {
            this.setState({loading: false});
            return showMessage(t('invalid-iban'));
        } else if (validation.length > 0) {
            this.setState({loading: false});
            return showMessage(t('error'));
        }

        const param = {
            date_of_birth: moment(
                user_profile.date_of_birth,
                FE_DATE_FORMAT,
            ).isValid()
                ? moment(user_profile.date_of_birth, FE_DATE_FORMAT).format(
                      BE_DATE_FORMAT,
                  )
                : moment(user_profile.date_of_birth, BE_DATE_FORMAT).format(
                      BE_DATE_FORMAT,
                  ),
            iban: user_profile.iban,
            registered_with_tool: user_profile.registered_with_tool,
            paypal_email: user_profile.paypal_email,
            phone: user_profile.phone,
            mobile: user_profile.mobile,
            address: user_profile.address,
            facebook:
                user_profile.facebook !== this.hints.facebook
                    ? user_profile.facebook
                    : null,
            instagram:
                user_profile.instagram !== this.hints.instagram
                    ? user_profile.instagram
                    : null,
            linkedin: user_profile.linkedin,
            xing: user_profile.xing,
            twitter: user_profile.twitter,
            website:
                user_profile.website !== this.hints.website
                    ? user_profile.website
                    : null,
            ...(avatar
                ? {
                      picture: {
                          uri: avatar.uri,
                          name: `photo.${getExtFromMime(avatar.mime)}`,
                          filename: `imagename.${getExtFromMime(avatar.mime)}`,
                          type: avatar.mime,
                      },
                  }
                : {}),
        };
        if (user && user.id)
            await this.props.updateUserProfile(user.id, param, res => {
                callback && callback();
            });
    }
    async updateUser(value) {
        const {user} = this.state;
        const param = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            canton: user.canton,
        };
        if (user && user.id)
            await this.props.updateUser(param, res => {
                this.setState({loading: false});
                if (res) {
                    const {t} = this.props;
                    showMessage(t('msg_saved'), true);
                    this.props.navigation.goBack();
                } else this.openCloseModal = false;
            });
    }
    async saveProfile() {
        this.setState({loading: true});
        await this.updateProfile(() => {
            this.updateUser();
        });
    }
    getFromGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            mediaType: 'photo',
            cropping: false,
        }).then(_image => {
            this.setState(
                {
                    originalAvatar: {
                        uri: _image.path,
                        width: _image.width,
                        height: _image.height,
                        mime: _image.mime,
                    },
                },
                () => {
                    console.log('State:', this.state);
                    ImagePicker.openCropper({
                        path: _image.path,
                        width: 300,
                        height: 300,
                        freeStyleCropEnabled: true,
                        cropperChooseText: 'Wählen Sie',
                        cropperCancelText: 'Abbrechen',
                        cropperCircleOverlay: true,
                    }).then(image => {
                        this.setImage({
                            uri: image.path,
                            width: image.width,
                            height: image.height,
                            mime: image.mime,
                        });
                    });
                },
            );
        });
    };
    getFromCamera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            mediaType: 'photo',
            cropperChooseText: 'Wählen Sie',
            cropperCancelText: 'Abbrechen',
        }).then(_image => {
            this.setState({
                originalAvatar: {
                    uri: _image.path,
                    width: _image.width,
                    height: _image.height,
                    mime: _image.mime,
                },
            });
            ImagePicker.openCropper({
                path: _image.path,
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
        });
    };

    cropImage = () => {
        if (this.state.avatar) {
            console.log(
                'openActionSheet -> this.state.originalAvatar',
                this.state.originalAvatar,
            );
            ImagePicker.openCropper({
                path: this.state.originalAvatar
                    ? this.state.originalAvatar.uri
                    : this.state.avatar.uri,
                width: 300,
                height: 300,
                freeStyleCropEnabled: true,
                cropperChooseText: 'Wählen Sie',
                cropperCancelText: 'Abbrechen',
                cropperCircleOverlay: true,
            }).then(image => {
                this.setImage({
                    uri: image.path,
                    width: image.width,
                    height: image.height,
                    mime: image.mime,
                });
            });
        }
    };
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
                if (this.state.avatar) {
                    switch (index) {
                        case 0: {
                            this.setImage(null);
                            break;
                        }
                        case 1: {
                            this.getFromGallery();
                            break;
                        }
                        case 2: {
                            this.getFromCamera();
                            break;
                        }
                        case 3: {
                            this.cropImage();
                            break;
                        }
                        case 4: {
                            break;
                        }
                    }
                } else {
                    switch (index) {
                        case 0: {
                            this.getFromGallery();
                            break;
                        }
                        case 1: {
                            this.getFromCamera();
                            break;
                        }
                        case 2: {
                            break;
                        }
                    }
                }
            },
        );
    }

    closeTapped = () => {
        // Check if anything has been changed
        const {
            user,
            user_profile,
            original_user,
            original_user_profile,
        } = this.state;
        user_profile.date_of_birth = moment(
            user_profile.date_of_birth,
            FE_DATE_FORMAT,
        ).format(BE_DATE_FORMAT);
        const condition =
            isEqual(user, original_user) &&
            isEqual(user_profile, original_user_profile) &&
            !this.state.avatar;
        if (condition) return this.props.navigation.goBack();
        const {t} = this.props;
        this.openCloseModal = true;
        Alert.alert(
            t('confirm'),
            t('confirmmsg'),
            [
                {
                    text: t('save'),
                    onPress: () => {
                        this.saveProfile();
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

    setImage(avatar) {
        this.setState({avatar});
        /*
        const { user, user_profile } = this.props;
        var new_obj = JSON.parse(JSON.stringify(user_profile))
        delete new_obj.avatar;
        this.props.updateUserProfile(user.id, {
            ...new_obj,
            picture: avatar && { uri: avatar.uri, name: 'photo.png', filename: 'imageName.png', type: avatar.mime }
        })
        */
    }

    hints = {
        website: 'https://',
        facebook: 'https://facebook.com/',
        instagram: 'https://instagram.com/',
    };

    formatIBAN = () => {
        const value = this.state.user_profile.iban;
        if (!value) return;
        this.setState({
            user_profile: {
                ...this.state.user_profile,
                iban: value
                    .toUpperCase()
                    .replace(/[^\dA-Z]/g, '')
                    .replace(/(.{4})/g, '$1 ')
                    .trim(),
            },
        });
    };

    formatAddress = addr => addr.replaceAll(' ', '\n');

    render() {
        const {user_profile, user, validation, addressFocused} = this.state;

        const {t} = this.props;

        return (
            <SafeAreaView style={{flex: 1}} keyboardShouldPersistTaps="handled">
                <View style={s.container} keyboardShouldPersistTaps="handled">
                    <View style={s.wrapper}>
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
                                        {t('personal')}
                                    </Text>
                                </View>
                            </View>
                            <Text style={s.sectionName}>{t('yourself')}</Text>
                            <View style={s.section}>
                                <View
                                    style={[
                                        s.sectionItem,
                                        validation.includes('first_name')
                                            ? {borderBottomColor: 'red'}
                                            : {},
                                    ]}>
                                    <Text style={s.sectionItemLabel}>
                                        {t('firstname')} *
                                    </Text>
                                    <CustomFocusInput
                                        style={[
                                            s.textInput,
                                            {textAlign: 'right'},
                                        ]}
                                        value={user && user.first_name}
                                        onChangeText={first_name => {
                                            this.setState({
                                                user: {...user, first_name},
                                            });
                                        }}
                                    />
                                </View>
                                <View
                                    style={[
                                        s.sectionItem,
                                        validation.includes('last_name')
                                            ? {borderBottomColor: 'red'}
                                            : {},
                                    ]}>
                                    <Text style={s.sectionItemLabel}>
                                        {t('lastname')} *
                                    </Text>
                                    <CustomFocusInput
                                        style={[
                                            s.textInput,
                                            {textAlign: 'right'},
                                        ]}
                                        value={user && user.last_name}
                                        onChangeText={last_name => {
                                            this.setState({
                                                user: {...user, last_name},
                                            });
                                        }}
                                    />
                                </View>
                                <View
                                    style={[
                                        s.sectionItem,
                                        validation.includes('date_of_birth')
                                            ? {borderBottomColor: 'red'}
                                            : {},
                                    ]}>
                                    <Text style={s.sectionItemLabel}>
                                        {t('birthdate')} *
                                    </Text>
                                    <DatePicker
                                        locale="de"
                                        style={{width: 200}}
                                        date={
                                            moment(
                                                user_profile.date_of_birth,
                                                FE_DATE_FORMAT,
                                            ).isValid()
                                                ? moment(
                                                      user_profile.date_of_birth,
                                                      FE_DATE_FORMAT,
                                                  ).toDate()
                                                : moment(
                                                      user_profile.date_of_birth,
                                                      BE_DATE_FORMAT,
                                                  ).toDate()
                                        }
                                        mode="date"
                                        placeholder="Wählen Sie ein Datum"
                                        format={FE_DATE_FORMAT}
                                        maxDate={moment().format(
                                            FE_DATE_FORMAT,
                                        )}
                                        confirmBtnText="Bestätigen Sie"
                                        cancelBtnText="Abbrechen"
                                        customStyles={{
                                            dateIcon: {
                                                width: 0,
                                            },
                                            dateInput: {
                                                marginLeft: 36,
                                                borderWidth: 0,
                                                textAlign: 'right',
                                                alignItems: 'flex-end',
                                            },
                                            dateText: {
                                                fontFamily: 'Rubik-Regular',
                                                marginRight: -7,
                                                color: GRAY_COLOR,
                                            },
                                            placeholderText: {
                                                marginRight: -7,
                                            },
                                        }}
                                        onDateChange={date => {
                                            this.setState({
                                                user_profile: {
                                                    ...user_profile,
                                                    date_of_birth: date,
                                                },
                                            });
                                        }}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={s.sectionItem}
                                    onPress={() => {
                                        this.openActionSheet();
                                    }}>
                                    <Text style={[s.sectionItemLabel]}>
                                        {t('choosepic')}
                                    </Text>
                                    <View style={s.touchImage}>
                                        <Image
                                            source={
                                                this.state.avatar
                                                    ? this.state.avatar
                                                    : {
                                                          uri:
                                                              user_profile &&
                                                              user_profile.avatar &&
                                                              user_profile
                                                                  .avatar
                                                                  .original
                                                                  ? user_profile
                                                                        .avatar
                                                                        .original
                                                                  : '',
                                                      }
                                            }
                                            style={s.sectionImage}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Text style={[s.sectionName, {marginBottom: 0}]}>
                                {t('contact')}
                            </Text>
                            <Text style={s.sectionSubName}>
                                {t('contact-desc')}
                            </Text>
                            <View style={s.section}>
                                <View
                                    style={[
                                        s.sectionItem,
                                        validation.includes('email')
                                            ? {borderBottomColor: 'red'}
                                            : {},
                                    ]}>
                                    <Text style={s.sectionItemLabel}>
                                        {t('email')}
                                    </Text>
                                    <CustomFocusInput
                                        style={[
                                            s.textInput,
                                            {textAlign: 'right'},
                                            validation.includes('email')
                                                ? {borderBottomColor: 'red'}
                                                : {},
                                        ]}
                                        value={user && user.email}
                                        onChangeText={Email => {
                                            this.setState({
                                                user: {
                                                    ...user,
                                                    email: Email,
                                                },
                                            });
                                        }}
                                    />
                                </View>
                                <View
                                    style={[
                                        s.sectionItem,
                                        validation.includes('phone')
                                            ? {borderBottomColor: 'red'}
                                            : {},
                                    ]}>
                                    <Text style={s.sectionItemLabel}>
                                        {t('phone')}
                                    </Text>
                                    <CustomFocusInput
                                        style={[
                                            s.textInput,
                                            {textAlign: 'right'},
                                            validation.includes('phone')
                                                ? {borderBottomColor: 'red'}
                                                : {},
                                        ]}
                                        value={
                                            user_profile && user_profile.phone
                                        }
                                        onChangeText={phone => {
                                            this.setState({
                                                user_profile: {
                                                    ...user_profile,
                                                    phone: formatPhoneNumber(
                                                        phone,
                                                    ),
                                                },
                                            });
                                        }}
                                        keyboardType="phone-pad"
                                        placeholder="+41 000 000 000"
                                    />
                                </View>
                                <View
                                    style={[
                                        s.sectionItem,
                                        validation.includes('mobile')
                                            ? {borderBottomColor: 'red'}
                                            : {},
                                    ]}>
                                    <Text style={s.sectionItemLabel}>
                                        {t('mobile')}
                                    </Text>
                                    <CustomFocusInput
                                        style={[
                                            s.textInput,
                                            {textAlign: 'right'},
                                            validation.includes('mobile')
                                                ? {borderBottomColor: 'red'}
                                                : {},
                                        ]}
                                        value={
                                            user_profile && user_profile.mobile
                                        }
                                        onChangeText={mobile => {
                                            this.setState({
                                                user_profile: {
                                                    ...user_profile,
                                                    mobile: formatPhoneNumber(
                                                        mobile,
                                                    ),
                                                },
                                            });
                                        }}
                                        keyboardType="phone-pad"
                                        placeholder="+41 000 000 000"
                                    />
                                </View>
                                <View
                                    style={[
                                        s.sectionItem,
                                        validation.includes('address')
                                            ? {borderBottomColor: 'red'}
                                            : {},
                                    ]}>
                                    <Text style={s.sectionItemLabel}>
                                        {t('address')} *
                                    </Text>
                                    <CustomFocusInput
                                        style={[
                                            s.textInput,
                                            {textAlign: 'right'},
                                        ]}
                                        value={user_profile?.address}
                                        bluredValue={getFormatAddress(
                                            user_profile?.address,
                                        )}
                                        onBlur={() =>
                                            this.setState({
                                                mapAddress:
                                                    user_profile.address,
                                            })
                                        }
                                        onChangeText={address => {
                                            this.setState({
                                                user_profile: {
                                                    ...user_profile,
                                                    address,
                                                },
                                            });
                                        }}
                                        multiline
                                        numberOfLines={2}
                                    />
                                </View>
                                <MiniMap
                                    //extra field "gmap" in user profile
                                    enableHighAccuracy
                                    address={this.state.mapAddress}
                                    addressChanged={address =>
                                        this.setState({
                                            user_profile: {
                                                ...user_profile,
                                                address,
                                            },
                                        })
                                    }
                                />
                            </View>
                            <Text style={s.sectionName}>{t('financial')}</Text>
                            <View style={s.section}>
                                <View
                                    style={[
                                        s.sectionItem,
                                        validation.includes('iban')
                                            ? {borderBottomColor: 'red'}
                                            : {},
                                    ]}>
                                    <Text style={s.sectionItemLabel}>
                                        {t('iban')}
                                    </Text>
                                    <CustomFocusInput
                                        style={[
                                            s.textInput,
                                            {textAlign: 'right'},
                                        ]}
                                        value={
                                            user_profile && user_profile.iban
                                        }
                                        onBlur={this.formatIBAN}
                                        onChangeText={ib =>
                                            this.setState({
                                                user_profile: {
                                                    ...user_profile,
                                                    iban: ib,
                                                },
                                            })
                                        }
                                        placeholder="CH90 0000 0000 0000 0000 1"
                                    />
                                </View>
                            </View>
                            <Text style={s.sectionName}>{t('external')}</Text>
                            <View style={s.section}>
                                <View style={s.sectionItem}>
                                    <SocialProfile
                                        name="twitter"
                                        domain="twitter.com"
                                        prefix="https://www.twitter.com/"
                                        value={
                                            user_profile && user_profile.twitter
                                        }
                                        onChange={val => {
                                            this.setState({
                                                user_profile: {
                                                    ...user_profile,
                                                    twitter: val,
                                                },
                                            });
                                        }}
                                    />
                                </View>
                                <View style={s.sectionItem}>
                                    <SocialProfile
                                        name="xing"
                                        domain="xing.com"
                                        prefix="https://www.xing.com/profile/"
                                        value={
                                            user_profile && user_profile.xing
                                        }
                                        onChange={val => {
                                            this.setState({
                                                user_profile: {
                                                    ...user_profile,
                                                    xing: val,
                                                },
                                            });
                                        }}
                                    />
                                </View>
                                <View style={s.sectionItem}>
                                    <SocialProfile
                                        name="linkedin"
                                        domain="linkedin.com"
                                        prefix="https://www.linkedin.com/in/"
                                        value={
                                            user_profile &&
                                            user_profile.linkedin
                                        }
                                        onChange={val => {
                                            this.setState({
                                                user_profile: {
                                                    ...user_profile,
                                                    linkedin: val,
                                                },
                                            });
                                        }}
                                    />
                                </View>
                                <View style={s.sectionItem}>
                                    <SocialProfile
                                        name="facebook"
                                        domain="facebook.com"
                                        prefix="https://www.facebook.com/"
                                        value={
                                            user_profile &&
                                            user_profile.facebook
                                        }
                                        onChange={val => {
                                            this.setState({
                                                user_profile: {
                                                    ...user_profile,
                                                    facebook: val,
                                                },
                                            });
                                        }}
                                    />
                                </View>
                                <View style={s.sectionItem}>
                                    <SocialProfile
                                        name="instagram"
                                        domain="instagram.com"
                                        prefix="https://www.instagram.com/"
                                        value={
                                            user_profile &&
                                            user_profile.instagram
                                        }
                                        onChange={val => {
                                            this.setState({
                                                user_profile: {
                                                    ...user_profile,
                                                    instagram: val,
                                                },
                                            });
                                        }}
                                    />
                                </View>
                                <View style={s.sectionItem}>
                                    <SocialProfile
                                        name="globe"
                                        domain="Eigene Website"
                                        prefix="https://"
                                        value={
                                            user_profile && user_profile.website
                                        }
                                        onChange={val => {
                                            this.setState({
                                                user_profile: {
                                                    ...user_profile,
                                                    website: val,
                                                },
                                            });
                                        }}
                                    />
                                </View>
                                <TouchableOpacity
                                    disabled={this.state.loading}
                                    style={[
                                        s.button,
                                        {
                                            backgroundColor: PRIMARY_COLOR,
                                            marginTop: 50,
                                            marginLeft: -25,
                                        },
                                    ]}
                                    onPress={() => {
                                        this.saveProfile();
                                    }}>
                                    {this.state.loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={s.btnLabel}>
                                            {t('savebutton')}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    user_profile: state.user.user_profile,
});

const mapDispatchToProps = {
    getUserProfile,
    updateUserProfile,
    updateUser,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    hoistStatics(
        withTranslation('userbasicsetting')(BasicSetting),
        BasicSetting,
    ),
);
