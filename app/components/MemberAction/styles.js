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
        paddingBottom: 40,
        paddingHorizontal: 30,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: Platform.OS == 'android' ? 20 : 0,
        borderBottomRightRadius: Platform.OS == 'android' ? 20 : 0,
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
    backButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
    },
    title: {
        fontSize: 18,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    subtitle: {
        fontSize: 14,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    optionLabel: {
        fontSize: 12,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    btn: {
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 40,
        marginVertical: 20,
        backgroundColor: PRIMARY_COLOR,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
    },
    btnLabel: {
        color: 'white',
        fontSize: 14,
        alignSelf: 'center',
        fontFamily: 'Rubik-Medium',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    outlinebtn: {
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 40,
        marginVertical: 20,
        marginHorizontal: 5,
        backgroundColor: 'white',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
    },
    outlinebtnLabel: {
        color: PRIMARY_COLOR,
        fontSize: 14,
        alignSelf: 'center',
        fontFamily: 'Rubik-Medium',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    pickeritem: {
        width: '100%',
    },
    pickerLabel: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        backgroundColor: 'rgba(142, 142, 147, 0.12)',
        borderRadius: 50,
        paddingVertical: Platform.OS == 'ios' ? 5 : 0,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        alignSelf: 'center',
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
        paddingVertical: 5,
    },
    sectionName: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        paddingHorizontal: 25,
        marginTop: 25,
        marginBottom: 15,
    },
    sectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
    },
    memberName: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
    },
    memberDescription: {
        fontSize: 14,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
        textAlign: 'left',
    },
    sectionImage: {
        width: 40,
        height: 40,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 50,
        marginVertical: 10,
        marginRight: 10,
        overflow: 'hidden',
    },
    avatarimg: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
    },
});
