import React from 'react';
import {View, Text, TouchableOpacity, Platform, Dimensions} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR} from '../../themes/colors';
import {withTranslation} from 'react-i18next';
import {AvatarImage} from '../';
import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal';

const {width} = Dimensions.get('window');

class FeedCardFinance extends React.Component {
    state = {
        showQR: false,
    };
    render() {
        const {t, onPress, invoice, unfold} = this.props;
        console.log(
            '🚀 ~ file: FeedCardFinance.js ~ line 19 ~ FeedCardFinance ~ render ~ invoice',
            invoice,
        );

        const club = invoice && invoice.club;
        const amount_statistics = invoice && invoice.amount_statistics;
        const progress = amount_statistics && amount_statistics.progress;
        let collected = 0.01,
            due_with_overdue = 0.01,
            open = 0.01;
        if (progress) {
            var total =
                progress.collected + progress.due_with_overdue + progress.open;
            collected = progress.collected / total;
            due_with_overdue = progress.due_with_overdue / total;
            open = progress.open / total;
        }

        if (this.props.preview) {
            open = 1;
            due_with_overdue = collected = 0;
        }
        return (
            <TouchableOpacity
                style={s.container}
                onPress={() => onPress && onPress()}>
                <View style={s.header}>
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
                            <Text style={s.headerTitle}>{club?.name}</Text>
                            <Text style={s.headerSubTitle}>{t('finance')}</Text>
                        </View>
                    </View>
                    <Icon name="bar-chart-2" size={35} color="white" />
                </View>
                {unfold && (
                    <View style={s.content}>
                        <View style={s.contentHeader}>
                            <View>
                                <Text style={s.bodyHeaderTitle}>
                                    {invoice && invoice.purpose}
                                </Text>
                                <Text style={s.bodyHeaderSubTitle}>
                                    {invoice && invoice.notice}
                                </Text>
                            </View>
                            {/* <View>
                                <Text
                                    style={[s.publicLabel, {color: '#3AF1AF'}]}>
                                    {invoice && invoice.status}
                                </Text>
                            </View> */}
                        </View>
                        <View style={s.body}>
                            <View style={s.intl}>
                                <Text style={s.financesubtitle}>
                                    {t('totalamount')}
                                </Text>
                                <View style={s.intlcontent}>
                                    <View style={s.intlchart} />
                                    <View style={s.intltxt}>
                                        <Text style={s.intlvalue}>
                                            CHF{' '}
                                            {amount_statistics &&
                                            amount_statistics.gross_total
                                                ? amount_statistics.gross_total
                                                : 0}
                                        </Text>
                                    </View>
                                </View>
                                <View style={s.intlcontent}>
                                    <View
                                        style={[
                                            s.intlchart,
                                            {
                                                backgroundColor: 'transparent',
                                                justifyContent: 'space-between',
                                            },
                                        ]}>
                                        <Text style={s.intlfeelabel}>
                                            {t('zirklfee')}
                                        </Text>
                                        <View
                                            style={[
                                                s.intlchart_gray,
                                                {
                                                    flex:
                                                        0.01 *
                                                        amount_statistics.zirkl_fees,
                                                },
                                            ]}
                                        />
                                    </View>
                                    <View style={s.intltxt}>
                                        <Text style={s.intlgrayvalue}>
                                            CHF -{' '}
                                            {amount_statistics &&
                                            amount_statistics.zirkl_fees
                                                ? amount_statistics.zirkl_fees
                                                : 0}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={s.excl}>
                                <Text style={s.financesubtitle}>
                                    {t('incomefee')}
                                </Text>
                                <View style={s.intlcontent}>
                                    <View
                                        style={[
                                            s.intlchart,
                                            {backgroundColor: 'transparent'},
                                        ]}>
                                        <View
                                            style={[
                                                s.intlchart_collect,
                                                {flex: collected},
                                            ]}
                                        />
                                        <View
                                            style={[
                                                s.intlchart_due,
                                                {flex: due_with_overdue},
                                            ]}
                                        />
                                        <View
                                            style={[
                                                s.intlchart_open,
                                                {flex: open},
                                            ]}
                                        />
                                    </View>
                                    <View style={s.intltxt}>
                                        <Text style={s.exclvalue}>
                                            CHF{' '}
                                            {progress && progress.total
                                                ? progress.total
                                                : 0}
                                        </Text>
                                    </View>
                                </View>
                                <View style={s.chartdesp}>
                                    <View
                                        style={[
                                            s.chartdespImg,
                                            {backgroundColor: '#3AF1AF'},
                                        ]}
                                    />
                                    <Text style={s.chartdesptxt}>
                                        {t('collected')}
                                    </Text>
                                    <View
                                        style={[
                                            s.chartdespImg,
                                            {backgroundColor: '#40DCE4'},
                                        ]}
                                    />
                                    <Text style={s.chartdesptxt}>
                                        {t('due')}
                                    </Text>
                                    <View
                                        style={[
                                            s.chartdespImg,
                                            {backgroundColor: '#FF5286'},
                                        ]}
                                    />
                                    <Text style={s.chartdesptxt}>
                                        {t('open')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={s.dategroup}>
                            <View style={{marginRight: 10}}>
                                <Text style={[s.date, {color: 'black'}]}>
                                    {invoice && invoice.payable_date}
                                </Text>
                                <Text style={[s.dateTitle, {color: 'black'}]}>
                                    {t('payable')}
                                </Text>
                            </View>
                            <View style={{marginRight: 10}}>
                                <Text style={[s.date, {color: 'black'}]}>
                                    {invoice && invoice.invoice_date}
                                </Text>
                                <Text style={[s.dateTitle, {color: 'black'}]}>
                                    {t('invoicedate')}
                                </Text>
                            </View>
                        </View>
                        <View style={s.dategroup}>
                            <View style={{marginRight: 10}}>
                                <Text style={[s.date, {color: 'black'}]}>
                                    {invoice && invoice.first_reminder}
                                </Text>
                                <Text style={[s.dateTitle, {color: 'black'}]}>
                                    {t('firstreminder')}
                                </Text>
                            </View>
                            <View>
                                <Text style={[s.date, {color: 'black'}]}>
                                    {invoice && invoice.second_reminder}
                                </Text>
                                <Text style={[s.dateTitle, {color: 'black'}]}>
                                    {t('secondreminder')}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={[
                                s.contentFooter,
                                {justifyContent: 'flex-start'},
                            ]}>
                            <TouchableOpacity
                                style={{marginRight: 15}}
                                onPress={() => this.setState({showQR: true})}>
                                <View
                                    style={[
                                        s.iconContainer,
                                        {merginRight: 10},
                                    ]}>
                                    <Icon
                                        name="credit-card"
                                        size={27}
                                        color={PRIMARY_COLOR}
                                    />
                                    <Text style={s.iconlabel}>{t('pay')}</Text>
                                </View>
                            </TouchableOpacity>
                            {/* <TouchableOpacity>
                                <View style={s.iconContainer}>
                                    <Icon
                                        name="bell"
                                        size={27}
                                        color={PRIMARY_COLOR}
                                    />
                                    <Text style={s.iconlabel}>
                                        {t('notification')}
                                    </Text>
                                </View>
                            </TouchableOpacity> */}
                            <TouchableOpacity style={{marginRight: 15}}>
                                <View
                                    style={[
                                        s.iconContainer,
                                        {merginRight: 10},
                                    ]}>
                                    <Icon
                                        name="file"
                                        size={27}
                                        color={PRIMARY_COLOR}
                                    />
                                    <Text style={s.iconlabel}>{t('bill')}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View
                                    style={[
                                        s.iconContainer,
                                        {opacity: 0, marginRight: 10},
                                    ]}>
                                    <Icon
                                        name="bookmark"
                                        size={27}
                                        color={PRIMARY_COLOR}
                                    />
                                    <Text style={s.iconlabel}>
                                        {t('makereservation')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <Modal
                    // isVisible={this.state.showQR}
                    isVisible={false}
                    onBackButtonPress={() => this.setState({showQR: false})}
                    onBackdropPress={() => this.setState({showQR: false})}
                    onSwipeComplete={() => this.setState({showQR: false})}
                    swipeDirection={['down']}
                    style={{
                        justifyContent:
                            Platform.OS == 'android' ? 'center' : 'flex-end',
                        margin: Platform.OS == 'android' ? 20 : 0,
                    }}>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 30,
                            backgroundColor: 'white',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            borderBottomLeftRadius:
                                Platform.OS == 'android' ? 20 : 0,
                            borderBottomRightRadius:
                                Platform.OS == 'android' ? 20 : 0,
                        }}>
                        <View
                            style={{
                                backgroundColor: '#2F425D',
                                opacity: 0.2,
                                width: 70,
                                height: Platform.OS == 'android' ? 0 : 5,
                                borderRadius: 5,
                                alignSelf: 'center',
                                marginVertical:
                                    Platform.OS == 'android' ? 20 : 40,
                            }}
                        />
                        <QRCode
                            value={`zirkl://club/${club?.id}`}
                            size={width / 2}
                            color={PRIMARY_COLOR}
                            backgroundColor="white"
                        />
                    </View>
                </Modal>
            </TouchableOpacity>
        );
    }
}

export default withTranslation('feedcard')(FeedCardFinance);
