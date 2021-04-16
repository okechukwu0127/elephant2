import {StyleSheet, Dimensions, Platform} from 'react-native';
import {BACKGROUND_COLOR, PRIMARY_TEXT_COLOR} from '../../themes/colors';

const {width} = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const slideWidth = wp(75);
export const itemHorizontalMargin = wp(0);

export const sliderWidth = slideWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

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
        paddingHorizontal: 18,
        flex: 0.1,
    },
    commentSection: {
        paddingHorizontal: 25,
        flex: 0.6,
        paddingTop: 23,
    },
    comment: {
        flexDirection: 'row',
        marginTop: 10,
    },
    avatar: {flex: 1},
    text: {
        marginLeft: 10,
        lineHeight: 20,
        fontSize: 14,
        fontFamily: 'Rubik-Regular',
    },
    time: {
        marginLeft: 10,
        lineHeight: 20,
        fontSize: 14,
        fontFamily: 'Rubik-Regular',
        color: '#88919E',
    },
    userName: {
        fontWeight: 'bold',
    },
    addCommentSection: {
        flex: 0.2,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 25,
    },
    inputContainer: {
        backgroundColor: 'rgba(142, 142, 147, 0.12)',
        paddingLeft: 20,
        paddingRight: 30,
        flex: 1,
        paddingVertical: 10,
        marginLeft: 12,
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        width: width - 100,
    },
    input: {
        fontSize: 16,
        marginLeft: 10,
    },
});
