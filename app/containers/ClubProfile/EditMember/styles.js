import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../../themes/colors';

const {width} = Dimensions.get('window');

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
        marginLeft: 15,
    },
    topBar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 25,
    },
    header: {
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 100,
        backgroundColor: PRIMARY_TEXT_COLOR,
        alignSelf: 'center',
    },
    name: {
        fontSize: 12,
        color: '#88919E',
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginBottom: 15,
    },
    section: {
        paddingVertical: 20,
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
        marginHorizontal: 25,
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
    version: {
        color: '#88919E',
        fontSize: 12,
        fontFamily: 'Rubik-Regular',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 10,
    },
    sectionRightLabel: {
        fontSize: 14,
        color: '#8F8F8F',
        fontFamily: 'Rubik-Regular',
    },
    sectionRight: {
        flexDirection: 'row',
        alignItems: 'center',
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
    button: {
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginBottom: 20,
        minWidth: 250,
    },
    btnLabel: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Rubik-Medium',
        letterSpacing: 2,
        textAlign: 'center',
    },
    inputContainer: {
        width: width - 40,
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
});