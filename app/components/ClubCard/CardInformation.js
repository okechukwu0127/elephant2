import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Linking,
    Platform,
    Alert,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR} from '../../themes/colors';
import FASIcon from 'react-native-vector-icons/FontAwesome';
import AppConfig from '../../config/AppConfig';
import {formatPhoneNumber} from '../../utils/utils';
import {withTranslation} from 'react-i18next';
import {openSocialLink} from '../../utils/utils';
import {SocialIcon} from '../index';

class CardInformation extends React.Component {
    render() {
        const {t, isBoardMember, club, disableShadow} = this.props;
        const profile = club && club.profile;
        const param = isBoardMember
            ? 'board-member'
            : club && club.is_user_member_of_club
            ? 'member'
            : club && club.is_user_following_this_club
            ? 'follower'
            : null;
        let cal_url = ['member', 'board-member'].includes(param)
            ? `${AppConfig.apiUrl}/webcal/club/${club &&
                  club.club_uid}/${param}`
            : null;
        if (Platform.OS === 'ios')
            cal_url = cal_url?.replace('https', 'webcal');

        var address = profile && profile.street ? profile.street + '\n' : '';
        if (profile && (profile.zip || profile.region)) {
            if (profile.zip) address += profile.zip + ' ';
            if (profile.region) address += profile.region;
        }

        var query = profile && profile.street ? profile.street : '';
        if (profile) {
            if (profile.zip) {
                query += '+' + profile.zip;
            }
            if (profile.region) {
                query += '+' + profile.region;
            }
        }
        return (
            <View style={[s.container, disableShadow ? {elevation: 1} : {}]}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>{t('contact')}</Text>
                    <Icon name="home" size={30} color={'white'} />
                </View>
                <View style={s.content}>
                    {!!profile?.phone && (
                        <TouchableOpacity
                            style={s.cardItem}
                            onPress={() =>
                                Alert.alert('', profile?.phone, [
                                    {
                                        text: 'Abbrechen',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Anrufen',
                                        style: 'default',
                                        onPress: () =>
                                            Linking.openURL(
                                                `tel:${profile?.phone}`,
                                            ),
                                    },
                                ])
                            }>
                            <Icon
                                name="phone"
                                size={25}
                                color={PRIMARY_COLOR}
                                style={s.cardItemIcon}
                            />
                            <Text style={s.cardItemText}>
                                {profile &&
                                    profile.phone &&
                                    formatPhoneNumber(profile.phone)}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {profile && profile.email && (
                        <TouchableOpacity
                            style={s.cardItem}
                            onPress={() =>
                                Linking.openURL(
                                    `mailto:${profile && profile.email}`,
                                )
                            }>
                            <Icon
                                name="at-sign"
                                size={25}
                                color={PRIMARY_COLOR}
                                style={s.cardItemIcon}
                            />
                            <Text style={s.cardItemText}>
                                {profile && profile.email}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {profile && profile.website && (
                        <TouchableOpacity
                            style={s.cardItem}
                            onPress={() =>
                                profile &&
                                profile.website &&
                                openSocialLink('website', profile.website)
                            }>
                            <Icon
                                name="globe"
                                size={25}
                                color={PRIMARY_COLOR}
                                style={s.cardItemIcon}
                            />
                            <Text style={s.cardItemText}>
                                {profile && profile.website}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {!!address && address.length > 0 && (
                        <TouchableOpacity
                            style={[s.cardItem]}
                            onPress={() => {
                                if (Platform.OS == 'android')
                                    Linking.openURL(
                                        `http://maps.google.com/maps?daddr=${query}`,
                                    );
                                else
                                    Linking.openURL(
                                        `http://maps.apple.com/maps?daddr=${query}`,
                                    );
                            }}>
                            <Icon
                                name="map-pin"
                                size={25}
                                color={PRIMARY_COLOR}
                                style={s.cardItemIcon}
                            />
                            <Text style={s.cardItemText}>{address}</Text>
                        </TouchableOpacity>
                    )}
                    {cal_url && club.has_future_events && (
                        <TouchableOpacity
                            style={[s.cardItem]}
                            onPress={() => Linking.openURL(cal_url)}>
                            <Icon
                                name="calendar"
                                size={25}
                                color={PRIMARY_COLOR}
                                style={s.cardItemIcon}
                            />
                            <Text style={[s.cardItemText, {color: '#6C8AF1'}]}>
                                {t('subscribe')}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <View style={s.cardItem}>
                        {profile?.facebook && (
                            <TouchableOpacity
                                style={[s.fillIcon]}
                                onPress={() =>
                                    openSocialLink('facebook', profile.facebook)
                                }>
                                <SocialIcon
                                    name="facebook"
                                    height={30}
                                    width={30}
                                />
                            </TouchableOpacity>
                        )}
                        {profile?.instagram && (
                            <TouchableOpacity
                                style={[
                                    s.fillIcon,
                                    {
                                        paddingTop: 2,
                                        paddingLeft: 1,
                                    },
                                ]}
                                onPress={() =>
                                    openSocialLink(
                                        'instagram',
                                        profile.instagram,
                                    )
                                }>
                                <SocialIcon
                                    name="instagram"
                                    height={30}
                                    width={30}
                                />
                            </TouchableOpacity>
                        )}
                        {profile?.twitter && (
                            <TouchableOpacity
                                style={[
                                    s.fillIcon,
                                    {paddingTop: 2, paddingLeft: 1.5},
                                ]}
                                onPress={() =>
                                    openSocialLink('twitter', profile.twitter)
                                }>
                                <SocialIcon
                                    name="twitter"
                                    height={30}
                                    width={30}
                                />
                            </TouchableOpacity>
                        )}
                        {profile?.xing && (
                            <TouchableOpacity
                                style={[
                                    s.fillIcon,
                                    {paddingTop: 2, paddingLeft: 2},
                                ]}
                                onPress={() =>
                                    openSocialLink('xing', profile.xing)
                                }>
                                <SocialIcon
                                    name="xing"
                                    height={30}
                                    width={30}
                                />
                            </TouchableOpacity>
                        )}
                        {profile?.linkedin && (
                            <TouchableOpacity
                                style={[
                                    s.fillIcon,
                                    {paddingTop: 1, paddingLeft: 2},
                                ]}
                                onPress={() =>
                                    openSocialLink('linkedin', profile.linkedin)
                                }>
                                <SocialIcon
                                    name="linkedin"
                                    height={30}
                                    width={30}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    }
}

export default withTranslation('clubcard')(CardInformation);
