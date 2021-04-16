import {StyleSheet} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';

export default StyleSheet.create({
    applicationView: {
        flex: 1,
        backgroundColor: '#78CEE4',
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
});
