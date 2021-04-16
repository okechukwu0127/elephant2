import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import s, {fab_width} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import FontAwsIcon from 'react-native-vector-icons/FontAwesome';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';
import {connect} from 'react-redux';
import {likePost} from '../../reducers/post';
import {withTranslation} from 'react-i18next';
import AvatarImage from '../AvatarImage';

class FeedCardPost extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {t, data, unfold, openCard} = this.props;
        const {content} = data;
        const posted_by = content ? content.posted_by : null;
        const club = content ? content.club : null;

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
                                user_id={posted_by?.id}
                                width={32}
                                user={posted_by}
                                backgroundColor={'rgba(255,255,255,0.5)'}
                            />
                        </View>
                        <View>
                            {posted_by ? (
                                <Text style={s.headerTitle}>
                                    {posted_by.first_name}
                                </Text>
                            ) : null}
                            <Text style={s.headerSubTitle}>{t('post')}</Text>
                        </View>
                    </View>
                    <Icon name="calendar" size={35} color="white" />
                </TouchableOpacity>
                {unfold && (
                    <View style={s.content}>
                        <View style={s.contentHeader}>
                            <View>
                                <Text style={s.bodyHeaderTitle}>
                                    {club && club.name}
                                </Text>
                                <Text style={s.bodyHeaderSubTitle}>
                                    {club && club.location}
                                </Text>
                            </View>
                            {/*
                                <TouchableOpacity>
                                    <Text style={s.publicLabel}>Öffentlich</Text>
                                </TouchableOpacity>
                                */}
                        </View>
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
                            <Text style={s.bodydate}>
                                {moment(data.created_at).format(
                                    'MMM DD YYYY hh:mm a',
                                )}
                            </Text>
                        </View>
                        <View
                            style={[
                                s.contentFooter,
                                {justifyContent: 'flex-start'},
                            ]}>
                            <View style={{marginRight: 10}}>
                                <View
                                    style={[
                                        s.iconContainer,
                                        {flexDirection: 'row'},
                                    ]}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.onLike(data);
                                        }}>
                                        <FontAwsIcon
                                            name={liked ? 'heart' : 'heart-o'}
                                            size={27}
                                            color={PRIMARY_COLOR}
                                        />
                                    </TouchableOpacity>
                                    <Text
                                        style={[s.iconlabel, {marginLeft: 5}]}>
                                        {count_likes}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <View
                                    style={[
                                        s.iconContainer,
                                        {flexDirection: 'row'},
                                    ]}>
                                    <TouchableOpacity
                                        onPress={() => {
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
                                        style={[s.iconlabel, {marginLeft: 5}]}>
                                        {count_comments}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

export default withTranslation('feedcard')(FeedCardPost);

const styles = StyleSheet.create({
    a: {
        fontSize: 14,
        fontFamily: 'Rubik-Regular',
        color: PRIMARY_TEXT_COLOR,
        lineHeight: 20,
    },
});
