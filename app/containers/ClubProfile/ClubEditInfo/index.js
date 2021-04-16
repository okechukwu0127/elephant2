import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    TextInput,
    PermissionsAndroid,
    Image,
    Alert,
    Platform,
    ActivityIndicator,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../../themes/colors';
import {CloseButton, CustomTextInput, ClearButton} from '../../../components';
import {connect} from 'react-redux';
import ActionSheet from 'react-native-action-sheet';
import {
    updateClub,
    updateClubProfile,
    deleteClub,
    regretClub,
} from '../../../reducers/club';
import ImagePicker from 'react-native-image-crop-picker';
import {BTN_IMAGE_PICKER, BTN_SELECTED_IMAGE_PICKER} from '../../../constants';
import {
    getExtFromMime,
    showMessage,
    formatPhoneNumber,
} from '../../../utils/utils';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import IconOrt from '../../../assets/icon_ort.png';
import {setLocation} from '../../../reducers/user';
import Geolocation from 'react-native-geolocation-service';
import DocumentPicker from 'react-native-document-picker';
import iban from 'iban';
import SocialProfile from '../../UserProfile/BasicSetting/socialProfile';
var PUBLIC_DATA = t => [t('common:private'), t('common:public')];

class ClubEditInfo extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    constructor(props) {
        super(props);
        const {club_profile} = props;
        this.state = {
            prefer: 'addr',
            myPosition: null,
            isprocessing: false,
            validation: [],
            avatar: null,
            imageDeleted: false,
            club: props.club,
            club_profile: {
                ...club_profile,
                //facebook: club_profile && club_profile.facebook && club_profile.facebook.length > 0 ? club_profile.facebook : 'https://facebook.com/',
                //instagram: club_profile && club_profile.instagram && club_profile.instagram.length > 0 ? club_profile.instagram : 'https://instagram.com/',
                //linkedin: club_profile && club_profile.linkedin && club_profile.linkedin.length > 0 ? club_profile.linkedin : 'https://linkedin.com/',
            },
        };
        console.log('constructor -> props.club', props.club);
        console.log('constructor -> props.club_profile', props.club_profile);
        props.setLocation(null);
    }
    UNSAFE_componentWillMount() {
        this.requestLocation();
    }
    async requestLocation() {
        const {t} = this.props;
        if (Platform.OS == 'android') {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            if (granted) {
                console.log('You can use the ACCESS_FINE_LOCATION');
                this.getLocation();
            } else {
                try {
                    const allowed = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    );
                    if (allowed === PermissionsAndroid.RESULTS.GRANTED) {
                        console.log('You can use the location');
                        this.getLocation();
                    } else {
                        console.log('location permission denied');
                        alert(t('permission_denied'));
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
        } else {
            Geolocation.requestAuthorization();
            Geolocation.setRNConfiguration({
                skipPermissionRequests: false,
                authorizationLevel: 'whenInUse',
            });
            this.getLocation();
        }
    }
    getLocation() {
        Geolocation.getCurrentPosition(
            async position => {
                console.log(position);
                if (position.coords) {
                    console.log('--------position', position);
                    this.setState({myPosition: position.coords});
                }
            },
            error => {
                // See error code charts below.
                console.log('error:', error.code, error.message);
            },
            {enableHighAccuracy: false, timeout: 15000, maximumAge: 10000},
        );
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (
            nextProps.location != null &&
            this.props.location != nextProps.location
        ) {
            let {json} = nextProps.location;
            if ((json?.street?.match(/,/g) || []).length > 1)
                json.street = json.street.replace(/,/g, ' ');
            if (json)
                this.setState({
                    club_profile: {...this.state.club_profile, ...json},
                    prefer: 'pos',
                });
            return;
        }
        // if (nextProps.club != this.state.club) {
        //     this.setState({club: nextProps.club});
        //     return;
        // }
        // if (nextProps.club_profile != this.props.club_profile) {
        //     const {club_profile} = nextProps;
        //     this.setState({
        //         club_profile: {
        //             ...club_profile,
        //             //facebook: club_profile.facebook && club_profile.facebook.length > 0 ? club_profile.facebook : 'https://facebook.com/',
        //             //instagram: club_profile.instagram && club_profile.instagram.length > 0 ? club_profile.instagram : 'https://instagram.com/',
        //             //linkedin: club_profile.linkedin && club_profile.linkedin.length > 0 ? club_profile.linkedin : 'https://linkedin.com/',
        //         },
        //     });
        //     return;
        // }
    }
    updateClubState(value) {
        const {club} = this.state;
        this.setState({
            club: {
                ...club,
                ...value,
            },
        });
    }
    updateClubProfileState(value) {
        const {club_profile} = this.state;
        this.setState({
            club_profile: {
                ...club_profile,
                ...value,
            },
        });
        const field = Object.keys(value)[0];
        if (['street', 'zip', 'region'].includes(field))
            this.setState({
                prefer: 'addr',
            });
    }
    generateClubDTO = (club, avatar) => {
        const result = {
            name: club.name,
            taken: club.taken,
            canton: club.canton,
            founded: club.founded,
            location: club.location,
            abbreviation: club.abbreviation,
            visibility: club.visibility,
            'categories[]': club.categories && club.categories.map(c => c.id),
            is_user_following_this_club: JSON.stringify(
                club.is_user_following_this_club,
            ),
            is_user_member_of_club: club.is_user_member_of_club,
            total_members: club.total_members,
            total_followers: club.total_followers,
            active: club.active,
            lat: club.lat,
            lng: club.lng,
            color: club.color,
            remove_photo: false,
        };
        if (avatar) {
            result.photo = {
                uri: avatar.uri,
                name: `photo.${getExtFromMime(avatar.mime)}`,
                filename: `imageName.${getExtFromMime(avatar.mime)}`,
                type: avatar.mime,
            };
        } else if (!avatar && this.state.imageDeleted) {
            result.remove_photo = true;
        }
        if (!result.remove_photo) delete result.remove_photo;
        return result;
    };

    generateClubProfileDTO = club_profile => {
        let profile_param = {...club_profile};

        if (club_profile.club_status && club_profile.club_status.uri) {
            profile_param.club_status = {
                uri: club_profile.club_status.uri,
                name: club_profile.club_status.name,
                filename: club_profile.club_status.name,
                type: club_profile.club_status.type,
            };
        } else delete profile_param.club_status;

        if (profile_param.user_club_settings)
            delete profile_param.user_club_settings;

        delete profile_param.user_club_settings_v2;

        return profile_param;
    };
    async saveProfile() {
        const {club, avatar, club_profile} = this.state;
        const {t} = this.props;

        var param = this.generateClubDTO(club, avatar);
        const updateClubPromise = this.props.updateClub(club && club.id, param);

        const profile_param = this.generateClubProfileDTO(club_profile);
        const updateClubProfilePromise = this.props.updateClubProfile(
            club && club.id,
            profile_param,
        );

        Promise.all([updateClubPromise, updateClubProfilePromise]).then(
            results => {
                console.log('saveProfile -> results', results);
                this.scrollview && this.scrollview.scrollToPosition(0, 0, true);
                this.setState({isprocessing: false});
                showMessage(t('msgsaved'), true);
            },
        );
    }
    setAvatar(avatar) {
        this.setState({avatar});
        if (avatar) this.setState({imageDeleted: false});
    }
    onValidate() {
        var validation = [];
        const {club, club_profile} = this.state;
        if (club.name == null || club.name.length <= 0) {
            validation.push('name');
        }

        const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (
            !club_profile.email ||
            (club_profile.email && !emailRegex.test(club_profile.email))
        ) {
            validation.push('email');
        }

        let phoneRegex = /\+41 [0-9]{3} [0-9]{3} [0-9]{03}/g;

        if (club_profile.phone && !phoneRegex.test(club_profile.phone)) {
            validation.push('phone');
        }

        if (
            club_profile.iban &&
            !iban.isValid(club_profile.iban.replace(' ', ''))
        ) {
            validation.push('iban');
        }
        return validation;
    }
    async pickFile() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            this.updateClubProfileState({club_status: res});
            console.log(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    formatIBAN = () => {
        const value = this.state.club_profile.iban;
        if (!value || value.length === 0) return null;
        this.updateClubProfileState({
            iban: value
                .toUpperCase()
                .replace(/[^\dA-Z]/g, '')
                .replace(/(.{4})/g, '$1 ')
                .trim(),
        });
    };

    render() {
        const {
            avatar,
            club,
            club_profile,
            validation,
            isprocessing,
        } = this.state;
        const {t, categories} = this.props;

        const isPictureDefined =
            !this.state.imageDeleted &&
            (avatar || (club && club.photo && club.photo.original));
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <KeyboardAwareScrollView
                            keyboardShouldPersistTaps="handled"
                        ref={_ref => (this.scrollview = _ref)}>
                        <View style={s.topBar}>
                            <Text style={s.title}>{t('title')}</Text>
                            <CloseButton
                                onPress={() => this.props.navigation.goBack()}
                            />
                        </View>
                        <Text style={s.sectionName}>{t('basic')}</Text>
                        <View style={s.section}>
                            <View
                                style={[
                                    s.sectionItem,
                                    validation.includes('name')
                                        ? {borderBottomColor: 'red'}
                                        : {},
                                ]}>
                                <Text style={s.sectionItemLabel}>
                                    {t('clubname')}
                                </Text>
                                <CustomTextInput
                                    style={[s.textInput, {textAlign: 'right'}]}
                                    value={club && club.name}
                                    onChangeText={name =>
                                        this.updateClubState({name})
                                    }
                                />
                            </View>
                            <View
                                style={[
                                    s.sectionItem,
                                    validation.includes('abbreviation')
                                        ? {borderBottomColor: 'red'}
                                        : {},
                                ]}>
                                <Text style={s.sectionItemLabel}>
                                    {t('abbreviation')}
                                </Text>
                                <CustomTextInput
                                    style={[s.textInput, {textAlign: 'right'}]}
                                    value={club && club.abbreviation}
                                    onChangeText={abbreviation =>
                                        this.updateClubState({abbreviation})
                                    }
                                />
                            </View>
                            <TouchableOpacity
                                style={s.sectionItem}
                                onPress={() => {
                                    this.props.navigation.navigate(
                                        'ClubCategoryPicker',
                                        {
                                            options: categories,
                                            selected: club?.categories.map(
                                                c => c.id,
                                            ),
                                            onClose: ids => {
                                                if (!ids) return;
                                                const selectedCategories = categories.filter(
                                                    c => ids.includes(c.id),
                                                );
                                                this.setState({
                                                    club: {
                                                        ...this.state.club,
                                                        categories: selectedCategories,
                                                    },
                                                });
                                            },
                                        },
                                    );
                                }}>
                                <Text style={s.sectionItemLabel}>
                                    {t('category')}
                                </Text>
                                <View style={s.sectionRight}>
                                    <Text
                                        style={[
                                            s.sectionRightLabel,
                                            {maxWidth: 200},
                                        ]}
                                        numberOfLines={1}>
                                        {club?.categories
                                            ?.map(c => c.name)
                                            .join(', ')}
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
                                    {t('visibility')}
                                </Text>
                                <TouchableOpacity
                                    style={s.sectionRight}
                                    onPress={() => {
                                        ActionSheet.showActionSheetWithOptions(
                                            {
                                                options: PUBLIC_DATA(t),
                                                tintColor: 'black',
                                            },
                                            index => {
                                                this.updateClubState({
                                                    visibility: index,
                                                });
                                            },
                                        );
                                    }}>
                                    <Text style={s.sectionRightLabel}>
                                        {club && club.visibility
                                            ? PUBLIC_DATA(t)[club.visibility]
                                            : PUBLIC_DATA(t)[0]}
                                    </Text>
                                    <Icon
                                        name="chevron-right"
                                        size={20}
                                        color="#C7C7CC"
                                        style={{marginLeft: 10}}
                                    />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={s.sectionItem}
                                onPress={() => {
                                    ActionSheet.showActionSheetWithOptions(
                                        {
                                            options: isPictureDefined
                                                ? BTN_SELECTED_IMAGE_PICKER
                                                : BTN_IMAGE_PICKER,
                                            tintColor: 'black',
                                        },
                                        index => {
                                            switch (
                                                isPictureDefined
                                                    ? index
                                                    : index + 1
                                            ) {
                                                case 0: {
                                                    this.setAvatar(null);
                                                    this.setState({
                                                        imageDeleted: true,
                                                    });
                                                    break;
                                                }
                                                case 1: {
                                                    ImagePicker.openPicker({
                                                        width: 300,
                                                        height: 300,
                                                        cropping: true,
                                                        cropperCircleOverlay: true,
                                                        mediaType: 'photo',
                                                        cropperChooseText:
                                                            'Wählen Sie',
                                                        cropperCancelText:
                                                            'Abbrechen',
                                                    }).then(image => {
                                                        this.setAvatar({
                                                            uri: image.path,
                                                            width: image.width,
                                                            height:
                                                                image.height,
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
                                                        cropperCircleOverlay: true,
                                                        mediaType: 'photo',
                                                        cropperChooseText:
                                                            'Wählen Sie',
                                                        cropperCancelText:
                                                            'Abbrechen',
                                                    }).then(image => {
                                                        this.setAvatar({
                                                            uri: image.path,
                                                            width: image.width,
                                                            height:
                                                                image.height,
                                                            mime: image.mime,
                                                        });
                                                    });
                                                    break;
                                                }
                                                case 3: {
                                                    ImagePicker.openCropper({
                                                        path: avatar
                                                            ? avatar.uri
                                                            : club.photo
                                                                  .original,
                                                        width: 300,
                                                        height: 300,
                                                        freeStyleCropEnabled: true,
                                                        cropperCircleOverlay: true,
                                                        cropperChooseText:
                                                            'Wählen Sie',
                                                        cropperCancelText:
                                                            'Abbrechen',
                                                    }).then(image => {
                                                        this.setAvatar({
                                                            uri: image.path,
                                                            width: image.width,
                                                            height:
                                                                image.height,
                                                            mime: image.mime,
                                                        });
                                                    });
                                                    break;
                                                }
                                                case 4: {
                                                    break;
                                                }
                                            }
                                        },
                                    );
                                }}>
                                <Text
                                    style={[
                                        s.sectionItemLabel,
                                        {color: PRIMARY_COLOR},
                                    ]}>
                                    {t(
                                        isPictureDefined
                                            ? 'editpic'
                                            : 'choosepic',
                                    )}
                                </Text>
                                <View style={s.touchImage}>
                                    {isPictureDefined && (
                                        <Image
                                            style={s.sectionImage}
                                            source={
                                                avatar
                                                    ? avatar
                                                    : {
                                                          uri:
                                                              club &&
                                                              club.photo &&
                                                              club.photo
                                                                  .original
                                                                  ? club.photo
                                                                        .original
                                                                  : '',
                                                      }
                                            }
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
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
                                <CustomTextInput
                                    style={[s.textInput, {textAlign: 'right'}]}
                                    value={club && club_profile.iban}
                                    placeholder="CH00 0000 0000 0000 0000 0"
                                    onBlur={this.formatIBAN}
                                    onChangeText={IBAN =>
                                        this.updateClubProfileState({
                                            iban: IBAN,
                                        })
                                    }
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <Text style={s.sectionName}>{t('address')}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    const valueOrNothing = val =>
                                        val ? val + ' ' : '';
                                    const initAddress =
                                        valueOrNothing(club_profile.street) +
                                        valueOrNothing(club_profile.zip) +
                                        valueOrNothing(club_profile.region);
                                    this.props.navigation.navigate(
                                        'LocationView',
                                        {
                                            initAddress,
                                            initposition: this.props.location
                                                ? this.props.location
                                                : this.state.myPosition,
                                            prefer:
                                                this.state.prefer === 'pos'
                                                    ? 'pos'
                                                    : initAddress?.length < 4
                                                    ? 'pos'
                                                    : 'addr',
                                        },
                                    );
                                }}
                                style={{paddingTop: 10, paddingRight: 10}}>
                                <Image
                                    source={IconOrt}
                                    style={{
                                        width: 39,
                                        height: 20,
                                        resizeMode: 'contain',
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={s.section}>
                            <View
                                style={[
                                    s.sectionItem,
                                    validation.includes('street')
                                        ? {borderBottomColor: 'red'}
                                        : {},
                                ]}>
                                <Text style={s.sectionItemLabel}>
                                    {t('street')}
                                </Text>
                                <CustomTextInput
                                    style={[s.textInput, {textAlign: 'right'}]}
                                    value={club_profile && club_profile.street}
                                    onChangeText={street =>
                                        this.updateClubProfileState({street})
                                    }
                                />
                            </View>
                            <View
                                style={[
                                    s.sectionItem,
                                    validation.includes('zip')
                                        ? {borderBottomColor: 'red'}
                                        : {},
                                ]}>
                                <Text style={s.sectionItemLabel}>
                                    {t('zip')}
                                </Text>
                                <CustomTextInput
                                    style={[s.textInput, {textAlign: 'right'}]}
                                    value={club_profile && club_profile.zip}
                                    onChangeText={zip =>
                                        this.updateClubProfileState({zip})
                                    }
                                />
                            </View>
                            <View
                                style={[
                                    s.sectionItem,
                                    validation.includes('region')
                                        ? {borderBottomColor: 'red'}
                                        : {},
                                ]}>
                                <Text style={s.sectionItemLabel}>
                                    {t('region')}
                                </Text>
                                <CustomTextInput
                                    style={[s.textInput, {textAlign: 'right'}]}
                                    value={club_profile && club_profile.region}
                                    onChangeText={region =>
                                        this.updateClubProfileState({region})
                                    }
                                />
                            </View>
                        </View>
                        <Text style={s.sectionName}>{t('aboutus')}</Text>
                        <View style={s.section}>
                            <View
                                style={[
                                    s.sectionItem,
                                    {
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    },
                                ]}>
                                <Text
                                    style={[
                                        s.sectionItemLabel,
                                        {paddingBottom: 5},
                                    ]}>
                                    {t('description')}
                                </Text>
                                <TextInput
                                    style={[
                                        s.textInput,
                                        {
                                            width: '100%',
                                            marginLeft: 0,
                                            paddingVertical: 3,
                                        },
                                    ]}
                                    multiline={true}
                                    numberOfLines={2}
                                    value={
                                        club_profile &&
                                        club_profile.short_description
                                    }
                                    onChangeText={short_description =>
                                        this.updateClubProfileState({
                                            short_description,
                                        })
                                    }
                                />
                            </View>
                            <View
                                style={[
                                    s.sectionItem,
                                    {
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    },
                                ]}>
                                <Text
                                    style={[
                                        s.sectionItemLabel,
                                        {paddingBottom: 5},
                                    ]}>
                                    {t('longdescp')}
                                </Text>
                                <TextInput
                                    style={[
                                        s.textInput,
                                        {
                                            width: '100%',
                                            marginLeft: 0,
                                            paddingVertical: 3,
                                        },
                                    ]}
                                    multiline={true}
                                    numberOfLines={2}
                                    value={
                                        club_profile &&
                                        club_profile.long_description
                                    }
                                    onChangeText={long_description =>
                                        this.updateClubProfileState({
                                            long_description,
                                        })
                                    }
                                />
                            </View>
                            <View
                                style={[
                                    s.sectionItem,
                                    validation.includes('club_status')
                                        ? {borderBottomColor: 'red'}
                                        : {},
                                ]}>
                                <Text
                                    style={[
                                        s.sectionItemLabel,
                                        {marginRight: 10},
                                    ]}>
                                    {t('clubstatus')}
                                </Text>
                                {club_profile && club_profile.club_status ? (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flex: 1,
                                        }}>
                                        <Text
                                            style={[
                                                {
                                                    color: '#88919E',
                                                    fontSize: 10,
                                                    marginRight: 5,
                                                },
                                            ]}>
                                            {club_profile.club_status.name
                                                ? club_profile.club_status.name
                                                : club_profile.club_status}
                                        </Text>
                                        <ClearButton
                                            onPress={() =>
                                                this.updateClubProfileState({
                                                    club_status: null,
                                                })
                                            }
                                        />
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => this.pickFile()}>
                                        <Text
                                            style={[
                                                s.textInput,
                                                {color: 'gray', fontSize: 14},
                                            ]}>
                                            {t('common:selectfile')}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        <Text style={s.sectionName}>{t('contact')}</Text>
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
                                <CustomTextInput
                                    style={[s.textInput, {textAlign: 'right'}]}
                                    value={club_profile && club_profile.email}
                                    onChangeText={email =>
                                        this.updateClubProfileState({email})
                                    }
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
                                <CustomTextInput
                                    keyboardType="phone-pad"
                                    placeholder="+41 000 000 000"
                                    style={[s.textInput, {textAlign: 'right'}]}
                                    value={club_profile && club_profile.phone}
                                    onChangeText={phone =>
                                        this.updateClubProfileState({
                                            phone: formatPhoneNumber(phone),
                                        })
                                    }
                                />
                            </View>
                            <View style={s.sectionItem}>
                                <SocialProfile
                                    name="globe"
                                    domain="Eigene Website"
                                    prefix="https://"
                                    value={club_profile && club_profile.website}
                                    onChange={website => {
                                        this.updateClubProfileState({website});
                                    }}
                                />
                            </View>
                            <View style={s.sectionItem}>
                                <SocialProfile
                                    name="facebook"
                                    domain="facebook.com"
                                    prefix="https://www.facebook.com/"
                                    value={
                                        club_profile && club_profile.facebook
                                    }
                                    onChange={facebook => {
                                        this.updateClubProfileState({facebook});
                                    }}
                                />
                            </View>
                            <View style={s.sectionItem}>
                                <SocialProfile
                                    name="twitter"
                                    domain="twitter.com"
                                    prefix="https://www.twitter.com/"
                                    value={club_profile && club_profile.twitter}
                                    onChange={twitter => {
                                        this.updateClubProfileState({twitter});
                                    }}
                                />
                            </View>
                            <View style={s.sectionItem}>
                                <SocialProfile
                                    name="linkedin"
                                    domain="linkedin.com"
                                    prefix="https://www.linkedin.com/in/"
                                    value={
                                        club_profile && club_profile.linkedin
                                    }
                                    onChange={linkedin => {
                                        this.updateClubProfileState({linkedin});
                                    }}
                                />
                            </View>
                            <View style={s.sectionItem}>
                                <SocialProfile
                                    name="instagram"
                                    domain="instagram.com"
                                    prefix="https://www.instagram.com/"
                                    value={
                                        club_profile && club_profile.instagram
                                    }
                                    onChange={instagram => {
                                        this.updateClubProfileState({
                                            instagram,
                                        });
                                    }}
                                />
                            </View>
                        </View>
                        {/*
                        <Text style={s.sectionName}>Kalender</Text>
                        <View style={s.section}>
                            <View style={s.sectionItem}>
                                <Text style={s.sectionItemLabel}>Mitglieder</Text>
                            </View>
                            <View style={s.sectionItem}>
                                <Text style={s.sectionItemLabel}>Vorstand</Text>

                            </View>
                            <View style={s.sectionItem}>
                                <Text style={s.sectionItemLabel}>Öffentlich</Text>
                            </View>
                        </View>
                        */}
                        <TouchableOpacity
                            style={[
                                s.button,
                                {backgroundColor: PRIMARY_COLOR, marginTop: 50},
                            ]}
                            onPress={() => {
                                if (isprocessing) return;
                                this.setState({validation: []});
                                const validationResult = this.onValidate();
                                if (validationResult.length > 0) {
                                    this.setState(
                                        {validation: validationResult},
                                        () => {
                                            this.scrollview &&
                                                this.scrollview.scrollToPosition(
                                                    0,
                                                    0,
                                                    true,
                                                );
                                        },
                                    );
                                    if (validationResult.includes('iban'))
                                        showMessage(t('invalid-iban'));
                                    else showMessage(t('missinginfo'));
                                    return;
                                }
                                this.setState({isprocessing: true});
                                this.saveProfile();
                            }}>
                            {isprocessing ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={s.btnLabel}>{t('save')}</Text>
                            )}
                        </TouchableOpacity>
                        {club && club.marked_for_deletion ? (
                            <TouchableOpacity
                                style={[s.button, {backgroundColor: '#FF5286'}]}
                                onPress={() => {
                                    if (isprocessing) return;
                                    Alert.alert(
                                        t('restoreclub'),
                                        t('restoremsg'),
                                        [
                                            {
                                                text: t('cancel'),
                                                onPress: () => {},
                                                style: 'cancel',
                                            },
                                            {
                                                text: t('ok'),
                                                onPress: () => {
                                                    this.props.regretClub(
                                                        club.id,
                                                        res => {
                                                            if (res)
                                                                this.props.navigation.goBack();
                                                        },
                                                    );
                                                },
                                            },
                                        ],
                                        {cancelable: true},
                                    );
                                }}>
                                <Text style={s.btnLabel}>{t('restore')}</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={[s.button, {backgroundColor: '#FF5286'}]}
                                onPress={() => {
                                    if (isprocessing) return;
                                    Alert.alert(
                                        t('deleteclub'),
                                        t('deletemsg'),
                                        [
                                            {
                                                text: t('cancel'),
                                                onPress: () => {},
                                                style: 'cancel',
                                            },
                                            {
                                                text: t('ok'),
                                                onPress: () => {
                                                    this.props.deleteClub(
                                                        club.id,
                                                        res => {
                                                            if (res)
                                                                this.props.navigation.pop(
                                                                    2,
                                                                );
                                                        },
                                                    );
                                                },
                                            },
                                        ],
                                        {cancelable: true},
                                    );
                                }}>
                                <Text style={s.btnLabel}>{t('delete')}</Text>
                            </TouchableOpacity>
                        )}
                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    categories: state.category.all_categories,
    club: state.club.club,
    club_profile: state.club.club_profile,
    location: state.user.location,
});

const mapDispatchToProps = {
    updateClub,
    updateClubProfile,
    deleteClub,
    setLocation,
    regretClub,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    hoistStatics(
        withTranslation(['clubeditinfo', 'common'])(ClubEditInfo),
        ClubEditInfo,
    ),
);
