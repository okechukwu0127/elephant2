import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    Image,
    FlatList,
    Platform,
    PermissionsAndroid,
    ActivityIndicator,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../../themes/colors';
import {
    ToggleSwitch,
    FeedCardEvent,
    CategoryDropdown,
    AvatarImage,
} from '../../../components';
import {connect} from 'react-redux';
import ActionSheet from 'react-native-action-sheet';
import {createEvent} from '../../../reducers/feed';
import {getCategoriesForNewsEvent} from '../../../reducers/category';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import Spinner from 'react-native-loading-spinner-overlay';
import {getClubsByUser, getMemberOfClubs} from '../../../reducers/club';
import {getVenueCategoires} from '../../../reducers/category';
import {
    getExtFromMime,
    removeDuplicates,
    showMessage,
} from '../../../utils/utils';
import {getClubMembers, getBoardMembers} from '../../../reducers/member';
import Geolocation from 'react-native-geolocation-service';
import {setLocation} from '../../../reducers/user';
import {
    getEvent,
    updateEvent,
    addExtraFileToEvent,
    removeExtraFileFromEvent,
    getWhereToPay,
} from '../../../reducers/event';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {getUserName, checkLength} from '../../../utils/utils';
import CustomFocusInput from '../../../components/CustomFocusInput/CustomFocusInput';
import MiniMap from '../../../components/MiniMap/MiniMap';
import ClearButton from '../../../components/ClearButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const DATE_FORMAT = 'DD.MM.YYYY';
const DATETIME_FORMAT = 'ddd. ' + DATE_FORMAT + ' HH:mm';

var GROUP_OPTIONS = t => [
    {value: 'public', label: t('common:public')},
    {value: 'member', label: t('common:member')},
    {value: 'board', label: t('common:board')},
];
var RECURRING_OPTIONS = t => [
    {value: 'weekly', label: t('common:weekly')},
    {value: 'monthly', label: t('common:monthly')},
    {value: 'yearly', label: t('common:yearly')},
];
var PAY_OPTIONS = t => [
    {value: 'at-registration', label: t('option_at_registration')},
];
var FEE_OPTIONS = t => [
    {value: 'admission', label: t('admission-fee')},
    {value: 'participation', label: t('participation-fee')},
    {value: 'reservation', label: t('reservation-fee')},
    {value: 'expenses', label: t('expenses-fee')},
    {value: 'contribution', label: t('contribution-fee')},
];

class CreateEvent extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    datePickerStyles = {
        dateText: {
            fontFamily: 'Rubik-Medium',
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
        const event_id = props.navigation.getParam('event_id');
        const today = moment().add(1, 'days');
        this.state = {
            inputs: null,
            spinner: false,
            loading: event_id != null ? true : false,
            loading_text: 'creating',
            openCategory: false,
            ispublish: false,
            validation: [],
            userview: null,
            myPosition: null,
            orging_event_data: null,
            whereToPayData: [],
            form: {
                club_id: null,
                title: null,
                description: null,
                author: props.user,
                links: [],
                all_day: 0,
                start_at: today.clone(),
                end_at: today.clone().add(1, 'days'),
                venue_category_id: null,
                venue_id: null,
                registration: true,
                //registration_deadline: 2020-09-11 09:00
                definitely_close: true,
                min_participants: null,
                max_participants: null,
                allow_waiting: true,
                financial_type: FEE_OPTIONS(props.t)[0],
                fees: null,
                how_to_pay: null,
                use_zirkl_pay: true,
                reminders: true,
                remind_before_deadline: true,
                remind_deadline_at: null,
                reminder_channels_deadline: null,
                remind_before_event: true,
                remind_event_at: null,
                reminder_channels_event: null,
                visibility: 1,
                allow_likes: true,
                allow_comments: true,
                allow_sharing: true,
                contact: '',
                //accessible_via: 'Not sure what this is',
                sharing_options: [],
                published_at: today.clone(),
                categories: null,
                extra_files: [],
                photo: null,

                recurring: RECURRING_OPTIONS(props.t)[0],
                location_instructions: null,
                register_by: today.clone().add(-1, 'hours'),

                calendar_feed: GROUP_OPTIONS(props.t)[0],

                main_contact: props.user,
            },
        };
        props.getClubsByUser();
        props.getVenueCategoires();
        props.getMemberOfClubs();
        props.setLocation(null);
        this.scrollView = React.createRef();
        this.publishScroll = React.createRef();
        this.props.getWhereToPay(whereToPayData =>
            this.setState({whereToPayData}),
        );
    }
    componentDidMount() {
        const event_id = this.props.navigation.getParam('event_id');
        const {t} = this.props;
        if (event_id != null) {
            this.props.getEvent(event_id, res => {
                if (!res) return;
                this.props.setLocation({
                    address: res.location_instructions,
                });
                const form = {
                    ...res,
                    categories:
                        res.categories && res.categories.length > 0
                            ? res.categories[0]
                            : null,
                    club_id: res.club,
                    start_at: res.start_at ? moment(res.start_at) : null,
                    end_at: res.end_at ? moment(res.end_at) : null,

                    venue_id: res.venue_category,

                    register_by: res.registration_deadline
                        ? moment(res.registration_deadline)
                        : null,
                    financial_type: FEE_OPTIONS(t)[0], //missing
                    how_to_pay: this.state.whereToPayData?.find(
                        el => el.id === res.where_to_pay,
                    ),

                    visibility: parseInt(res.visibility, 10),
                    published_at: res.published_at
                        ? moment(res.published_at)
                        : null,
                    sharing_options: [],
                    calendar_feed: GROUP_OPTIONS(t).find(
                        item => item.value == res.calendar_feed,
                    ),
                    links: res.links
                        ? Array.isArray(res.links)
                            ? res.links
                            : JSON.parse(res.links)
                        : [],
                    reminder_channels_deadline: res.reminder_channels_deadline
                        ? Array.isArray(res.reminder_channels_deadline)
                            ? res.reminder_channels_deadline
                            : JSON.parse(res.reminder_channels_deadline)
                        : [],
                    reminder_channels_event: res.reminder_channels_event
                        ? Array.isArray(res.reminder_channels_event)
                            ? res.reminder_channels_event
                            : JSON.parse(res.reminder_channels_event)
                        : [],
                    remind_deadline_at: res.remind_deadline_at
                        ? moment(res.remind_deadline_at)
                        : null,
                    remind_event_at: res.remind_event_at
                        ? moment(res.remind_event_at)
                        : null,
                    location_instructions: res.address,
                    main_contact: res.author,
                    program: res.agenda,
                };
                if (res.club) this.props.getCategoriesForNewsEvent(res.club.id);
                this.setState({
                    loading: false,
                    mapAddress: res.address,
                    form,
                    orging_event_data: res,
                });
            });
        }
    }
    UNSAFE_componentWillMount() {
        this.requestLocation();
    }
    UNSAFE_componentWillReceiveProps(nextprops) {
        // if (
        //     nextprops.location &&
        //     nextprops.location.address != this.state.form.location_instructions
        // ) {
        //     this.onChangeValue(
        //         'location_instructions',
        //         nextprops.location.address,
        //     );
        // }
    }
    componentWillUnmount() {}
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
    setInputPosition({ids, value}) {
        const {inputs} = this.state;

        let updatedInputs = {
            ...inputs,
        };

        ids.forEach(id => {
            if (updatedInputs[id]) updatedInputs[id].yCoordinate = value;
            else updatedInputs[id] = {yCoordinate: value};
        });

        this.setState({
            inputs: updatedInputs,
        });
    }

    onChangeValue(name, value) {
        const {form} = this.state;
        const {t} = this.props;
        if (name == 'start_at') {
            if (form.end_at.isBefore(value)) {
                this.setState({
                    form: {
                        ...form,
                        ['start_at']: value,
                        end_at: value.clone().add(1, 'days'),
                    },
                });
                return;
            }
        }
        if (name == 'end_at') {
            if (value.isBefore(form.start_at)) {
                alert(t('invalid_enddate'));
                return;
            }
        }

        if (name === 'club_id')
            return this.setState({
                form: {
                    ...form,
                    club_id: value,
                    categories: null,
                },
            });

        if (name === 'all_day') {
            let end_at = form.end_at;
            if (
                value &&
                moment(form.end_at, DATE_FORMAT).diff(
                    moment(form.start_at, DATE_FORMAT),
                    'days',
                ) < 1
            ) {
                end_at = moment(
                    moment(form.start_at).add(1, 'day'),
                    DATE_FORMAT,
                );
            }
            return this.setState({
                form: {
                    ...form,
                    all_day: value,
                    end_at,
                },
            });
        }

        this.setState({
            form: {
                ...form,
                [name]: value,
            },
        });
    }
    onValidate() {
        var validation = [];
        const {form} = this.state;
        if (form.title == null || form.title.length <= 0) {
            validation.push('title');
        }
        console.log(
            '🚀 ~ file: index.js ~ line 375 ~ CreateEvent ~ onValidate ~ form.categories',
            form.categories,
        );
        if (form.categories == null) {
            validation.push('categories');
        }
        if (form.description == null || form.description.length <= 0) {
            validation.push('description');
        }
        if (form.photo == null) {
            validation.push('photo');
        }
        if (form.location_instructions == null) {
            validation.push('address');
        }
        if (form.club_id == null) {
            validation.push('club_id');
        }
        if (form.venue_id == null) {
            validation.push('venue_id');
        }
        if (form.start_at && moment(form.start_at).isSameOrAfter(form.end_at))
            validation.push('start_at');

        if (
            form.register_by &&
            moment(form.register_by).isSameOrAfter(form.start_at)
        )
            validation.push('register_by');

        if (
            form.remind_before_deadline &&
            form.remind_deadline_at &&
            moment(form.remind_deadline_at).isSameOrAfter(form.start_at)
        )
            validation.push('remind_deadline_at');

        if (
            form.remind_before_event &&
            form.remind_event_at &&
            moment(form.remind_event_at).isSameOrAfter(form.start_at)
        )
            validation.push('remind_event_at');
        if (form.published_at && moment(form.published_at).isBefore(new Date()))
            validation.push('published_at');
        if (
            form.remind_before_deadline &&
            form.remind_deadline_at &&
            moment(form.remind_deadline_at).isBefore(new Date())
        )
            validation.push('remind_deadline_at');

        console.log('onValidate -> validation', validation);
        return validation;
    }
    goBack = () =>
        this.props.navigation.getParam('backTo')
            ? this.props.navigation.navigate(
                  this.props.navigation.getParam('backTo'),
              )
            : this.props.navigation.goBack();

    createEvent(event_id) {
        const {form} = this.state;
        var sharing_options = {};
        form.sharing_options.map(key => {
            sharing_options[key] = true;
        });
        const files = form.extra_files.filter(
            extra_data => extra_data.name && extra_data.file,
        );
        let extra_files = {};
        if (files.length > 0) {
            files.map((item, index) => {
                extra_files[`extra_files[${index}][name]`] = item.name;
                extra_files[`extra_files[${index}][file]`] = item.file;
            });
        }
        const DATE_FORMAT_BACKEND = 'YYYY-MM-DD';
        var param = {
            title: form.title,
            'categories[]': form.categories ? [form.categories.id] : [],
            club_id: form.club_id && form.club_id.id,
            author: form.author.id,
            description: form.description,
            ...(form.photo && form.photo.uri
                ? {
                      photo: {
                          uri: form.photo.uri,
                          name: `photo.${getExtFromMime(form.photo.mime)}`,
                          filename: `imagename.${getExtFromMime(
                              form.photo.mime,
                          )}`,
                          type: form.photo.mime,
                      },
                  }
                : {}),

            all_day: form.all_day,
            start_at:
                form.start_at &&
                form.start_at.format(DATE_FORMAT_BACKEND + ' HH:mm'),
            end_at:
                form.end_at &&
                form.end_at.format(DATE_FORMAT_BACKEND + ' HH:mm'),

            // venue_id: form.venue_id && form.venue_id.id,
            venue_category_id: form.venue_id && form.venue_id.id,
            location_instructions: form.location_instructions,

            registration_deadline:
                form.register_by &&
                form.register_by.format(DATE_FORMAT_BACKEND + ' HH:mm'),
            fees: form.fees ? form.fees : 0,
            how_to_pay: form?.how_to_pay?.id,

            visibility: form.visibility,
            published_at:
                form.published_at &&
                form.published_at.format(DATE_FORMAT_BACKEND + ' HH:mm'),
            sharing_options: JSON.stringify(sharing_options),
            calendar_feed: form.calendar_feed && form.calendar_feed.value,

            main_contact: form.main_contact && form.main_contact.id,
            contact:
                form.contact && form.contact.length > 0
                    ? form.contact
                    : 'Bestimmen',

            allow_comments: form.allow_comments ? 1 : 0,
            allow_likes: form.allow_likes ? 1 : 0,
            allow_sharing: form.allow_sharing ? 1 : 0,
            allow_waiting: form.allow_waiting ? 1 : 0,
            definitely_close: form.definitely_close ? 1 : 0,
            registration: form.registration ? 1 : 0,
            reminders:
                !!form.remind_before_deadline && !!form.remind_before_event
                    ? 1
                    : 0,
            use_zirkl_pay: form.use_zirkl_pay ? 1 : 0,
            links: JSON.stringify(
                form.links.filter(
                    link =>
                        link.title &&
                        link.title.length > 0 &&
                        link.url &&
                        link.url.length > 0,
                ),
            ),

            remind_before_deadline: form.remind_before_deadline ? 1 : 0,
            remind_deadline_at: form.remind_deadline_at
                ? form.remind_deadline_at.format(DATE_FORMAT_BACKEND + ' HH:mm')
                : moment(form.register_by)
                      .add(-1, 'hour')
                      .format(DATE_FORMAT_BACKEND + ' HH:mm'),
            reminder_channels_deadline: form.reminder_channels_deadline
                ? JSON.stringify(form.reminder_channels_deadline)
                : null,

            remind_before_event: form.remind_before_event ? 1 : 0,
            remind_event_at: form.remind_event_at
                ? form.remind_event_at.format(DATE_FORMAT_BACKEND + ' HH:mm')
                : moment(form.start_at)
                      .add(-1, 'hour')
                      .format(DATE_FORMAT_BACKEND + ' HH:mm'),
            reminder_channels_event: form.reminder_channels_event
                ? JSON.stringify(form.reminder_channels_event)
                : null,

            min_participants: form.min_participants ? form.min_participants : 0,
            max_participants: form.max_participants ? form.max_participants : 0,

            financial_type: form.financial_type
                ? form.financial_type.value
                : null,

            address: form.location_instructions,
            agenda: form.program,
        };
        const {t} = this.props;
        this.setState({
            spinner: true,
            loading_text: event_id ? t('processupdate') : t('processcreate'),
        });
        if (event_id) {
            this.props.updateEvent(
                event_id,
                {
                    ...param,
                },
                res => {
                    if (res) {
                        let removed_files = [];
                        const {orging_event_data} = this.state;
                        if (
                            orging_event_data.extra_files &&
                            orging_event_data.extra_files.length > 0
                        ) {
                            orging_event_data.extra_files.map(item => {
                                if (
                                    !form.extra_files.find(
                                        ex => ex.id == item.id,
                                    )
                                ) {
                                    removed_files.push(item.id);
                                }
                            });
                        }

                        if (Object.keys(extra_files).length > 0) {
                            this.setState({
                                spinner: true,
                                loading_text: 'uploading extra files...',
                            });
                            this.props.addExtraFileToEvent(
                                event_id,
                                extra_files,
                                extrafile_res => {
                                    console.log(
                                        '========extrafile_res',
                                        extrafile_res,
                                    );
                                    if (removed_files.length > 0) {
                                        Promise.all(
                                            removed_files.map(item =>
                                                this.props.removeExtraFileFromEvent(
                                                    event_id,
                                                    item,
                                                ),
                                            ),
                                        ).then(results => {});
                                    }
                                    this.setState({spinner: false});
                                    this.goBack();
                                },
                            );
                        } else {
                            if (removed_files.length > 0) {
                                Promise.all(
                                    removed_files.map(item =>
                                        this.props.removeExtraFileFromEvent(
                                            event_id,
                                            item,
                                        ),
                                    ),
                                ).then(results => {});
                            }
                            this.setState({spinner: false});
                            this.goBack();
                        }
                    } else {
                        this.setState({spinner: false});
                    }
                },
            );
        } else {
            this.props.createEvent(param, res => {
                console.log('========res', res);
                if (res) {
                    if (Object.keys(extra_files).length > 0) {
                        this.setState({
                            spinner: true,
                            loading_text: 'uploading extra files...',
                        });
                        this.props.addExtraFileToEvent(
                            res.id,
                            extra_files,
                            extrafile_res => {
                                console.log(
                                    '========extrafile_res',
                                    extrafile_res,
                                );
                                this.setState({spinner: false});
                                this.goBack();
                            },
                        );
                    } else {
                        this.setState({spinner: false});
                        this.goBack();
                    }
                } else {
                    this.setState({spinner: false});
                }
            });
        }
    }

    setReminders = (field, isOn) => {
        this.setState({
            form: {
                ...this.state.form,
                [field]: isOn ? 1 : 0,
            },
        });
    };

    autoFill = () => {
        if (!__DEV__) return;
        console.log('Autofilling the form..');
        const {clubs_user, board_of_clubs} = this.props;

        const clubs = removeDuplicates(
            [...clubs_user, ...board_of_clubs],
            'id',
        );
        const club = clubs.find(c => c.id === 300);
        this.onChangeValue('club_id', club);
        this.props.getBoardMembers(club.id);
        this.props.getCategoriesForNewsEvent(club.id);
        const random = parseInt(Math.random() * 100, 10);
        this.setState(
            {
                form: {
                    club_id: club,
                    title: 'Cool title #' + random,
                    description: `Desc #${random} here..`,
                    links: [
                        {title: 'Google', url: 'https://www.google.com'},
                        {title: 'Facebook', url: 'https://www.facebook.com'},
                    ],
                    venue_category_id: 1,
                    venue_id: null,
                    min_participants: 2,
                    max_participants: 10,
                    allow_waiting: true,
                    fees: 25,
                },
            },
            () => console.log('New state', this.state),
        );
    };

    checkValidation = (validation, field) => {
        if (validation.includes(field))
            return {
                borderBottomColor: '#e74c3c',
            };
        return {};
    };

    renderUserView() {
        const {t, board_members} = this.props;
        const members_data = removeDuplicates(
            [...board_members.map(item => ({...item.user, role: item.role}))],
            'id',
        );
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <View style={s.topBar}>
                        <TouchableOpacity onPress={() => this.goBack()}>
                            <Icon
                                name="arrow-left"
                                color={PRIMARY_TEXT_COLOR}
                                size={25}
                                style={{marginRight: 15}}
                            />
                        </TouchableOpacity>
                        <Text style={s.title}>{t('userviewtitle')}</Text>
                    </View>
                    <View style={{marginTop: 20}}>
                        <TouchableOpacity
                            style={{
                                marginVertical: 10,
                                marginHorizontal: 20,
                                marginBottom: 30,
                            }}
                            onPress={() => this.setState({userview: null})}>
                            <Icon
                                name="arrow-left"
                                color={PRIMARY_COLOR}
                                size={20}
                            />
                        </TouchableOpacity>
                        <FlatList
                            data={members_data}
                            renderItem={({item}) => {
                                const {role, profile} = item;
                                return (
                                    <TouchableOpacity
                                        style={[
                                            s.sectionItem,
                                            {
                                                paddingHorizontal: 20,
                                                paddingVertical: 5,
                                            },
                                        ]}
                                        onPress={async () => {
                                            this.setState({userview: null});
                                            if (
                                                this.state.userview == 'author'
                                            ) {
                                                this.onChangeValue(
                                                    'author',
                                                    item,
                                                );
                                            } else {
                                                await this.onChangeValue(
                                                    'main_contact',
                                                    item,
                                                );
                                                await this.onChangeValue(
                                                    'contact',
                                                    null,
                                                );
                                            }
                                        }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}>
                                            <View style={s.sectionImage}>
                                                <AvatarImage
                                                    user_id={item?.id}
                                                    width={40}
                                                    user={item}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    marginLeft: 10,
                                                }}>
                                                <Text style={[s.memberName]}>
                                                    {getUserName(item)}
                                                </Text>
                                                {role ? (
                                                    <Text
                                                        style={[
                                                            s.memberDescription,
                                                        ]}>
                                                        {role.name}
                                                    </Text>
                                                ) : null}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                            keyExtractor={(item, index) => item.id + ''}
                        />
                    </View>
                </View>
            </View>
        );
    }
    render() {
        const {ispublish} = this.state;
        return ispublish ? this.renderPublish() : this.renderEditForm();
    }
    renderPublish() {
        const {form, city} = this.state;
        const event_id = this.props.navigation.getParam('event_id');
        const {t} = this.props;
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <ScrollView ref={this.publishScroll}>
                        <View style={s.topBar}>
                            <TouchableOpacity
                                onPress={() =>
                                    this.setState({ispublish: false})
                                }>
                                <Icon
                                    name="arrow-left"
                                    color={PRIMARY_TEXT_COLOR}
                                    size={25}
                                    style={{marginRight: 15}}
                                />
                            </TouchableOpacity>
                            <Text style={s.title}>{t('overview')}</Text>
                        </View>
                        {
                            <View>
                                <Text
                                    style={[
                                        s.sectionItemLabel,
                                        {
                                            color: '#272E3F',
                                            marginHorizontal: 25,
                                            lineHeight: 20,
                                        },
                                    ]}>
                                    {t('overviewdescrp')}
                                </Text>
                                <FeedCardEvent
                                    unfold={true}
                                    data={{
                                        action: 'event-created',
                                        content: {
                                            // author: form.author,
                                            title: form.title,
                                            description: form.description,
                                            all_day: form.all_day,
                                            start_at:
                                                form.start_at &&
                                                form.start_at.format(
                                                    'YYYY-MM-DD HH:mm',
                                                ),
                                            end_at:
                                                form.end_at &&
                                                form.end_at.format(
                                                    'YYYY-MM-DD HH:mm',
                                                ),
                                            photo: form.photo,
                                            fees: form.fees,
                                            interested: true,
                                            attending: true,
                                            allow_likes: form.allow_likes,
                                            allow_comments: form.allow_comments,
                                            allow_sharing: form.allow_sharing,
                                            club: form.club_id,
                                            city,
                                            registration: form.registration,
                                            register_by: form.register_by,
                                            agenda: form.program,
                                            extra_files: form.extra_files,
                                            links: form.links,
                                            address: form.location_instructions,
                                            min_participants:
                                                form.min_participants,
                                            max_participants:
                                                form.max_participants,
                                            allow_waiting: form.allow_waiting,
                                            how_to_pay: form.how_to_pay?.label,
                                            author: form.main_contact,
                                            contact: form.contact,
                                            categories: [form.categories],
                                            financial_type:
                                                form.financial_type?.value,
                                            venue_category: form.venue_id,
                                        },
                                    }}
                                    onOpenAttendees={event => {}}
                                    joinToEvent={(event, isJoin) => {}}
                                    confirmAttende={event => {}}
                                    openCard={data => {}}
                                    isPreview
                                />
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontFamily: 'Rubik-Medium',
                                        color: PRIMARY_TEXT_COLOR,
                                        paddingHorizontal: 28,
                                    }}>
                                    Meta
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        textAlign: 'center',
                                        justifyContent: 'space-between',
                                        marginVertical: 7,
                                        paddingHorizontal: 28,
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontFamily: 'Rubik-Regular',
                                            color: PRIMARY_TEXT_COLOR,
                                        }}>
                                        Publiziert:
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'Rubik-Medium',
                                            fontSize: 14,
                                            color: PRIMARY_TEXT_COLOR,
                                        }}>
                                        {moment().format(DATETIME_FORMAT)}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        textAlign: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 7,
                                        paddingHorizontal: 28,
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontFamily: 'Rubik-Regular',
                                            color: PRIMARY_TEXT_COLOR,
                                        }}>
                                        Zuletzt editiert:
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'Rubik-Medium',
                                            fontSize: 14,
                                            color: PRIMARY_TEXT_COLOR,
                                        }}>
                                        {moment().format(DATETIME_FORMAT)}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[
                                        s.button,
                                        {
                                            backgroundColor: PRIMARY_COLOR,
                                            marginTop: 50,
                                        },
                                    ]}
                                    onPress={() => this.createEvent(event_id)}>
                                    <Text style={s.btnLabel}>
                                        {event_id
                                            ? t('btnupdate')
                                            : 'PUBLIZIEREN '}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </ScrollView>
                </View>
                <Spinner
                    visible={this.state.spinner}
                    textContent={this.state.loading_text}
                    textStyle={s.spinnerTextStyle}
                />
            </View>
        );
    }
    updateExtraFiles(extra_files) {
        this.onChangeValue('extra_files', extra_files);
    }
    updateLinks(links) {
        this.onChangeValue('links', links);
    }
    renderEditForm() {
        const {form, validation, userview, loading} = this.state;
        const {t, venues} = this.props;

        if (userview) {
            return this.renderUserView();
        }
        const author_profile = form.author && form.author.profile;
        const main_contact_profile =
            form.main_contact && form.main_contact.profile;
        if (main_contact_profile)
            main_contact_profile.username = form.main_contact
                ? form.main_contact.first_name +
                  ' ' +
                  form.main_contact.last_name
                : null;
        let contacts = [form.main_contact && form.main_contact.email];
        if (main_contact_profile && main_contact_profile.phone)
            contacts.push(main_contact_profile.phone);
        if (main_contact_profile && main_contact_profile.mobile)
            contacts.push(main_contact_profile.mobile);

        return (
            <View style={s.container}>
                <KeyboardAwareScrollView
                    style={{flex: 1}}
                    enableOnAndroid={true}
                    keyboardShouldPersistTaps="handled">
                    <View style={s.wrapper}>
                        <ScrollView
                            ref={this.scrollView}
                            onScroll={({nativeEvent}) => {
                                this.setState({
                                    currentScroll: nativeEvent.contentOffset.y,
                                });
                            }}>
                            <View style={s.topBar}>
                                <TouchableOpacity onPress={() => this.goBack()}>
                                    <Icon
                                        name="arrow-left"
                                        color={PRIMARY_TEXT_COLOR}
                                        size={25}
                                        style={{marginRight: 15}}
                                    />
                                </TouchableOpacity>
                                <Text style={s.title}>{t('title')}</Text>
                            </View>
                            {loading ? (
                                <ActivityIndicator
                                    color={PRIMARY_COLOR}
                                    size="large"
                                    style={{alignSelf: 'center', marginTop: 10}}
                                />
                            ) : (
                                <View>
                                    <Text style={s.sectionName}>
                                        {t('designation')}
                                    </Text>

                                    <View
                                        style={s.section}
                                        onLayout={({nativeEvent}) => {
                                            this.setInputPosition({
                                                ids: [
                                                    'title',
                                                    'club_id',
                                                    'categories',
                                                    'description',
                                                    'photo',
                                                ],
                                                value: nativeEvent.layout.y,
                                            });
                                        }}>
                                        <TouchableOpacity
                                            style={[
                                                s.sectionItem,
                                                this.checkValidation(
                                                    validation,
                                                    'club_id',
                                                ),
                                            ]}
                                            onPress={() =>
                                                this.showSelectClub()
                                            }>
                                            <Text style={s.sectionItemLabel}>
                                                {t('club')} *
                                            </Text>
                                            <View style={s.sectionRight}>
                                                <Text
                                                    style={s.sectionRightLabel}>
                                                    {form &&
                                                        form.club_id &&
                                                        form.club_id.name}
                                                </Text>
                                                <Icon
                                                    name="chevron-right"
                                                    size={20}
                                                    color="#C7C7CC"
                                                    style={{marginLeft: 10}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <View
                                            style={[
                                                s.sectionItem,
                                                this.checkValidation(
                                                    validation,
                                                    'title',
                                                ),
                                            ]}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('eventtitle')} *
                                            </Text>
                                            <CustomFocusInput
                                                style={[
                                                    s.textInput,
                                                    {textAlign: 'right'},
                                                ]}
                                                value={form && form.title}
                                                onChangeText={value =>
                                                    this.onChangeValue(
                                                        'title',
                                                        value,
                                                    )
                                                }
                                            />
                                        </View>
                                        <TouchableOpacity
                                            style={[
                                                s.sectionItem,
                                                this.checkValidation(
                                                    validation,
                                                    'categories',
                                                ),
                                            ]}
                                            onPress={() => {
                                                form.club_id
                                                    ? this.setState({
                                                          openCategory: true,
                                                      })
                                                    : showMessage(
                                                          t('msg_chooseclub'),
                                                      );
                                            }}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('category')} *
                                            </Text>
                                            <View style={s.sectionRight}>
                                                <Text
                                                    style={s.sectionRightLabel}>
                                                    {form?.categories?.name}
                                                </Text>
                                                <Icon
                                                    name="chevron-right"
                                                    size={20}
                                                    color="#C7C7CC"
                                                    style={{marginLeft: 10}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                s.sectionItem,
                                                this.checkValidation(
                                                    validation,
                                                    'photo',
                                                ),
                                            ]}
                                            onPress={() =>
                                                this.showImagePicker()
                                            }>
                                            <Text style={[s.sectionItemLabel]}>
                                                {t('photo')} *
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-end',
                                                    marginVertical: 10,
                                                }}>
                                                {form && form.photo && (
                                                    <View>
                                                        {form.photo.original ? (
                                                            <Image
                                                                style={
                                                                    s.sectionImage
                                                                }
                                                                source={{
                                                                    uri:
                                                                        form
                                                                            .photo
                                                                            .original,
                                                                }}
                                                            />
                                                        ) : (
                                                            <Image
                                                                style={
                                                                    s.sectionImage
                                                                }
                                                                source={
                                                                    form.photo
                                                                }
                                                            />
                                                        )}
                                                    </View>
                                                )}
                                                <Icon
                                                    name="chevron-right"
                                                    size={20}
                                                    color="#C7C7CC"
                                                    style={{marginLeft: 10}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <View
                                            style={[
                                                s.sectionItem,
                                                {
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                },
                                                this.checkValidation(
                                                    validation,
                                                    'description',
                                                ),
                                            ]}>
                                            <Text
                                                style={[
                                                    s.sectionItemLabel,
                                                    {paddingBottom: 5},
                                                ]}>
                                                {t('description')} *
                                            </Text>
                                            <CustomFocusInput
                                                style={[
                                                    s.textInput,
                                                    {
                                                        width: '100%',
                                                        marginLeft: 0,
                                                        paddingVertical: 3,
                                                    },
                                                ]}
                                                touchStyle={{width: '100%'}}
                                                multiline={true}
                                                numberOfLines={5}
                                                textAlignVertical="top"
                                                value={form && form.description}
                                                onChangeText={value =>
                                                    this.onChangeValue(
                                                        'description',
                                                        value,
                                                    )
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
                                                {t('program')}
                                            </Text>
                                            <CustomFocusInput
                                                style={[
                                                    s.textInput,
                                                    {
                                                        width: '100%',
                                                        marginLeft: 0,
                                                        paddingVertical: 3,
                                                    },
                                                ]}
                                                touchStyle={{width: '100%'}}
                                                multiline={true}
                                                numberOfLines={5}
                                                textAlignVertical="top"
                                                value={form && form.program}
                                                onChangeText={value =>
                                                    this.onChangeValue(
                                                        'program',
                                                        value,
                                                    )
                                                }
                                            />
                                        </View>
                                        <TouchableOpacity
                                            style={s.sectionItem}
                                            onPress={() => {
                                                form.club_id
                                                    ? this.setState({
                                                          userview: 'author',
                                                      })
                                                    : showMessage(
                                                          t('msg_chooseclub'),
                                                      );
                                            }}>
                                            <Text style={[s.sectionItemLabel]}>
                                                {t('author')} *
                                            </Text>
                                            <View style={s.touchImage}>
                                                <AvatarImage
                                                    user_id={form.author?.id}
                                                    width={40}
                                                    user={form.author}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <Text
                                        style={[
                                            s.sectionName,
                                            {marginTop: 40},
                                        ]}>
                                        {t('supp')}
                                    </Text>
                                    <View style={s.section}>
                                        <TouchableOpacity
                                            style={[s.sectionItem]}
                                            onPress={() => {
                                                this.props.navigation.navigate(
                                                    'MultipleFiles',
                                                    {
                                                        extra_files:
                                                            form.extra_files,
                                                        updateExtraFiles: this.updateExtraFiles.bind(
                                                            this,
                                                        ),
                                                    },
                                                );
                                            }}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('files')}
                                            </Text>
                                            <View style={s.sectionRight}>
                                                <Text
                                                    style={[
                                                        s.sectionRightLabel,
                                                    ]}>
                                                    {checkLength(
                                                        form?.extra_files
                                                            ?.filter(
                                                                item =>
                                                                    item.name &&
                                                                    item.name
                                                                        .length >
                                                                        0,
                                                            )
                                                            ?.map(
                                                                item =>
                                                                    item.name,
                                                            )
                                                            ?.join(', '),
                                                        30,
                                                    )}
                                                </Text>
                                                <Icon
                                                    name="chevron-right"
                                                    size={20}
                                                    color="#C7C7CC"
                                                    style={{marginLeft: 10}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[s.sectionItem]}
                                            onPress={() => {
                                                this.props.navigation.navigate(
                                                    'MultipleLinks',
                                                    {
                                                        links: form.links,
                                                        updateLinks: this.updateLinks.bind(
                                                            this,
                                                        ),
                                                    },
                                                );
                                            }}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('links')}
                                            </Text>
                                            <View style={s.sectionRight}>
                                                <Text
                                                    style={s.sectionRightLabel}>
                                                    {checkLength(
                                                        form?.links
                                                            ?.filter(
                                                                item =>
                                                                    item.title &&
                                                                    item.title
                                                                        .length >
                                                                        0,
                                                            )
                                                            ?.map(
                                                                item =>
                                                                    item.title,
                                                            )
                                                            ?.join(', '),
                                                        30,
                                                    )}
                                                </Text>
                                                <Icon
                                                    name="chevron-right"
                                                    size={20}
                                                    color="#C7C7CC"
                                                    style={{marginLeft: 10}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <Text
                                        style={[
                                            s.sectionName,
                                            {marginTop: 40},
                                        ]}>
                                        {t('time')}
                                    </Text>
                                    <View style={s.section}>
                                        <View style={s.sectionItem}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('fullday')}
                                            </Text>
                                            <ToggleSwitch
                                                isOn={!!form.all_day}
                                                onColor={PRIMARY_COLOR}
                                                offColor={'gray'}
                                                label={''}
                                                onToggle={isOn => {
                                                    this.onChangeValue(
                                                        'all_day',
                                                        isOn ? 1 : 0,
                                                    );
                                                }}
                                            />
                                        </View>
                                        <View style={s.sectionItem}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('startat')}
                                            </Text>
                                            <DatePicker
                                                locale="de"
                                                style={{width: 200}}
                                                date={form.start_at}
                                                confirmBtnText="Bestätigen Sie"
                                                cancelBtnText="Abbrechen"
                                                customStyles={
                                                    this.datePickerStyles
                                                }
                                                placeholder="Wählen Sie ein Datum und eine Uhrzeit"
                                                mode={
                                                    form.all_day
                                                        ? 'date'
                                                        : 'datetime'
                                                }
                                                format={
                                                    form.all_day
                                                        ? DATE_FORMAT
                                                        : DATETIME_FORMAT
                                                }
                                                minDate={moment().format(
                                                    form.all_day
                                                        ? DATE_FORMAT
                                                        : DATETIME_FORMAT,
                                                )}
                                                onDateChange={date => {
                                                    this.onChangeValue(
                                                        'start_at',
                                                        moment(
                                                            date,
                                                            form.all_day
                                                                ? DATE_FORMAT
                                                                : DATE_FORMAT +
                                                                      ' HH:mm',
                                                        ),
                                                    );
                                                }}
                                            />
                                        </View>
                                        <View style={s.sectionItem}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('endat')}
                                            </Text>
                                            <DatePicker
                                                locale="de"
                                                style={{width: 200}}
                                                date={form.end_at}
                                                placeholder="Wählen Sie ein Datum und eine Uhrzeit"
                                                confirmBtnText="Bestätigen Sie"
                                                cancelBtnText="Abbrechen"
                                                customStyles={
                                                    this.datePickerStyles
                                                }
                                                mode={
                                                    form.all_day
                                                        ? 'date'
                                                        : 'datetime'
                                                }
                                                format={
                                                    form.all_day
                                                        ? DATE_FORMAT
                                                        : DATETIME_FORMAT
                                                }
                                                minDate={moment().format(
                                                    form.all_day
                                                        ? DATE_FORMAT
                                                        : DATETIME_FORMAT,
                                                )}
                                                onDateChange={date => {
                                                    this.onChangeValue(
                                                        'end_at',
                                                        moment(
                                                            date,
                                                            form.all_day
                                                                ? DATE_FORMAT
                                                                : DATE_FORMAT +
                                                                      ' HH:mm',
                                                        ),
                                                    );
                                                }}
                                            />
                                        </View>
                                        {
                                            // ? This will be added in later versions
                                            /* <TouchableOpacity
                                        style={s.sectionItem}
                                        onPress={() => {
                                            ActionSheet.showActionSheetWithOptions(
                                                {
                                                    options: RECURRING_OPTIONS(
                                                        t,
                                                    ).map(item => item.label),
                                                    tintColor: 'black',
                                                },
                                                index => {
                                                    index != undefined &&
                                                        this.onChangeValue(
                                                            'recurring',
                                                            RECURRING_OPTIONS(
                                                                t,
                                                            )[index],
                                                        );
                                                },
                                            );
                                        }}>
                                        <Text style={s.sectionItemLabel}>
                                            {t('recurring')}
                                        </Text>
                                        <View style={s.sectionRight}>
                                            <Text style={s.sectionRightLabel}>
                                                {form.recurring &&
                                                    form.recurring.label}
                                            </Text>
                                            <Icon
                                                name="chevron-right"
                                                size={20}
                                                color="#C7C7CC"
                                                style={{marginLeft: 10}}
                                            />
                                        </View>
                                    </TouchableOpacity> */
                                        }
                                    </View>
                                    <Text
                                        style={[
                                            s.sectionName,
                                            {marginTop: 40},
                                        ]}>
                                        {t('place')}
                                    </Text>
                                    <View
                                        style={s.section}
                                        onLayout={({nativeEvent}) => {
                                            this.setInputPosition({
                                                ids: [
                                                    'venue_id',
                                                    'location_instructions',
                                                ],
                                                value: nativeEvent.layout.y,
                                            });
                                        }}>
                                        <TouchableOpacity
                                            style={[
                                                s.sectionItem,
                                                this.checkValidation(
                                                    validation,
                                                    'venue_id',
                                                ),
                                            ]}
                                            onPress={() => {
                                                if (
                                                    venues &&
                                                    venues.length > 0
                                                ) {
                                                    ActionSheet.showActionSheetWithOptions(
                                                        {
                                                            options: venues.map(
                                                                item =>
                                                                    item.name,
                                                            ),
                                                            tintColor: 'black',
                                                        },
                                                        index => {
                                                            index !=
                                                                undefined &&
                                                                this.onChangeValue(
                                                                    'venue_id',
                                                                    venues[
                                                                        index
                                                                    ],
                                                                );
                                                        },
                                                    );
                                                } else alert('No venues');
                                            }}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('placecategory')} *
                                            </Text>
                                            <View style={s.sectionRight}>
                                                <Text
                                                    style={s.sectionRightLabel}>
                                                    {form &&
                                                        form.venue_id &&
                                                        form.venue_id.name}
                                                </Text>
                                                <Icon
                                                    name="chevron-right"
                                                    size={20}
                                                    color="#C7C7CC"
                                                    style={{marginLeft: 10}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <View
                                            style={[
                                                s.sectionItem,
                                                this.checkValidation(
                                                    validation,
                                                    'address',
                                                ),
                                            ]}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('address')} *
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    flex: 1,
                                                    justifyContent: 'flex-end',
                                                    overflow: 'hidden',
                                                }}>
                                                <CustomFocusInput
                                                    multiline
                                                    style={[
                                                        s.textInput,
                                                        {
                                                            textAlign: 'right',
                                                        },
                                                    ]}
                                                    onBlur={() => {
                                                        this.setState({
                                                            mapAddress: this
                                                                .state.form
                                                                .location_instructions,
                                                        });
                                                    }}
                                                    value={
                                                        form &&
                                                        form.location_instructions
                                                    }
                                                    onChangeText={value =>
                                                        this.onChangeValue(
                                                            'location_instructions',
                                                            value,
                                                        )
                                                    }
                                                />
                                                <ClearButton
                                                    onPress={() =>
                                                        this.onChangeValue(
                                                            'location_instructions',
                                                            null,
                                                        )
                                                    }
                                                />
                                            </View>
                                        </View>
                                        <View style={{marginLeft: -25}}>
                                            <MiniMap
                                                enableHighAccuracy
                                                address={this.state.mapAddress}
                                                addressChanged={address => {
                                                    console.log(
                                                        'address',
                                                        address,
                                                    );
                                                    this.onChangeValue(
                                                        'location_instructions',
                                                        address,
                                                    );
                                                }}
                                                cityChange={city =>
                                                    this.setState({city})
                                                }
                                            />
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingRight: 10,
                                            marginTop: 40,
                                            paddingBottom: 10,
                                        }}>
                                        <Text style={s.sectionNameWithSwitcher}>
                                            {t('registration')}
                                        </Text>
                                        <ToggleSwitch
                                            isOn={!!form.registration}
                                            onColor={PRIMARY_COLOR}
                                            offColor={'gray'}
                                            label={''}
                                            style={{marginTop: 10}}
                                            onToggle={isOn => {
                                                this.onChangeValue(
                                                    'registration',
                                                    isOn ? 1 : 0,
                                                );
                                            }}
                                        />
                                    </View>
                                    {!!form.registration && (
                                        <View style={s.section}>
                                            <View style={s.sectionItem}>
                                                <Text
                                                    style={s.sectionItemLabel}>
                                                    {t('registerby')}
                                                </Text>
                                                <DatePicker
                                                    disabled={
                                                        !form.registration
                                                    }
                                                    locale="de"
                                                    style={{width: 200}}
                                                    date={form.register_by}
                                                    mode="datetime"
                                                    placeholder="Wählen Sie ein Datum und eine Uhrzeit"
                                                    format={DATETIME_FORMAT}
                                                    minDate={moment().format(
                                                        DATETIME_FORMAT,
                                                    )}
                                                    confirmBtnText="Bestätigen Sie"
                                                    cancelBtnText="Abbrechen"
                                                    customStyles={
                                                        this.datePickerStyles
                                                    }
                                                    onDateChange={date => {
                                                        this.onChangeValue(
                                                            'register_by',
                                                            moment(
                                                                date,
                                                                DATE_FORMAT +
                                                                    ' HH:mm',
                                                            ),
                                                        );
                                                    }}
                                                />
                                            </View>
                                            {/* <View style={s.sectionItem}>
                                                <Text
                                                    style={s.sectionItemLabel}>
                                                    {t('definitely')}
                                                </Text>
                                                <ToggleSwitch
                                                    disabled={
                                                        !form.registration
                                                    }
                                                    isOn={
                                                        !!form.definitely_close &&
                                                        form.registration
                                                    }
                                                    onColor={PRIMARY_COLOR}
                                                    offColor={'gray'}
                                                    label={''}
                                                    onToggle={isOn => {
                                                        this.onChangeValue(
                                                            'definitely_close',
                                                            isOn ? 1 : 0,
                                                        );
                                                    }}
                                                />
                                            </View> */}
                                            <View style={[s.sectionItem]}>
                                                <Text
                                                    style={s.sectionItemLabel}>
                                                    {t('min-participants')}
                                                </Text>
                                                <CustomFocusInput
                                                    editable={
                                                        !!form.registration
                                                    }
                                                    style={[
                                                        s.textInput,
                                                        {textAlign: 'right'},
                                                    ]}
                                                    value={
                                                        form.min_participants ===
                                                        null
                                                            ? 1
                                                            : form.min_participants
                                                    }
                                                    onChangeText={value =>
                                                        this.onChangeValue(
                                                            'min_participants',
                                                            value,
                                                        )
                                                    }
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                            <View style={[s.sectionItem]}>
                                                <Text
                                                    style={s.sectionItemLabel}>
                                                    {t('max-participants')}
                                                </Text>
                                                <CustomFocusInput
                                                    editable={
                                                        !!form.registration
                                                    }
                                                    style={[
                                                        s.textInput,
                                                        {textAlign: 'right'},
                                                    ]}
                                                    value={
                                                        form.max_participants
                                                            ? form.max_participants +
                                                              ''
                                                            : ''
                                                    }
                                                    onChangeText={value =>
                                                        this.onChangeValue(
                                                            'max_participants',
                                                            value,
                                                        )
                                                    }
                                                    keyboardType="numeric"
                                                />
                                            </View>
                                            {/* ! For a later version 
                                        <View style={s.sectionItem}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('waiting-list')}
                                            </Text>
                                            <ToggleSwitch
                                                disabled={!form.registration}
                                                isOn={
                                                    !!form.allow_waiting &&
                                                    form.registration
                                                }
                                                onColor={PRIMARY_COLOR}
                                                offColor={'gray'}
                                                label={''}
                                                onToggle={isOn => {
                                                    this.onChangeValue(
                                                        'allow_waiting',
                                                        isOn ? 1 : 0,
                                                    );
                                                }}
                                            />
                                        </View> */}
                                        </View>
                                    )}
                                    <Text
                                        style={[
                                            s.sectionName,
                                            {
                                                marginTop: 40,
                                            },
                                        ]}>
                                        {t('financial')}
                                    </Text>
                                    <View style={s.section}>
                                        <View style={[s.sectionItem]}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('fees')}
                                            </Text>
                                            <CustomFocusInput
                                                isMoney
                                                style={[
                                                    s.textInput,
                                                    {
                                                        textAlign: 'right',
                                                        fontWeight: 'bold',
                                                    },
                                                ]}
                                                value={
                                                    form.fees
                                                        ? form.fees + ''
                                                        : ''
                                                }
                                                onChangeText={value =>
                                                    this.onChangeValue(
                                                        'fees',
                                                        value,
                                                    )
                                                }
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        {/* {!!form.fees &&
                                            parseInt(form.fees, 10) > 0 && (
                                                <>
                                                    <TouchableOpacity
                                                        style={s.sectionItem}
                                                        onPress={() => {
                                                            ActionSheet.showActionSheetWithOptions(
                                                                {
                                                                    options: FEE_OPTIONS(
                                                                        t,
                                                                    ).map(
                                                                        item =>
                                                                            item.label,
                                                                    ),
                                                                    tintColor:
                                                                        'black',
                                                                },
                                                                index => {
                                                                    index !=
                                                                        undefined &&
                                                                        this.onChangeValue(
                                                                            'financial_type',
                                                                            FEE_OPTIONS(
                                                                                t,
                                                                            )[
                                                                                index
                                                                            ],
                                                                        );
                                                                },
                                                            );
                                                        }}>
                                                        <Text
                                                            style={
                                                                s.sectionItemLabel
                                                            }>
                                                            {t('type')}
                                                        </Text>
                                                        <View
                                                            style={
                                                                s.sectionRight
                                                            }>
                                                            <Text
                                                                style={
                                                                    s.sectionRightLabel
                                                                }>
                                                                {form.financial_type &&
                                                                    form
                                                                        .financial_type
                                                                        .label}
                                                            </Text>
                                                            <Icon
                                                                name="chevron-right"
                                                                size={20}
                                                                color="#C7C7CC"
                                                                style={{
                                                                    marginLeft: 10,
                                                                }}
                                                            />
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={s.sectionItem}
                                                        onPress={() => {
                                                            ActionSheet.showActionSheetWithOptions(
                                                                {
                                                                    options: this.state.whereToPayData?.map(
                                                                        item =>
                                                                            item.name,
                                                                    ),
                                                                    tintColor:
                                                                        'black',
                                                                },
                                                                index => {
                                                                    index !=
                                                                        undefined &&
                                                                        this.onChangeValue(
                                                                            'how_to_pay',
                                                                            this
                                                                                .state
                                                                                .whereToPayData[
                                                                                index
                                                                            ],
                                                                        );
                                                                },
                                                            );
                                                        }}>
                                                        <Text
                                                            style={
                                                                s.sectionItemLabel
                                                            }>
                                                            {t('howtopay')}
                                                        </Text>
                                                        <View
                                                            style={
                                                                s.sectionRight
                                                            }>
                                                            <Text
                                                                style={
                                                                    s.sectionRightLabel
                                                                }>
                                                                {
                                                                    form
                                                                        ?.how_to_pay
                                                                        ?.name
                                                                }
                                                            </Text>
                                                            <Icon
                                                                name="chevron-right"
                                                                size={20}
                                                                color="#C7C7CC"
                                                                style={{
                                                                    marginLeft: 10,
                                                                }}
                                                            />
                                                        </View>
                                                    </TouchableOpacity>
                                                </>
                                            )} */}
                                        {/*
                                    Will be needed in next versions
                                    <View style={s.sectionItem}>
                                        <Text style={s.sectionItemLabel}>
                                            {t('zirkl-pay')}
                                        </Text>
                                        <ToggleSwitch
                                            isOn={!!form.use_zirkl_pay}
                                            onColor={PRIMARY_COLOR}
                                            offColor={'gray'}
                                            label={''}
                                            onToggle={isOn => {
                                                this.onChangeValue(
                                                    'use_zirkl_pay',
                                                    isOn ? 1 : 0,
                                                );
                                            }}
                                        />
                                    </View> */}
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingRight: 10,
                                            marginTop: 40,
                                            paddingBottom: 10,
                                        }}>
                                        <Text style={s.sectionNameWithSwitcher}>
                                            {t('memories')}
                                        </Text>
                                        <ToggleSwitch
                                            isOn={!!form.reminders}
                                            onColor={PRIMARY_COLOR}
                                            offColor={'gray'}
                                            label={''}
                                            style={{marginTop: 10}}
                                            onToggle={isOn => {
                                                this.setReminders(
                                                    'reminders',
                                                    isOn ? 1 : 0,
                                                );
                                            }}
                                        />
                                    </View>
                                    {!!form.reminders && (
                                        <View
                                            style={s.section}
                                            onLayout={({nativeEvent}) => {
                                                this.setInputPosition({
                                                    ids: [
                                                        'remind_before_deadline',
                                                        'remind_deadline_at',
                                                    ],
                                                    value: nativeEvent.layout.y,
                                                });
                                            }}>
                                            {!!form.registration && (
                                                <>
                                                    <View
                                                        style={[
                                                            s.sectionItem,
                                                            this.checkValidation(
                                                                validation,
                                                                'remind_before_deadline',
                                                            ),
                                                        ]}>
                                                        <Text
                                                            style={
                                                                s.sectionItemLabel
                                                            }>
                                                            {t(
                                                                'beforeregister',
                                                            )}
                                                        </Text>
                                                        <ToggleSwitch
                                                            isOn={
                                                                !!form.remind_before_deadline
                                                            }
                                                            onColor={
                                                                PRIMARY_COLOR
                                                            }
                                                            offColor={'gray'}
                                                            label={''}
                                                            onToggle={isOn => {
                                                                this.setReminders(
                                                                    'remind_before_deadline',
                                                                    isOn,
                                                                );
                                                            }}
                                                        />
                                                    </View>
                                                    {!!form.remind_before_deadline && (
                                                        <>
                                                            <View
                                                                style={
                                                                    s.sectionItem
                                                                }>
                                                                <Text
                                                                    style={
                                                                        s.sectionItemLabel
                                                                    }>
                                                                    {t(
                                                                        'howtopay',
                                                                    )}
                                                                </Text>
                                                                <DatePicker
                                                                    disabled={
                                                                        !form.remind_before_deadline
                                                                    }
                                                                    locale="de"
                                                                    style={{
                                                                        width: 200,
                                                                    }}
                                                                    date={
                                                                        form.remind_deadline_at ||
                                                                        moment(
                                                                            form.register_by,
                                                                        ).add(
                                                                            -1,
                                                                            'hour',
                                                                        )
                                                                    }
                                                                    mode="datetime"
                                                                    placeholder="Wählen Sie ein Datum und eine Uhrzeit"
                                                                    format={
                                                                        DATETIME_FORMAT
                                                                    }
                                                                    minDate={moment().format(
                                                                        DATETIME_FORMAT,
                                                                    )}
                                                                    confirmBtnText="Bestätigen Sie"
                                                                    cancelBtnText="Abbrechen"
                                                                    customStyles={
                                                                        this
                                                                            .datePickerStyles
                                                                    }
                                                                    onDateChange={date => {
                                                                        this.onChangeValue(
                                                                            'remind_deadline_at',
                                                                            moment(
                                                                                date,
                                                                                DATE_FORMAT +
                                                                                    ' HH:mm',
                                                                            ),
                                                                        );
                                                                    }}
                                                                />
                                                            </View>
                                                            <TouchableOpacity
                                                                disabled={
                                                                    !form.remind_before_deadline
                                                                }
                                                                style={[
                                                                    s.sectionItem,
                                                                ]}
                                                                onPress={() =>
                                                                    this.renderSelectChannel(
                                                                        'reminder_channels_deadline',
                                                                        'showSelectDeadlineReminderChannels',
                                                                    )
                                                                }>
                                                                <Text
                                                                    style={
                                                                        s.sectionItemLabel
                                                                    }>
                                                                    {t(
                                                                        'channels',
                                                                    )}
                                                                </Text>
                                                                <View
                                                                    style={
                                                                        s.sectionRight
                                                                    }>
                                                                    <Text
                                                                        style={[
                                                                            s.sectionRightLabel,
                                                                            {
                                                                                textTransform:
                                                                                    'capitalize',
                                                                            },
                                                                        ]}>
                                                                        {form &&
                                                                            form.reminder_channels_deadline &&
                                                                            form.reminder_channels_deadline.join(
                                                                                ', ',
                                                                            )}
                                                                    </Text>
                                                                    <Icon
                                                                        name="chevron-right"
                                                                        size={
                                                                            20
                                                                        }
                                                                        color="#C7C7CC"
                                                                        style={{
                                                                            marginLeft: 10,
                                                                        }}
                                                                    />
                                                                </View>
                                                            </TouchableOpacity>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                            <View style={[s.sectionItem]}>
                                                <Text
                                                    style={s.sectionItemLabel}>
                                                    {t('beforeevent')}
                                                </Text>
                                                <ToggleSwitch
                                                    isOn={
                                                        !!form.remind_before_event
                                                    }
                                                    onColor={PRIMARY_COLOR}
                                                    offColor={'gray'}
                                                    label={''}
                                                    onToggle={isOn => {
                                                        this.setReminders(
                                                            'remind_before_event',
                                                            isOn,
                                                        );
                                                    }}
                                                />
                                            </View>
                                            {!!form.remind_before_event && (
                                                <>
                                                    <View style={s.sectionItem}>
                                                        <Text
                                                            style={
                                                                s.sectionItemLabel
                                                            }>
                                                            {t('howtopay')}
                                                        </Text>
                                                        <DatePicker
                                                            disabled={
                                                                !form.remind_before_event
                                                            }
                                                            locale="de"
                                                            style={{width: 200}}
                                                            date={
                                                                form.remind_event_at ||
                                                                moment(
                                                                    form.start_at,
                                                                ).add(
                                                                    -1,
                                                                    'hour',
                                                                )
                                                            }
                                                            mode="datetime"
                                                            placeholder="Wählen Sie ein Datum und eine Uhrzeit"
                                                            format={
                                                                DATETIME_FORMAT
                                                            }
                                                            minDate={moment().format(
                                                                DATETIME_FORMAT,
                                                            )}
                                                            confirmBtnText="Bestätigen Sie"
                                                            cancelBtnText="Abbrechen"
                                                            customStyles={
                                                                this
                                                                    .datePickerStyles
                                                            }
                                                            onDateChange={date => {
                                                                this.onChangeValue(
                                                                    'remind_event_at',
                                                                    moment(
                                                                        date,
                                                                        DATE_FORMAT +
                                                                            ' HH:mm',
                                                                    ),
                                                                );
                                                            }}
                                                        />
                                                    </View>
                                                    <TouchableOpacity
                                                        disabled={
                                                            !form.remind_before_event
                                                        }
                                                        style={[s.sectionItem]}
                                                        onPress={() =>
                                                            this.renderSelectChannel(
                                                                'reminder_channels_event',
                                                                'showSelectEventReminderChannels',
                                                            )
                                                        }>
                                                        <Text
                                                            style={
                                                                s.sectionItemLabel
                                                            }>
                                                            {t('channels')}
                                                        </Text>
                                                        <View
                                                            style={
                                                                s.sectionRight
                                                            }>
                                                            <Text
                                                                style={[
                                                                    s.sectionRightLabel,
                                                                    {
                                                                        textTransform:
                                                                            'capitalize',
                                                                    },
                                                                ]}>
                                                                {form &&
                                                                    form.reminder_channels_event &&
                                                                    form.reminder_channels_event.join(
                                                                        ', ',
                                                                    )}
                                                            </Text>
                                                            <Icon
                                                                name="chevron-right"
                                                                size={20}
                                                                color="#C7C7CC"
                                                                style={{
                                                                    marginLeft: 10,
                                                                }}
                                                            />
                                                        </View>
                                                    </TouchableOpacity>
                                                </>
                                            )}
                                        </View>
                                    )}
                                    <Text
                                        style={[
                                            s.sectionName,
                                            {marginTop: 40},
                                        ]}>
                                        {t('publication')}
                                    </Text>
                                    <View style={s.section}>
                                        <TouchableOpacity
                                            style={s.sectionItem}
                                            onPress={() => {
                                                ActionSheet.showActionSheetWithOptions(
                                                    {
                                                        options: GROUP_OPTIONS(
                                                            t,
                                                        ).map(
                                                            item => item.label,
                                                        ),
                                                        tintColor: 'black',
                                                    },
                                                    index => {
                                                        index != undefined &&
                                                            this.onChangeValue(
                                                                'calendar_feed',
                                                                GROUP_OPTIONS(
                                                                    t,
                                                                )[index],
                                                            );
                                                    },
                                                );
                                            }}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('calendarfeed')}
                                            </Text>
                                            <View style={s.sectionRight}>
                                                <Text
                                                    style={s.sectionRightLabel}>
                                                    {form.calendar_feed &&
                                                        form.calendar_feed
                                                            .label}
                                                </Text>
                                                <Icon
                                                    name="chevron-right"
                                                    size={20}
                                                    color="#C7C7CC"
                                                    style={{marginLeft: 10}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        {/* <TouchableOpacity
                                        style={[s.sectionItem]}
                                        onPress={() =>
                                            this.renderSelectChannel(
                                                'sharing_options',
                                                'showSharingOptions',
                                                [
                                                    {
                                                        label: 'Facebook',
                                                        value: 'facebook',
                                                    },
                                                    {
                                                        value: 'twitter',
                                                        label: 'Twitter',
                                                    },
                                                    {
                                                        value: 'linkedin',
                                                        label: 'LinkedIn',
                                                    },
                                                ],
                                            )
                                        }>
                                        <Text style={s.sectionItemLabel}>
                                            {t('more-channels')}
                                        </Text>
                                        <View style={s.sectionRight}>
                                            <Text
                                                style={[
                                                    s.sectionRightLabel,
                                                    {
                                                        textTransform:
                                                            'capitalize',
                                                    },
                                                ]}>
                                                {form &&
                                                    form.sharing_options &&
                                                    form.sharing_options.join(
                                                        ', ',
                                                    )}
                                            </Text>
                                            <Icon
                                                name="chevron-right"
                                                size={20}
                                                color="#C7C7CC"
                                                style={{marginLeft: 10}}
                                            />
                                        </View>
                                    </TouchableOpacity> */}
                                        <View style={s.sectionItem}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('publishat')}
                                            </Text>
                                            <DatePicker
                                                locale="de"
                                                style={{width: 200}}
                                                date={form.published_at}
                                                mode="datetime"
                                                placeholder="Wählen Sie ein Datum und eine Uhrzeit"
                                                format={DATETIME_FORMAT}
                                                minDate={moment().format(
                                                    DATETIME_FORMAT,
                                                )}
                                                confirmBtnText="Bestätigen Sie"
                                                cancelBtnText="Abbrechen"
                                                customStyles={
                                                    this.datePickerStyles
                                                }
                                                onDateChange={date => {
                                                    this.onChangeValue(
                                                        'published_at',
                                                        moment(
                                                            date,
                                                            DATE_FORMAT +
                                                                ' HH:mm',
                                                        ),
                                                    );
                                                }}
                                            />
                                        </View>
                                    </View>

                                    <Text
                                        style={[
                                            s.sectionName,
                                            {marginTop: 40},
                                        ]}>
                                        Reaktionen zulassen
                                    </Text>
                                    <View style={s.section}>
                                        <View style={[s.sectionItem]}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('thumbs-up')}
                                            </Text>
                                            <ToggleSwitch
                                                isOn={!!form.allow_likes}
                                                onColor={PRIMARY_COLOR}
                                                offColor={'gray'}
                                                label={''}
                                                onToggle={isOn => {
                                                    this.onChangeValue(
                                                        'allow_likes',
                                                        isOn ? 1 : 0,
                                                    );
                                                }}
                                            />
                                        </View>
                                        <View style={[s.sectionItem]}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('comments')}
                                            </Text>
                                            <ToggleSwitch
                                                isOn={!!form.allow_comments}
                                                onColor={PRIMARY_COLOR}
                                                offColor={'gray'}
                                                label={''}
                                                onToggle={isOn => {
                                                    this.onChangeValue(
                                                        'allow_comments',
                                                        isOn ? 1 : 0,
                                                    );
                                                }}
                                            />
                                        </View>
                                        <View style={[s.sectionItem]}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('share')}
                                            </Text>
                                            <ToggleSwitch
                                                isOn={!!form.allow_sharing}
                                                onColor={PRIMARY_COLOR}
                                                offColor={'gray'}
                                                label={''}
                                                onToggle={isOn => {
                                                    this.onChangeValue(
                                                        'allow_sharing',
                                                        isOn ? 1 : 0,
                                                    );
                                                }}
                                            />
                                        </View>
                                    </View>

                                    <Text
                                        style={[
                                            s.sectionName,
                                            {marginTop: 40},
                                        ]}>
                                        {t('responsibility')}
                                    </Text>
                                    <View style={s.section}>
                                        <TouchableOpacity
                                            style={s.sectionItem}
                                            onPress={() => {
                                                form.club_id
                                                    ? this.setState({
                                                          userview:
                                                              'responsible',
                                                      })
                                                    : showMessage(
                                                          t('msg_chooseclub'),
                                                      );
                                            }}>
                                            <Text style={[s.sectionItemLabel]}>
                                                {t('maincontact')}
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}>
                                                <Text
                                                    style={[
                                                        s.sectionRightLabel,
                                                        {marginRight: 10},
                                                    ]}>
                                                    {main_contact_profile &&
                                                        main_contact_profile.username}
                                                </Text>
                                                <AvatarImage
                                                    user_id={
                                                        form.main_contact?.id
                                                    }
                                                    width={40}
                                                    user={form.main_contact}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={s.sectionItem}
                                            onPress={() => {
                                                if (
                                                    contacts &&
                                                    contacts.length
                                                ) {
                                                    ActionSheet.showActionSheetWithOptions(
                                                        {
                                                            options: contacts,
                                                            tintColor: 'black',
                                                        },
                                                        index => {
                                                            index !=
                                                                undefined &&
                                                                this.onChangeValue(
                                                                    'contact',
                                                                    contacts[
                                                                        index
                                                                    ],
                                                                );
                                                        },
                                                    );
                                                } else alert('No contacts');
                                            }}>
                                            <Text style={s.sectionItemLabel}>
                                                {t('contact')}
                                            </Text>
                                            <View style={s.sectionRight}>
                                                <Text
                                                    style={s.sectionRightLabel}>
                                                    {form.contact &&
                                                    form.contact.length > 0
                                                        ? form.contact
                                                        : 'Bestimmen'}
                                                </Text>
                                                <Icon
                                                    name="chevron-right"
                                                    size={20}
                                                    color="#C7C7CC"
                                                    style={{marginLeft: 10}}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity
                                        style={[
                                            s.button,
                                            {
                                                backgroundColor: PRIMARY_COLOR,
                                                marginTop: 50,
                                            },
                                        ]}
                                        onPress={() => {
                                            this.setState({validation: []});
                                            const Validation = this.onValidate();
                                            if (Validation.length > 0) {
                                                this.setState({
                                                    validation: Validation,
                                                });
                                                const target_obj = this.state
                                                    .inputs[Validation[0]];

                                                if (target_obj) {
                                                    this.scrollView.current.scrollTo(
                                                        {
                                                            x: 0,
                                                            y:
                                                                target_obj.yCoordinate,
                                                            animated: true,
                                                        },
                                                    );
                                                }
                                                switch (Validation[0]) {
                                                    case 'register_by':
                                                        showMessage(
                                                            'Registration deadline date must be before start date!',
                                                        );
                                                        break;
                                                    case 'remind_deadline_at':
                                                        showMessage(
                                                            'Deadline reminder date must be before start date!',
                                                        );
                                                        break;
                                                    case 'remind_event_at':
                                                        showMessage(
                                                            'Event reminder date must be before start date and after current date & time!',
                                                        );
                                                        break;
                                                    case 'published_at':
                                                        showMessage(
                                                            'The published at must be after current date & time!',
                                                        );
                                                        break;
                                                    case 'remind_deadline':
                                                        showMessage(
                                                            'The reminder deadline must be after current date & time!',
                                                        );
                                                        break;

                                                    default:
                                                        showMessage(
                                                            t(
                                                                'msg_missinginfo',
                                                            ),
                                                        );
                                                        break;
                                                }
                                                return;
                                            }
                                            this.setState({ispublish: true});
                                            this.publishScroll.current?.scrollTo(
                                                {
                                                    y: 0,
                                                    x: 0,
                                                    animated: true,
                                                },
                                            );
                                        }}>
                                        <Text style={s.btnLabel}>
                                            {t('btncreate')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                    <CategoryDropdown
                        club_id={form.club_id && form.club_id.id}
                        visible={this.state.openCategory}
                        data={this.props.event_categories}
                        onClose={() => this.setState({openCategory: false})}
                        onSelectCategory={category => {
                            this.onChangeValue('categories', category);
                            this.setState({openCategory: false});
                        }}
                    />
                </KeyboardAwareScrollView>
            </View>
        );
    }
    showSelectClub() {
        const {form} = this.state;
        const {t, clubs_user, board_of_clubs} = this.props;

        const clubs = removeDuplicates(
            [...clubs_user, ...board_of_clubs],
            'id',
        );

        this.props.navigation.navigate('ZirklSelect', {
            title: t('select-club'),
            options: clubs
                .filter(club => club?.is_user_board_member_of_club)
                .map(club => ({
                    label: club.name,
                    value: club.id,
                })),
            selected: form && form.club_id && form.club_id.id,
            onClose: id => {
                if (!id) return;
                const club = clubs.find(c => c.id === id);
                this.onChangeValue('club_id', club);
                this.props.getBoardMembers(club.id);
                this.props.getCategoriesForNewsEvent(club.id);
            },
        });
    }
    renderSelectChannel(fieldName, visibleField, options = null) {
        const {form} = this.state;
        const {t} = this.props;
        if (!options)
            options = [
                {label: 'Feed', value: 'feed'},
                {value: 'notifications', label: 'Notifications'},
                {value: 'email', label: 'E-Mail'},
            ];

        this.props.navigation.navigate('ZirklSelect', {
            title: t('select-channel'),
            options,
            selected: form && form[fieldName],
            multi: true,
            onClose: values => {
                this.setState({[visibleField]: false});
                if (!values) return;
                this.onChangeValue(fieldName, values);
            },
        });
    }
    showImagePicker() {
        const {form} = this.state;
        const {t} = this.props;

        this.props.navigation.navigate('ImagePicker', {
            title: t('select-image'),
            selected: form && form.photo,
            onClose: image => this.onChangeValue('photo', image),
        });
    }
}
const mapStateToProps = state => ({
    clubs_user: state.club.clubs_user,
    board_of_clubs: state.club.board_of_clubs,
    user: state.user.user,
    user_profile: state.user.user_profile,
    event_categories: state.category.event_categories,
    venues: state.category.venues,
    club_members: state.member.club_members,
    board_members: state.member.board_members,
    location: state.user.location,
});

const mapDispatchToProps = {
    createEvent,
    getCategoriesForNewsEvent,
    getClubsByUser,
    getVenueCategoires,
    getMemberOfClubs,
    getClubMembers,
    getBoardMembers,
    setLocation,
    getEvent,
    updateEvent,
    addExtraFileToEvent,
    removeExtraFileFromEvent,
    getWhereToPay,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    hoistStatics(
        withTranslation(['createevent', 'common'])(CreateEvent),
        CreateEvent,
    ),
);
