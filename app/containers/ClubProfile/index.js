import * as React from 'react';
import {View, TouchableOpacity, Text, Image, ScrollView} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_TEXT_COLOR, PRIMARY_COLOR} from '../../themes/colors';
import {getClub, getClubProfile} from '../../reducers/club';
import {selectClubs, setFilterType} from '../../reducers/feed';
import {getClubFeatures} from '../../reducers/featureshop';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {showMessage} from '../../utils/utils';
import IconShop from '../../assets/icon_shop.png';
import AvatarImage from '../../components/AvatarImage';

class ClubProfile extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    constructor(props) {
        super(props);
        this.refresh();
    }
    refresh() {
        console.log('Refreshiiing');
        const club_id = this.props.navigation.getParam('club_id');
        if (club_id) {
            this.props.getClub(club_id, res => {
                if (res.deleted) {
                    const {t} = this.props;
                    showMessage(t('msg_club'));
                    this.props.navigation.goBack();
                    return;
                }
            });
            this.props.getClubProfile(club_id);
            this.props.getClubFeatures(club_id);
        }
    }
    componentDidMount() {
        this.unsubsribe = this.props.navigation.addListener('willFocus', () => {
            this.refresh();
        });
    }
    componentWillUnmount() {
        if (this.unsubsribe && typeof this.unsubsribe === 'function') {
            this.unsubsribe();
        }
    }
    render() {
        const club_id = this.props.navigation.getParam('club_id');
        const {t, subscribes, club} = this.props;
        console.log(
            '🚀 ~ file: index.js ~ line 41 ~ ClubProfile ~ render ~ subscribes',
            subscribes,
        );
        const hasZirklPay = club?.has_zirklpay;
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <ScrollView>
                        <View style={s.topBar}>
                            <Text style={s.title}>{t('title')}</Text>
                            <TouchableOpacity
                                style={{borderRadius: 30, overflow: 'hidden'}}
                                onPress={() => this.props.navigation.goBack()}>
                                <Icon
                                    name="x"
                                    color="white"
                                    size={17}
                                    style={{
                                        fontWeight: '100',
                                        backgroundColor: PRIMARY_TEXT_COLOR,
                                        width: 35,
                                        height: 35,
                                        textAlign: 'center',
                                        paddingTop: 8,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={s.sectionName}>{t('info')}</Text>
                        <View style={s.section}>
                            <TouchableOpacity
                                style={s.sectionItem}
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        'ClubEditInfo',
                                    )
                                }>
                                <AvatarImage
                                    uri={
                                        this.props.club &&
                                        this.props.club.photo &&
                                        this.props.club.photo.original
                                    }
                                    width={40}
                                    user={{
                                        first_name:
                                            this.props.club &&
                                            this.props.club.name,
                                    }}
                                    // backgroundColor={'rgba(255,255,255,0.5)'}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {t('basic')}
                                </Text>
                            </TouchableOpacity>
                            <View style={[s.sectionItem, {opacity: 0}]}>
                                <Icon
                                    name="edit"
                                    size={40}
                                    color="#642FD0"
                                    style={s.icon}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {t('editboard')}
                                </Text>
                            </View>
                            {/* <TouchableOpacity
                                style={s.sectionItem}
                                onPress={() => {}}>
                                <Icon
                                    name="settings"
                                    size={40}
                                    color="#642FD0"
                                    style={s.icon}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {t('connect-club')}
                                </Text>
                            </TouchableOpacity> */}
                            {/* <TouchableOpacity style={s.sectionItem} onPress={() => this.props.navigation.navigate('ClubAddInfo')}>
                                <Icon name="edit" size={40} color="#642FD0" style={s.icon} />
                                <Text style={s.sectionItemLabel}>{t('additional')}</Text>
                            </TouchableOpacity> */}
                        </View>
                        <Text style={s.sectionName}>{t('member')}</Text>
                        <View style={s.section}>
                            <TouchableOpacity
                                style={s.sectionItem}
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        'EditMember',
                                        {
                                            club_id: club_id,
                                        },
                                    )
                                }>
                                <Icon
                                    name="users"
                                    size={40}
                                    color="#642FD0"
                                    style={s.icon}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {t('editmember')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[s.sectionItem]}
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        'Membership',
                                        {
                                            club_id,
                                        },
                                    )
                                }>
                                <Icon
                                    name="user"
                                    size={40}
                                    color="#642FD0"
                                    style={s.icon}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {t('membership')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={s.sectionName}>{t('board')}</Text>
                        <View style={s.section}>
                            <TouchableOpacity
                                style={s.sectionItem}
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        'EditBoard',
                                        {
                                            club_id: club_id,
                                        },
                                    )
                                }>
                                <Icon
                                    name="star"
                                    size={40}
                                    color="#642FD0"
                                    style={s.icon}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {t('editboard')}
                                </Text>
                            </TouchableOpacity>
                            <View style={[s.sectionItem, {opacity: 0}]}>
                                <Icon
                                    name="edit"
                                    size={40}
                                    color="#642FD0"
                                    style={s.icon}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {t('editboard')}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Text style={s.sectionName}>{t('finance')}</Text>
                            <View
                                style={[
                                    s.section,
                                    {justifyContent: 'flex-start'},
                                ]}>
                                {hasZirklPay ? (
                                    <TouchableOpacity
                                        style={[s.sectionItem]}
                                        onPress={() =>
                                            this.props.navigation.navigate(
                                                'Contributions',
                                                {
                                                    club_id: club_id,
                                                    isZirklpay: true,
                                                },
                                            )
                                        }>
                                        <Icon
                                            name="edit"
                                            size={40}
                                            color="#642FD0"
                                            style={s.icon}
                                        />
                                        <Text style={s.sectionItemLabel}>
                                            {t('zirklpay')}
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={s.sectionItem}
                                        onPress={() =>
                                            this.props.navigation.navigate(
                                                'Contributions',
                                                {
                                                    club_id: club_id,
                                                    isZirklpay: false,
                                                },
                                            )
                                        }>
                                        <Icon
                                            name="edit"
                                            size={40}
                                            color="#642FD0"
                                            style={s.icon}
                                        />
                                        <Text style={s.sectionItemLabel}>
                                            {'Beiträge einfordern'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        <Text style={s.sectionName}>{t('featureshop')}</Text>
                        <View style={s.section}>
                            <TouchableOpacity
                                style={s.sectionItem}
                                onPress={() =>
                                    this.props.navigation.navigate(
                                        'FeatureShop',
                                        {
                                            club_id: club_id,
                                        },
                                    )
                                }>
                                <Image
                                    source={IconShop}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        resizeMode: 'contain',
                                        marginLeft: -5,
                                    }}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {t('btnFeatureshop')}
                                </Text>
                            </TouchableOpacity>
                            <View style={[s.sectionItem, {opacity: 0}]}>
                                <Icon
                                    name="edit"
                                    size={40}
                                    color="#642FD0"
                                    style={s.icon}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {t('editboard')}
                                </Text>
                            </View>
                        </View>
                        <Text style={s.sectionName}>{t('inhalt')}</Text>
                        <View style={s.inlineSection}>
                            <TouchableOpacity
                                style={s.inlineRow}
                                onPress={() =>
                                    this.props.selectClubs(
                                        [this.props.club?.id],
                                        () => {
                                            this.props.setFilterType(
                                                'all',
                                                this.props.navigation.navigate(
                                                    'Feed',
                                                ),
                                            );
                                        },
                                    )
                                }>
                                <Icon
                                    name="edit"
                                    size={22}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.inlineItem}>Entwürfe</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={s.inlineRow}
                                onPress={() =>
                                    this.props.selectClubs(
                                        [this.props.club?.id],
                                        () => {
                                            this.props.setFilterType(
                                                'news',
                                                this.props.navigation.navigate(
                                                    'Feed',
                                                ),
                                            );
                                        },
                                    )
                                }>
                                <Icon
                                    name="file-text"
                                    size={22}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.inlineItem}>News</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={s.inlineRow}
                                onPress={() =>
                                    this.props.selectClubs(
                                        [this.props.club?.id],
                                        () => {
                                            this.props.setFilterType(
                                                'event',
                                                this.props.navigation.navigate(
                                                    'Feed',
                                                ),
                                            );
                                        },
                                    )
                                }>
                                <Icon
                                    name="calendar"
                                    size={22}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.inlineItem}>Events</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={s.inlineRow}
                                onPress={() =>
                                    this.props.selectClubs(
                                        [this.props.club?.id],
                                        () => {
                                            this.props.setFilterType(
                                                'finance',
                                                this.props.navigation.navigate(
                                                    'Feed',
                                                ),
                                            );
                                        },
                                    )
                                }>
                                <Icon
                                    name="credit-card"
                                    size={22}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.inlineItem}>Finanzen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={s.inlineRow}
                                onPress={() =>
                                    this.props.selectClubs(
                                        [this.props.club?.id],
                                        () => {
                                            this.props.setFilterType(
                                                'impression',
                                                this.props.navigation.navigate(
                                                    'Feed',
                                                ),
                                            );
                                        },
                                    )
                                }>
                                <Icon
                                    name="image"
                                    size={22}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.inlineItem}>Galerie</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={s.inlineRow}
                                onPress={() =>
                                    this.props.selectClubs(
                                        [this.props.club?.id],
                                        () => {
                                            this.props.setFilterType(
                                                'post',
                                                this.props.navigation.navigate(
                                                    'Feed',
                                                ),
                                            );
                                        },
                                    )
                                }>
                                <Icon
                                    name="square"
                                    size={22}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.inlineItem}>Postings</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    club: state.club.club,
    subscribes: state.featureshop.subscribes,
});

const mapDispatchToProps = {
    getClub,
    getClubProfile,
    getClubFeatures,
    selectClubs,
    setFilterType,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation(['clubsetting'])(ClubProfile), ClubProfile));
