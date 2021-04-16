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
    colorText: {
        fontSize: 10,
        fontFamily: 'Rubik-Medium',
        color: 'white',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        alignSelf: 'center',
    },
    colorPanel: {
        backgroundColor: BACKGROUND_COLOR,
        borderRadius: 16,
        padding: 20,
        alignSelf: 'center',
        marginTop: 10,
    },
    colorItem: {
        width: 35,
        height: 35,
        borderRadius: 32,
        margin: 8,
    },
});
