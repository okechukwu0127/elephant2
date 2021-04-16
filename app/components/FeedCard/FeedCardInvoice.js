import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import s, {fab_width} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import {withTranslation} from 'react-i18next';
import {getUserName} from '../../utils/utils';
import AvatarImage from '../AvatarImage';

class FeedCardInvoice extends React.Component {
    render() {
        const {t, data, unfold, openCard} = this.props;
        const invoice = data && data.content;
        const user = invoice && invoice.user;
        return (
            <View style={s.container}>
                <TouchableOpacity
                    style={s.header}
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
                                uri={user?.profile?.avatar?.original}
                                width={32}
                                user={user}
                                backgroundColor={'rgba(255,255,255,0.5)'}
                            />
                        </View>
                        <View>
                            <Text style={s.headerTitle}>
                                {getUserName(user)}
                            </Text>
                            <Text style={s.headerSubTitle}>Finanzen</Text>
                        </View>
                    </View>
                    <Icon name="bar-chart-2" size={35} color="white" />
                </TouchableOpacity>
                {unfold && (
                    <View style={s.content}>
                        <View style={s.contentHeader}>
                            <View>
                                <Text
                                    style={[s.bodyHeaderTitle, {fontSize: 20}]}>
                                    {invoice && invoice.purpose}
                                </Text>
                                {/*<Text style={s.bodyHeaderSubTitle}>{invoice && invoice.notice}</Text>*/}
                            </View>
                            <TouchableOpacity>
                                <Text style={s.publicLabel}>
                                    {/* {invoice && invoice.status} */}
                                    {/* Intern */}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={s.body}>
                            <Text style={s.priceTxt}>
                                CHF{' '}
                                {invoice?.amount_statistics?.gross_total +
                                    invoice?.amount_statistics?.zirkl_fees}
                            </Text>
                            <Text style={{fontFamily: 'Rubik-Regular'}}>
                                Offener Betrag
                            </Text>
                            <Text style={s.priceDescription}>
                                {invoice && invoice.notice}
                            </Text>
                        </View>
                        <View style={s.dategroup}>
                            <View style={{marginRight: 10}}>
                                <Text style={s.date}>
                                    {invoice && invoice.invoice_date}
                                </Text>
                                <Text style={s.dateTitle}>
                                    {t('dateofinvoice')}
                                </Text>
                            </View>
                            <View>
                                <Text style={s.date}>
                                    {invoice && invoice.payable_date}
                                </Text>
                                <Text style={s.dateTitle}>
                                    {t('payableto')}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

export default withTranslation('feedcard')(FeedCardInvoice);
