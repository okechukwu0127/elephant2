import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CheckBox from 'react-native-check-box';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import {searchWithKeyword} from '../../utils/utils';
import {connect} from 'react-redux';
import {getUserName} from '../../utils/utils';
import {getAttendance} from '../../reducers/event';
import Pie from 'react-native-pie';
import {withTranslation} from 'react-i18next';
import AvatarImage from '../AvatarImage';

const COLOR_REGISTRATION = '#429F7E';
const COLOR_RESERVATION = '#3AF1AF';
const COLOR_UNSUBSCRIBE = '#FF5286';
const COLOR_NOFEEDBACK = '#C4C4C4';
class EventMembers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            filtered: [],
            loading: false,
            title: '',
            page: 'main',
        };
    }
    UNSAFE_componentWillReceiveProps(nextprops) {
        if (nextprops.isVisible && !this.props.isVisible) {
            const {content} = nextprops.event;
            this.setState({loading: true});
            this.props.getAttendance(content.id, res => {
                if (res) {
                    this.setState({members: res, loading: false});
                } else this.setState({loading: false});
            });
        }
    }
    onStateClose() {
        this.setState({page: 'main'});
        this.props.onClose();
    }
    renderChart() {
        const {t, event} = this.props;
        const {members} = this.state;
        if (members.length <= 0)
            return (
                <Text style={[{textAlign: 'center'}, s.memberName]}>
                    No members
                </Text>
            );

        const isNotFree = event && event.content && event.content.fees > 0;
        const registraions = [];
        const reserved = [];
        const unsubscribed = [];
        const nofeedback = [];
        members.map(item => {
            if (item.deleted_at) {
                unsubscribed.push(item);
            } else if (item.entry_confirmed_at) {
                if (isNotFree && item.price_charged) {
                    reserved.push(item);
                } else registraions.push(item);
            } else {
                nofeedback.push(item);
            }
        });
        let pie_data = [
            {
                percentage: (registraions.length / members.length) * 100,
                color: COLOR_REGISTRATION,
            },
            {
                percentage: (unsubscribed.length / members.length) * 100,
                color: COLOR_UNSUBSCRIBE,
            },
            {
                percentage: (nofeedback.length / members.length) * 100,
                color: COLOR_NOFEEDBACK,
            },
        ];
        if (isNotFree)
            pie_data.push({
                percentage: (reserved.length / members.length) * 100,
                color: COLOR_RESERVATION,
            });

        return (
            <View>
                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-around',
                        paddingHorizontal: 10,
                    }}>
                    <View>
                        <Pie
                            radius={65}
                            innerRadius={40}
                            sections={pie_data}
                            strokeCap={'butt'}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Text style={s.total}>
                                {members && members.length}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={s.optionitem}
                            onPress={() =>
                                this.setState({
                                    page: 'member',
                                    filtered: registraions,
                                    title: t('registrations'),
                                })
                            }>
                            <View
                                style={[
                                    s.dot,
                                    {backgroundColor: COLOR_REGISTRATION},
                                ]}
                            />
                            <Text style={s.dotlabel}>{t('registrations')}</Text>
                        </TouchableOpacity>
                        {isNotFree && (
                            <TouchableOpacity
                                style={s.optionitem}
                                onPress={() =>
                                    this.setState({
                                        page: 'member',
                                        filtered: reserved,
                                        title: t('reservation'),
                                    })
                                }>
                                <View
                                    style={[
                                        s.dot,
                                        {backgroundColor: COLOR_RESERVATION},
                                    ]}
                                />
                                <Text style={s.dotlabel}>
                                    {t('reservation')}
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={s.optionitem}
                            onPress={() =>
                                this.setState({
                                    page: 'member',
                                    filtered: unsubscribed,
                                    title: t('unsubscribe'),
                                })
                            }>
                            <View
                                style={[
                                    s.dot,
                                    {backgroundColor: COLOR_UNSUBSCRIBE},
                                ]}
                            />
                            <Text style={s.dotlabel}>{t('unsubscribe')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={s.optionitem}
                            onPress={() =>
                                this.setState({
                                    page: 'member',
                                    filtered: nofeedback,
                                    title: t('nofeedback'),
                                })
                            }>
                            <View
                                style={[
                                    s.dot,
                                    {backgroundColor: COLOR_NOFEEDBACK},
                                ]}
                            />
                            <Text style={s.dotlabel}>{t('nofeedback')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
    renderMemberList() {
        const {filtered} = this.state;
        const {t} = this.props;
        return (
            <View style={{flexDirection: 'row'}}>
                <FlatList
                    style={{flex: 1, width: '100%', maxHeight: 300}}
                    data={filtered}
                    renderItem={({item}) => {
                        const {attendee} = item;
                        return (
                            <View key={item.id + ''} style={s.member}>
                                <View style={s.memberAvatar}>
                                    <AvatarImage
                                        user_id={attendee?.id}
                                        width={30}
                                        user={attendee}
                                    />
                                </View>
                                <View>
                                    <Text style={s.memberName}>
                                        {getUserName(attendee)}
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
                    keyExtractor={(item, index) => item.id + ''}
                />
            </View>
        );
    }
    render() {
        const {t, isVisible, event} = this.props;
        const {members, title, loading, page} = this.state;

        return (
            <Modal
                isVisible={isVisible}
                onBackButtonPress={() => this.onStateClose()}
                onBackdropPress={() => this.onStateClose()}
                onSwipeComplete={() => this.onStateClose()}
                swipeDirection={['down']}
                style={s.modal}>
                <View style={s.modalContainer}>
                    <View style={s.modalcloseBtn} />
                    <View style={s.header}>
                        {page != 'main' && (
                            <TouchableOpacity
                                onPress={() => this.setState({page: 'main'})}>
                                <Icon
                                    name="arrow-left"
                                    size={20}
                                    color={PRIMARY_COLOR}
                                    style={{marginRight: 10}}
                                />
                            </TouchableOpacity>
                        )}
                        <Text style={s.title}>
                            {page == 'main' ? t('entrylist') : title}
                        </Text>
                    </View>
                    {loading && (
                        <ActivityIndicator
                            color={PRIMARY_COLOR}
                            style={{marginTop: 10}}
                        />
                    )}
                    {!loading && page == 'main'
                        ? this.renderChart()
                        : this.renderMemberList()}
                </View>
            </Modal>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
});

const mapDispatchToProps = {
    getAttendance,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation('eventmembers')(EventMembers));
