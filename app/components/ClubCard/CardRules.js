import React from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
} from 'react-native';
import s, {fab_width} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import IconTV from '../../assets/icon_tv.png';
import {withTranslation} from 'react-i18next';

class CardRules extends React.Component {
    render() {
        const {t, club, disableShadow} = this.props;
        const club_profile = club && club.profile;
        return (
            <View style={[s.container, disableShadow ? {elevation: 1} : {}]}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>{t('status')}</Text>
                    <Icon name="file-text" size={30} color="white" />
                </View>
                <TouchableOpacity
                    style={[
                        s.content,
                        {justifyContent: 'center', alignItems: 'center'},
                    ]}
                    onPress={() => {
                        Linking.openURL(
                            club_profile && club_profile.club_status,
                        );
                    }}>
                    <Icon name="file-text" size={50} color={PRIMARY_COLOR} />
                </TouchableOpacity>
            </View>
        );
    }
}

export default withTranslation('clubcard')(CardRules);
