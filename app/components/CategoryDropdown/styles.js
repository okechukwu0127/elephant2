import {StyleSheet, Dimensions} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
    GRAY_COLOR,
} from '../../themes/colors';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'flex-end',
        borderColor: 'gray',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        flex: 1,
    },
    addInput: {
        fontSize: 16,
        padding: 0,
        backgroundColor: 'white',
        marginRight: 20,
        flex: 1,
        fontFamily: 'Rubik-Regular',
        color: PRIMARY_TEXT_COLOR,
    },
    addContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'flex-start',
        borderColor: PRIMARY_COLOR,
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    dropItem: {
        paddingVertical: 7,
    },
    dropText: {
        fontSize: 20,
        fontFamily: 'Rubik-Medium',
        color: PRIMARY_TEXT_COLOR,
    },
    noData: {
        color: GRAY_COLOR,
        fontSize: 14,
        textAlign: 'center',
        padding: 10,
    },
});
