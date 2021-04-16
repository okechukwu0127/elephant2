import {StyleSheet, Platform} from 'react-native';
import {BACKGROUND_COLOR, PRIMARY_TEXT_COLOR} from '../../../themes/colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#272E3F',
    },
    wrapper: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginTop: Platform.OS == 'ios' ? 45 : 5,
    },
    title: {
        fontSize: 28,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
    },
    topBar: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 25,
    },
    header: {
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
