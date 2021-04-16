import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';

const {width, height} = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const slideWidth = wp(75);
export const itemHorizontalMargin = wp(0);

export const sliderWidth = slideWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

export default StyleSheet.create({
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
    title: {
        fontSize: 28,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
    },
    topBar: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 25,
        marginBottom: 40,
    },
    header: {
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 100,
        backgroundColor: PRIMARY_TEXT_COLOR,
        alignSelf: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    name: {
        fontSize: 12,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 35,
    },
    section: {
        borderTopColor: '#E5E5E5',
        borderTopWidth: 1,
        paddingHorizontal: 25,
        paddingVertical: 8,
    },
    sectionName: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        paddingLeft: 24,
        paddingBottom: 7,
    },
    sectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionItemLabel: {
        fontSize: 12,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
        marginLeft: 15,
        paddingVertical: 10,
    },
    version: {
        color: '#88919E',
        fontSize: 12,
        fontFamily: 'Rubik-Regular',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 10,
    },
    camera: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 20,
        padding: 5,
        alignSelf: 'center',
        opacity: 1,
    },
    avatarImage: {
        resizeMode: 'cover',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 80,
        height: 80,
    },
    connectContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    connectText: {
        fontSize: 18,
        textAlign: 'center',
    },
    connectBtn: {
        padding: 5,
        marginTop: 5,
    },
    connectBtnText: {
        fontSize: 16,
        color: PRIMARY_COLOR,
    },
    btnContainer: {
        marginVertical: 5,
        padding: height / 38,
        borderRadius: 10,
        width: '50%',
        alignItems: 'center',
    },
    btnIcon: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    btnLabel: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    notFound: {
        marginTop: 15,
        fontFamily: 'Rubik-Light',
    },
});
