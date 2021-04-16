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

const slideHeight = height * 0.75;
const slideWidth = wp(100);
export const itemHorizontalMargin = wp(0);

export const sliderWidth = width;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;
const entryBorderRadius = 8;

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: Platform.OS == 'ios' ? 60 : 30,
        paddingBottom: 15,
    },
    headerTitle: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        lineHeight: 19,
        marginLeft: 27,
    },
    headerPage: {
        fontSize: 14,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik',
        marginLeft: 27,
    },
    headerDismiss: {
        fontSize: 14,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik',
        marginRight: 27,
    },
    content: {
        flex: 1,
        backgroundColor: '#354762',
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
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 10,
        borderRadius: entryBorderRadius,
    },
    imageContainer: {
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'transparent',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        alignSelf: 'center',
    },
    imageContainerEven: {
        backgroundColor: 'white',
    },
    image: {
        resizeMode: 'contain',
        width,
        height: height - 120,
    },
    nextBtn: {
        position: 'absolute',
        bottom: Platform.OS == 'ios' ? 60 : 20,
        backgroundColor: 'white',
        marginHorizontal: 20,
        textAlign: 'center',
        paddingVertical: 15,
        width: width - 70,
        alignSelf: 'center',
        borderRadius: 10,
    },
    nextBtnLabel: {
        fontSize: 14,
        color: PRIMARY_COLOR,
        alignSelf: 'center',
        fontFamily: 'Rubik-Medium',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    paginationContainer: {
        paddingVertical: 8,
    },
    paginationDot: {
        width: 40,
        height: 8,
        borderRadius: 10,
        marginHorizontal: 0,
    },
});
