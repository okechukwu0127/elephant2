import React, {useState, useEffect} from 'react';
import {
    View,
    ScrollView,
    Text,
    TextInput,
    ActivityIndicator,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR} from '../../themes/colors';
import {AvatarImage, CloseButton} from '../../components';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {getEventComments} from '../../reducers/event';
import {getNewsComments} from '../../reducers/news';
import {getImpressionComments} from '../../reducers/impression';

export default function Comments({navigation}) {
    const [value, setValue] = useState('');
    const [comments, setComments] = useState(null);
    const user = useSelector(state => state.user && state.user.user.profile);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const data = navigation.getParam('data');
    const type = navigation.getParam('type');
    const onComment = navigation.getParam('onComment');

    useEffect(() => {
        refresh();
    }, []);

    const refresh = () => {
        switch (type) {
            case 'event':
                dispatch(
                    getEventComments(
                        data.content.club.id,
                        data.content.id,
                        c => {
                            console.log('refresh -> c', c);
                            setComments(c);
                        },
                    ),
                );
                break;
            case 'news':
                dispatch(
                    getNewsComments(data.content.club.id, data.content.id, c =>
                        setComments(c),
                    ),
                );
                break;
            case 'impression':
                dispatch(
                    getImpressionComments(
                        data.content.club.id,
                        data.content.id,
                        c => setComments(c),
                    ),
                );
                break;

            default:
                break;
        }
    };

    const addComment = () => {
        if (!value || !value.length) return;

        onComment(value, refresh);
        setValue('');
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'height' : null}
            contentContainerStyle={{flex: 1}}
            style={s.container}>
            <View style={s.wrapper}>
                <View style={s.topBar}>
                    <Text style={s.title}>{t('comments')}</Text>
                    <CloseButton onPress={() => navigation.goBack()} />
                </View>
                <ScrollView style={s.commentSection}>
                    <View style={{paddingBottom: 50}}>
                        {comments &&
                            comments.map((comment, index) => (
                                <View style={s.comment} key={index}>
                                    <AvatarImage
                                        uri={
                                            comment?.user?.profile?.avatar
                                                ?.original
                                        }
                                        width={40}
                                        user={comment.user}
                                    />
                                    <View style={{flex: 1}}>
                                        <Text style={s.text}>
                                            <Text style={s.userName}>
                                                {comment.user.first_name +
                                                    ' ' +
                                                    comment.user.last_name}
                                            </Text>
                                            {'  ' + comment.comment}
                                        </Text>
                                        <Text style={s.time}>
                                            {comment.created_at_for_humans_de}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        {!comments && (
                            <ActivityIndicator
                                size="large"
                                color={PRIMARY_COLOR}
                            />
                        )}
                    </View>
                </ScrollView>
                <View style={s.addCommentSection}>
                    <AvatarImage
                        uri={user && user.avatar && user.avatar.original}
                        width={40}
                        user={user}
                    />
                    <View style={s.inputContainer}>
                        <Icon name="message-circle" size={25} color="#88919E" />
                        <TextInput
                            style={s.input}
                            placeholder={t('add-comment')}
                            value={value}
                            onChangeText={setValue}
                            onSubmitEditing={addComment}
                        />
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
