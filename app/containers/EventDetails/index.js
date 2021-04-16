import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_TEXT_COLOR, PRIMARY_COLOR} from '../../themes/colors';
import s from './styles';
import {FeedCardEvent} from '../../components';
import {useDispatch} from 'react-redux';
import {getEvent} from '../../reducers/event';
import {useTranslation} from 'react-i18next';

export default function EventDetails({navigation}) {
    const {t} = useTranslation();
    const event_id = navigation.getParam('event_id');
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            getEvent(event_id, res => {
                setEvent(res);
                setLoading(false);
            }),
        );
    }, []);

    return (
        <View style={s.container}>
            <View style={s.wrapper}>
                {loading ? (
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                ) : (
                    <ScrollView>
                        <View style={s.topBar}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}>
                                <Icon
                                    name="arrow-left"
                                    color={PRIMARY_TEXT_COLOR}
                                    size={25}
                                    style={{marginRight: 15}}
                                />
                            </TouchableOpacity>
                            <Text style={s.title}>
                                Einzelheiten zur Veranstaltung
                            </Text>
                        </View>
                        <View>
                            <FeedCardEvent
                                unfold={true}
                                data={{
                                    action: 'event-created',
                                    content: {
                                        // author: event.author,
                                        title: event.title,
                                        description: event.description,
                                        start_at:
                                            event.start_at &&
                                            event.start_at.event?.format(
                                                'YYYY-MM-DD HH:mm',
                                            ),
                                        end_at:
                                            event.end_at &&
                                            event.end_at.event?.format(
                                                'YYYY-MM-DD HH:mm',
                                            ),
                                        photo: event.photo,
                                        fees: event.fees,
                                        interested: true,
                                        attending: true,
                                        allow_likes: event.allow_likes,
                                        allow_comments: event.allow_comments,
                                        allow_sharing: event.allow_sharing,
                                        club: event.club_id,
                                        // city,
                                        register_by: event.register_by,
                                        program: event.program,
                                        extra_files: event.extra_files,
                                        links: event.links,
                                        address: event.location_instructions,
                                        min_participants:
                                            event.min_participants,
                                        max_participants:
                                            event.max_participants,
                                        allow_waiting: event.allow_waiting,
                                        how_to_pay: event.how_to_pay?.label,
                                        author: event.main_contact,
                                        contact: event.contact,
                                        categories: [event.categories],
                                        financial_type:
                                            event.financial_type?.value,
                                    },
                                }}
                                onOpenAttendees={event => {}}
                                joinToEvent={(event, isJoin) => {}}
                                confirmAttende={event => {}}
                                openCard={data => {}}
                            />
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
    );
}
