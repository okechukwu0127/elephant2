import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    Platform,
    Linking,
    Alert,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, GRAY_COLOR} from '../../themes/colors';
import moment from 'moment';
import RNCalendarEvents from 'react-native-calendar-events';
import {showMessage} from '../../utils/utils';
import {connect} from 'react-redux';
import {
    getTicketsOfEvent,
    createNewTicket,
    confirmAttendance,
} from '../../reducers/event';
import Modal from 'react-native-modal';
import Share from 'react-native-share';
import {withTranslation} from 'react-i18next';
import AvatarImage from '../AvatarImage';
import MiniMap from '../MiniMap/MiniMap';

const {width} = Dimensions.get('window');

const DATE_FORMAT = 'DD.MM.YYYY';
const DATETIME_FORMAT = DATE_FORMAT + ', HH:mm';
var FEE_OPTIONS = t => [
    {value: 'admission', label: t('admission-fee')},
    {value: 'participation', label: t('participation-fee')},
    {value: 'reservation', label: t('reservation-fee')},
    {value: 'expenses', label: t('expenses-fee')},
    {value: 'contribution', label: t('contribution-fee')},
];
class FeedCardEvent extends React.Component {
    constructor(props) {
        super(props);
        const content = props.data && props.data.content;

        this.state = {
            attending: content ? !!content.attending : false,
            interested: content ? !!content.interested : false,
            openTicket: false,
            tickets: [],
            qrcode: null,
            showMore: false,
        };
    }
    UNSAFE_componentWillReceiveProps(nextprops) {
        if (nextprops.data) {
            const {content} = nextprops.data;
            const new_attending = !!content.attending;
            if (this.state.attending != new_attending) {
                this.setState({attending: new_attending});
            }
            const new_interested = !!content.interested;
            if (this.state.interested != new_interested) {
                this.setState({interested: new_interested});
            }
        }
    }
    async onClickCalendar() {
        const {t, data, isPreview} = this.props;
        const {content} = data;

        if (isPreview) return;
        const {title, short_title, first_reminder, second_reminder} = content;

        let first = moment(first_reminder);
        let second = moment(second_reminder);
        if (first.isAfter(second)) {
            let tmp = first;
            first = second;
            second = tmp;
        }
        const calendars = await RNCalendarEvents.findCalendars();
        const primaryCalendar = calendars.find(
            c => c.isPrimary && c.allowsModifications,
        );
        const eventToSave = {
            calendarId: primaryCalendar.id,
            description: short_title,
            startDate: first.toISOString(),
            endDate: second.toISOString(),
            recurrence: '',
            alarms: [
                {
                    date: first.toISOString(),
                },
            ],
            allDay: false,
        };

        try {
            await RNCalendarEvents.saveEvent(`${title}`, eventToSave);
            showMessage(t('addedcalendar'), true);
        } catch (error) {
            console.log(error);
            showMessage(error.message ? error.message : 'failed');
        }
    }
    render() {
        const {
            t,
            user,
            unfold,
            data,
            onOpenAttendees,
            joinToEvent,
            openCard,
            isPreview,
        } = this.props;

        const {content} = data;
        const {
            liked,
            count_likes,
            count_comments,
            allow_likes,
            allow_comments,
            allow_sharing,
            start_at,
            city,
            all_day,
            venue_category,
            registration,
        } = content;

        const created_by = content ? content.author : null;
        const club = content ? content.club : null;
        const {interested} = this.state;

        const icon_style = {
            justifyContent: 'center',
            flex: 0.25,
        };

        const getRange = (start, end) => {
            start = moment(start);
            end = moment(end);

            if (start.isSame(end, 'day'))
                return `${start.format('DD. MMMM YYYY')}\n${start.format(
                    'HH:mm',
                )} - ${end.format('HH:mm')} Uhr`;

            return `${start.format(
                all_day ? DATE_FORMAT : DATETIME_FORMAT,
            )} bis\n${end.format(all_day ? DATE_FORMAT : DATETIME_FORMAT)}`;
        };
        return (
            <View style={s.container}>
                <TouchableOpacity
                    style={s.header}
                    onPress={() => {
                        openCard && openCard(data.id);
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'center',
                        }}>
                        <View style={s.avatar}>
                            <AvatarImage
                                uri={
                                    club && club.avatar
                                        ? club.avatar.original
                                        : club &&
                                          club.photo &&
                                          club.photo.original
                                }
                                width={32}
                                user={{first_name: club && club.name}}
                                backgroundColor={'rgba(255,255,255,0.5)'}
                            />
                        </View>
                        <View style={{flex: 1}}>
                            {club ? (
                                <Text style={s.headerSubTitle}>
                                    {content.categories &&
                                        content.categories[0]?.name}
                                </Text>
                            ) : null}
                            {club ? (
                                <Text style={s.headerTitle}>
                                    {moment(start_at).format(
                                        all_day ? DATE_FORMAT : DATETIME_FORMAT,
                                    )}
                                    <Text style={{fontFamily: 'Rubik-Regular'}}>
                                        {city ? ', ' + city : ''}
                                    </Text>
                                </Text>
                            ) : null}
                        </View>
                    </View>
                </TouchableOpacity>
                {unfold && (
                    <View style={s.content}>
                        <View style={s.body}>
                            <Text style={s.bodyHeaderTitle}>
                                {content && content.title}
                            </Text>
                            {!!content?.register_by && !!registration && (
                                <Text style={[s.bodyText, {color: '#F16C74'}]}>
                                    {`Anmeldeschluss: ${moment(
                                        content.register_by,
                                    ).format(DATETIME_FORMAT)}`}
                                </Text>
                            )}
                            {!!content?.fees && (
                                <Text
                                    style={[
                                        s.bodyText,
                                        {
                                            color: '#6C8AF1',
                                        },
                                    ]}>
                                    {`${
                                        FEE_OPTIONS(t).find(
                                            option =>
                                                option.value ==
                                                content.financial_type,
                                        )?.label
                                    }: CHF ${content.fees}`}
                                </Text>
                            )}
                            {content &&
                                content.photo &&
                                (content.photo.original ? (
                                    <Image
                                        source={{
                                            uri: content.photo.original,
                                        }}
                                        style={{
                                            width: width - 80,
                                            height: width - 80,
                                            alignSelf: 'center',
                                            borderRadius: 5,
                                            marginVertical: 13,
                                        }}
                                    />
                                ) : (
                                    <Image
                                        source={content.photo}
                                        style={{
                                            width: width - 80,
                                            height: width - 80,
                                            alignSelf: 'center',
                                            borderRadius: 5,
                                            marginVertical: 13,
                                        }}
                                    />
                                ))}
                            <Text style={[s.bodyText, {marginTop: 10}]}>
                                {content && `${content.description}`}
                            </Text>
                            {!this.state.showMore && (
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({showMore: true})
                                    }>
                                    <Text
                                        style={[
                                            s.bodyText,
                                            {
                                                fontFamily: 'Rubik-Medium',
                                                color: '#6C8AF1',
                                                marginVertical: 7,
                                            },
                                        ]}>
                                        Mehr anzeigen
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {this.state.showMore && (
                                <>
                                    <Text style={[s.bodydate, {marginTop: 12}]}>
                                        {content &&
                                            getRange(
                                                content.start_at,
                                                content.end_at,
                                            )}
                                    </Text>
                                    {content?.agenda && (
                                        <>
                                            <Text
                                                style={{
                                                    fontFamily: 'Rubik-Medium',
                                                }}>
                                                Programm:{' '}
                                            </Text>
                                            <Text style={s.bodyText}>
                                                {`${content.agenda}`}
                                            </Text>
                                        </>
                                    )}
                                    {((!!content.extra_files &&
                                        content.extra_files.length > 0) ||
                                        (!!content.links &&
                                            (typeof content.links === 'string'
                                                ? JSON.parse(content.links)
                                                : content.links
                                            ).length > 0)) && (
                                        <>
                                            <Text
                                                style={[
                                                    s.bodyText,
                                                    {
                                                        marginTop: 12,
                                                        marginBottom: 7,
                                                        fontSize: 18,
                                                        fontFamily:
                                                            'Rubik-Medium',
                                                    },
                                                ]}>
                                                Beilagen und Verweise
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                }}>
                                                {content?.extra_files?.map(
                                                    (file, index) => (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                file?.url &&
                                                                Linking.openURL(
                                                                    file?.url,
                                                                )
                                                            }
                                                            key={index}
                                                            style={{
                                                                flexDirection:
                                                                    'row',
                                                                textAlign:
                                                                    'center',
                                                                padding: 5,
                                                                paddingLeft: 0,
                                                                justifyContent:
                                                                    'center',
                                                            }}>
                                                            <Icon
                                                                name="file"
                                                                color={
                                                                    PRIMARY_COLOR
                                                                }
                                                                size={22}
                                                                style={{
                                                                    marginRight: 8,
                                                                }}
                                                            />
                                                            <Text
                                                                style={[
                                                                    s.bodyText,
                                                                    {
                                                                        fontSize: 16,
                                                                        color: GRAY_COLOR,
                                                                    },
                                                                ]}>
                                                                {file?.name}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ),
                                                )}
                                                {(typeof content.links ===
                                                'string'
                                                    ? JSON.parse(content.links)
                                                    : content.links
                                                ).map((links, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => {
                                                            Linking.openURL(
                                                                links?.url,
                                                            );
                                                        }}
                                                        style={{
                                                            flexDirection:
                                                                'row',
                                                            textAlign: 'center',
                                                            padding: 5,
                                                            paddingLeft: 0,
                                                            justifyContent:
                                                                'center',
                                                        }}>
                                                        <Icon
                                                            name="globe"
                                                            color={
                                                                PRIMARY_COLOR
                                                            }
                                                            size={22}
                                                            style={{
                                                                marginRight: 8,
                                                            }}
                                                        />
                                                        <Text
                                                            style={[
                                                                s.bodyText,
                                                                {
                                                                    fontSize: 16,
                                                                    color: GRAY_COLOR,
                                                                },
                                                            ]}>
                                                            {links?.title}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        </>
                                    )}
                                    <Text
                                        style={[
                                            s.bodyText,
                                            {
                                                marginTop: 7,
                                                marginBottom: 7,
                                                fontSize: 18,
                                                fontFamily: 'Rubik-Medium',
                                            },
                                        ]}>
                                        {venue_category?.name?.toLowerCase() ===
                                        'gemeinde/region'
                                            ? 'Ort'
                                            : venue_category?.name}
                                    </Text>
                                    <Text
                                        style={[s.bodyText, {marginBottom: 7}]}>
                                        {content?.address
                                            ? content?.address
                                                  .split(',')
                                                  .slice(
                                                      0,
                                                      content?.address.split(
                                                          ',',
                                                      ).length - 1,
                                                  )
                                                  .join(',')
                                            : null}
                                    </Text>
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                        }}>
                                        <MiniMap
                                            fullWidth
                                            address={content?.address}
                                            readOnly
                                        />
                                    </View>
                                    {!!registration && (
                                        <>
                                            <Text
                                                style={[
                                                    s.bodyText,
                                                    {
                                                        marginTop: 15,
                                                        marginBottom: 7,
                                                        fontSize: 18,
                                                        fontFamily:
                                                            'Rubik-Medium',
                                                    },
                                                ]}>
                                                Anmeldung
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    textAlign: 'center',
                                                    justifyContent:
                                                        'space-between',
                                                    marginBottom: 7,
                                                }}>
                                                <Text style={s.bodyText}>
                                                    Anmeldeschluss
                                                </Text>
                                                <Text
                                                    style={[
                                                        s.bodyText,
                                                        {
                                                            fontFamily:
                                                                'Rubik-Medium',
                                                        },
                                                    ]}>
                                                    {moment(
                                                        content.register_by,
                                                    ).format(
                                                        'ddd. ' +
                                                            DATETIME_FORMAT,
                                                    )}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                    {(!!content.max_participants ||
                                        !!content.min_participants) && (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                textAlign: 'center',
                                                justifyContent: 'space-between',
                                            }}>
                                            <Text style={s.bodyText}>
                                                Teilnehmer
                                            </Text>
                                            <Text
                                                style={[
                                                    s.bodyText,
                                                    {
                                                        fontFamily:
                                                            'Rubik-Medium',
                                                    },
                                                ]}>
                                                {content.min_participants &&
                                                    `minimal ${
                                                        content.min_participants
                                                    }\n`}
                                                {content.max_participants &&
                                                    `maximal ${
                                                        content.max_participants
                                                    }`}
                                            </Text>
                                        </View>
                                    )}
                                    {/* {!!content?.allow_waiting && (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                textAlign: 'center',
                                                justifyContent: 'space-between',
                                            }}>
                                            <Text style={s.bodyText}>
                                                Es wird eine Warteliste geführt
                                            </Text>
                                        </View>
                                    )} */}
                                    {!!content.fees && (
                                        <>
                                            <Text
                                                style={[
                                                    s.bodyText,
                                                    {
                                                        marginTop: 15,
                                                        marginBottom: 7,
                                                        fontSize: 18,
                                                        fontFamily:
                                                            'Rubik-Medium',
                                                    },
                                                ]}>
                                                Teilnahmegebühr
                                            </Text>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    textAlign: 'center',
                                                    justifyContent:
                                                        'space-between',
                                                }}>
                                                <Text style={s.bodyText}>
                                                    Eintrittspreis
                                                </Text>
                                                <Text
                                                    style={[
                                                        s.bodyText,
                                                        {
                                                            fontFamily:
                                                                'Rubik-Medium',
                                                        },
                                                    ]}>
                                                    CHF {content?.fees}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    textAlign: 'center',
                                                    justifyContent:
                                                        'space-between',
                                                }}>
                                                <Text style={s.bodyText}>
                                                    {content?.how_to_pay}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                    <Text
                                        style={[
                                            s.bodyText,
                                            {
                                                marginTop: 15,
                                                marginBottom: 10,
                                                fontSize: 18,
                                                fontFamily: 'Rubik-Medium',
                                            },
                                        ]}>
                                        Kontakt
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                        <AvatarImage
                                            uri={
                                                content?.author?.profile?.avatar
                                                    ?.original
                                            }
                                            width={35}
                                            user={content?.author}
                                        />
                                        <Text
                                            style={[
                                                s.bodyText,
                                                {
                                                    marginLeft: 10,
                                                    fontSize: 16,
                                                    fontFamily: 'Rubik-Medium',
                                                },
                                            ]}>
                                            {`${
                                                content?.author?.first_name
                                                    ? content?.author
                                                          ?.first_name
                                                    : ''
                                            } ${
                                                content?.author?.last_name
                                                    ? content?.author?.last_name
                                                    : ''
                                            }`}
                                        </Text>
                                    </View>
                                    {!!content?.contact &&
                                        content?.contact != 'Bestimmen' && (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    Alert.alert(
                                                        '',
                                                        content?.contact,
                                                        [
                                                            {
                                                                text:
                                                                    'Abbrechen',
                                                                style: 'cancel',
                                                            },
                                                            content?.contact?.includes(
                                                                '@',
                                                            )
                                                                ? {
                                                                      text:
                                                                          'Mail',
                                                                      onPress: () =>
                                                                          Linking.openURL(
                                                                              `mailto:${
                                                                                  content?.contact
                                                                              }`,
                                                                          ),
                                                                  }
                                                                : {
                                                                      text:
                                                                          'Call',
                                                                      onPress: () =>
                                                                          Linking.openURL(
                                                                              `tel:${
                                                                                  content?.contact
                                                                              }`,
                                                                          ),
                                                                  },
                                                        ],
                                                        {cancelable: false},
                                                    )
                                                }
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    marginTop: 10,
                                                }}>
                                                <Icon
                                                    name={
                                                        content?.contact?.includes(
                                                            '@',
                                                        )
                                                            ? 'mail'
                                                            : 'phone'
                                                    }
                                                    size={33}
                                                    color={PRIMARY_COLOR}
                                                />
                                                <Text
                                                    style={[
                                                        s.bodyText,
                                                        {
                                                            marginLeft: 10,
                                                            fontSize: 16,
                                                        },
                                                    ]}>
                                                    {content?.contact}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                </>
                            )}
                        </View>
                        <Text
                            style={[
                                s.bodyText,
                                {
                                    marginTop: 12,
                                    marginBottom: 7,
                                    fontSize: 18,
                                    fontFamily: 'Rubik-Medium',
                                },
                            ]}>
                            Aktionen
                        </Text>
                        <View
                            style={[
                                s.contentFooter,
                                {
                                    justifyContent: 'flex-start',
                                    flexWrap: 'wrap',
                                },
                            ]}>
                            {!interested ? (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (content && content.fees > 0) {
                                            this.setState({openTicket: true});
                                        } else joinToEvent(data, true);
                                    }}
                                    style={icon_style}>
                                    <View style={s.iconContainer}>
                                        <Icon
                                            name={'check'}
                                            size={27}
                                            color={PRIMARY_COLOR}
                                        />
                                        <Text style={s.iconlabel}>
                                            {t('register')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (isPreview) return;
                                        if (interested)
                                            joinToEvent(data, false);
                                    }}
                                    style={icon_style}>
                                    <View style={s.iconContainer}>
                                        <Icon
                                            name="x"
                                            size={27}
                                            color={
                                                interested
                                                    ? PRIMARY_COLOR
                                                    : 'gray'
                                            }
                                        />
                                        <Text style={s.iconlabel}>
                                            {t('register')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}

                            {!!content.fees && content.fees > 0 && (
                                <TouchableOpacity
                                    style={icon_style}
                                    onPress={() => {
                                        if (isPreview) return;
                                        onOpenAttendees(data);
                                    }}>
                                    <View style={s.iconContainer}>
                                        <Icon
                                            name="credit-card"
                                            size={27}
                                            color={PRIMARY_COLOR}
                                        />
                                        <Text style={s.iconlabel}>
                                            {`CHF ${content.fees}`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={icon_style}
                                onPress={() => {
                                    if (isPreview) return;
                                    onOpenAttendees(data);
                                }}>
                                <View style={s.iconContainer}>
                                    <Icon
                                        name="users"
                                        size={27}
                                        color={PRIMARY_COLOR}
                                    />
                                    <Text style={s.iconlabel}>
                                        {t('attendees')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                                style={icon_style}
                                onPress={() => {}}>
                                <View style={s.iconContainer}>
                                    <Icon
                                        name="x"
                                        size={27}
                                        color={PRIMARY_COLOR}
                                    />
                                    <Text style={s.iconlabel}>Abmelden</Text>
                                </View>
                            </TouchableOpacity> */}
                        </View>
                        {this.state.showMore && (
                            <>
                                <View
                                    style={[
                                        s.contentFooter,
                                        {
                                            justifyContent: 'flex-start',
                                            flexWrap: 'wrap',
                                        },
                                    ]}>
                                    {!!allow_likes && (
                                        <View style={icon_style}>
                                            <View
                                                style={[
                                                    s.iconContainer,
                                                    {flexDirection: 'row'},
                                                ]}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if (isPreview) return;
                                                        this.props.onLike(data);
                                                    }}>
                                                    <Icon
                                                        name={'thumbs-up'}
                                                        size={27}
                                                        color={
                                                            liked
                                                                ? '#6C8AF1'
                                                                : PRIMARY_COLOR
                                                        }
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={[
                                                        s.iconlabel,
                                                        {marginLeft: 5},
                                                    ]}>
                                                    {count_likes != null
                                                        ? count_likes
                                                        : 0}
                                                </Text>
                                            </View>
                                            <Text
                                                style={[
                                                    s.iconlabel,
                                                    {textAlign: 'center'},
                                                ]}>
                                                {t('likes')}
                                            </Text>
                                        </View>
                                    )}
                                    {!!allow_comments && (
                                        <View style={icon_style}>
                                            <View
                                                style={[
                                                    s.iconContainer,
                                                    {flexDirection: 'row'},
                                                ]}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if (isPreview) return;
                                                        if (club && club.id) {
                                                            this.props.onComment(
                                                                data,
                                                            );
                                                        } else
                                                            alert(t('noclub'));
                                                    }}>
                                                    <Icon
                                                        name="message-circle"
                                                        size={27}
                                                        color={PRIMARY_COLOR}
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={[
                                                        s.iconlabel,
                                                        {marginLeft: 5},
                                                    ]}>
                                                    {count_comments != null
                                                        ? count_comments
                                                        : 0}
                                                </Text>
                                            </View>
                                            <Text
                                                style={[
                                                    s.iconlabel,
                                                    {textAlign: 'center'},
                                                ]}>
                                                {t('comments')}
                                            </Text>
                                        </View>
                                    )}
                                    {!!allow_sharing && (
                                        <TouchableOpacity
                                            style={icon_style}
                                            onPress={() => {
                                                if (isPreview) return;

                                                const url =
                                                    content &&
                                                    content.photo &&
                                                    content.photo.original
                                                        ? content.photo.original
                                                        : '';
                                                const title =
                                                    club && club.name
                                                        ? club.name
                                                        : '';
                                                const message =
                                                    content &&
                                                    content.description
                                                        ? content.description
                                                        : '';
                                                const icon = '';
                                                const options = Platform.select(
                                                    {
                                                        ios: {
                                                            activityItemSources: [
                                                                {
                                                                    // For sharing url with custom title.
                                                                    placeholderItem: {
                                                                        type:
                                                                            'url',
                                                                        content: url,
                                                                    },
                                                                    item: {
                                                                        default: {
                                                                            type:
                                                                                'url',
                                                                            content: url,
                                                                        },
                                                                    },
                                                                    subject: {
                                                                        default: title,
                                                                    },
                                                                    linkMetadata: {
                                                                        originalUrl: url,
                                                                        url,
                                                                        title,
                                                                    },
                                                                },
                                                                {
                                                                    // For sharing text.
                                                                    placeholderItem: {
                                                                        type:
                                                                            'text',
                                                                        content: message,
                                                                    },
                                                                    item: {
                                                                        default: {
                                                                            type:
                                                                                'text',
                                                                            content: message,
                                                                        },
                                                                        message: null, // Specify no text to share via Messages app.
                                                                    },
                                                                    linkMetadata: {
                                                                        // For showing app icon on share preview.
                                                                        title: message,
                                                                    },
                                                                },
                                                                {
                                                                    // For using custom icon instead of default text icon at share preview when sharing with message.
                                                                    placeholderItem: {
                                                                        type:
                                                                            'url',
                                                                        content: icon,
                                                                    },
                                                                    item: {
                                                                        default: {
                                                                            type:
                                                                                'text',
                                                                            content: `${message} ${url}`,
                                                                        },
                                                                    },
                                                                    linkMetadata: {
                                                                        title: message,
                                                                        icon: icon,
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                        default: {
                                                            title,
                                                            subject: title,
                                                            message: `${message} ${url}`,
                                                        },
                                                    },
                                                );

                                                Share.open(options);
                                            }}>
                                            <View style={s.iconContainer}>
                                                <Icon
                                                    name="share"
                                                    size={27}
                                                    color={PRIMARY_COLOR}
                                                />
                                                <Text style={s.iconlabel}>
                                                    {t('share')}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        onPress={async () => {
                                            const status = await RNCalendarEvents.authorizationStatus().catch(
                                                err => console.error(err),
                                            );
                                            if (status !== 'authorized') {
                                                RNCalendarEvents.authorizeEventStore().then(
                                                    out => {
                                                        this.onClickCalendar();
                                                    },
                                                );
                                            } else {
                                                this.onClickCalendar();
                                            }
                                        }}
                                        style={icon_style}>
                                        <View style={s.iconContainer}>
                                            <Icon
                                                name="calendar"
                                                size={27}
                                                color={PRIMARY_COLOR}
                                            />
                                            <Text style={s.iconlabel}>
                                                {t('calendar')}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={[
                                        s.contentFooter,
                                        {
                                            justifyContent: 'flex-start',
                                            flexWrap: 'wrap',
                                        },
                                    ]}>
                                    {((user &&
                                        created_by &&
                                        user.id == created_by.id) ||
                                        isPreview) && (
                                        <TouchableOpacity
                                            style={icon_style}
                                            onPress={() => {
                                                if (isPreview) return;
                                                this.props.navigation.navigate(
                                                    'CreateEvent',
                                                    {
                                                        event_id: content.id,
                                                        backTo: 'Feed',
                                                    },
                                                );
                                            }}>
                                            <View style={s.iconContainer}>
                                                <Icon
                                                    name="edit"
                                                    size={27}
                                                    color="#6C8AF1"
                                                />
                                                <Text style={[s.iconlabel]}>
                                                    {t('edit')}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    {content.fees != null && content.fees > 0 && (
                                        <View style={icon_style}>
                                            <View style={s.iconContainer}>
                                                <Icon
                                                    name="bar-chart"
                                                    size={27}
                                                    color={'#6C8AF1'}
                                                />
                                                <Text style={[s.iconlabel]}>
                                                    Kasse
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        style={icon_style}
                                        onPress={() => {}}>
                                        <View style={s.iconContainer}>
                                            <Icon
                                                name="x"
                                                size={27}
                                                color="#6C8AF1"
                                            />
                                            <Text style={[s.iconlabel]}>
                                                Absagen
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                )}
                {this.state.openTicket && (
                    <Modal
                        isVisible={this.state.openTicket}
                        onBackButtonPress={() =>
                            this.setState({openTicket: false, qrcode: null})
                        }
                        onBackdropPress={() =>
                            this.setState({openTicket: false, qrcode: null})
                        }
                        onSwipeComplete={() =>
                            this.setState({openTicket: false, qrcode: null})
                        }
                        //swipeDirection={['down']}
                        style={s.ios_modal}
                        avoidKeyboard>
                        <View style={s.ios_modalContainer}>
                            <View style={s.ios_modalcloseBtn} />
                            <Text
                                style={[
                                    s.priceTxt,
                                    {
                                        alignSelf: 'flex-start',
                                        color: PRIMARY_COLOR,
                                    },
                                ]}>{`${content && content.fees} CHF`}</Text>
                            <Text
                                style={[
                                    s.priceDescription,
                                    {
                                        alignSelf: 'flex-start',
                                        color: '#2F425D',
                                        marginBottom: 20,
                                    },
                                ]}>
                                {t('eventfee')}
                            </Text>
                            {this.state.qrcode ? (
                                <Image
                                    source={{uri: this.state.qrcode}}
                                    style={{
                                        width: width / 2,
                                        height: width / 2,
                                        resizeMode: 'contain',
                                        marginBottom: 30,
                                    }}
                                />
                            ) : (
                                <View>
                                    <TouchableOpacity
                                        style={[s.btn, {marginBottom: 0}]}
                                        onPress={() => {
                                            this.props.confirmAttendance(
                                                content.id,
                                                null,
                                                res => {
                                                    if (res && res.qr) {
                                                        this.setState({
                                                            qrcode: res.qr,
                                                        });
                                                    } else {
                                                        alert(t('nofeature'));
                                                    }
                                                },
                                            );
                                            //this.setState({ openTicket: false })
                                        }}>
                                        <Text style={s.btnLabel}>
                                            {t('payandtake')}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            s.btn,
                                            {
                                                backgroundColor: 'white',
                                                borderColor: PRIMARY_COLOR,
                                                borderWidth: 1,
                                            },
                                        ]}
                                        onPress={() => {
                                            this.setState({
                                                openTicket: false,
                                                qrcode: null,
                                            });
                                        }}>
                                        <Text
                                            style={[
                                                s.btnLabel,
                                                {color: PRIMARY_COLOR},
                                            ]}>
                                            {t('abort')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </Modal>
                )}
            </View>
        );
    }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = {
    getTicketsOfEvent,
    createNewTicket,
    confirmAttendance,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation('feedcard')(FeedCardEvent));
