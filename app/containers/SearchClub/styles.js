import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR,
        paddingHorizontal: 25,
        paddingTop: 35,
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        paddingVertical: Platform.OS == 'ios' ? 5 : 0,
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
        alignSelf: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 20,
    },
    menuItem: {
        fontSize: 15,
        fontFamily: 'Rubik-Regular',
        color: PRIMARY_TEXT_COLOR,
    },
});
