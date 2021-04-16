import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';

const {width} = Dimensions.get('window');
export const fab_width = width * 0.7;
export const fab_offset = 18;

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR,
    },
    dismissBtn: {
        fontSize: 12,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        paddingRight: 20,
    },
    title: {
        fontSize: 28,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        paddingHorizontal: 30,
        marginBottom: 40,
        marginTop: 20,
    },
    btn: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 10,
        paddingVertical: 15,
        width: 150,
        marginTop: 20,
    },
    btnLabel: {
        fontSize: 14,
        color: 'white',
        alignSelf: 'center',
        textTransform: 'uppercase',
        fontFamily: 'Rubik-Medium',
        letterSpacing: 2,
    },
    inputContainer: {
        width: width - 40,
        backgroundColor: 'white',
        borderRadius: 7,
        paddingVertical: Platform.OS == 'ios' ? 8 : 0,
        paddingHorizontal: 20,
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
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    mapContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    dropdownBtn: {
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 2,
        paddingLeft: 10,
        paddingRight: 7,
    },
    dropdownLabel: {
        fontSize: 12,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Regular',
        marginRight: 5,
    },
    dropdownItem: {
        fontSize: 12,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        marginRight: 10,
        textAlign: 'right',
        margin: 0,
    },
});
