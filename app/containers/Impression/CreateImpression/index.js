import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    TextInput,
    ScrollView,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import {
    ToggleSwitch,
    AvatarImage,
    FeedCardImpression,
} from '../../../components';
import s from './styles';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../../themes/colors';
import {connect} from 'react-redux';
import {createImpression} from '../../../reducers/feed';
import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-action-sheet';
import {
    removeDuplicates,
    showMessage,
    getUserName,
    getExtFromMime,
} from '../../../utils/utils';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-datepicker';
import {getClubsByUser, getMemberOfClubs} from '../../../reducers/club';
import {getCategoriesForNewsEvent} from '../../../reducers/category';
import {getClubMembers, getBoardMembers} from '../../../reducers/member';
import {getEvents} from '../../../reducers/event';
import {
    addExtraFileToImpression,
    getImpression,
    removeExtraFileFromImpression,
    updateImpression,
} from '../../../reducers/impression';

const DATE_TIME_FORMAT = 'ddd. DD.MM.YYYY HH:mm';
moment.defineLocale('de', {
    weekdaysShort: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    monthsShort: 'Jän_Feb_März_Apr_Mai_Juni_Juli_Aug_Sept_Okt_Nov_Dez'.split(
        '_',
    ),
});
const SHARE_OPTIONS = [
    {
        value: 'facebook',
        label: 'Facebook',
    },
    {
        value: 'twitter',
        label: 'Tiwtter',
    },
    {
        value: 'instagram',
        label: 'Instagram',
    },
    {
        value: 'linkedin',
        label: 'Linkedin',
    },
    {
        value: 'xing',
        label: 'Xing',
    },
];
class CreateImpression extends React.Component {
    visibilityData = [
        {
            label: this.props.t('public'),
            value: 'public',
        },
        {
            label: this.props.t('internals'),
            value: 'members',
        },
        {
            label: this.props.t('board'),
            value: 'board-members',
        },
    ];
    constructor(props) {
        super(props);
        this.state = {
            ispublish: false,
            validation: [],
            inputs: [],
            loading: true,
            form: {
                club_id: null,
                title: null,
                // connected_to: null,
                created_by: props.user,
                content: null,
                photos: [],

                visibility: 'public',
                news_date: moment(),
                sharing_options: [],

                allow_likes: 1,
                allow_comments: 1,
                allow_shares: 1,
                main_contact: props.user,
                contact: '',
                publication_channels: [],
            },
        };
        this.scrollView = React.createRef();
    }
    componentDidMount() {
        const impression_id = this.props.navigation.getParam('impression_id');
        if (impression_id) {
            this.props.getImpression(impression_id, res => {
                if (!res) return;
                const form = {
                    ...res,
                    club_id: res.club,
                    news_date: moment(res.news_date),
                    published_at: res.published_at
                        ? moment(res.published_at)
                        : null,
                    sharing_options: [],
                };
                this.setState({
                    loading: false,
                    form,
                    original_data: res,
                });
            });
        } else {
            this.setState({loading: false});
        }
    }
    changeClubInfo(key, value) {
        this.setState({[key]: value});
    }
    goBack() {
        this.props.navigation.goBack();
    }
    createImpression() {
        const impression_id = this.props.navigation.getParam('impression_id');
        const {form} = this.state;
        this.setState({
            spinner: true,
            spinnerText: 'Creating the impression..',
        });

        const files = form.photos.filter(photo => photo.name && photo.file);
        let photos = {};
        if (files.length > 0) {
            files.map((item, index) => {
                if (!item.file) return;
                photos[`photos[${index}][name]`] = item.name;
                photos[`photos[${index}][file]`] = {
                    uri: item.file.uri,
                    name: `photo.${getExtFromMime(item.file.mime)}`,
                    filename: `imagename.${getExtFromMime(item.file.mime)}`,
                    type: item.file.mime,
                };
            });
        }

        var sharing_options = {};
        form.sharing_options.map(key => {
            sharing_options[key] = true;
        });

        const param = {
            club_id: form.club_id?.id,
            title: form.title,
            content: form.content,

            published_by: form.created_by?.id,

            visibility: form.visibility,
            news_date: form.news_date.format('YYYY-MM-DD HH:mm:ss'),
            sharing_options: JSON.stringify(sharing_options),

            allow_likes: form.allow_likes,
            allow_comments: form.allow_comments,
            allow_shares: form.allow_shares,

            main_contact: form.main_contact?.id,
            contact:
                form.contact && form.contact.length > 0
                    ? form.contact
                    : 'Bestimmen',
        };
        console.log('CreateImpression -> createImpression -> param', param);

        if (!impression_id) {
            this.props.createImpression(param, res => {
                this.setState({
                    spinnerText: 'Uploading the images..',
                });
                this.props.addExtraFileToImpression(
                    res.id,
                    photos,
                    attachments_res => {
                        console.log('========attachments_res', attachments_res);
                        this.setState({spinner: false});
                        if (res) this.props.navigation.goBack();
                    },
                );
            });
            return;
        }

        this.props.updateImpression(
            impression_id,
            {
                ...param,
            },
            res => {
                this.setState({spinner: false});
                this.goBack();
                return;

                if (res) {
                    this.setState({
                        spinnerText: 'Uploading the images..',
                    });
                    let removed_files = [];
                    const {original_data} = this.state;
                    if (original_data?.photos?.length > 0) {
                        original_data.photos.map(item => {
                            if (!form.photos.find(ex => ex.id == item.id)) {
                                removed_files.push(item.id);
                            }
                        });
                    }

                    if (Object.keys(form.photos).length > 0) {
                        this.setState({
                            spinner: true,
                            spinnerText: 'uploading extra files...',
                        });
                        this.props.addExtraFileToImpression(
                            impression_id,
                            photos,
                            extrafile_res => {
                                console.log(
                                    '========extrafile_res',
                                    extrafile_res,
                                );
                                if (removed_files.length > 0) {
                                    Promise.all(
                                        removed_files.map(item =>
                                            this.props.removeExtraFileFromImpression(
                                                impression_id,
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
                                    this.props.removeExtraFileFromImpression(
                                        impression_id,
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
    }

    onValidate() {
        var validation = [];
        const {form} = this.state;
        if (form.title == null) {
            validation.push('title');
        }
        if (form.title?.length < 5) {
            validation.push('title_length');
        }
        // if (!form.connected_to) {
        //     validation.push('connected_to');
        // }
        if (form.content == null || form.content.length <= 0) {
            validation.push('content');
        }
        if (!form.photos || form.photos.length === 0) validation.push('photos');
        if (form.photos && form.photos.length > 0) {
            for (const photo of form.photos) {
                if (!photo?.name || (!photo?.file && !photo?.url)) {
                    validation.push('photo_invalid');
                    break;
                }
            }
        }
        if (form.club_id == null) {
            validation.push('club_id');
        }
        return validation;
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
    updatePhotos(photos) {
        this.onChangeValue('photos', photos);
        const files = photos.filter(photo => photo.name && photo.file);
        let ph = {};
        if (files.length > 0) {
            files.map((item, index) => {
                ph[`photos[${index}][name]`] = item.name;
                ph[`photos[${index}][file]`] = item.file;
            });
        }
        console.log('updatePhotos -> ph', ph, JSON.stringify(ph));
    }
    onChangeValue(name, value) {
        const {form} = this.state;
        this.setState(
            {
                form: {
                    ...form,
                    [name]: value,
                },
            },
            () => console.log('State updated:', this.state),
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
                this.setState({showSelectClub: false});
                if (!id) return;
                const club = clubs.find(c => c.id === id);
                this.onChangeValue('club_id', club);
                this.props.getBoardMembers(club.id);
                this.props.getCategoriesForNewsEvent(club.id);
            },
        });
    }
    showConnectedTo() {
        const {form} = this.state;
        const {t} = this.props;

        this.props.navigation.navigate('ZirklSelect', {
            title: t('select-event'),
            optionsGetter: this.props.getEvents,
            selected: form?.connected_to?.id,
            onClose: (id, name) => {
                if (!id) return;
                this.onChangeValue('connected_to', {
                    id,
                    name,
                });
            },
        });
    }
    showSelectSharingOptions() {
        const {form} = this.state;
        const {t} = this.props;
        this.props.navigation.navigate('ZirklSelect', {
            title: t('select-channel'),
            options: SHARE_OPTIONS,
            multi: true,
            selected: form && form.sharing_options,
            onClose: values => {
                this.setState({showSharingOptions: false});
                if (!values) return;
                this.onChangeValue('sharing_options', values);
                setTimeout(() => {
                    if (this.scrollView?.current)
                        this.scrollView?.current.scrollTo({
                            x: 0,
                            y: this.state.currentScroll,
                            animated: true,
                        });
                }, 500);
            },
        });
    }

    getErrorMessage = field => {
        switch (field) {
            case 'photo_invalid':
                return this.props.t('photos-error');
            case 'title_length':
                return 'Der Titel sollte mindestens 5 Cahracter haben.';
            default:
                return this.props.t('missing-data');
        }
    };

    render() {
        const {ispublish} = this.state;
        return ispublish ? this.renderPublish() : this.renderEditForm();
    }
    renderPublish() {
        const {form} = this.state;
        const {t} = this.props;
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <ScrollView>
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
                                {t('overviewdescription')}
                            </Text>
                            <FeedCardImpression
                                unfold={true}
                                data={{
                                    action: 'event-created',
                                    content: {
                                        club: form.club_id,
                                        title: form.title,
                                        // connected_to: form.connected_to,
                                        content: form.content,
                                        photos: form.photos,
                                        date: form.news_date,
                                        author: form.created_by,
                                        allow_likes: form.allow_likes,
                                        allow_comments: form.allow_comments,
                                        allow_shares: form.allow_shares,
                                        main_contact: form.main_contact,
                                        contact: form.contact,
                                    },
                                }}
                                openCard={data => {}}
                                isPreview
                                navigation={this.props.navigation}
                                user={this.props.user}
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
                                    {moment().format(DATE_TIME_FORMAT)}
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
                                    {moment().format(DATE_TIME_FORMAT)}
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
                                onPress={() => this.createImpression()}>
                                <Text style={s.btnLabel}>
                                    {t('btnpublish')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                <Spinner
                    visible={this.state.spinner}
                    textContent={this.state.spinnerText || t('creating')}
                    textStyle={s.spinnerTextStyle}
                />
            </View>
        );
    }

    renderEditForm() {
        const {form, validation, userview} = this.state;

        if (userview) {
            return this.renderUserView();
        }

        const {t} = this.props;

        const author_profile = form.created_by && form.created_by.profile;
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
                <View style={s.wrapper}>
                    <ScrollView
                        onScrollEndDrag={e =>
                            this.setState({
                                currentScroll: e.nativeEvent.contentOffset.y,
                            })
                        }
                        ref={this.scrollView}>
                        <View style={s.topBar}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.goBack()}>
                                <Icon
                                    name="arrow-left"
                                    color={PRIMARY_TEXT_COLOR}
                                    size={25}
                                    style={{marginRight: 15}}
                                />
                            </TouchableOpacity>
                            <Text style={s.title}>{t('title')}</Text>
                        </View>
                        {this.state.loading ? (
                            <ActivityIndicator
                                style={{marginTop: 30}}
                                size="large"
                                color={PRIMARY_COLOR}
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
                                                'news_category_id',
                                            ],
                                            value: nativeEvent.layout.y,
                                        });
                                    }}>
                                    <TouchableOpacity
                                        style={[
                                            s.sectionItem,
                                            validation.includes('club_id')
                                                ? {borderBottomColor: 'red'}
                                                : {},
                                        ]}
                                        onPress={() => this.showSelectClub()}>
                                        <Text style={s.sectionItemLabel}>
                                            {t('club')} *
                                        </Text>
                                        <View style={s.sectionRight}>
                                            <Text style={s.sectionRightLabel}>
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
                                            validation.includes('title') ||
                                            validation.includes('title_length')
                                                ? {borderBottomColor: 'red'}
                                                : {},
                                        ]}>
                                        <Text style={s.sectionItemLabel}>
                                            {t('newstitle')} *
                                        </Text>
                                        <TextInput
                                            style={s.textInput}
                                            value={form && form.title}
                                            onChangeText={value =>
                                                this.onChangeValue(
                                                    'title',
                                                    value,
                                                )
                                            }
                                        />
                                    </View>
                                    {/* <TouchableOpacity
                                    style={[
                                        s.sectionItem,
                                        validation.includes('connected_to')
                                            ? {borderBottomColor: 'red'}
                                            : {},
                                    ]}
                                    onPress={() => {
                                        form.club_id
                                            ? this.showConnectedTo()
                                            : showMessage(t('msg_chooseclub'));
                                    }}>
                                    <Text style={s.sectionItemLabel}>
                                        {t('connected_to')} *
                                    </Text>
                                    <View style={s.sectionRight}>
                                        <Text style={s.sectionRightLabel}>
                                            {form?.connected_to?.name}
                                        </Text>
                                        <Icon
                                            name="chevron-right"
                                            size={20}
                                            color="#C7C7CC"
                                            style={{marginLeft: 10}}
                                        />
                                    </View>
                                </TouchableOpacity> */}
                                    <View
                                        style={[
                                            s.sectionItem,
                                            {
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                            },
                                            validation.includes('content')
                                                ? {borderBottomColor: 'red'}
                                                : {},
                                        ]}>
                                        <Text
                                            style={[
                                                s.sectionItemLabel,
                                                {paddingBottom: 5},
                                            ]}>
                                            {t('content')} *
                                        </Text>
                                        <TextInput
                                            style={[
                                                s.textInput,
                                                {
                                                    width: '100%',
                                                    marginLeft: 0,
                                                    paddingVertical: 3,
                                                    textAlign: 'left',
                                                },
                                            ]}
                                            multiline={true}
                                            numberOfLines={5}
                                            value={form && form.content}
                                            textAlignVertical="top"
                                            onChangeText={value =>
                                                this.onChangeValue(
                                                    'content',
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
                                                uri={
                                                    author_profile?.avatar
                                                        ?.original
                                                }
                                                width={40}
                                                user={form.created_by}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <Text style={[s.sectionName, {marginTop: 40}]}>
                                    {t('extra')}
                                </Text>
                                <View style={s.section}>
                                    <TouchableOpacity
                                        style={[
                                            s.sectionItem,
                                            validation.includes('photos')
                                                ? {borderBottomColor: 'red'}
                                                : {},
                                        ]}
                                        onPress={() =>
                                            this.props.navigation.navigate(
                                                'MultipleImages',
                                                {
                                                    photos: form.photos,
                                                    updatePhotos: this.updatePhotos.bind(
                                                        this,
                                                    ),
                                                },
                                            )
                                        }>
                                        <Text style={[s.sectionItemLabel]}>
                                            {t('files')} *
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
                                                {form?.photos?.length}{' '}
                                                {t('images')}
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
                                <Text style={[s.sectionName, {marginTop: 40}]}>
                                    {t('publication')}
                                </Text>
                                <View style={s.section}>
                                    <TouchableOpacity
                                        style={s.sectionItem}
                                        onPress={() => {
                                            ActionSheet.showActionSheetWithOptions(
                                                {
                                                    options: this.visibilityData.map(
                                                        el => el.label,
                                                    ),
                                                    tintColor: 'black',
                                                },
                                                index => {
                                                    index !== undefined &&
                                                        this.onChangeValue(
                                                            'visibility',
                                                            this.visibilityData[
                                                                index
                                                            ].value,
                                                        );
                                                },
                                            );
                                        }}>
                                        <Text style={s.sectionItemLabel}>
                                            {t('visibility')}
                                        </Text>
                                        <View style={s.sectionRight}>
                                            <Text style={s.sectionRightLabel}>
                                                {
                                                    this.visibilityData.find(
                                                        el =>
                                                            el.value ===
                                                            form.visibility,
                                                    )?.label
                                                }
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
                                    style={s.sectionItem}
                                    onPress={() =>
                                        this.showSelectSharingOptions()
                                    }>
                                    <Text style={s.sectionItemLabel}>
                                        {t('channels')}
                                    </Text>
                                    <View style={s.sectionRight}>
                                        <Text
                                            style={[
                                                s.sectionRightLabel,
                                                {
                                                    textTransform: 'capitalize',
                                                },
                                            ]}>
                                            {form &&
                                                form.sharing_options &&
                                                form.sharing_options.join(', ')}
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
                                            {t('newsdate')}
                                        </Text>
                                        <DatePicker
                                            locale="de"
                                            date={form.news_date}
                                            mode="datetime"
                                            placeholder="select date"
                                            format={DATE_TIME_FORMAT}
                                            minDate={moment().format(
                                                DATE_TIME_FORMAT,
                                            )}
                                            confirmBtnText="Bestätigen Sie"
                                            cancelBtnText="Abbrechen"
                                            customStyles={{
                                                dateText: {
                                                    fontFamily: 'Rubik-Medium',
                                                },
                                                dateIcon: {
                                                    width: 0,
                                                },
                                                dateInput: {
                                                    textAlign: 'right',
                                                    alignItems: 'flex-end',
                                                    borderWidth: 0,
                                                },
                                            }}
                                            onDateChange={date => {
                                                this.onChangeValue(
                                                    'news_date',
                                                    moment(
                                                        date,
                                                        DATE_TIME_FORMAT,
                                                    ),
                                                );
                                            }}
                                        />
                                    </View>
                                </View>
                                <Text style={[s.sectionName, {marginTop: 40}]}>
                                    {t('allowoptions')}
                                </Text>
                                <View style={s.section}>
                                    <View style={s.sectionItem}>
                                        <Text style={s.sectionItemLabel}>
                                            {t('allowlikes')}
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
                                    <View style={s.sectionItem}>
                                        <Text style={s.sectionItemLabel}>
                                            {t('allowcomments')}
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
                                    <View style={s.sectionItem}>
                                        <Text style={s.sectionItemLabel}>
                                            {t('allowshares')}
                                        </Text>
                                        <ToggleSwitch
                                            isOn={!!form.allow_shares}
                                            onColor={PRIMARY_COLOR}
                                            offColor={'gray'}
                                            label={''}
                                            onToggle={isOn => {
                                                this.onChangeValue(
                                                    'allow_shares',
                                                    isOn ? 1 : 0,
                                                );
                                            }}
                                        />
                                    </View>
                                </View>
                                <Text style={[s.sectionName, {marginTop: 40}]}>
                                    {t('responsibility')}
                                </Text>
                                <View style={s.section}>
                                    <TouchableOpacity
                                        style={s.sectionItem}
                                        onPress={() => {
                                            form.club_id
                                                ? this.setState({
                                                      userview: 'responsible',
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
                                                uri={
                                                    main_contact_profile?.avatar
                                                        ?.original
                                                }
                                                width={40}
                                                user={form?.main_contact}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={s.sectionItem}
                                        onPress={() => {
                                            if (contacts && contacts.length) {
                                                ActionSheet.showActionSheetWithOptions(
                                                    {
                                                        options: contacts,
                                                        tintColor: 'black',
                                                    },
                                                    index => {
                                                        index != undefined &&
                                                            this.onChangeValue(
                                                                'contact',
                                                                contacts[index],
                                                            );
                                                    },
                                                );
                                            } else alert('No contacts');
                                        }}>
                                        <Text style={s.sectionItemLabel}>
                                            {t('contact')}
                                        </Text>
                                        <View style={s.sectionRight}>
                                            <Text style={s.sectionRightLabel}>
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
                                        console.log('Validation', Validation);
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
                                            showMessage(
                                                this.getErrorMessage(
                                                    Validation[0],
                                                ),
                                            );
                                            return;
                                        }
                                        this.setState({ispublish: true});
                                    }}>
                                    <Text style={s.btnLabel}>
                                        {t('btncreate')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
                <Spinner
                    visible={this.state.spinner}
                    textContent={t('creating')}
                    textStyle={s.spinnerTextStyle}
                />
            </View>
        );
    }

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
                        <Text style={s.title}>{t('userview')}</Text>
                        <TouchableOpacity
                            style={{borderRadius: 30, overflow: 'hidden'}}
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon
                                name="x"
                                color="white"
                                size={17}
                                style={{
                                    fontWeight: '100',
                                    backgroundColor: PRIMARY_TEXT_COLOR,
                                    width: 35,
                                    height: 35,
                                    textAlign: 'center',
                                    paddingTop: 8,
                                }}
                            />
                        </TouchableOpacity>
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
                                const {profile, role} = item;
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
                                                    'created_by',
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
}
const mapStateToProps = state => ({
    user: state.user.user,
    clubs_user: state.club.clubs_user,
    board_of_clubs: state.club.board_of_clubs,
    user_profile: state.user.user_profile,
    event_categories: state.category.event_categories,
    club_members: state.member.club_members,
    board_members: state.member.board_members,
});

const mapDispatchToProps = {
    createImpression,
    getCategoriesForNewsEvent,
    getClubsByUser,
    getMemberOfClubs,
    getClubMembers,
    getBoardMembers,
    getEvents,
    addExtraFileToImpression,
    getImpression,
    removeExtraFileFromImpression,
    updateImpression,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    hoistStatics(
        withTranslation('createimpression')(CreateImpression),
        CreateImpression,
    ),
);
