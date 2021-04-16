import {StyleSheet, Dimensions} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: 'flex-end',
        margin: 0,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    modalContainer: {},
    modalContent: {
        marginBottom: 80,
        paddingHorizontal: 40,
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
    checkgroupTitle: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        fontWeight: 'bold',
        textAlign: 'left',
        borderBottomColor: PRIMARY_TEXT_COLOR,
        borderBottomWidth: 1,
        paddingRight: 10,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    addclubBtn: {
        paddingVertical: 10,
    },
    addclubBtnLabel: {
        fontSize: 12,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Regular',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    checkboxText: {
        fontSize: 12,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
        fontWeight: 'bold',
        height: 15,
    },
    checkgroup: {
        marginVertical: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
