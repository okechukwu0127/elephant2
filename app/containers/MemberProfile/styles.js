import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';

const {width, height} = Dimensions.get('window');
const IS_IOS = Platform.OS === 'ios';
function wp(percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const slideHeight = height * 0.36;
const slideWidth = wp(70);
const itemHorizontalMargin = wp(2);

export const sliderWidth = width;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
const entryBorderRadius = 8;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#272E3F',
    },
    wrapper: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginTop: Platform.OS == 'ios' ? 45 : 5,
    },
    topBar: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 25,
    },
    header: {
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: PRIMARY_TEXT_COLOR,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    avatarimg: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    name: {
        fontSize: 28,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
        marginTop: 10,
    },
    description: {
        fontSize: 12,
        color: '#88919E',
        fontFamily: 'Rubik-Regular',
        textAlign: 'center',
        lineHeight: 20,
        marginHorizontal: 30,
        marginVertical: 15,
    },
    headerButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    joinBtn: {
        padding: 14,
        borderRadius: 10,
        backgroundColor: PRIMARY_COLOR,
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
    },
    joinBtnLabel: {
        textTransform: 'uppercase',
        fontSize: 14,
        color: 'white',
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
        letterSpacing: 2,
    },
    followBtn: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
    },
    followBtnLabel: {
        textTransform: 'uppercase',
        fontSize: 14,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
        letterSpacing: 2,
    },
    slider: {
        overflow: 'visible', // for custom animations
    },
    sliderContentContainer: {},
    slideInnerContainer: {
        width: itemWidth,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 0, // needed for shadow,
        flex: 1,
    },
    carouselBody: {
        marginTop: 10,
        marginBottom: 50,
    },
    paginationContainer: {},
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 10,
        marginHorizontal: 0,
    },
    inputContainer: {
        width: width - 40,
        backgroundColor: 'rgba(142, 142, 147, 0.12)',
        borderRadius: 50,
        paddingVertical: Platform.OS == 'ios' ? 5 : 0,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        alignSelf: 'center',
    },
    inputIcon: {
        marginRight: 5,
        width: 20,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
        paddingVertical: 5,
    },
    member: {
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 25,
        marginBottom: 20,
    },
    memberAvatar: {
        width: 35,
        height: 35,
        borderRadius: 35,
        backgroundColor: PRIMARY_TEXT_COLOR,
        marginRight: 10,
    },
    memberName: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
    },
    memberDescp: {
        fontSize: 14,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
    },
});
