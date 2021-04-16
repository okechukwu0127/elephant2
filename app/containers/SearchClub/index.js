import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
    Keyboard,
} from 'react-native';
import s, {fab_width} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import {ClubCard, SettingFeed, SettingClub, BackButton} from '../../components';
import AuthModal from '../Login';
import {connect} from 'react-redux';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {
    getClubs,
    followClub,
    unfollowClub,
    clearClubs,
} from '../../reducers/club';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {showMessage} from '../../utils/utils';

class SearchClub extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerLeft: <BackButton navigation={navigation} />,
            headerRight: null,
        };
    };
    constructor(props) {
        super(props);
        const club_category_id = props.navigation.getParam('club_category_id');
        const isFetched = props.navigation.getParam('isFetched');
        this.state = {
            loadmore: false,
            isRefreshing: false,
            openAuth: false,
            visibleFeedSetting: false,
            visibleClubSetting: false,
            clubs: props.clubs,
            query: null,
            disableSetting: club_category_id || isFetched ? true : false,
        };
        this.lastParam = null;
    }
    UNSAFE_componentWillMount() {
        this.refresh();
        this.unsubsribe = this.props.navigation.addListener('willFocus', () => {
            this.refresh();
        });
    }
    refresh() {
        const club_category_id = this.props.navigation.getParam(
            'club_category_id',
        );
        console.log(
            '🚀 ~ file: index.js ~ line 67 ~ SearchClub ~ refresh ~ club_category_id',
            club_category_id,
        );
        const isFetched = this.props.navigation.getParam('isFetched');
        if (isFetched == null || !isFetched) {
            if (club_category_id) {
                this.setState({isRefreshing: true});
                this.lastParam = {
                    club_category_id,
                };
                this.props.getClubs(this.lastParam, false, () => {
                    this.setState({isRefreshing: false});
                });
                return;
            }
            if (this.state.query == null || this.state.query.length <= 0) {
                this.props.clearClubs();
            }
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.clubs != this.state.clubs) {
            this.setState({clubs: nextProps.clubs});
        }
    }
    componentWillUnmount() {
        if (this.unsubsribe && typeof this.unsubsribe === 'function') {
            this.unsubsribe();
        }
    }
    hideMenu = () => {
        this._menu && this._menu.hide();
    };
    onRefresh() {
        if (this.lastParam) {
            this.setState({isRefreshing: true}); // true isRefreshing flag for enable pull to refresh indicator
            this.props.getClubs(this.lastParam, false, () => {
                this.setState({isRefreshing: false});
            });
        }
    }
    handleLoadMore = () => {
        if (!this.state.loadmore && this.lastParam) {
            this.setState({loadmore: true});

            this.props.getClubs(this.lastParam, true, () => {
                this.setState({loadmore: false});
            });
        }
    };
    render() {
        const {t, user} = this.props;
        const {clubs, query, disableSetting} = this.state;
        return (
            <View style={s.container}>
                <View style={s.header}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {/*<BackButton navigation={this.props.navigation} style={{paddingLeft: 0, marginRight: 10}}/>*/}
                        <Text style={s.title}>{t('title')}</Text>
                    </View>
                    {/*
                        !disableSetting && this.props.user ?
                            <Menu
                                ref={_ref => this._menu = _ref}
                                button={
                                    <TouchableOpacity style={s.iconBtn}
                                        onPress={() => {
                                            this._menu && this._menu.show();
                                        }}>
                                        <Icon name="plus" size={20} color="white" style={s.icon} />
                                    </TouchableOpacity>}
                                style={{ top: 90 }}
                            >
                                <MenuItem
                                    onPress={() => {
                                        this.hideMenu();
                                        this.props.navigation.navigate('CreateClub')
                                    }}
                                    textStyle={s.menuItem}>Verein neu erfassen</MenuItem>
                            </Menu> : null
                            */}
                </View>
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
                        returnKeyType="search"
                        value={query}
                        onChangeText={query => this.setState({query})}
                        onEndEditing={() => {
                            if (query && query.length > 0) {
                                this.lastParam = {name: query};
                                this.setState({isRefreshing: true});
                                this.props.getClubs(
                                    {name: query},
                                    false,
                                    () => {
                                        this.setState({isRefreshing: false});
                                    },
                                );
                            } else {
                                this.lastParam = null;
                                this.props.clearClubs();
                            }
                        }}
                    />
                    {query && query.length > 0 ? (
                        <TouchableOpacity
                            style={{paddingVertical: 5, paddingLeft: 5}}
                            onPress={() => {
                                Keyboard.dismiss();
                                this.setState({query: null});
                                this.lastParam = null;
                                this.props.clearClubs();
                            }}>
                            <Icon
                                name="x"
                                size={15}
                                color={'#88919E'}
                                style={[
                                    s.inputIcon,
                                    {width: 15, marginRight: 0},
                                ]}
                            />
                        </TouchableOpacity>
                    ) : (
                        <View />
                    )}
                </View>
                {!this.state.isRefreshing && clubs.length <= 0 ? (
                    <Text style={s.hitlabel}>{t('noresults')}</Text>
                ) : null}
                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{flex: 1, width: '100%'}}
                    data={clubs}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh.bind(this)}
                            colors={[PRIMARY_COLOR]}
                        />
                    }
                    renderItem={({item}) => (
                        <ClubCard
                            unfold={true}
                            club={item}
                            onPress={club => {
                                if (club && club.deleted) {
                                    showMessage(
                                        'Club was deleted due to fewer members.',
                                    );
                                } else
                                    this.props.navigation.navigate(
                                        'ClubDetail',
                                        {club_id: club.id, search_param: query},
                                    );
                            }}
                        />
                    )}
                    keyExtractor={(item, index) => item.id + ''}
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
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
    clubs: state.club.clubs,
});

const mapDispatchToProps = {
    getClubs,
    followClub,
    unfollowClub,
    clearClubs,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('searchclub')(SearchClub), SearchClub));
