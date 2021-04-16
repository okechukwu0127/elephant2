import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
    FlatList,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR} from '../../themes/colors';
import moment from 'moment';
import FontAwsIcon from 'react-native-vector-icons/FontAwesome';
import ImageView from 'react-native-image-view';
import Share from 'react-native-share';
import {withTranslation} from 'react-i18next';
import AvatarImage from '../AvatarImage';

class FeedCardImpression extends React.Component {
    constructor(props) {
        super(props);
        this.state = {imagesIndex: 0, isImageViewVisible: false};
    }
    getExtention = filename => {
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    };
    render() {
        const {t, data, unfold, onLike, openCard, user, isPreview} = this.props;
        const {content} = data;
        console.log(
            '🚀 ~ file: FeedCardImpression.js ~ line 31 ~ FeedCardImpression ~ render ~ content',
            content,
        );
        const club = content ? content.club : null;
        let media = content?.photos || [];
        const main_contact = content.main_contact || content.created_by;

        const {liked, count_likes, count_comments} = content;
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
                                    club?.avatar?.original ||
                                    club?.photo?.original
                                }
                                width={32}
                                user={{first_name: club?.name}}
                                backgroundColor={'rgba(255,255,255,0.5)'}
                            />
                        </View>
                        <View>
                            <Text style={s.headerSubTitle}>GALERIE</Text>
                            <Text
                                style={[
                                    s.headerSubTitle,
                                    {
                                        fontSize: 16,
                                        textTransform: 'none',
                                        fontFamily: 'Rubik-Medium',
                                    },
                                ]}>
                                {content?.title}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {unfold && (
                    <View style={s.content}>
                        <View style={s.contentHeader}>
                            <View>
                                <Text style={s.bodyHeaderTitle}>
                                    {moment(content.news_date).format(
                                        'DD.MM.YYYY',
                                    )}
                                </Text>
                                <Text style={s.bodyHeaderSubTitle}>
                                    {club && club.location}
                                </Text>
                            </View>
                        </View>
                        <View style={s.body}>
                            <FlatList
                                style={{width: '100%', marginBottom: 10}}
                                data={
                                    media.length > 4 ? media.slice(0, 4) : media
                                }
                                renderItem={({item, index}) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.setState({
                                                    imagesIndex: index,
                                                    isImageViewVisible: true,
                                                })
                                            }
                                            key={media.id}
                                            style={s.impressItem}>
                                            <View style={s.impressImgView}>
                                                {
                                                    <Image
                                                        source={
                                                            item.url
                                                                ? {
                                                                      uri:
                                                                          item.url,
                                                                  }
                                                                : item.file
                                                        }
                                                        style={s.impressimg}
                                                    />
                                                }
                                            </View>
                                            {index === 3 && media.length > 4 && (
                                                <View
                                                    style={{
                                                        backgroundColor:
                                                            'rgba(0,0,0,0.35)',
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                        borderRadius: 10,
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontFamily:
                                                                'Rubik-Medium',
                                                            color: 'white',
                                                            fontSize: 32,
                                                        }}>
                                                        +{media.length - 3}
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    );
                                }}
                                keyExtractor={(item, index) => item.id + ''}
                                numColumns={2}
                                extraData={this.props}
                            />
                            <Text
                                style={{
                                    fontSize: 14,
                                }}>
                                {content.content}
                            </Text>
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
                                Kontaktperson
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <AvatarImage
                                    uri={
                                        main_contact?.profile?.avatar?.original
                                    }
                                    width={35}
                                    user={main_contact}
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
                                        main_contact?.first_name
                                            ? main_contact?.first_name
                                            : ''
                                    } ${
                                        main_contact?.last_name
                                            ? main_contact?.last_name
                                            : ''
                                    }`}
                                </Text>
                            </View>
                            {!!content?.contact &&
                                content?.contact != 'Bestimmen' && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            Linking.openURL(
                                                content?.contact?.includes('@')
                                                    ? `mailto:${
                                                          content?.contact
                                                      }`
                                                    : `callto:${
                                                          content?.contact
                                                      }`,
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
                                    marginBottom: 15,
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
                            {!!content.allow_likes ? (
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
                                            <FontAwsIcon
                                                name={
                                                    liked ? 'heart' : 'heart-o'
                                                }
                                                size={27}
                                                color={PRIMARY_COLOR}
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
                            {!!content.allow_comments ? (
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
                            {!!content.allow_shares && (
                                <TouchableOpacity
                                    style={s.footerItem}
                                    onPress={() => {
                                        const options = {
                                            title: '',
                                            message: '',
                                            subject:
                                                club && club.name
                                                    ? club.name
                                                    : '',
                                            type: 'image/jpeg',
                                            urls: media.map(item => item.url),
                                        };
                                        Share.open(options);
                                    }}>
                                    <View style={s.iconContainer}>
                                        <Icon
                                            name="share-2"
                                            size={27}
                                            color={PRIMARY_COLOR}
                                        />
                                        <Text style={s.iconlabel}>
                                            {t('share')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View
                            style={[
                                s.contentFooter,
                                {justifyContent: 'flex-start', marginTop: 20},
                            ]}>
                            {/* user &&
                                content.author &&
                                user.id == content.author.id */}
                            {user?.id === content?.created_by?.id && (
                                <>
                                    <TouchableOpacity
                                        style={s.footerItem}
                                        onPress={() => {
                                            if (isPreview) return;
                                            this.props.navigation.navigate(
                                                'CreateImpression',
                                                {
                                                    impression_id: content.id,
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
                <ImageView
                    images={media.map(el => ({
                        title: el.name,
                        source: el.url ? {uri: el.url} : el.file,
                    }))}
                    imageIndex={this.state.imagesIndex}
                    renderFooter={currentImage => (
                        <View
                            style={{
                                backgroundColor: 'rgba(0,0,0,.3)',
                                paddingVertical: 30,
                            }}>
                            <Text
                                style={{
                                    fontFamily: 'Rubik-Regular',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontSize: 16,
                                }}>
                                {currentImage.title}
                            </Text>
                        </View>
                    )}
                    isVisible={this.state.isImageViewVisible}
                    onClose={() => this.setState({isImageViewVisible: false})}
                    onImageChange={index => this.setState({imagesIndex: index})}
                />
            </View>
        );
    }
}

export default withTranslation('feedcard')(FeedCardImpression);
