import * as React from 'react';
import {View, TouchableOpacity, Text, FlatList, ScrollView} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../../themes/colors';
import {connect} from 'react-redux';
import {
    searchClubMembers,
    getClubRoles,
    getBoardMembers,
    addClubBoardMember,
    requestToRemoveBoardMember,
} from '../../../reducers/member';
import {MemberAction, AvatarImage} from '../../../components';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {getUserName} from '../../../utils/utils';

class EditBoard extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    constructor(props) {
        super(props);
        const club_id = props.navigation.getParam('club_id');
        this.state = {
            showaction: false,
            selMember: null,
            club_id,
        };
        props.getBoardMembers(club_id);
        props.getClubRoles();
        props.searchClubMembers(club_id, '');
    }
    render() {
        const {t, board_members} = this.props;
        const {club_id} = this.state;
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <ScrollView>
                        <View style={s.topBar}>
                            <TouchableOpacity
                                style={{borderRadius: 30, overflow: 'hidden'}}
                                onPress={() => this.props.navigation.goBack()}>
                                <Icon
                                    name="arrow-left"
                                    color={PRIMARY_TEXT_COLOR}
                                    size={30}
                                />
                            </TouchableOpacity>
                            <Text style={s.title}>{t('title')}</Text>
                        </View>
                        <Text style={s.sectionName}>{t('board')}</Text>
                        <View style={s.section}>
                            {board_members && board_members.length > 0 ? (
                                <FlatList
                                    data={board_members.sort((a, b) =>
                                        a?.user?.first_name?.localeCompare(
                                            b?.user?.first_name,
                                        ),
                                    )}
                                    renderItem={({item}) => {
                                        console.log(
                                            '🚀 ~ file: index.js ~ line 67 ~ EditBoard ~ render ~ item.user',
                                            item.user,
                                        );
                                        return (
                                            <View style={s.sectionItem}>
                                                <View
                                                    style={[
                                                        s.sectionItem,
                                                        {
                                                            flex: 1,
                                                            justifyContent:
                                                                'flex-start',
                                                        },
                                                    ]}>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            this.props.navigation.navigate(
                                                                'MemberProfile',
                                                                {
                                                                    member_id:
                                                                        item
                                                                            ?.user
                                                                            ?.id,
                                                                },
                                                            )
                                                        }
                                                        style={s.sectionImage}>
                                                        <AvatarImage
                                                            user_id={
                                                                item?.user?.id
                                                            }
                                                            width={40}
                                                            user={item.user}
                                                        />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            if (
                                                                item.marked_for_deletion
                                                            )
                                                                return;
                                                            this.props.searchClubMembers(
                                                                club_id,
                                                                item.user
                                                                    .first_name,
                                                            );
                                                            this.setState({
                                                                showaction: true,
                                                                selMember:
                                                                    item.user,
                                                            });
                                                        }}>
                                                        <Text
                                                            style={[
                                                                s.sectionItemLabel,
                                                            ]}>
                                                            {`${getUserName(
                                                                item.user,
                                                            )}, ${
                                                                item.role.name
                                                            }`}
                                                            {item.marked_for_deletion ? (
                                                                <Text
                                                                    style={[
                                                                        s.sectionItemLabel,
                                                                        {
                                                                            color:
                                                                                'red',
                                                                            fontSize: 10,
                                                                        },
                                                                    ]}>{`\nDeleted: ${
                                                                    item.reason
                                                                }`}</Text>
                                                            ) : null}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    }}
                                    keyExtractor={(item, index) =>
                                        item.user ? item.user.id + '' : index
                                    }
                                />
                            ) : (
                                <Text
                                    style={[
                                        s.title,
                                        {fontSize: 15, textAlign: 'center'},
                                    ]}>
                                    {t('nomembers')}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity
                            style={s.sectionItem}
                            onPress={() => {
                                this.props.navigation.navigate('EditMember', {
                                    club_id: club_id,
                                });
                            }}>
                            <View
                                style={[
                                    s.sectionItem,
                                    {flex: 1, marginLeft: 25},
                                ]}>
                                <Text
                                    style={[
                                        s.sectionItemLabel,
                                        {color: PRIMARY_COLOR},
                                    ]}>
                                    {t('selectmember')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {/*
                        <TouchableOpacity style={[s.button, { backgroundColor: PRIMARY_COLOR, marginTop: 50 }]}
                            onPress={() => {
                                this.props.navigation.goBack()
                            }}>
                            <Text style={s.btnLabel}>Änderungen speichern</Text>
                        </TouchableOpacity>
                        */}
                    </ScrollView>
                </View>
                <MemberAction
                    isVisible={this.state.showaction}
                    roles={this.props.roles}
                    club_members={this.props.club_members}
                    member={this.state.selMember}
                    searchMembers={keywoard =>
                        this.props.searchClubMembers(club_id, keywoard)
                    }
                    addMemberWithRole={(id, role) =>
                        this.props.addClubBoardMember(club_id, id, role)
                    }
                    requestRemove={(id, reason) =>
                        this.props.requestToRemoveBoardMember(
                            club_id,
                            id,
                            reason,
                        )
                    }
                    onClose={() => this.setState({showaction: false})}
                />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    club: state.club.club,
    roles: state.member.roles,
    club_members: state.member.club_members,
    board_members: state.member.board_members,
});

const mapDispatchToProps = {
    searchClubMembers,
    getClubRoles,
    getBoardMembers,
    addClubBoardMember,
    requestToRemoveBoardMember,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation(['editboard'])(EditBoard), EditBoard));
