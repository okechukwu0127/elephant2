import {StyleSheet, Dimensions} from 'react-native';
import {BACKGROUND_COLOR} from '../../themes/colors';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR,
    },
    logoImg: {
        resizeMode: 'contain',
        width: width - 40,
    },
});
