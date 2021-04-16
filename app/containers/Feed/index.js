import React from 'react';
import {
    FlatList,
    ActivityIndicator,
    View,
    Text,
    Image,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../themes/colors';
import {
    FeedCardEvent,
    FeedCardNews,
    FeedCardInvoice,
    FeedCardInvoiceMember,
    FeedCardPromote,
    FeedCardAddedFeature,
    SettingFeed,
    SettingClub,
    FeedCardPost,
    FeedCardImpression,
    CommentInput,
    EventMembers,
} from '../../components';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {connect} from 'react-redux';
import {
    getUserFeed,
    updateUserFeed,
    selectClubs,
    setFilterType,
} from '../../reducers/feed';
import moment from 'moment';
import ImageDivider from '../../assets/feed-divider.png';
import {likePost, commentPost} from '../../reducers/post';
import {likeImpression, commentImpression} from '../../reducers/impression';
import {
    addAttendeeToEvent,
    removeAttendeeToEvent,
    confirmAttendance,
    likeEvent,
    commentEvent,
} from '../../reducers/event';
import {getClubsByUser, castVoteForDeletion} from '../../reducers/club';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {likeNews, commentNews} from '../../reducers/news';
import {feed_item_types} from '../../constants';

class Feed extends React.Component {
    focusListener = null;
    state = {
        loadmore: false,
        isRefreshing: true,
        visibleFeedSetting: false,
        visibleClubSetting: false,
        visibleEventMember: false,
        visibleFeedMenu: false,
        filter_type: 'all',
        unfold: false,
        openCommentInput: false,
        selFeed: null,
        open_cards: [],
    };
    hideMenu = () => {
        this._menu && this._menu.hide();
    };
    constructor(props) {
        super(props);
        this.todaydivider = 0;
    }
    UNSAFE_componentWillMount() {
        const {user} = this.props;
        if (!user) {
            this.props.navigation.navigate('DiscoverTab');
            return;
        }
        this.onRefresh();
        this.focusListener = this.props.navigation.addListener(
            'willFocus',
            () => {
                if (!user) {
                    this.props.navigation.navigate('DiscoverTab');
                    return;
                }
                this.onRefresh();
            },
        );
    }
    componentWillUnmount() {
        // this.focusListener && this.focusListener.remove();
    }
    feedmap(user_feed) {
        let added_divider = false;
        this.todaydivider = 0;
        const {filter_type} = this.props;
        let result =
            filter_type.toLowerCase() == 'all'
                ? user_feed
                : user_feed.filter(item =>
                      item.feed_item_type.includes(filter_type.toLowerCase()),
                  );

        // Filtering out feed items that we dont show
        result = result.filter(item => {
            if (item?.feed_item_type !== 'zirklpay-invoice') return true;
            return item?.content?.status !== 'draft';
        });

        // Filtering out draft invoices
        result = result.filter(item => {
            return feed_item_types.includes(item?.feed_item_type);
        });

        // Sorting the array by dates, and using events' start_at instead of created_at
        result = result.sort((a, b) => {
            const dateA =
                a.feed_item_type === 'event'
                    ? a.content?.start_at
                    : a.created_at;
            const dateB =
                b.feed_item_type === 'event'
                    ? b.content?.start_at
                    : b.created_at;

            return new Date(dateB) - new Date(dateA);
        });

        return result.map((item, index) => {
            const diff = moment().diff(
                moment(
                    item.feed_item_type === 'event'
                        ? item.content?.start_at
                        : item.created_at,
                ),
                'days',
            );
            if (diff > 0 && !added_divider) {
                added_divider = true;
                this.todaydivider = index;
                return {
                    ...item,
                    divider: true,
                };
            }
            return item;
        });
    }
    updateComment(event) {
        const new_feeds = this.props.user_feed.map(feed => {
            if (feed.id == event.id && feed.content) {
                return {
                    ...feed,
                    content: {
                        ...feed.content,
                        count_comments:
                            parseInt(feed.content.count_comments, 10) + 1,
                    },
                };
            }
            return feed;
        });
        this.props.updateUserFeed(new_feeds);
    }
    submitComment = (comment, callback = null) => {
        if (comment && comment.length > 0) {
            const {type, data} = this.state.selFeed;
            const {content} = data;
            if (content) {
                const {club} = content;
                this.updateComment(data);
                if (type == 'news') {
                    this.props.commentNews(
                        club && club.id,
                        content.id,
                        comment,
                        callback,
                    );
                } else if (type == 'post') {
                    this.props.commentPost(
                        club && club.id,
                        content.id,
                        comment,
                    );
                } else if (type == 'impression') {
                    this.props.commentImpression(
                        club && club.id,
                        content.id,
                        comment,
                        callback,
                    );
                } else if (type == 'event') {
                    this.props.commentEvent(
                        club && club.id,
                        content.id,
                        comment,
                        callback,
                    );
                }
            } else alert('Invalid content');
        }
    };
    confirmAttendance(event) {
        const {content} = event;
        this.updateEvent(event, 'attending');
        this.props.confirmAttendance(content.id, res => {
            if (!res) this.updateEvent(event, 'interested');
        });
    }
    joinToEvent(event, isJoin, callback = false) {
        const {content} = event;
        this.updateEvent(event, 'interested');
        if (isJoin) {
            this.props.addAttendeeToEvent(content.id, res => {
                if (!res) this.updateEvent(event, 'interested');
                if (callback) callback(res);
            });
        } else {
            this.props.removeAttendeeToEvent(content.id, res => {
                if (!res) this.updateEvent(event, 'interested');
                if (callback) callback(res);
            });
        }
    }
    updateFeedItem(data) {
        const new_feeds = this.props.user_feed.map(feed => {
            if (data.id == feed.id) {
                return data;
            }
            return feed;
        });
        this.props.updateUserFeed(new_feeds);
    }
    updateEvent(event, fieldname) {
        const new_feeds = this.props.user_feed.map(feed => {
            if (feed.id == event.id && feed.content) {
                return {
                    ...feed,
                    content: {
                        ...feed.content,
                        [fieldname]: !feed.content[fieldname],
                    },
                };
            }
            return feed;
        });
        this.props.updateUserFeed(new_feeds);
    }
    handleLoadMore = () => {
        if (!this.state.loadmore) {
            this.setState({loadmore: true});
            this.props.getUserFeed(true, () => {
                this.setState({loadmore: false});
            });
        }
    };
    onRefresh() {
        this.setState({isRefreshing: true}); // true isRefreshing flag for enable pull to refresh indicator
        this.props.getUserFeed(false, () => {
            this.setState({isRefreshing: false});
        });
        this.props.getClubsByUser();
    }
    updateLike(event) {
        const new_feeds = this.props.user_feed.map(feed => {
            if (feed.id == event.id && feed.content) {
                return {
                    ...feed,
                    content: {
                        ...feed.content,
                        liked: !feed.content.liked,
                        count_likes:
                            parseInt(feed.content.count_likes, 10) +
                            (feed.content.liked ? -1 : 1),
                    },
                };
            }
            return feed;
        });
        this.props.updateUserFeed(new_feeds);
    }
    onLike(type, event) {
        const backup_feed = [...this.props.user_feed];
        this.updateLike(event);
        const {content} = event;
        if (content) {
            const {club} = content;
            if (type == 'news') {
                this.props.likeNews(club.id, content.id, true, res => {
                    if (!res) this.props.updateUserFeed(backup_feed);
                });
            } else if (type == 'event') {
                this.props.likeEvent(club.id, content.id, true, res => {
                    if (!res) this.props.updateUserFeed(backup_feed);
                });
            } else if (type == 'post') {
                this.props.likePost(club.id, content.id, true, res => {
                    if (!res) this.props.updateUserFeed(backup_feed);
                });
            } else if (type == 'impression') {
                this.props.likeImpression(club.id, content.id, true, res => {
                    if (!res) this.props.updateUserFeed(backup_feed);
                });
            }
        }
    }
    renderFooter = () => {
        if (!this.state.loadmore) return null;
        return (
            <ActivityIndicator
                color={PRIMARY_COLOR}
                style={{marginBottom: 10}}
            />
        );
    };
    openCard(id) {
        const {open_cards} = this.state;
        if (open_cards.includes(id)) {
            this.setState({
                open_cards: open_cards.filter(item => item != id),
            });
        } else this.setState({open_cards: [...open_cards, id]});
    }
    updateVote(event, vote) {
        const new_feeds = this.props.user_feed.map(feed => {
            if (feed.id == event.id && feed.content) {
                return {
                    ...feed,
                    content: {
                        ...feed.content,
                        voted_for_deletion: vote ? true : false,
                    },
                };
            }
            return feed;
        });
        this.props.updateUserFeed(new_feeds);
    }
    clearParams(param) {
        this.props.navigation.setParams({[param]: null});
    }
    render() {
        const {t, user_feed, user, filter_type} = this.props;
        const {unfold} = this.state;
        const datasource = this.feedmap(user_feed);
        return (
            <View style={s.container}>
                <View style={s.header}>
                    <Text style={s.title}>{t('title')}</Text>
                    {this.props.club_id && (
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                this.setState({club_id: null}, () => {
                                    this.props.selectClubs([]);
                                    this.onRefresh();
                                    this.props.navigation.navigate(
                                        'DiscoverTab',
                                    );
                                });
                            }}>
                            <Text
                                style={{
                                    fontFamily: 'Rubik-Regular',
                                    fontSize: 18,
                                    marginRight: 7,
                                }}>
                                {/* {this.props.club_name} */}
                            </Text>
                            <Icon
                                name="x"
                                size={25}
                                color={PRIMARY_TEXT_COLOR}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={s.filterform}>
                    <Menu
                        ref={_ref => (this._filtermenu = _ref)}
                        button={
                            <TouchableOpacity
                                style={s.filtertype}
                                onPress={() =>
                                    this._filtermenu && this._filtermenu.show()
                                }>
                                <Icon
                                    name="filter"
                                    size={15}
                                    color={PRIMARY_TEXT_COLOR}
                                />
                                <Text
                                    style={[
                                        s.filterLabel,
                                        {marginLeft: 10, marginRight: 5},
                                    ]}>
                                    {filter_type === 'zirklpay'
                                        ? t('finance')
                                        : filter_type === 'club'
                                        ? t('post')
                                        : t(filter_type)}
                                </Text>
                                <Icon
                                    name="chevron-down"
                                    size={15}
                                    color={PRIMARY_TEXT_COLOR}
                                />
                            </TouchableOpacity>
                        }
                        style={{top: 130}}>
                        <MenuItem
                            onPress={() => {
                                this._filtermenu && this._filtermenu.hide();
                                this.props.setFilterType('all');
                            }}
                            textStyle={s.menuItem}>
                            {t('all')}
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem
                            onPress={() => {
                                this._filtermenu && this._filtermenu.hide();
                                this.props.setFilterType('news');
                            }}
                            textStyle={s.menuItem}>
                            {t('news')}
                        </MenuItem>
                        <MenuItem
                            onPress={() => {
                                this._filtermenu && this._filtermenu.hide();
                                this.props.setFilterType('event');
                            }}
                            textStyle={s.menuItem}>
                            {t('event')}
                        </MenuItem>
                        <MenuItem
                            onPress={() => {
                                this._filtermenu && this._filtermenu.hide();
                                this.props.setFilterType('impression');
                            }}
                            textStyle={s.menuItem}>
                            {t('impression')}
                        </MenuItem>
                        <MenuItem
                            onPress={() => {
                                this._filtermenu && this._filtermenu.hide();
                                this.props.setFilterType('club');
                            }}
                            textStyle={s.menuItem}>
                            {t('post')}
                        </MenuItem>
                        <MenuItem
                            onPress={() => {
                                this._filtermenu && this._filtermenu.hide();
                                this.props.setFilterType('zirklpay');
                            }}
                            textStyle={s.menuItem}>
                            {t('finance')}
                        </MenuItem>
                    </Menu>
                    <TouchableOpacity
                        style={s.filtertype}
                        onPress={() => {
                            const {open_cards} = this.state;
                            this.setState({
                                unfold: !unfold,
                                open_cards: unfold ? [] : open_cards,
                            });
                        }}>
                        <Text style={s.filterLabel}>
                            {unfold ? t('fold') : t('unfold')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={s.filtertype}
                        onPress={() => {
                            try {
                                this.flatList_Ref.scrollToIndex({
                                    animated: true,
                                    index:
                                        this.todaydivider > 0
                                            ? this.todaydivider - 1
                                            : 0,
                                });
                            } catch (error) {
                                return error;
                            }
                        }}>
                        <Text style={s.filterLabel}>{t('today')}</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={{flex: 1, width: '100%'}}
                    data={datasource}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh.bind(this)}
                            colors={[PRIMARY_COLOR]}
                        />
                    }
                    renderItem={({item}) => {
                        const {open_cards} = this.state;
                        const opencard = unfold || open_cards.includes(item.id);

                        // let child = <FeedCard2 data={item} />;
                        let child = null;
                        switch (item.feed_item_type) {
                            case 'club-feature': {
                                child = (
                                    <FeedCardAddedFeature
                                        unfold={opencard}
                                        data={item}
                                        navigation={this.props.navigation}
                                        openCard={data => this.openCard(data)}
                                    />
                                );
                                break;
                            }
                            case 'club-board-member': {
                                child = (
                                    <FeedCardPromote
                                        unfold={opencard}
                                        data={item}
                                        navigation={this.props.navigation}
                                        openCard={data => this.openCard(data)}
                                    />
                                );
                                break;
                            }
                            case 'event': {
                                child = (
                                    <FeedCardEvent
                                        unfold={opencard}
                                        data={item}
                                        user={user}
                                        navigation={this.props.navigation}
                                        onOpenAttendees={event =>
                                            this.setState({
                                                visibleEventMember: true,
                                                selFeed: event,
                                            })
                                        }
                                        joinToEvent={(event, isJoin) =>
                                            this.joinToEvent(event, isJoin)
                                        }
                                        confirmAttende={event =>
                                            this.confirmAttendance(event)
                                        }
                                        openCard={data => this.openCard(data)}
                                        onLike={data =>
                                            this.onLike('event', data)
                                        }
                                        onComment={data => {
                                            this.setState({
                                                selFeed: {
                                                    type: 'event',
                                                    data,
                                                },
                                            });
                                            this.props.navigation.navigate(
                                                'Comments',
                                                {
                                                    type: 'event',
                                                    data,
                                                    onComment: this.submitComment.bind(
                                                        this,
                                                    ),
                                                },
                                            );
                                        }}
                                    />
                                );
                                break;
                            }
                            case 'impression': {
                                child = (
                                    <FeedCardImpression
                                        unfold={opencard}
                                        data={item}
                                        onLike={data =>
                                            this.onLike('impression', data)
                                        }
                                        onComment={data => {
                                            this.setState({
                                                selFeed: {
                                                    type: 'impression',
                                                    data,
                                                },
                                            });
                                            this.props.navigation.navigate(
                                                'Comments',
                                                {
                                                    type: 'impression',
                                                    data,
                                                    onComment: this.submitComment.bind(
                                                        this,
                                                    ),
                                                },
                                            );
                                        }}
                                        openCard={data => this.openCard(data)}
                                        navigation={this.props.navigation}
                                        user={this.props.user}
                                    />
                                );
                                break;
                            }
                            case 'news': {
                                child = (
                                    <FeedCardNews
                                        unfold={opencard}
                                        data={item}
                                        user={user}
                                        openCard={data => this.openCard(data)}
                                        onLike={data =>
                                            this.onLike('news', data)
                                        }
                                        navigation={this.props.navigation}
                                        onComment={data => {
                                            this.setState({
                                                selFeed: {
                                                    type: 'news',
                                                    data,
                                                },
                                            });
                                            this.props.navigation.navigate(
                                                'Comments',
                                                {
                                                    type: 'news',
                                                    data,
                                                    onComment: this.submitComment.bind(
                                                        this,
                                                    ),
                                                },
                                            );
                                        }}
                                    />
                                );
                                break;
                            }
                            case 'post': {
                                child = (
                                    <FeedCardPost
                                        unfold={opencard}
                                        data={item}
                                        onLike={data =>
                                            this.onLike('post', data)
                                        }
                                        onComment={data => {
                                            this.setState({
                                                selFeed: {
                                                    type: 'post ',
                                                    data,
                                                },
                                                openCommentInput: true,
                                            });
                                        }}
                                        openCard={data => this.openCard(data)}
                                    />
                                );
                                break;
                            }
                            case 'zirklpay-invoice-member': {
                                child = (
                                    <FeedCardInvoiceMember
                                        unfold={opencard}
                                        data={item}
                                        openCard={data => this.openCard(data)}
                                        navigation={this.props.navigation}
                                    />
                                );
                                break;
                            }
                            case 'zirklpay-invoice': {
                                child = (
                                    <FeedCardInvoice
                                        unfold={opencard}
                                        data={item}
                                        containerStyle={{marginHorizontal: 25}}
                                        openCard={data => this.openCard(data)}
                                    />
                                );
                                break;
                            }
                            // case 'club': {
                            //     child = (
                            //         <ClubCard
                            //             unfold={opencard}
                            //             club={item.content}
                            //             containerStyle={{marginHorizontal: 25}}
                            //             onPress={club =>
                            //                 item.content &&
                            //                 this.props.navigation.navigate(
                            //                     'ClubDetail',
                            //                     {
                            //                         club: item.content,
                            //                     },
                            //                 )
                            //             }
                            //             feed={item}
                            //             openCard={data => this.openCard(data)}
                            //             castVote={(feed, vote) => {
                            //                 const backup_feed = [
                            //                     ...this.props.user_feed,
                            //                 ];
                            //                 this.updateVote(feed, vote);
                            //                 this.props.castVoteForDeletion(
                            //                     feed.content.id,
                            //                     vote,
                            //                     res => {
                            //                         if (!res)
                            //                             this.props.updateUserFeed(
                            //                                 backup_feed,
                            //                             );
                            //                     },
                            //                 );
                            //             }}
                            //         />
                            //     );
                            //     break;
                            // }
                            default: {
                            }
                        }
                        return (
                            child && (
                                <View>
                                    {item.divider ? (
                                        <Image
                                            source={ImageDivider}
                                            style={s.divider}
                                        />
                                    ) : null}
                                    {child}
                                </View>
                            )
                        );
                    }}
                    keyExtractor={(item, index) => item.id + ''}
                    ref={ref => {
                        this.flatList_Ref = ref;
                    }}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    onEndReachedThreshold={0.4}
                    onEndReached={this.handleLoadMore.bind(this)}
                />
                <SettingFeed
                    onClose={() => this.setState({visibleFeedSetting: false})}
                    isVisible={this.state.visibleFeedSetting}
                    navigation={this.props.navigation}
                />
                <SettingClub
                    onClose={() => this.setState({visibleClubSetting: false})}
                    isVisible={this.state.visibleClubSetting}
                    navigation={this.props.navigation}
                />
                <CommentInput
                    isVisible={this.state.openCommentInput}
                    onClose={() => this.setState({openCommentInput: false})}
                    onSubmit={comment => {
                        this.submitComment(comment);
                    }}
                />
                <EventMembers
                    isVisible={this.state.visibleEventMember}
                    event={this.state.selFeed}
                    onClose={() => this.setState({visibleEventMember: false})}
                />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
    user_feed: state.feed.user_feed,
    clubs_user: state.club.clubs_user,
    member_of_clubs: state.club.member_of_clubs,
    club_id: state.feed.selected_clubs && state.feed.selected_clubs[0],
    club_name: state.feed.club_name,
    filter_type: state.feed.filter_type,
});

const mapDispatchToProps = {
    getUserFeed,
    likePost,
    commentPost,
    updateUserFeed,
    likeImpression,
    commentImpression,
    addAttendeeToEvent,
    removeAttendeeToEvent,
    confirmAttendance,
    getClubsByUser,
    likeNews,
    commentNews,
    likeEvent,
    commentEvent,
    castVoteForDeletion,
    selectClubs,
    setFilterType,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('feedpage')(Feed), Feed));
