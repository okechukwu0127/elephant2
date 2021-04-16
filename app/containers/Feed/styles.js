import {StyleSheet, Dimensions} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR,
        paddingTop: 35,
        paddingBottom: 0,
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 25,
    },
    title: {
        fontSize: 28,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
    },
    iconBtn: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 100,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        textAlign: 'center',
    },
    inputContainer: {
        width: width - 40,
        backgroundColor: 'rgba(142, 142, 147, 0.12)',
        borderRadius: 50,
        paddingVertical: 0,
        paddingHorizontal: 20,
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
    hitlabel: {
        fontSize: 10,
        fontFamily: 'Rubik-Regular',
        color: '#88919E',
        textAlign: 'left',
        alignSelf: 'flex-start',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 20,
    },
    scrollView: {
        paddingHorizontal: 25,
        paddingBottom: 80,
    },
    menuItem: {
        fontSize: 15,
        fontFamily: 'Rubik-Regular',
        color: PRIMARY_TEXT_COLOR,
    },
    filterform: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 25,
    },
    filtertype: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    filterLabel: {
        fontSize: 12,
        fontFamily: 'Rubik-Medium',
        color: PRIMARY_TEXT_COLOR,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    divider: {
        width: width,
        height: (width * 176) / 1500,
        resizeMode: 'cover',
    },
});
