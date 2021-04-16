import * as React from 'react';
import {
    View,
    Keyboard,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    FlatList,
    TextInput,
    ScrollView,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../../themes/colors';
import {
    searchClubMembers,
    getClubRoles,
    getBoardMembers,
    getClubMembers,
    addClubBoardMember,
    removeMemberToClub,
} from '../../../reducers/member';
import {connect} from 'react-redux';
import {MemberAction, AvatarGroup, AvatarImage} from '../../../components';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {getUserName} from '../../../utils/utils';

class EditMember extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };

    constructor(props) {
        super(props);
        const club_id = props.navigation.getParam('club_id');

        this.state = {
            loading: true,
            showaction: false,
            selMember: null,
            club_id,
            keyword: undefined,
            actionMembers: [],
        };
        props.getBoardMembers(club_id);
        props.getClubMembers(club_id, () => {
            this.setState({loading: false});
        });
        props.getClubRoles();
        props.searchClubMembers(club_id, '');
    }
    searchMemberAction(keyword) {
        const {club_id} = this.state;
        this.props.searchClubMembers(club_id, keyword, res => {
            if (res) {
                this.setState({actionMembers: res});
            }
        });
    }
    findMembers(query) {
        const {club_members} = this.props;
        if (query && query.length > 0) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            return club_members.filter(
                item => item.first_name && item.first_name.search(regex) >= 0,
            );
        }
        return club_members;
    }
    render() {
        const {t, board_members} = this.props;
        const {loading, club_id, keyword, actionMembers} = this.state;
        const members_data = this.findMembers(keyword);

        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <View style={s.topBar}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon
                                name="arrow-left"
                                color={PRIMARY_TEXT_COLOR}
                                size={30}
                            />
                        </TouchableOpacity>
                        <Text style={s.title}>{t('title')}</Text>
                    </View>
                    {loading ? (
                        <ActivityIndicator
                            style={{alignSelf: 'center', marginTop: 20}}
                            size="small"
                            color={PRIMARY_COLOR}
                        />
                    ) : (
                        <ScrollView>
                            {
                                <View style={s.section}>
                                    {members_data && members_data.length > 0 ? (
                                        <AvatarGroup data={members_data} />
                                    ) : null}
                                    <View style={s.inputContainer}>
                                        <Icon
                                            name="search"
                                            size={20}
                                            color={'#88919E'}
                                            style={s.inputIcon}
                                        />
                                        <TextInput
                                            style={s.input}
                                            placeholder={t('search')}
                                            placeholderTextColor={'#88919E'}
                                            onEndEditing={() => {
                                                Keyboard.dismiss();
                                            }}
                                            returnKeyType="search"
                                            value={keyword}
                                            onChangeText={key =>
                                                this.setState({keyword: key})
                                            }
                                        />
                                    </View>
                                    {members_data && members_data.length > 0 ? (
                                        <FlatList
                                            data={members_data}
                                            renderItem={({item}) => {
                                                const {
                                                    profile,
                                                    subscribed_membership,
                                                } = item;
                                                const board = board_members.find(
                                                    board_member =>
                                                        board_member.user &&
                                                        board_member.user.id ==
                                                            item.id,
                                                );
                                                return (
                                                    <View style={s.sectionItem}>
                                                        <View
                                                            style={{
                                                                flexDirection:
                                                                    'row',
                                                                alignItems:
                                                                    'center',
                                                            }}>
                                                            <View
                                                                style={
                                                                    s.sectionImage
                                                                }>
                                                                <AvatarImage
                                                                    user_id={item?.id}
                                                                    width={40}
                                                                    user={item}
                                                                />
                                                            </View>
                                                            <View
                                                                style={{
                                                                    flexDirection:
                                                                        'column',
                                                                    alignItems:
                                                                        'flex-start',
                                                                }}>
                                                                <Text
                                                                    style={[
                                                                        s.memberName,
                                                                    ]}>
                                                                    {getUserName(
                                                                        item,
                                                                    )}
                                                                </Text>
                                                                {board &&
                                                                board.role ? (
                                                                    <Text
                                                                        style={
                                                                            s.memberDescp
                                                                        }>
                                                                        {
                                                                            board
                                                                                .role
                                                                                .name
                                                                        }
                                                                    </Text>
                                                                ) : null}
                                                                {subscribed_membership ? (
                                                                    <Text
                                                                        style={
                                                                            s.memberDescp
                                                                        }>
                                                                        {subscribed_membership.title ===
                                                                        'Free membership'
                                                                            ? 'Mitglied'
                                                                            : subscribed_membership.title}
                                                                    </Text>
                                                                ) : null}
                                                            </View>
                                                        </View>
                                                        <TouchableOpacity
                                                            style={{
                                                                paddingVertical: 10,
                                                            }}
                                                            onPress={() => {
                                                                this.searchMemberAction(
                                                                    item.first_name,
                                                                );
                                                                this.setState({
                                                                    showaction: true,
                                                                    selMember: item,
                                                                });
                                                            }}>
                                                            <Icon
                                                                name="more-vertical"
                                                                size={25}
                                                                color={
                                                                    PRIMARY_COLOR
                                                                }
                                                                style={{
                                                                    marginLeft: 10,
                                                                }}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                );
                                            }}
                                            keyExtractor={(item, index) =>
                                                item.id + ''
                                            }
                                        />
                                    ) : (
                                        <Text
                                            style={[
                                                s.title,
                                                {
                                                    fontSize: 15,
                                                    textAlign: 'center',
                                                    marginTop: 20,
                                                },
                                            ]}>
                                            {t('nomembers')}
                                        </Text>
                                    )}
                                </View>
                            }
                        </ScrollView>
                    )}
                    {/*
                    <TouchableOpacity style={[s.button, { backgroundColor: PRIMARY_COLOR, marginTop: 20 }]}
                        onPress={() => this.props.navigation.goBack()}>
                        <Text style={s.btnLabel}>Änderungen speichern</Text>
                    </TouchableOpacity>
                    */}
                </View>
                <MemberAction
                    isVisible={this.state.showaction}
                    roles={this.props.roles}
                    club_members={actionMembers}
                    member={this.state.selMember}
                    searchMembers={keywoard =>
                        this.searchMemberAction(keywoard)
                    }
                    addMemberWithRole={(id, role) =>
                        this.props.addClubBoardMember(club_id, id, role)
                    }
                    requestRemove={(id, reason) =>
                        this.props.removeMemberToClub(club_id, id)
                    }
                    onClose={() => this.setState({showaction: false})}
                    isMember={true}
                />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    club_members: state.member.club_members,
    roles: state.member.roles,
    board_members: state.member.board_members,
});

const mapDispatchToProps = {
    getClubMembers,
    searchClubMembers,
    getClubRoles,
    addClubBoardMember,
    removeMemberToClub,
    getBoardMembers,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation(['editmember'])(EditMember), EditMember));
