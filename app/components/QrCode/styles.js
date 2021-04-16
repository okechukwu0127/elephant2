import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    modal: {
        justifyContent: Platform.OS == 'android' ? 'center' : 'flex-end',
        margin: Platform.OS == 'android' ? 20 : 0,
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: Platform.OS == 'android' ? 20 : 0,
        borderBottomRightRadius: Platform.OS == 'android' ? 20 : 0,
    },
    modalcloseBtn: {
        backgroundColor: '#2F425D',
        opacity: 0.2,
        width: 70,
        height: Platform.OS == 'android' ? 0 : 5,
        borderRadius: 5,
        alignSelf: 'center',
        marginVertical: Platform.OS == 'android' ? 20 : 40,
    },
    title: {
        fontSize: 28,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
        margin: 30,
    },
});
