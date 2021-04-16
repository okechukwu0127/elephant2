import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import s, {fab_width} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import moment from 'moment';
import {withTranslation} from 'react-i18next';

moment.defineLocale('de', {
    weekdaysShort: 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
    monthsShort: 'Jän_Feb_März_Apr_Mai_Juni_Juli_Aug_Sept_Okt_Nov_Dez'.split(
        '_',
    ),
});
class CardChronology extends React.Component {
    state = {
        showmore: false,
        loading: null,
    };

    icons = {
        news: 'file-text',
        event: 'calendar',
        impression: 'image',
    };
    render() {
        const {t, feed_timeline, disableShadow, club_id} = this.props;
        const {showmore, loading} = this.state;
        var datasource = feed_timeline.filter(el =>
            ['news', 'event', 'impression'].includes(el?.feed_item_type),
        );
        if (!showmore) {
            datasource = datasource.slice(0, 3);
        }
        return (
            <View style={[s.container, disableShadow ? {elevation: 1} : {}]}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>{t('chronology')}</Text>
                </View>
                <View style={s.content}>
                    {datasource.map((item, index) => {
                        return (
                            <TouchableOpacity
                                disabled={loading === index}
                                onPress={() => {
                                    this.setState({loading: index});
                                    this.props.selectClubs([club_id], () => {
                                        this.props.setFilterType(
                                            item?.feed_item_type,
                                            () => {
                                                this.setState({
                                                    loading: null,
                                                });
                                                this.props.navigation.navigate(
                                                    'Feed',
                                                );
                                            },
                                        );
                                    });
                                }}
                                key={index}
                                style={[
                                    s.sectionItem,
                                    {borderBottomWidth: 0, marginVertical: 5},
                                ]}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                    }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                        <Icon
                                            name={
                                                this.icons[
                                                    (item?.feed_item_type)
                                                ] || 'phone'
                                            }
                                            size={25}
                                            color={PRIMARY_COLOR}
                                            style={s.cardItemIcon}
                                        />
                                        <View
                                            style={{
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}>
                                            <View
                                                style={{
                                                    flex: 1,
                                                }}>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        maxHeight: 50,
                                                        overflow: 'hidden',
                                                        flex: 1,
                                                    }}>
                                                    <Text
                                                        style={{
                                                            fontFamily:
                                                                'Rubik-Regular',
                                                            fontSize: 16,
                                                            color: PRIMARY_TEXT_COLOR,
                                                        }}>
                                                        {item?.content?.title ||
                                                            'Impression'}
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={[
                                                        s.memberDescription,
                                                    ]}>
                                                    {moment(
                                                        item.created_at,
                                                    ).format('DD. MMM YYYY')}
                                                </Text>
                                            </View>
                                            <View>
                                                {loading === index ? (
                                                    <ActivityIndicator
                                                        color={PRIMARY_COLOR}
                                                    />
                                                ) : (
                                                    <Icon
                                                        name="chevron-right"
                                                        color={PRIMARY_COLOR}
                                                        size={20}
                                                    />
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                    {feed_timeline && feed_timeline.length > 3 && (
                        <View
                            style={[
                                s.contentFooter,
                                {justifyContent: 'center'},
                            ]}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({showmore: !showmore});
                                }}>
                                <Text style={s.showmoreLabel}>
                                    {!showmore ? t('showmore') : t('showless')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        );
    }
}

export default withTranslation('clubcard')(CardChronology);
const styles = StyleSheet.create({
    a: {
        fontSize: 16,
        fontFamily: 'Rubik-Regular',
        color: PRIMARY_TEXT_COLOR,
        lineHeight: 20,
    },
});
