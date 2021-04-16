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

export default StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    container: {
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: BACKGROUND_COLOR,
        paddingBottom: 20,
    },
    dismissBtn: {
        fontSize: 12,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        paddingRight: 20,
    },
    title: {
        fontSize: 28,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
    },
    interestText: {
        fontSize: 20,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        alignSelf: 'flex-start',
    },
    inputContainer: {
        width: '100%',
        backgroundColor: 'rgba(142, 142, 147, 0.12)',
        borderRadius: 50,
        paddingVertical: Platform.OS == 'ios' ? 5 : 0,
        paddingHorizontal: 25,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
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
    tagitem: {
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingHorizontal: 20,
    },
    taglabel: {
        color: PRIMARY_COLOR,
        fontSize: 16,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
    },
    tagitemSelected: {
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 20,
    },
    taglabelSelected: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Rubik-Medium',
    },
    btn: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 10,
        paddingVertical: 15,
        width: '100%',
        marginTop: 20,
    },
    btnLabel: {
        fontSize: 14,
        color: 'white',
        alignSelf: 'center',
        textTransform: 'uppercase',
        fontFamily: 'Rubik-Medium',
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
        borderRadius: 10,
    },
    paginationContainer: {
        paddingVertical: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 10,
        marginHorizontal: 0,
    },
    addressContainer: {
        width: '100%',
        borderBottomColor: '#C4C4C4',
        borderBottomWidth: 1,
        paddingVertical: Platform.OS == 'ios' ? 10 : 0,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    address: {
        flex: 1,
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
    },
    addressLabel: {
        fontSize: 18,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        marginRight: 10,
    },
});
