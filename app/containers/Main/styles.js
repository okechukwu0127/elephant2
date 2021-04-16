import {StyleSheet, Dimensions} from 'react-native';
import {BACKGROUND_COLOR, PRIMARY_COLOR} from '../../themes/colors';

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
        fontSize: height / 24,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        marginBottom: height / 25,
    },
    activebtnContainer: {
        backgroundColor: PRIMARY_COLOR,
    },
    btnContainer: {
        marginVertical: 5,
        width: width / 2 - 40,
        height: width / 2 - 40,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnIcon: {
        marginBottom: 10,
    },
    btnLabel: {
        fontSize: 18,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
    },
    plusicon: {
        position: 'absolute',
        top: 33,
        right: 57,
        borderRadius: 50,
        backgroundColor: BACKGROUND_COLOR,
    },
    btnRow: {
        flexDirection: 'row',
    },
});
