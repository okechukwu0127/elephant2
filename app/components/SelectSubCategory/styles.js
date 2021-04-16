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
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: BACKGROUND_COLOR,
    },
    catName: {
        fontSize: 20,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        fontWeight: 'bold',
    },
    subCategory: {
        fontSize: 12,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    allcheckBtn: {
        marginVertical: 5,
    },
    allcheckBtnLabel: {
        fontSize: 12,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        fontWeight: 'bold',
    },
    inputContainer: {
        width: '100%',
        backgroundColor: 'rgba(142, 142, 147, 0.12)',
        borderRadius: 50,
        paddingVertical: Platform.OS == 'ios' ? 5 : 0,
        paddingHorizontal: 15,
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
        fontSize: 14,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
        paddingVertical: 3,
    },
    okbtn: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 40,
        marginTop: 20,
        marginBottom: 20,
    },
    okbtnLabel: {
        fontSize: 14,
        color: 'white',
        alignSelf: 'center',
        textTransform: 'uppercase',
        fontFamily: 'Rubik-Medium',
        letterSpacing: 2,
    },
    checkboxText: {
        fontSize: 12,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
        fontWeight: 'bold',
        height: 15,
    },
    activecheckboxText: {
        fontSize: 12,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Regular',
        fontWeight: 'bold',
        height: 15,
    },
});
