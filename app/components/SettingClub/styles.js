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
        backgroundColor: 'rgba(47,66,93,0.9)',
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
        color: 'white',
        fontFamily: 'Rubik-Medium',
        fontWeight: 'bold',
        textAlign: 'left',
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        paddingLeft: 10,
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    addclubBtn: {
        paddingVertical: 10,
    },
    addclubBtnLabel: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Rubik-Regular',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    checkboxText: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Rubik-Regular',
        fontWeight: 'bold',
        textAlign: 'right',
        paddingRight: 10,
        height: 15,
    },
    checkgroup: {
        marginVertical: 10,
    },
});
