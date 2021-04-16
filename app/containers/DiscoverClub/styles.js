import {StyleSheet, Platform, Dimensions} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
    GRAY_COLOR,
} from '../../themes/colors';

const {width} = Dimensions.get('screen');

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
        fontSize: 26,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
    },
    topBar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 25,
        paddingHorizontal: 25,
    },
    header: {
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
        paddingRight: 10,
    },
    sectionItemLabel: {
        fontSize: 14,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
        paddingVertical: 15,
        marginLeft: 10,
    },
    section: {
        borderTopColor: '#E5E5E5',
        borderTopWidth: 1,
        paddingLeft: 25,
        paddingVertical: 8,
        marginTop: 15,
    },
    sectionName: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        paddingHorizontal: 25,
    },

    notFound: {
        fontSize: 16,
        color: GRAY_COLOR,
        fontFamily: 'Rubik-Regular',
        maxWidth: '60%',
        textAlign: 'center',
    },

    inputContainer: {
        backgroundColor: 'rgba(142, 142, 147, 0.12)',
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
        paddingVertical: 10,
        marginLeft: 12,
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        width: width - 30,
    },
    input: {
        fontSize: 16,
        flex: 0.75,
        fontFamily: 'Rubik-Medium',
    },
});
