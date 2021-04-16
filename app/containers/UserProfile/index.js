import * as React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    ScrollView,
    Dimensions,
    InteractionManager,
    ActivityIndicator,
} from 'react-native';
import s from './styles';
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
import Carousel, {Pagination, ParallaxImage} from 'react-native-snap-carousel';
import {
    getClubsByUser,
    getMemberOfClubs,
    getFollowedClubs,
} from '../../reducers/club';
import {getUserProfile} from '../../reducers/user';
import {connect} from 'react-redux';
// import Carousel from 'react-native-anchor-carousel';
import {getUserName} from '../../utils/utils';
import BackButton from '../../components/BackButton';
import ImageView from 'react-native-image-view';

const {width} = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const slideWidth = wp(75);
export const itemHorizontalMargin = wp(0);

export const sliderWidth = slideWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const SLIDER_1_FIRST_ITEM = 0;

class SliderEntry extends React.Component {
    render() {
        const {
            data,
            user,
            user_profile,
            clubs_user,
            member_of_clubs,
            followed_clubs,
            navigation,
            style,
        } = this.props;
        return (
            <View
                style={[
                    {
                        paddingBottom: 0,
                        paddingHorizontal: 10,
                        height: '100%',
                    },
                    style,
                ]}>
                {data.type == 'contact' && (
                    <MemberCard1
                        phone={user_profile?.phone}
                        mobile={user_profile?.mobile}
                        email={user?.email}
                        website={user_profile?.website}
                        facebook={user_profile?.facebook}
                        instagram={user_profile?.instagram}
                        linkedin={user_profile?.linkedin}
                        twitter={user_profile?.twitter}
                        xing={user_profile?.xing}
                        address={user_profile?.address}
                    />
                )}
                {data.type == 'memberclub' && (
                    <MemberCard2
                        club={data.club}
                        user={user}
                        navigation={this.props.navigation}
                    />
                )}
                {data.type == 'myclub' && (
                    <MemberCard3
                        clubs={[...clubs_user, ...member_of_clubs]}
                        navigation={navigation}
                    />
                )}
                {data.type == 'followclub' && (
                    <MemberCard4
                        clubs={followed_clubs}
                        navigation={navigation}
                    />
                )}
                {data.type == 'statistics' && (
                    <MemberCard5 statistics={user_profile?.statistics} />
                )}
            </View>
        );
    }
}
class UserProfile extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    state = {
        slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
        openAuth: false,
        loading: true,
        showImage: false,
    };
    constructor(props) {
        super(props);
        this._renderItemWithParallax = this._renderItemWithParallax.bind(this);
        if (props.user) props.getUserProfile(props.user.id);
        console.log('props.navigator', props.navigator);
    }
    _renderItemWithParallax({item, index}, parallaxProps) {
        const {
            user_profile,
            clubs_user,
            member_of_clubs,
            followed_clubs,
            user,
            navigation,
        } = this.props;
        return (
            <SliderEntry
                navigation={navigation}
                user={user}
                user_profile={user_profile}
                clubs_user={clubs_user}
                member_of_clubs={member_of_clubs}
                followed_clubs={followed_clubs}
                data={item}
                index={index}
                parallax={true}
                parallaxProps={parallaxProps}
            />
        );
    }
    goBack = () => {
        const backTo = this.props.navigation.getParam('backTo');
        if (backTo) return this.props.navigation.navigate(backTo);
        this.props.navigation.goBack();
    };
    getMapsCarousel(member_of_clubs) {
        let result = [
            {
                index: 0,
                type: 'contact',
            },
        ];
        if (member_of_clubs && member_of_clubs.length > 0) {
            console.log('getMapsCarousel -> member_of_clubs', member_of_clubs);
            result = [
                ...result,
                ...member_of_clubs.map(item => {
                    return {
                        index: `club ${item.id}`,
                        type: 'memberclub',
                        club: item,
                    };
                }),
            ];
        }
        return result;
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(async () => {
            await this.props.getClubsByUser();
            await this.props.getFollowedClubs();
            this.setState({loading: false});
        });
    }
    render() {
        const {user, user_profile, member_of_clubs} = this.props;

        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <ScrollView>
                        <View style={s.topBar}>
                            <TouchableOpacity
                                style={{borderRadius: 30, overflow: 'hidden'}}>
                                <BackButton
                                    onPress={() => this.goBack()}
                                    navigation={this.props.navigation}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={s.header}>
                            <TouchableOpacity
                                onPress={() =>
                                    this.setState({
                                        showImage: true,
                                    })
                                }
                                style={[s.avatar, {width: 100, height: 100}]}>
                                <AvatarImage
                                    uri={
                                        user_profile &&
                                        user_profile.avatar &&
                                        user_profile.avatar.original
                                    }
                                    width={100}
                                    user={user}
                                />
                            </TouchableOpacity>
                            <Text style={s.name}>{getUserName(user)}</Text>
                        </View>
                        <View style={s.carouselBody}>
                            {this.state.loading ? (
                                <ActivityIndicator color={PRIMARY_COLOR} />
                            ) : (
                                <Carousel
                                    ref={c => (this._slider5Ref = c)}
                                    data={this.getMapsCarousel(member_of_clubs)}
                                    renderItem={this._renderItemWithParallax}
                                    itemWidth={itemWidth}
                                    sliderWidth={width}
                                    hasParallaxImages={false}
                                    firstItem={SLIDER_1_FIRST_ITEM}
                                    inactiveSlideScale={0.97}
                                    inactiveSlideOpacity={1}
                                    // inactiveSlideShift={20}
                                    containerCustomStyle={s.slider}
                                    contentContainerCustomStyle={
                                        s.sliderContentContainer
                                    }
                                    loop={false}
                                    loopClonesPerSide={2}
                                    autoplay={false}
                                    onSnapToItem={index =>
                                        this.setState({
                                            slider1ActiveSlide: index,
                                        })
                                    }
                                    scrollEnabled
                                />
                            )}
                        </View>
                    </ScrollView>
                </View>
                <ImageView
                    images={[
                        {
                            source: {
                                uri:
                                    user_profile &&
                                    user_profile.avatar &&
                                    user_profile.avatar.original,
                            },
                            title: getUserName(user),
                            width: 806,
                            height: 720,
                        },
                    ]}
                    imageIndex={0}
                    isVisible={this.state.showImage}
                    onClose={() => this.setState({showImage: false})}
                />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
    user_profile: state.user.user_profile,
    clubs_user: state.club.clubs_user,
    member_of_clubs: state.club.member_of_clubs,
    followed_clubs: state.club.followed_clubs,
});

const mapDispatchToProps = {
    getClubsByUser,
    getMemberOfClubs,
    getFollowedClubs,
    getUserProfile,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserProfile);
