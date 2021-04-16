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
        overflow: 'hidden',
        marginVertical: 15,
        marginHorizontal: 25,
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
        //backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 32,
        marginRight: 8,
        overflow: 'hidden',
    },
    avatarImage: {
        width: 32,
        height: 32,
        resizeMode: 'cover',
    },
    headerTitle: {
        fontSize: 13,
        color: 'white',
        fontFamily: 'Rubik-Medium',
        letterSpacing: 1.5,
        textAlign: 'left',
        marginBottom: 2,
    },
    headerSubTitle: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Rubik-Regular',
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
        marginBottom: 10,
    },
    bodyHeaderTitle: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        marginBottom: 3,
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
        fontSize: 14,
        fontFamily: 'Rubik-Regular',
        color: PRIMARY_TEXT_COLOR,
    },
    bodydate: {
        fontFamily: 'Rubik-Medium',
        color: PRIMARY_TEXT_COLOR,
        fontSize: 18,
        marginVertical: 10,
    },
    showmoreLabel: {
        fontSize: 12,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        marginVertical: 5,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconlabel: {
        fontSize: 12,
        color: '#88919E',
        fontFamily: 'Rubik-Medium',
        lineHeight: 20,
        textAlign: 'center',
    },
    // card2
    priceTxt: {
        fontSize: 24,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
    },
    priceDescription: {
        fontSize: 12,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
    },
    dategroup: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    date: {
        fontSize: 12,
        fontFamily: 'Rubik-Medium',
        lineHeight: 16,
    },
    dateTitle: {
        fontSize: 12,
        fontFamily: 'Rubik-Regular',
        lineHeight: 20,
    },
    //card 3
    imageGroup: {
        marginVertical: 20,
    },
    imageRow: {
        flexDirection: 'row',
    },
    imagebox: {
        flex: 0.5,
        height: 150,
        backgroundColor: PRIMARY_TEXT_COLOR,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        margin: 5,
        borderRadius: 8,
    },
    memberavatar: {
        width: 60,
        height: 60,
        backgroundColor: PRIMARY_TEXT_COLOR,
        borderRadius: 100,
        marginRight: 15,
    },
    membername: {
        fontSize: 16,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        lineHeight: 19,
    },
    membertext: {
        fontSize: 14,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
        lineHeight: 20,
    },
    //////////////////////
    financesubtitle: {
        fontSize: 12,
        color: '#2F425D',
        fontFamily: 'Rubik-Medium',
        lineHeight: 20,
    },
    intl: {
        marginVertical: 5,
    },
    intlcontent: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    intlchart: {
        flex: 0.7,
        backgroundColor: PRIMARY_COLOR,
        flexDirection: 'row',
        borderRadius: 5,
        overflow: 'hidden',
    },
    intltxt: {
        flex: 0.3,
        alignItems: 'flex-end',
    },
    intlchart_gray: {
        flex: 1,
        marginLeft: 50,
        borderRadius: 5,
        backgroundColor: '#88919E',
    },
    excl: {
        marginVertical: 5,
    },
    intlchart_collect: {
        flex: 0.01,
        backgroundColor: '#3AF1AF',
    },
    intlchart_due: {
        flex: 0.01,
        backgroundColor: '#40DCE4',
    },
    intlchart_open: {
        flex: 0.01,
        backgroundColor: '#FF5286',
    },
    chartdesp: {
        flexDirection: 'row',
        marginTop: 10,
    },
    chartdespImg: {
        width: 15,
        height: 15,
        borderRadius: 15,
        marginRight: 10,
    },
    chartdesptxt: {
        marginRight: 20,
        fontSize: 12,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
    },
    intlvalue: {
        fontSize: 16,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
    },
    intlgrayvalue: {
        fontSize: 16,
        color: '#88919E',
        fontFamily: 'Rubik-Medium',
    },
    intlfeelabel: {
        fontSize: 12,
        color: '#88919E',
        fontFamily: 'Rubik-Medium',
        marginTop: 2,
    },
    exclvalue: {
        fontSize: 16,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
    },
    impressItem: {
        alignItems: 'center',
    },
    impressImgView: {
        backgroundColor: PRIMARY_TEXT_COLOR,
        flex: 1,
        borderRadius: 10,
        margin: 2,
        overflow: 'hidden',
    },
    impressimg: {
        width: width / 2 - 45,
        height: width / 2 - 45,
        resizeMode: 'cover',
    },
    modal: {
        justifyContent: 'center',
        margin: 20,
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: 'white',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderRadius: 5,
        paddingVertical: 30,
    },
    ios_modal: {
        justifyContent: Platform.OS == 'android' ? 'center' : 'flex-end',
        margin: Platform.OS == 'android' ? 20 : 0,
    },
    ios_modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: Platform.OS == 'android' ? 20 : 0,
        borderBottomRightRadius: Platform.OS == 'android' ? 20 : 0,
    },
    ios_modalcloseBtn: {
        backgroundColor: '#2F425D',
        opacity: 0.2,
        width: 70,
        height: Platform.OS == 'android' ? 0 : 5,
        borderRadius: 5,
        alignSelf: 'center',
        marginVertical: Platform.OS == 'android' ? 20 : 40,
    },
    btn: {
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginVertical: 20,
        marginBottom: 40,
        backgroundColor: PRIMARY_COLOR,
        alignSelf: 'center',
    },
    btnLabel: {
        color: 'white',
        fontSize: 12,
        alignSelf: 'center',
        fontFamily: 'Rubik-Medium',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    footerItem: {
        flex: 0.25,
        justifyContent: 'center',
    },
});
