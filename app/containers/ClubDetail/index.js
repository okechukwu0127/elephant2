import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Keyboard,
    Image,
    Platform,
    ActivityIndicator,
} from 'react-native';
import s, {sliderWidth, itemWidth} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../themes/colors';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import AuthModal from '../Login';
import {
    getImpressionsByClubId,
    getClub,
    followClub,
    unfollowClub,
    addMemberToClub,
    removeMemberToClub,
    claimClub,
} from '../../reducers/club';
import {connect} from 'react-redux';
import {
    AvatarGroup,
    QrCodeModal,
    CardDescription,
    CardInformation,
    CardChronology,
    CardBoardMember,
    CardRules,
    CardImpressions,
    CardFinances,
} from '../../components';
import QRCode from 'react-native-qrcode-svg';
import {
    searchClubMembers,
    getClubRoles,
    addClubBoardMember,
    getClubMembers,
    getBoardMembers,
    removeMemberToClub as removeMember,
} from '../../reducers/member';
import {getFeedTimeline, selectClubs, setFilterType} from '../../reducers/feed';
import {
    checkBoardMember,
    checkCreatorClub,
    showMessage,
    getUserName,
} from '../../utils/utils';
import AppConfig from '../../config/AppConfig';
import {MemberAction, SelectMemberShip, AvatarImage} from '../../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getMembership} from '../../reducers/membership';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {withNavigationFocus} from 'react-navigation';

const SLIDER_1_FIRST_ITEM = 0;
const ENTRIES1 = [
    {
        index: 0, //desctription
    },
    {
        index: 1, //information
    },
    {
        index: 3, //board
    },
    {
        index: 4, //Rules
    },
    {
        index: 5, //Impressions
    },
    {
        index: 6, //Finances
    },
    {
        index: 2, //event/activities
    },
];
class SliderEntry extends React.Component {
    render() {
        const {
            data,
            club,
            board_members,
            isBoardMember,
            feed_timeline,
            impressions_club,
            memberships,
        } = this.props;
        return (
            <View style={{paddingBottom: 15, paddingHorizontal: 10}}>
                {data.index == 0 && (
                    <CardDescription
                        disableShadow={this.props.disableShadow}
                        club={club}
                    />
                )}
                {data.index == 1 && (
                    <CardInformation
                        disableShadow={this.props.disableShadow}
                        isBoardMember={isBoardMember}
                        club={club}
                    />
                )}
                {data.index == 2 && (
                    <CardChronology
                        disableShadow={this.props.disableShadow}
                        feed_timeline={feed_timeline}
                        selectClubs={this.props.selectClubs}
                        setFilterType={this.props.setFilterType}
                        navigation={this.props.navigation}
                        club_id={club?.id}
                    />
                )}
                {data.index == 3 && (
                    <CardBoardMember
                        disableShadow={this.props.disableShadow}
                        club={club}
                        board_members={board_members}
                        navigation={this.props.navigation}
                    />
                )}
                {data.index == 4 && (
                    <CardRules
                        disableShadow={this.props.disableShadow}
                        club={club}
                    />
                )}
                {data.index == 5 && (
                    <CardImpressions
                        disableShadow={this.props.disableShadow}
                        club={club}
                        impressions={impressions_club}
                    />
                )}
                {data.index == 6 && (
                    <CardFinances
                        disableShadow={this.props.disableShadow}
                        memberships={memberships}
                        club={club}
                    />
                )}
            </View>
        );
    }
}
class ClubDetail extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    constructor(props) {
        super(props);
        const club = props.navigation.getParam('club');
        const club_id = props.navigation.getParam('club_id');
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            openAuth: false,
            openQrcode: false,
            club: club_id ? {id: club_id} : club,
            keyword: null,
            showaction: false,
            selMember: null,
            showmembership: false,
            loading: true,
        };
        if (club_id) {
            props.getClub(club_id);
        }
        this._renderItemWithParallax = this._renderItemWithParallax.bind(this);
        //props.getClubMembers(club_id ? club_id : club?.id)
        props.getClubRoles();
        props.searchClubMembers(club_id ? club_id : club?.id, '');
        this.backup_id = club_id ? club_id : club?.id;
    }
    componentDidUpdate() {
        const club = this.props.navigation.getParam('club');
        const club_id = this.props.navigation.getParam('club_id');
        if (
            club_id !== (this.state.club ? this.state.club?.id : null) &&
            club_id &&
            !this.state._loading
        ) {
            console.log('componentDidUpdate -> club_id', club_id);
            this.setState({_loading: true});
            this.props.getClub(club_id, () => this.setState({_loading: false}));
            this.props.getClubRoles();
            this.props.searchClubMembers(club_id ? club_id : club?.id, '');
        }
    }
    async refresh(club_id) {
        console.log(
            '🚀 ~ file: index.js ~ line 199 ~ ClubDetail ~ refresh ~ club_id',
            club_id,
        );
        this.setState({loading: true});
        const {club} = this.state;
        await this.props.getFeedTimeline(
            club_id ? club_id : club && club?.id,
            res => {
                console.log('refresh -> res', res);
                if (res.notfound) {
                    const {t} = this.props;
                    showMessage(t('msg_deleted'));
                    this.goBack();
                }
            },
        );
        await this.props.searchClubMembers(club_id ? club_id : club?.id, '');
        await this.props.getBoardMembers(club_id ? club_id : club && club?.id);
        await this.props.getImpressionsByClubId(
            club_id ? club_id : club && club?.id,
        );
        await this.props.getMembership(club_id ? club_id : club && club?.id);
        this.setState({loading: false});
    }
    async componentDidMount() {
        this.refresh();
        this.unsubsribe = this.props.navigation.addListener('willFocus', () => {
            const {club} = this.state;
            const club_id = this.props.navigation.getParam('club_id');
            if (!club || club_id != club.id) {
                this.props.getClub(club_id);
                this.state.club = {id: club_id};
                this.refresh(this.club_id);
            }
        });
    }
    componentWillUnmount = () => {
        if (this.unsubsribe && typeof this.unsubsribe === 'function') {
            this.unsubsribe();
        }
    };
    _renderItemWithParallax({item, index}, parallaxProps) {
        const {club} = this.state;
        const {user, board_members, memberships} = this.props;
        const isBoardMember =
            user && user?.id && checkBoardMember(user?.id, board_members);
        return (
            <SliderEntry
                data={item}
                club={club}
                board_members={this.props.board_members}
                isBoardMember={isBoardMember}
                feed_timeline={this.props.feed_timeline}
                memberships={memberships}
                impressions_club={this.props.impressions_club}
                index={(index + 1) % 2 === 0}
                parallax={true}
                parallaxProps={parallaxProps}
                dotCount={ENTRIES1.length}
                disableShadow={
                    this.state.slider1ActiveSlide == index ? false : true
                }
                navigation={this.props.navigation}
                selectClubs={this.props.selectClubs}
                setFilterType={this.props.setFilterType}
            />
        );
    }
    UNSAFE_componentWillReceiveProps(nextprops) {
        if (nextprops.club != this.props.club) {
            if (nextprops.club && nextprops.club.deleted) {
                console.log(
                    'UNSAFE_componentWillReceiveProps -> nextprops.club',
                    nextprops,
                );
                const {t} = this.props;
                showMessage(t('msg_deleted'));
                this.goBack();
                return;
            }
            this.setState({club: nextprops.club});
        }
        if (nextprops.switchAuth != this.props.switchAuth) {
            const {club} = this.state;
            this.props.getClub(club && club?.id);
            this.refresh();
        }
    }
    findMembers(query) {
        const {club_members} = this.props;
        if (query && query.length > 0) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            return club_members.filter(
                item =>
                    (item.first_name && item.first_name.search(regex) >= 0) ||
                    (item.last_name && item.last_name.search(regex) >= 0),
            );
        }
        return club_members;
    }
    renderCarousel() {
        const {
            board_members,
            feed_timeline,
            memberships,
            impressions_club,
        } = this.props;
        const {club, loading} = this.state;
        if (loading) {
            return (
                <ActivityIndicator
                    color={PRIMARY_COLOR}
                    size="large"
                    style={{alignItems: 'center', marginVertical: 20}}
                />
            );
        }
        const club_profile = club && club.profile;
        let carousel_maps = ENTRIES1;
        if (club_profile == null || club_profile.club_status == null) {
            carousel_maps = carousel_maps.filter(item => item.index != 4);
        }
        if (feed_timeline == null || feed_timeline.length <= 0) {
            carousel_maps = carousel_maps.filter(item => item.index != 2);
        }
        if (memberships == null || memberships.length <= 0) {
            carousel_maps = carousel_maps.filter(item => item.index != 6);
        }
        if (board_members.length <= 0) {
            carousel_maps = carousel_maps.filter(item => item.index != 3);
        }
        if (impressions_club.length <= 0) {
            carousel_maps = carousel_maps.filter(item => item.index != 5);
        }

        return (
            <View
                style={s.carouselBody}
                onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    this.carouselview = layout.y + layout.height - 20;
                }}>
                <Carousel
                    ref={c => (this._slider5Ref = c)}
                    data={carousel_maps}
                    renderItem={this._renderItemWithParallax}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    hasParallaxImages={false}
                    firstItem={SLIDER_1_FIRST_ITEM}
                    inactiveSlideScale={0.97}
                    inactiveSlideOpacity={1}
                    // inactiveSlideShift={20}
                    containerCustomStyle={s.slider}
                    contentContainerCustomStyle={s.sliderContentContainer}
                    loop={false}
                    loopClonesPerSide={2}
                    autoplay={false}
                    autoplayDelay={500}
                    autoplayInterval={3000}
                    onSnapToItem={index =>
                        this.setState({slider1ActiveSlide: index})
                    }
                    scrollEnabled={true}
                />
                <Pagination
                    dotsLength={carousel_maps.length}
                    activeDotIndex={this.state.slider1ActiveSlide}
                    containerStyle={s.paginationContainer}
                    dotColor={PRIMARY_COLOR}
                    dotStyle={s.paginationDot}
                    inactiveDotColor={'#C4C4C4'}
                    inactiveDotOpacity={1}
                    inactiveDotScale={1}
                    carouselRef={this._slider5Ref}
                    tappableDots={!!this._slider5Ref}
                />
            </View>
        );
    }

    goBack = () =>
        this.props.navigation.getParam('backTo')
            ? this.props.navigation.navigate(
                  this.props.navigation.getParam('backTo'),
              )
            : this.props.navigation.goBack();

    render() {
        const {t, user, board_members} = this.props;
        const {club, keyword} = this.state;
        const profile = club && club.profile;
        const showMembers =
            (club && club.creator && user && club.creator?.id == user?.id) ||
            club?.is_user_member_of_club;

        const members_data = this.findMembers(keyword);
        const isBoardMember =
            user && user?.id && checkBoardMember(user?.id, board_members);
        const isCreator = user && user?.id && checkCreatorClub(user?.id, club);
        if (!club)
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                </View>
            );
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps="handled"
                        ref={ref => {
                            this.scroll = ref;
                        }}>
                        <View style={s.topBar}>
                            <TouchableOpacity
                                style={{borderRadius: 30, overflow: 'hidden'}}
                                onPress={() => this.goBack()}>
                                <Icon
                                    name="arrow-left"
                                    color={PRIMARY_TEXT_COLOR}
                                    size={30}
                                />
                            </TouchableOpacity>
                            {(isCreator || isBoardMember) && (
                                <TouchableOpacity
                                    style={s.filtertype}
                                    onPress={() =>
                                        this.props.navigation.navigate(
                                            'ClubProfile',
                                            {club_id: club?.id},
                                        )
                                    }>
                                    <Icon
                                        name="settings"
                                        color={PRIMARY_TEXT_COLOR}
                                        size={30}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={s.header}>
                            <TouchableOpacity
                                style={s.qrcodeBtn}
                                onPress={() =>
                                    this.setState({openQrcode: true})
                                }>
                                <QRCode
                                    value={`zirkl://club/${club?.id}`}
                                    size={30}
                                    color="black"
                                    backgroundColor="white"
                                />
                            </TouchableOpacity>
                            <View style={s.avatar}>
                                {club && club.photo && club.photo.original && (
                                    <Image
                                        source={{uri: club.photo.original}}
                                        style={s.avatarImg}
                                    />
                                )}
                            </View>
                            <Text style={s.name}>{club && club.name}</Text>
                            <Text style={s.description}>
                                {profile && profile.short_description}
                            </Text>
                            {!this.state.loading &&
                                !isCreator &&
                                !club.is_user_member_of_club &&
                                !club.is_user_following_this_club && (
                                    <>
                                        {club.claimed_at && club.claimed_by ? (
                                            <View style={s.headerButton}>
                                                <TouchableOpacity
                                                    style={
                                                        club &&
                                                        club.is_user_member_of_club
                                                            ? s.followBtn
                                                            : s.joinBtn
                                                    }
                                                    onPress={() => {
                                                        if (user) {
                                                            if (
                                                                club &&
                                                                club.is_user_member_of_club
                                                            )
                                                                this.props.removeMemberToClub(
                                                                    club?.id,
                                                                );
                                                            else {
                                                                if (
                                                                    club.has_active_membership_plans
                                                                ) {
                                                                    this.setState(
                                                                        {
                                                                            showmembership: true,
                                                                        },
                                                                    );
                                                                    return;
                                                                } else
                                                                    this.props.addMemberToClub(
                                                                        club?.id,
                                                                    );
                                                            }
                                                            this.setState({
                                                                club: {
                                                                    ...club,
                                                                    is_user_member_of_club: !club?.is_user_member_of_club,
                                                                },
                                                            });
                                                        } else
                                                            this.setState({
                                                                openAuth: true,
                                                            });
                                                    }}>
                                                    <Text
                                                        style={
                                                            club &&
                                                            club.is_user_member_of_club
                                                                ? s.followBtnLabel
                                                                : s.joinBtnLabel
                                                        }>
                                                        {club &&
                                                        club.is_user_member_of_club
                                                            ? t('leave')
                                                            : t('join')}
                                                    </Text>
                                                </TouchableOpacity>
                                                {!isBoardMember && (
                                                    <TouchableOpacity
                                                        style={
                                                            club &&
                                                            club.is_user_following_this_club
                                                                ? s.followBtn
                                                                : s.joinBtn
                                                        }
                                                        onPress={() => {
                                                            if (user) {
                                                                if (
                                                                    club &&
                                                                    club.is_user_following_this_club
                                                                )
                                                                    this.props.unfollowClub(
                                                                        club?.id,
                                                                        () => {},
                                                                        this.props.navigation.getParam(
                                                                            'search_param',
                                                                        ),
                                                                    );
                                                                else
                                                                    this.props.followClub(
                                                                        club?.id,
                                                                        () => {},
                                                                        this.props.navigation.getParam(
                                                                            'search_param',
                                                                        ),
                                                                    );
                                                                this.setState({
                                                                    club: {
                                                                        ...club,
                                                                        is_user_following_this_club: !club.is_user_following_this_club,
                                                                    },
                                                                });
                                                            } else
                                                                this.setState({
                                                                    openAuth: true,
                                                                });
                                                        }}>
                                                        <Text
                                                            style={
                                                                club &&
                                                                club.is_user_following_this_club
                                                                    ? s.followBtnLabel
                                                                    : s.joinBtnLabel
                                                            }>
                                                            {club &&
                                                            club.is_user_following_this_club
                                                                ? t('unfollow')
                                                                : t('follow')}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        ) : (
                                            <View style={s.headerButton}>
                                                <TouchableOpacity
                                                    style={s.joinBtn}
                                                    onPress={() => {
                                                        if (user) {
                                                            this.props.claimClub(
                                                                club?.id,
                                                                res => {
                                                                    if (res) {
                                                                        this.setState(
                                                                            {
                                                                                club: res,
                                                                            },
                                                                        );
                                                                    }
                                                                },
                                                            );
                                                        } else
                                                            this.setState({
                                                                openAuth: true,
                                                            });
                                                    }}>
                                                    <Text
                                                        style={s.joinBtnLabel}>
                                                        {t('claim')}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </>
                                )}
                        </View>
                        {this.renderCarousel()}
                        {showMembers && (
                            <View>
                                <View>
                                    <Text style={s.memberLabel}>
                                        {t('members')}
                                    </Text>
                                    <AvatarGroup data={members_data} />
                                </View>
                                {((members_data && members_data.length > 0) ||
                                    (keyword && keyword.length > 0)) && (
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
                                                setTimeout(() => {
                                                    //this.scroll.scrollTo({ x: 0, y: this.carouselview, animated: true })
                                                    this.scroll &&
                                                        this.scroll.scrollToPosition(
                                                            0,
                                                            this.carouselview,
                                                        );
                                                }, 50);
                                            }}
                                            returnKeyType="search"
                                            value={keyword}
                                            onChangeText={key =>
                                                this.setState({keyword: key})
                                            }
                                        />
                                    </View>
                                )}
                                {members_data.map(item => {
                                    const {
                                        profile,
                                        subscribed_membership,
                                    } = item;
                                    const board = board_members.find(
                                        board_member =>
                                            board_member.user &&
                                            board_member.user?.id == item?.id,
                                    );
                                    return (
                                        <TouchableOpacity
                                            key={item?.id + ''}
                                            style={s.member}
                                            onPress={() =>
                                                item?.id === user?.id
                                                    ? this.props.navigation.navigate(
                                                          'UserProfile',
                                                          {
                                                              backTo:
                                                                  'ClubDetail',
                                                          },
                                                      )
                                                    : this.props.navigation.navigate(
                                                          'MemberProfile',
                                                          {member_id: item?.id},
                                                      )
                                            }>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}>
                                                <View style={s.memberAvatar}>
                                                    <AvatarImage
                                                        user_id={item.id}
                                                        width={35}
                                                        user={item}
                                                    />
                                                </View>
                                                <View>
                                                    <Text style={s.memberName}>
                                                        {getUserName(item)}
                                                    </Text>
                                                    {board && board.role ? (
                                                        <Text
                                                            style={
                                                                s.memberDescp
                                                            }>
                                                            {board.role.name}
                                                        </Text>
                                                    ) : subscribed_membership ? (
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
                                            {/*
                                                    (isCreator || isBoardMember) &&
                                                    <TouchableOpacity style={{ paddingVertical: 10 }}
                                                        onPress={() => {
                                                            this.props.searchClubMembers(club?.id, '')
                                                            this.setState({ showaction: true, selMember: item })
                                                        }}>
                                                        <Icon name="more-vertical" size={25} color={PRIMARY_COLOR} style={{ marginLeft: 10 }} />
                                                    </TouchableOpacity>
                                                    */}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </KeyboardAwareScrollView>
                </View>
                <AuthModal
                    isVisible={this.state.openAuth}
                    onClose={() => this.setState({openAuth: false})}
                    navigation={this.props.navigation}
                    nextAfterLogin={`ClubDetail:${club?.id}`}
                />
                <QrCodeModal
                    club={club}
                    isVisible={this.state.openQrcode}
                    onClose={() => this.setState({openQrcode: false})}
                />
                <MemberAction
                    isVisible={this.state.showaction}
                    roles={this.props.roles}
                    club_members={this.props.club_members}
                    member={this.state.selMember}
                    searchMembers={keywoard =>
                        this.props.searchClubMembers(club?.id, keywoard)
                    }
                    addMemberWithRole={(id, role) =>
                        this.props.addClubBoardMember(club?.id, id, role)
                    }
                    requestRemove={(id, reason) =>
                        this.props.removeMember(club?.id, id)
                    }
                    onClose={() => this.setState({showaction: false})}
                />
                <SelectMemberShip
                    club_id={club?.id}
                    isVisible={this.state.showmembership}
                    onClose={() => this.setState({showmembership: false})}
                    onAddMembership={membership_id => {
                        this.setState(
                            {
                                showmembership: false,
                                club: {
                                    ...club,
                                    is_user_member_of_club: true,
                                },
                            },
                            () => {
                                this.props.addMemberToClub(
                                    club?.id,
                                    membership_id,
                                );
                            },
                        );
                    }}
                />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
    club: state.club.club,
    club_members: state.member.club_members,
    board_members: state.member.board_members,
    feed_timeline: state.feed.feed_timeline,
    impressions_club: state.club.impressions_club,
    roles: state.member.roles,
    memberships: state.membership.memberships,
    switchAuth: state.user.switchAuth,
});

const mapDispatchToProps = {
    followClub,
    unfollowClub,
    addMemberToClub,
    removeMemberToClub,
    getClubMembers,
    getBoardMembers,
    getFeedTimeline,
    getClub,
    getImpressionsByClubId,
    searchClubMembers,
    addClubBoardMember,
    getClubRoles,
    removeMember,
    claimClub,
    getMembership,
    setFilterType,
    selectClubs,
};
const wrapComponent = withNavigationFocus(ClubDetail);
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('clubdetails')(wrapComponent), wrapComponent));
