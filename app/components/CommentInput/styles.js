import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20,
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderRadius: 20,
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
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: BACKGROUND_COLOR,
    },
    backButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
    },
    title: {
        fontSize: 20,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 30,
    },
    textarea: {
        height: 150,
        width: '100%',
        borderWidth: 1,
        borderColor: PRIMARY_TEXT_COLOR,
        textAlignVertical: 'top',
    },
    confirmBtn: {
        borderRadius: 10,
        paddingVertical: 15,
        width: '100%',
        marginVertical: 20,
        marginBottom: 30,
        backgroundColor: PRIMARY_COLOR,
    },
    confirmBtnLabel: {
        color: 'white',
        fontSize: 14,
        alignSelf: 'center',
        fontFamily: 'Rubik-Medium',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
});
