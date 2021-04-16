import {StyleSheet, Platform} from 'react-native';
import {BACKGROUND_COLOR, PRIMARY_TEXT_COLOR} from '../../themes/colors';

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
        paddingTop: 20,
        paddingHorizontal: 25,
        marginBottom: 40,
    },
    header: {
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopColor: '#E5E5E5',
        borderTopWidth: 1,
        paddingHorizontal: 25,
        paddingVertical: 20,
    },
    sectionName: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        marginHorizontal: 25,
        marginVertical: 10,
    },
    sectionItem: {
        flexDirection: 'column',
        alignItems: 'center',
        flex: 0.5,
    },
    sectionItemLabel: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'Rubik-Medium',
        paddingVertical: 10,
        textAlign: 'center',
    },
    inlineSection: {
        borderTopColor: '#E5E5E5',
        borderTopWidth: 1,
        paddingHorizontal: 25,
        paddingVertical: 20,
    },
    inlineRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        marginBottom: 15,
    },
    inlineItem: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
        marginLeft: 15,
    },
});
