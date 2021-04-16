import {StyleSheet, Dimensions, Platform} from 'react-native';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../../themes/colors';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    scene: {
        flex: 1,
        backgroundColor: '#354762',
        paddingHorizontal: 25,
    },
    tabBar: {
        paddingTop: Platform.OS == 'ios' ? 50 : 30,
        paddingHorizontal: 25,
        width: '100%',
        backgroundColor: BACKGROUND_COLOR,
    },
    tabItem: {
        alignItems: 'center',
        padding: 16,
    },
    tabTitle: {
        fontSize: 16,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        textAlign: 'left',
        lineHeight: 19,
    },
    tabPage: {
        fontSize: 12,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Medium',
        lineHeight: 16,
        textAlign: 'left',
    },
    nextBtn: {
        paddingHorizontal: 5,
        paddingBottom: 10,
    },
    nextBtnLabel: {
        fontSize: 20,
        color: PRIMARY_COLOR,
        fontFamily: 'Rubik-Medium',
        lineHeight: 22,
        textAlign: 'right',
    },
    paginationDot: {
        width: 40,
        height: 8,
        borderRadius: 10,
        marginRight: 8,
        marginTop: 10,
        marginBottom: 25,
    },
    txtInput: {
        backgroundColor: BACKGROUND_COLOR,
        borderRadius: 12,
        marginTop: 70,
        textAlign: 'center',
        fontSize: 28,
        fontFamily: 'Rubik-Medium',
        color: PRIMARY_TEXT_COLOR,
        ...(Platform.OS == 'ios'
            ? {
                  paddingVertical: 10,
              }
            : {}),
    },
    title: {
        fontSize: 28,
        fontFamily: 'Rubik-Medium',
        color: 'white',
        alignSelf: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        fontFamily: 'Rubik-Regular',
        color: 'white',
        textAlign: 'center',
        alignSelf: 'center',
        width: 250,
        lineHeight: 19,
    },
    avatar: {
        width: 100,
        height: 100,
        backgroundColor: BACKGROUND_COLOR,
        alignSelf: 'center',
        borderRadius: 100,
        marginTop: 30,
        overflow: 'hidden',
    },
    clubImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    chooseBtn: {
        borderWidth: 2,
        borderColor: PRIMARY_COLOR,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'white',
        marginVertical: 20,
    },
    chooseBtnLabel: {
        fontSize: 14,
        fontFamily: 'Rubik-Medium',
        color: PRIMARY_COLOR,
        letterSpacing: 2,
        textTransform: 'uppercase',
        alignSelf: 'center',
    },
    colorText: {
        fontSize: 10,
        fontFamily: 'Rubik-Medium',
        color: 'white',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        alignSelf: 'center',
    },
    colorPanel: {
        backgroundColor: BACKGROUND_COLOR,
        borderRadius: 16,
        padding: 20,
        alignSelf: 'center',
        marginTop: 10,
    },
    colorItem: {
        width: 35,
        height: 35,
        borderRadius: 32,
        margin: 8,
    },
    spinnerTextStyle: {
        fontSize: 14,
        fontFamily: 'Rubik-Medium',
        color: 'white',
        letterSpacing: 1.5,
    },
});
