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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: BACKGROUND_COLOR,
    },
    title: {
        fontSize: 28,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        marginBottom: 30,
    },
    activebtnContainer: {
        backgroundColor: PRIMARY_COLOR,
    },
    btnContainer: {
        marginVertical: 5,
        padding: 20,
        borderRadius: 10,
    },
    btnIcon: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    btnLabel: {
        fontSize: 20,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
    },
    plusicon: {
        position: 'absolute',
        top: 28,
        right: 47,
        borderRadius: 50,
        backgroundColor: 'white',
    },
    BackButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 5,
        marginTop: 25,
    },
    BackButtonLabel: {
        fontSize: 15,
        color: 'white',
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
    },
});
