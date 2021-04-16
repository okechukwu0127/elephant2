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
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import moment from 'moment';
import {withTranslation} from 'react-i18next';
import {getUserName} from '../../utils/utils';
//feed_item_type = ['post', 'post-comment','post-like']
import AvatarImage from '../AvatarImage';

class FeedCardPostLike extends React.Component {
    render() {
        const {onPress, data, unfold, openCard} = this.props;
        const {content} = data;
        const user = content ? content.user || content.liked_by : null;

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
                                user_id={user?.id}
                                width={32}
                                user={user}
                                backgroundColor={'rgba(255,255,255,0.5)'}
                            />
                        </View>
                        <View>
                            {user ? (
                                <Text style={s.headerTitle}>
                                    {getUserName(user)}
                                </Text>
                            ) : null}
                            <Text style={s.headerSubTitle}>{data.action}</Text>
                        </View>
                    </View>
                    <Icon name="heart" size={35} color="white" />
                </TouchableOpacity>
                {unfold && (
                    <View style={s.content}>
                        {/*
                        <View style={s.contentHeader}>
                            <View>
                                <Text style={s.bodyHeaderTitle}>{club && club.name}</Text>
                                <Text style={s.bodyHeaderSubTitle}>{club && club.location}</Text>
                            </View>
                            
                        <TouchableOpacity>
                            <Text style={s.publicLabel}>Öffentlich</Text>
                        </TouchableOpacity>
                        
                        </View>
                        */}
                        <View style={s.body}>
                            {/*<Text style={s.bodyText}>{post && post.content}</Text>*/}
                            <Text style={s.bodydate}>
                                {moment(data.created_at).format(
                                    'MMM DD YYYY hh:mm a',
                                )}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

export default withTranslation('feedcard')(FeedCardPostLike);
