import {StyleSheet, Dimensions} from 'react-native';
import {PRIMARY_COLOR} from '../../themes/colors';

const {width} = Dimensions.get('window');
export const fab_width = width * 0.7;
export const fab_height = fab_width / 1.45;
export const fab_btnsize = 50;
export const fab_offset = 18;

export default StyleSheet.create({
    fabContainer: {
        width: fab_width,
        height: fab_height,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40,
    },
    background: {
        width: fab_width,
        height: fab_height,
        resizeMode: 'contain',
        position: 'absolute',
        left: 0,
        top: 0,
    },
    fabBtn: {
        backgroundColor: PRIMARY_COLOR,
        alignSelf: 'center',
        width: fab_btnsize,
        height: fab_btnsize,
        borderRadius: fab_btnsize / 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    iconUser: {
        width: fab_width / 3,
        height: fab_width / 3,
        resizeMode: 'contain',
    },
});
