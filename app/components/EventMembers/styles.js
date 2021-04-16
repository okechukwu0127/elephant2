import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    modal: {
        justifyContent: Platform.OS == 'android' ? 'center' : 'flex-end',
        margin: Platform.OS == 'android' ? 20 : 0,
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: Platform.OS == 'android' ? 20 : 0,
        borderBottomRightRadius: Platform.OS == 'android' ? 20 : 0,
        paddingBottom: 20,
    },
    modalcloseBtn: {
        backgroundColor: '#2F425D',
        opacity: 0.2,
        width: 70,
        height: Platform.OS == 'android' ? 0 : 5,
        borderRadius: 5,
        alignSelf: 'center',
        marginVertical: Platform.OS == 'android' ? 20 : 40,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: BACKGROUND_COLOR,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    member: {
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
        paddingVertical: 5,
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 20,
    },
    memberAvatar: {
        width: 30,
        height: 30,
        borderRadius: 35,
        backgroundColor: PRIMARY_TEXT_COLOR,
        marginRight: 10,
        overflow: 'hidden',
    },
    avatarimg: {
        width: 30,
        height: 30,
        resizeMode: 'cover',
    },
    memberName: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
    },
    title: {
        fontSize: 24,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
    },
    optionitem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 7,
    },
    total: {
        fontSize: 28,
        color: '#2F425D',
        fontFamily: 'Rubik-Medium',
    },
    dot: {
        width: 15,
        height: 15,
        borderRadius: 15,
        marginRight: 10,
    },
    dotlabel: {
        fontSize: 12,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
    },
});
