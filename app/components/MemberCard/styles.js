import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 12,
        backgroundColor: 'white',
        width: '100%',
        overflow: 'hidden',
        marginVertical: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: PRIMARY_COLOR,
        width: '100%',
        padding: 15,
    },
    avatar: {
        width: 32,
        height: 32,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 32,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Rubik-Medium',
        letterSpacing: 1.5,
        textAlign: 'left',
    },
    headerSubTitle: {
        fontSize: 12,
        color: 'white',
        fontFamily: 'Rubik-Medium',
        textTransform: 'uppercase',
        textAlign: 'left',
        marginTop: 3,
    },
    content: {
        padding: 15,
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        flex: 1,
        flexWrap: 'wrap',
    },
    cardItemIcon: {
        marginRight: 15,
    },
    cardItemText: {
        fontSize: 14,
        color: '#88919E',
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        flex: 1,
        flexWrap: 'wrap',
    },
    fillIcon: {
        marginHorizontal: 3,
        paddingTop: Platform.select({
            ios: 4,
            android: 0,
        }),
    },
    contactName: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        lineHeight: 19,
    },
    contactDate: {
        fontSize: 14,
        color: '#4E586E',
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        lineHeight: 20,
    },
    contactItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btnLabel: {
        color: PRIMARY_COLOR,
        fontSize: 12,
        fontFamily: 'Rubik-Medium',
    },
    sectionName: {
        color: '#88919E',
        fontSize: 12,
        fontFamily: 'Rubik-Medium',
        borderBottomColor: '#C4C4C4',
        borderBottomWidth: 1,
        marginVertical: 10,
        paddingBottom: 5,
    },
    clubImage: {
        backgroundColor: 'gray',
        width: 50,
        height: 50,
        borderRadius: 50,
        marginRight: 15,
        overflow: 'hidden',
    },
    clubimg: {
        resizeMode: 'cover',
        width: 50,
        height: 50,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 8,
    },
    cardCol: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusNum: {
        color: PRIMARY_COLOR,
        fontSize: 24,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
    },
    statusTxt: {
        color: 'black',
        fontSize: 12,
        fontFamily: 'Rubik-Medium',
        textAlign: 'center',
    },
});
