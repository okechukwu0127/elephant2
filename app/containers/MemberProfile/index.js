import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import s, {sliderWidth, itemWidth} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../themes/colors';
import {
    MemberCard1,
    MemberCard2,
    MemberCard3,
    MemberCard4,
    MemberCard5,
    AvatarImage,
} from '../../components';
import Carousel from 'react-native-snap-carousel';
import {
    getClubsByUser,
    getMemberOfClubs,
    getFollowedClubs,
    getMemberInfo,
} from '../../reducers/club';
import {connect} from 'react-redux';

const SLIDER_1_FIRST_ITEM = 0;

class SliderEntry extends React.Component {
    render() {
        const {
            data,
            index,
            memberinfo,
            navigation,
            clubs_user,
            member_of_clubs,
            followed_clubs,
        } = this.props;

        const member_profile = memberinfo && memberinfo.profile;
        return (
            <View style={{paddingBottom: 15, paddingHorizontal: 10}}>
                {data.type == 'contact' && (
                    <MemberCard1
                        disableShadow={this.props.disableShadow}
                        phone={member_profile && member_profile.phone}
                        mobile={member_profile && member_profile.mobile}
                        email={memberinfo && memberinfo.email}
                        street={member_profile && member_profile.street}
                        zip={member_profile && member_profile.zip}
                        city={member_profile && member_profile.city}
                        website={member_profile && member_profile.website}
                        facebook={member_profile && member_profile.facebook}
                        instagram={member_profile && member_profile.instagram}
                        linkedin={member_profile && member_profile.linkedin}
                        twitter={member_profile && member_profile.twitter}
                        xing={member_profile && member_profile.xing}
                    />
                )}
                {data.type == 'memberclub' && (
                    <MemberCard2
                        disableShadow={this.props.disableShadow}
                        club={data.club}
                        user={memberinfo}
                        navigation={this.props.navigation}
                    />
                )}
                {data.type == 'myclub' && (
                    <MemberCard3
                        clubs={[...clubs_user, ...member_of_clubs]}
                        disableShadow={this.props.disableShadow}
                        navigation={navigation}
                        hideCreateClub={true}
                    />
                )}
                {data.type == 'followclub' && (
                    <MemberCard4
                        disableShadow={this.props.disableShadow}
                        clubs={followed_clubs}
                        navigation={navigation}
                    />
                )}
                {data.type == 'statistics' && (
                    <MemberCard5
                        disableShadow={this.props.disableShadow}
                        statistics={member_profile && member_profile.statistics}
                    />
                )}
            </View>
        );
    }
}
class MemberProfile extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    constructor(props) {
        super(props);
        const member_id = props.navigation.getParam('member_id');
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            openAuth: false,
            memberinfo: null,
            myclubs: [],
            loadingClubs: true,
            loadingFollowed: true,
            loadingMyClubs: true,
            loading: true,
            member_id,
        };

        this.props.getMemberInfo(member_id, memberinfo =>
            this.setState({memberinfo, loading: false}),
        );

        this._renderItemWithParallax = this._renderItemWithParallax.bind(this);
    }
    async UNSAFE_componentWillMount() {
        const member_id = this.props.navigation.getParam('member_id');
        if (!member_id) return;
        await this.props.getClubsByUser(member_id, () => {
            this.setState({loadingClubs: false});
        });
        await this.props.getFollowedClubs(member_id, () => {
            this.setState({loadingFollowed: false});
        });
        await this.props.getMemberOfClubs(member_id, res => {
            if (res) this.setState({myclubs: res, loadingMyClubs: false});
        });
    }
    componentWillUnmount() {
        this.props.getClubsByUser();
        this.props.getFollowedClubs();
    }
    _renderItemWithParallax({item, index}, parallaxProps) {
        const {memberinfo} = this.state;
        const {
            navigation,
            clubs_user,
            member_of_clubs,
            followed_clubs,
        } = this.props;
        return (
            <SliderEntry
                data={item}
                memberinfo={memberinfo}
                clubs_user={clubs_user}
                member_of_clubs={member_of_clubs}
                followed_clubs={followed_clubs}
                navigation={navigation}
                index={index}
                parallax={true}
                parallaxProps={parallaxProps}
                disableShadow={
                    this.state.slider1ActiveSlide == index ? false : true
                }
            />
        );
    }
    getMapsCarousel(member_of_clubs) {
        let result = [
            {
                index: 0,
                type: 'contact',
            },
        ];
        if (member_of_clubs && member_of_clubs.length > 0) {
            result = [
                ...result,
                ...member_of_clubs.map(item => {
                    return {
                        index: 'club' + item.id,
                        type: 'memberclub',
                        club: item,
                    };
                }),
            ];
        }
        result = [
            ...result,
            {
                index: 2,
                type: 'myclub',
            },
            {
                index: 3,
                type: 'followclub',
            },
            {
                index: 4,
                type: 'statistics',
            },
        ];
        return result;
    }
    renderContent() {
        const {member_of_clubs} = this.props;
        const {
            memberinfo,
            myclubs,
            loadingClubs,
            loadingFollowed,
            loadingMyClubs,
        } = this.state;
        const both_clubs = member_of_clubs.filter(item =>
            myclubs.find(me => me.id === item.id),
        );
        const datasource = this.getMapsCarousel(both_clubs);
        if (loadingClubs || loadingFollowed || loadingMyClubs)
            return (
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 100,
                    }}>
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                </View>
            );

        return (
            <View style={s.carouselBody}>
                <Carousel
                    ref={c => (this._slider5Ref = c)}
                    data={datasource}
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
                    onSnapToItem={index =>
                        this.setState({slider1ActiveSlide: index})
                    }
                    scrollEnabled={true}
                />
            </View>
        );
    }
    render() {
        const {memberinfo, loading} = this.state;

        const member_profile = memberinfo && memberinfo.profile;

        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    {!loading && (
                        <ScrollView>
                            <View style={s.topBar}>
                                {/*
                            <TouchableOpacity>
                                <Icon name="settings" color={PRIMARY_TEXT_COLOR} size={30} />
                            </TouchableOpacity>
                            */}
                                <View />
                                <TouchableOpacity
                                    style={{
                                        borderRadius: 30,
                                        overflow: 'hidden',
                                    }}
                                    onPress={() =>
                                        this.props.navigation.goBack()
                                    }>
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
                            <View style={s.header}>
                                <View style={s.avatar}>
                                    <AvatarImage
                                        uri={
                                            member_profile &&
                                            member_profile.avatar &&
                                            member_profile.avatar.original
                                        }
                                        width={100}
                                        user={memberinfo}
                                    />
                                </View>
                                <Text style={s.name}>
                                    {memberinfo && memberinfo.first_name}{' '}
                                    {memberinfo && memberinfo.last_name}
                                </Text>
                            </View>
                            {this.renderContent()}
                        </ScrollView>
                    )}
                    {loading && (
                        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    )}
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    clubs_user: state.club.clubs_user,
    member_of_clubs: state.club.member_of_clubs,
    followed_clubs: state.club.followed_clubs,
});

const mapDispatchToProps = {
    getClubsByUser,
    getMemberOfClubs,
    getFollowedClubs,
    getMemberInfo,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MemberProfile);
