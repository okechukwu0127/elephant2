import {StyleSheet, Platform} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../../../themes/colors';

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
        fontSize: 26,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
    },
    topBar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 25,
        paddingHorizontal: 25,
    },
    header: {
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
        paddingRight: 10,
    },
    sectionItemLabel: {
        fontSize: 14,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
        paddingVertical: 15,
        marginLeft: 10,
    },
    section: {
        borderTopColor: '#E5E5E5',
        borderTopWidth: 1,
        paddingLeft: 25,
        paddingVertical: 8,
        marginTop: 20,
        flex: 0.85,
    },
    sectionName: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        paddingHorizontal: 25,
    },
    itemTouch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    nextBtn: {
        paddingHorizontal: 5,
    },
    nextBtnLabel: {
        fontSize: 20,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        lineHeight: 22,
        textAlign: 'right',
    },
});
