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

class MemberCard5 extends React.Component {
    render() {
        const {t, disableShadow, statistics} = this.props;
        return (
            <View style={[s.container, disableShadow ? {elevation: 1} : {}]}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>{t('statistics')}</Text>
                    <Icon name="at-sign" size={30} color="white" />
                </View>
                <View style={s.content}>
                    <View style={s.cardRow}>
                        <View style={s.cardCol}>
                            <Text style={s.statusNum}>
                                {(statistics && statistics.events) || '0'}
                            </Text>
                            <Text
                                style={
                                    s.statusTxt
                                }>{`Veranstaltungen\nbesucht`}</Text>
                        </View>
                        <View style={s.cardCol}>
                            <Text style={s.statusNum}>
                                {(statistics && statistics.member_of_clubs) ||
                                    '0'}
                            </Text>
                            <Text
                                style={
                                    s.statusTxt
                                }>{`Mitglieder\n gewonnen`}</Text>
                        </View>
                    </View>
                    <View style={s.cardRow}>
                        <View style={s.cardCol}>
                            <Text style={s.statusNum}>
                                {(statistics && statistics.feedback_given) ||
                                    '0'}
                            </Text>
                            <Text
                                style={
                                    s.statusTxt
                                }>{`Feedbacks\n abgegeben`}</Text>
                        </View>
                        <View style={s.cardCol}>
                            <Text style={s.statusNum}>
                                {(statistics && statistics.contributed) || '0'}
                            </Text>
                            <Text
                                style={
                                    s.statusTxt
                                }>{`Beiträge\n verfasst`}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default withTranslation('membercard')(MemberCard5);
