import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR} from '../../themes/colors';
import {connect} from 'react-redux';
import {getBoardMembers, getClubMembers} from '../../reducers/member';
import {getFeedTimeline} from '../../reducers/feed';
import {withTranslation} from 'react-i18next';
import moment from 'moment';
import {AvatarImage} from '../';

class MemberCard2 extends React.Component {
    state = {
        role: 'loading',
        timelines: null,
    };
    UNSAFE_componentWillMount() {
        const {club, user} = this.props;
        if (club && user) {
            this.props.getBoardMembers(club.id, res => {
                let find_user = null;
                if (res && res.length > 0) {
                    find_user = res.find(
                        item => item.user && item.user.id == user.id,
                    );
                }
                this.setState({
                    role:
                        find_user && find_user.role
                            ? find_user.role.name
                            : 'Mitglied',
                    yearsSince:
                        find_user &&
                        moment(find_user.role_assigned_on).diff(
                            new Date(),
                            'years',
                        ),
                });
            });
        }
    }
    render() {
        const {t, disableShadow, club} = this.props;
        const {role, yearsSince} = this.state;
        return (
            <View style={[s.container, disableShadow ? {elevation: 1} : {}]}>
                <View style={s.header}>
                    <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() =>
                            this.props.navigation.navigate('ClubDetail', {
                                club_id: club?.id,
                            })
                        }>
                        <Text style={s.headerTitle}>{`@\n${club &&
                            club.name}`}</Text>
                    </TouchableOpacity>
                    <AvatarImage
                        uri={club && club.photo && club.photo.original}
                        width={40}
                        user={{first_name: club?.name}}
                    />
                </View>
                <View style={s.content}>
                    <View style={s.cardItem}>
                        <Icon
                            name="user"
                            size={25}
                            color={PRIMARY_COLOR}
                            style={s.cardItemIcon}
                        />
                        <Text style={s.cardItemText}>{role}</Text>
                    </View>
                    <View style={s.cardItem}>
                        <Icon
                            name="calendar"
                            size={25}
                            color={PRIMARY_COLOR}
                            style={s.cardItemIcon}
                        />
                        <Text style={s.cardItemText}>
                            {yearsSince > 1
                                ? t('pastdate', {year: yearsSince})
                                : yearsSince === 0
                                ? t('zeroyear')
                                : t('oneyear')}
                        </Text>
                    </View>
                    {/*
                    <Text style={s.sectionName}>Chronologie</Text>
                    <View style={s.contactItem}>
                        <View style={s.cardItem}>
                            <Icon name='phone' size={25} color={PRIMARY_COLOR} style={s.cardItemIcon} />
                            <View>
                                <Text style={s.contactName}>{'Ist Beigetreten'}</Text> 
                                <Text style={s.contactDate}>{'25. März 2019'}</Text>
                            </View>
                            <Icon name='chevron-right' size={18} color={PRIMARY_COLOR} />
                        </View>

                    </View>
                    <View style={s.contactItem} >
                        <View style={s.cardItem}>
                            <Icon name='phone' size={25} color={PRIMARY_COLOR} style={s.cardItemIcon} />
                            <View>
                                <Text style={s.contactName}>{'Ist Beigetreten'}</Text> 
                                <Text style={s.contactDate}>{'25. März 2019'}</Text>
                            </View>
                            <Icon name='chevron-right' size={18} color={PRIMARY_COLOR} />
                        </View>
                    </View>
                    */}
                    {/*
                        timelines == null ?
                            <ActivityIndicator color={PRIMARY_COLOR} style={{ alignSelf: 'center' }} /> :
                            <View>
                                {
                                    timelines.length > 0 ?
                                    timelines.map(item => {
                                        return (
                                            <View style={s.contactItem} key={item.id + ''}>
                                                <View style={s.cardItem}>
                                                    <Icon name='phone' size={25} color={PRIMARY_COLOR} style={s.cardItemIcon} />
                                                    <View>
                                                        {item.action ? <Text style={s.contactName}>{item.action.toUpperCase()}</Text> : null}
                                                        <Text style={s.contactDate}>{moment(item.created_at).format('DD MMMM YYYY')}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }) :
                                    <Text style={s.contactDate}></Text>
                                }
                            </View>
                            */}
                    {/*
                    <TouchableOpacity style={{ padding: 10, alignSelf: 'center' }}>
                        <Text style={s.btnLabel}>Mehr anzeigen</Text>
                    </TouchableOpacity>
                    */}
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    getBoardMembers,
    getClubMembers,
    getFeedTimeline,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation('membercard')(MemberCard2));
