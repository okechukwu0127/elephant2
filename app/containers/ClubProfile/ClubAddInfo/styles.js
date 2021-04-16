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
        borderTopColor: '#E5E5E5',
        borderTopWidth: 1,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
        paddingLeft: 25,
        marginBottom: 25,
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
        paddingRight: 10,
    },
    sectionItemLabel: {
        fontSize: 14,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
        paddingVertical: 15,
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
    textInput: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'Rubik-Regular',
        paddingVertical: 15,
        flex: 1,
        marginLeft: 15,
    },
    exitButton: {
        backgroundColor: '#FF5286',
        alignSelf: 'flex-end',
        borderRadius: 3,
        paddingHorizontal: 20,
        paddingVertical: 7,
        marginVertical: 7,
        marginRight: 10,
    },
    exitButtonLabel: {
        fontFamily: 'Rubik-Regular',
        fontSize: 12,
        color: 'white',
    },
    textwithitcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
});
