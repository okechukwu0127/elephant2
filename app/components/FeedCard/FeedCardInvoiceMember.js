import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    Linking,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {
    PRIMARY_TEXT_COLOR,
    GRAY_COLOR,
    PRIMARY_COLOR,
} from '../../themes/colors';
import moment from 'moment';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import AvatarImage from '../AvatarImage';
import Share from 'react-native-share';

const {width} = Dimensions.get('window');
moment.defineLocale('de', {
    weekdaysShort: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    monthsShort: 'Jän_Feb_März_Apr_Mai_Juni_Juli_Aug_Sept_Okt_Nov_Dez'.split(
        '_',
    ),
});

const RED_COLOR = '#B62727';
const GREEN_COLOR = '#429F7E';

class FeedCardInvoiceMember extends React.Component {
    render() {
        const {unfold, data, openCard} = this.props;

        const {content} = data;
        console.log(
            '🚀 ~ file: FeedCardInvoiceMember.js ~ line 39 ~ FeedCardInvoiceMember ~ render ~ content',
            content,
        );
        const club = content ? content.club : null;
        const colors = {
            due: PRIMARY_COLOR,
            overdue: PRIMARY_COLOR,
            paid_to_zirkl: GREEN_COLOR,
            paid_to_club: GREEN_COLOR,
        };
        return (
            <View style={s.container}>
                <TouchableOpacity
                    style={[
                        s.header,
                        {
                            backgroundColor:
                                colors[(content?.payment_status)] ||
                                PRIMARY_COLOR,
                        },
                    ]}
                    onPress={() => {
                        openCard && openCard(data.id);
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'center',
                        }}>
                        <View style={s.avatar}>
                            <AvatarImage
                                uri={club?.photo?.original}
                                width={32}
                                user={{first_name: club?.name}}
                                backgroundColor={'rgba(255,255,255,0.5)'}
                            />
                        </View>
                        <View>
                            {club ? (
                                <Text style={s.headerTitle}>
                                    {club.name}aaaaaaa
                                </Text>
                            ) : null}
                            <Text style={s.headerSubTitle}>
                                {unfold
                                    ? 'Finanzen'
                                    : content?.invoice_details?.purpose}
                            </Text>
                        </View>
                    </View>
                    <Icon name="bar-chart-2" size={40} color="white" />
                </TouchableOpacity>
                {unfold && !content?.payment_status?.includes('paid') && (
                    <View style={s.content}>
                        <View style={s.body}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 10,
                                    justifyContent: 'space-between',
                                }}>
                                <Text
                                    style={[s.bodyHeaderTitle, {fontSize: 20}]}>
                                    {content?.invoice_details?.purpose}
                                </Text>
                                <Text
                                    style={{
                                        color: GRAY_COLOR,
                                        fontFamily: 'Rubik-Medium',
                                    }}>
                                    Intern
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 20}}>
                                {content?.qr && (
                                    <Image
                                        source={{uri: content.qr}}
                                        style={{
                                            width: width / 3,
                                            height: width / 3,
                                            resizeMode: 'contain',
                                            marginVertical: 10,
                                            borderRadius: 5,
                                        }}
                                    />
                                )}
                                <View style={{paddingLeft: 20}}>
                                    <Text
                                        style={{
                                            fontSize: 28,
                                            color: RED_COLOR,
                                            fontFamily: 'Rubik-Medium',
                                            marginTop: 5,
                                        }}>
                                        CHF {content?.amount}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: PRIMARY_TEXT_COLOR,
                                            fontFamily: 'Rubik-Medium',
                                            marginTop: 20,
                                        }}>
                                        {moment(
                                            content?.invoice_details
                                                ?.payable_date,
                                            'DD.MM.YYYY',
                                        ).format('DD. MMM YYYY')}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: PRIMARY_TEXT_COLOR,
                                            fontFamily: 'Rubik-Regular',
                                            marginTop: 4,
                                        }}>
                                        Zahlbar bis
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={[
                                    s.contentFooter,
                                    {
                                        justifyContent: 'flex-start',
                                        marginTop: 10,
                                    },
                                ]}>
                                <TouchableOpacity
                                    style={s.footerItem}
                                    onPress={() => {
                                        const options = {
                                            title:
                                                'Invoice: ' +
                                                content?.invoice_details
                                                    ?.purpose,
                                            message:
                                                'Pay for this zirkl invoice using the QR Code',
                                            url: content?.qr,
                                        };

                                        Share.open(options);
                                    }}>
                                    <View style={s.iconContainer}>
                                        <Icon
                                            name="upload"
                                            size={27}
                                            color={RED_COLOR}
                                        />
                                        <Text style={s.iconlabel}>Teilen</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        Linking.openURL(content?.qr_pdf);
                                    }}
                                    style={s.footerItem}>
                                    <View
                                        style={[
                                            s.iconContainer,
                                            {flexDirection: 'row'},
                                        ]}>
                                        <Icon
                                            name="file"
                                            size={27}
                                            color={RED_COLOR}
                                        />
                                    </View>
                                    <Text style={s.iconlabel}>Rechnung</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log(
                                            'Taking u to club profile',
                                            content?.club?.id,
                                        );
                                        this.props.navigation.navigate(
                                            'ClubDetail',
                                            {club_id: content?.club?.id},
                                        );
                                    }}
                                    style={s.footerItem}>
                                    <View
                                        style={[
                                            s.iconContainer,
                                            {flexDirection: 'row'},
                                        ]}>
                                        <Icon
                                            name="user"
                                            size={27}
                                            color={RED_COLOR}
                                        />
                                    </View>
                                    <Text style={s.iconlabel}>Profil</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation('feedcard')(FeedCardInvoiceMember));
