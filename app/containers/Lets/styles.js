import {StyleSheet, Dimensions} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: BACKGROUND_COLOR,
        paddingBottom: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImg: {
        resizeMode: 'contain',
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 44,
        color: PRIMARY_COLOR,
        lineHeight: 46,
        fontFamily: 'Rubik-Bold',
        fontStyle: 'normal',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        textAlign: 'left',
        fontFamily: 'Rubik-Regular',
    },
    btn: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 10,
        paddingVertical: 15,
        width: '100%',
    },
    btnLabel: {
        fontSize: 14,
        color: 'white',
        alignSelf: 'center',
        textTransform: 'uppercase',
        fontFamily: 'Rubik-Medium',
        letterSpacing: 2,
    },
});
