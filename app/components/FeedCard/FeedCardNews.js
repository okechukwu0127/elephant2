import React from 'react';
import {
    StyleSheet,
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
import {
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
    GRAY_COLOR,
} from '../../themes/colors';
import HTMLView from 'react-native-htmlview';
import Share from 'react-native-share';
import {withTranslation} from 'react-i18next';
import AvatarImage from '../AvatarImage';
import moment from 'moment';

const {width} = Dimensions.get('window');
const DATE_FORMAT = 'DD.MM.YYYY';
class FeedCardNews extends React.Component {
    constructor(props) {
        super(props);
        console.log(
            '🚀 ~ file: FeedCardNews.js ~ line 30 ~ FeedCardNews ~ constructor ~ props',
            props,
        );
    }
    render() {
        const {data, t, unfold, openCard, isPreview, user} = this.props;
        const {content} = data;
        const {
            club,
            allow_likes,
            allow_comments,
            allow_shares,
            liked,
            count_likes,
            count_comments,
            title,
            date,
            news_date,
        } = content;

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
                                uri={club && club.photo && club.photo.original}
                                width={32}
                                user={{first_name: club && club.name}}
                                backgroundColor={'rgba(255,255,255,0.5)'}
                            />
                        </View>
                        <View>
                            {club ? (
                                <>
                                    <Text style={s.headerSubTitle}>
                                        {club.name}
                                    </Text>
                                    <Text style={s.headerTitle}>{title}</Text>
                                </>
                            ) : null}
                        </View>
                    </View>
                </TouchableOpacity>
                {unfold && (
                    <View style={s.content}>
                        <View style={s.contentHeader}>
                            <Text style={[s.bodyHeaderTitle, {fontSize: 14}]}>
                                {moment(
                                    news_date || date,
                                    date
                                        ? 'ddd. DD.MM.YYYY HH:mm'
                                        : 'YYYY-MM-DD',
                                ).format(DATE_FORMAT)}
                            </Text>
                        </View>
                        {isPreview && content.photo && (
                            <Image
                                source={content.photo}
                                style={{
                                    width: width - 100,
                                    height: width - 100,
                                    resizeMode: 'cover',
                                    alignSelf: 'center',
                                    borderRadius: 20,
                                    marginVertical: 10,
                                }}
                            />
                        )}
                        {content &&
                            content.files &&
                            content.files.photos &&
                            content.files.photos.length > 0 && (
                                <Image
                                    source={{uri: content.files.photos[0].url}}
                                    style={{
                                        width: width - 100,
                                        height: width - 100,
                                        resizeMode: 'cover',
                                        alignSelf: 'center',
                                        borderRadius: 5,
                                        marginVertical: 10,
                                    }}
                                />
                            )}
                        <View style={s.body}>
                            <HTMLView
                                value={
                                    content && content.content
                                        ? content.content
                                        : ''
                                }
                                style={{width: '100%'}}
                                stylesheet={styles}
                            />
                            {((!!content.attachments &&
                                content.attachments.length > 0) ||
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
                                                marginTop: 15,
                                                marginBottom: 7,
                                                fontSize: 18,
                                                fontFamily: 'Rubik-Medium',
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
                                        {content?.attachments?.map(
                                            (file, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={() =>
                                                        file?.url &&
                                                        Linking.openURL(
                                                            file?.url,
                                                        )
                                                    }
                                                    style={{
                                                        flexDirection: 'row',
                                                        textAlign: 'center',
                                                        padding: 5,
                                                        justifyContent:
                                                            'center',
                                                    }}>
                                                    <Icon
                                                        name="file"
                                                        color={PRIMARY_COLOR}
                                                        size={27}
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
                                        {(typeof content.links === 'string'
                                            ? JSON.parse(content.links)
                                            : content.links
                                        ).map((links, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() =>
                                                    Linking.openURL(links?.url)
                                                }
                                                style={{
                                                    flexDirection: 'row',
                                                    textAlign: 'center',
                                                    padding: 5,
                                                    justifyContent: 'center',
                                                }}>
                                                <Icon
                                                    name="globe"
                                                    color={PRIMARY_COLOR}
                                                    size={27}
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
                            {/* <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 10,
                                }}>
                                <Icon
                                    name="mail"
                                    size={27}
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
                                    {content?.author?.email}
                                </Text>
                            </View> */}
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
                                        content?.main_contact?.profile?.avatar
                                            ?.original
                                    }
                                    width={35}
                                    user={content?.main_contact}
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
                                    {content?.main_contact?.first_name
                                        ? content?.main_contact?.first_name
                                        : '' +
                                          ' ' +
                                          content?.main_contact?.last_name
                                        ? content?.main_contact?.last_name
                                        : ''}
                                </Text>
                            </View>
                            {console.log('Contacnt', content?.contact)}
                            {typeof content?.contact === 'string' &&
                                content?.contact.length > 0 &&
                                content?.contact != 'Bestimmen' && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            Alert.alert(
                                                'Confirm',
                                                content?.contact?.includes('@')
                                                    ? `Would you like to write an e-mail to ${
                                                          content?.contact
                                                      }?`
                                                    : `Would you like to call ${
                                                          content?.contact
                                                      }?`,
                                                [
                                                    {
                                                        text: 'Cancel',
                                                        style: 'cancel',
                                                    },
                                                    {
                                                        text: 'OK',
                                                        onPress: () =>
                                                            Linking.openURL(
                                                                content?.contact?.includes(
                                                                    '@',
                                                                )
                                                                    ? `mailto:${
                                                                          content?.contact
                                                                      }`
                                                                    : `tel:${
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
                                                content?.contact?.includes('@')
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
                        </View>
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
                            Aktionen
                        </Text>
                        <View
                            style={[
                                s.contentFooter,
                                {justifyContent: 'flex-start'},
                            ]}>
                            {!!allow_likes ? (
                                <View style={s.footerItem}>
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
                                    <Text style={s.iconlabel}>
                                        {t('likes')}
                                    </Text>
                                </View>
                            ) : null}
                            {!!allow_comments ? (
                                <View style={s.footerItem}>
                                    <View
                                        style={[
                                            s.iconContainer,
                                            {flexDirection: 'row'},
                                        ]}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (isPreview) return;
                                                if (club && club.id) {
                                                    this.props.onComment(data);
                                                } else alert(t('noclub'));
                                            }}>
                                            <Icon
                                                name="message-square"
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
                                    <Text style={s.iconlabel}>
                                        {t('comments')}
                                    </Text>
                                </View>
                            ) : null}
                            {!!allow_shares && (
                                <TouchableOpacity
                                    style={s.footerItem}
                                    onPress={() => {
                                        if (isPreview) return;
                                        const url =
                                            content &&
                                            content.files &&
                                            content.files.photos &&
                                            content.files.photos.length > 0
                                                ? content.files.photos[0].url
                                                : '';
                                        const title =
                                            content && content.title
                                                ? content.title
                                                : '';
                                        const message =
                                            content && content.content
                                                ? content.content
                                                : '';
                                        const icon = '';
                                        const options = Platform.select({
                                            ios: {
                                                activityItemSources: [
                                                    {
                                                        // For sharing url with custom title.
                                                        placeholderItem: {
                                                            type: 'url',
                                                            content: url,
                                                        },
                                                        item: {
                                                            default: {
                                                                type: 'url',
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
                                                            type: 'text',
                                                            content: message,
                                                        },
                                                        item: {
                                                            default: {
                                                                type: 'text',
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
                                                            type: 'url',
                                                            content: icon,
                                                        },
                                                        item: {
                                                            default: {
                                                                type: 'text',
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
                                        });

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
                            <View style={s.footerItem}>
                                <View
                                    style={[
                                        s.iconContainer,
                                        {flexDirection: 'row'},
                                    ]}>
                                    <TouchableOpacity onPress={() => {}}>
                                        <Icon
                                            name="eye"
                                            size={27}
                                            color={PRIMARY_COLOR}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={s.iconlabel}>Gelesen</Text>
                            </View>
                        </View>

                        <View
                            style={[
                                s.contentFooter,
                                {justifyContent: 'flex-start', marginTop: 20},
                            ]}>
                            {(user?.id === content?.author?.id ||
                                isPreview) && (
                                <>
                                    <TouchableOpacity
                                        style={s.footerItem}
                                        onPress={() => {
                                            if (isPreview) return;
                                            this.props.navigation.navigate(
                                                'CreateNews',
                                                {
                                                    news_id: content.id,
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

                                    <View style={s.footerItem}>
                                        <View
                                            style={[
                                                s.iconContainer,
                                                {flexDirection: 'row'},
                                            ]}>
                                            <TouchableOpacity
                                                onPress={() => {}}>
                                                <Icon
                                                    name="eye"
                                                    size={27}
                                                    color="#6C8AF1"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={s.iconlabel}>Gelesen</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

export default withTranslation('feedcard')(FeedCardNews);

const styles = StyleSheet.create({
    a: {
        fontSize: 14,
        fontFamily: 'Rubik-Regular',
        color: PRIMARY_TEXT_COLOR,
        lineHeight: 20,
    },
});
