import React from 'react';
import {View, Text} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {withTranslation} from 'react-i18next';
var INVOICE_OPTIONS = t => [
    {value: 'month', label: t('common:months'), singular: t('common:month')},
    {value: 'year', label: t('common:years'), singular: t('common:year')},
];

class CardFinances extends React.Component {
    render() {
        const {t, memberships, disableShadow} = this.props;

        return (
            <View style={[s.container, disableShadow ? {elevation: 1} : {}]}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>{t('finance')}</Text>
                    <Icon name="credit-card" size={32} color="white" />
                </View>
                <View
                    style={[
                        s.content,
                        {justifyContent: 'center', alignItems: 'center'},
                    ]}>
                    {memberships
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map(item => {
                            const recurring = INVOICE_OPTIONS(t).find(
                                option => option.value == item.invoice_interval,
                            );
                            return (
                                <View
                                    key={item.id + ''}
                                    style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                        justifyContent: 'space-between',
                                        marginVertical: 5,
                                    }}>
                                    <Text style={[s.cardItemText]}>
                                        {item.title === 'Free membership'
                                            ? 'Mitglied'
                                            : item.title}
                                    </Text>
                                    <Text
                                        style={[
                                            s.cardItemText,
                                            {
                                                fontSize: 14,
                                                color: '#6C8AF1',
                                                fontFamily: 'Rubik-Regular',
                                                textAlign: 'right',
                                            },
                                        ]}>{`CHF ${item.amount}`}</Text>
                                    {/* \n${t(
                                        'common:per',
                                    )} ${item.invoice_period}  ${recurring &&
                                        (item.invoice_period == 1
                                            ? recurring.singular
                                            : recurring.label)} */}
                                </View>
                            );
                        })}
                </View>
            </View>
        );
    }
}

export default withTranslation(['clubcard', 'common'])(CardFinances);
