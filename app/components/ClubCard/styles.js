import {StyleSheet, Dimensions} from 'react-native';
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
        overflow: 'hidden',
        marginVertical: 10,
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
        borderRadius: 32,
        marginRight: 8,
        overflow: 'hidden',
    },
    avatarImg: {
        width: 32,
        height: 32,
        resizeMode: 'cover',
    },
    headerTitle: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Rubik-Medium',
        letterSpacing: 1.5,
        textAlign: 'left',
    },
    headerSubTitle: {
        fontSize: 10,
        color: 'white',
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
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
    bodyHeaderTitle: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
    },
    bodyHeaderSubTitle: {
        fontSize: 12,
        color: '#6C8AF1',
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
    },
    publicLabel: {
        fontSize: 12,
        color: '#88919E',
        fontFamily: 'Rubik-Medium',
        textAlign: 'right',
    },
    body: {
        marginVertical: 10,
    },
    bodyText: {
        fontSize: 12,
        fontFamily: 'Rubik-Regular',
        color: '#88919E',
        lineHeight: 20,
    },
    showmoreLabel: {
        fontSize: 12,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        marginVertical: 5,
    },
    followBtn: {
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    followBtnLabel: {
        fontSize: 14,
        color: 'white',
        fontFamily: 'Rubik-Medium',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        flex: 1,
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
    impressItem: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    impressImgView: {
        width: width / 4,
        height: width / 4,
        backgroundColor: PRIMARY_TEXT_COLOR,
        borderRadius: 10,
        margin: 2,
        overflow: 'hidden',
    },
    impressimg: {
        width: width / 4,
        height: width / 4,
        resizeMode: 'cover',
    },
    yesBtn: {
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    yesBtnLabel: {
        fontSize: 14,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    noBtn: {
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    noBtnLabel: {
        fontSize: 14,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
});
