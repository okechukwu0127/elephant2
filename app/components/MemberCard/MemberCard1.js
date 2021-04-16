import React from 'react';
import {
    View,
    Text,
    Linking,
    TouchableOpacity,
    Platform,
    Alert,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import FASIcon from 'react-native-vector-icons/FontAwesome';
import {formatPhoneNumber} from '../../utils/utils';
import {withTranslation} from 'react-i18next';
import {openSocialLink} from '../../utils/utils';
import {SocialIcon} from '../../components';
import {
    BACKGROUND_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';

class MemberCard1 extends React.Component {
    render() {
        const {
            t,
            address,
            phone,
            mobile,
            email,
            website,
            facebook,
            instagram,
            linkedin,
            twitter,
            xing,
            disableShadow,
        } = this.props;

        console.log('PROPS', this.props.website);

        return (
            <View style={[s.container, disableShadow ? {elevation: 1} : {}]}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>{t('contact')}</Text>
                    <Icon name="home" size={30} color="white" />
                </View>
                <View style={s.content}>
                    {phone && phone.length > 0 && (
                        <TouchableOpacity
                            style={s.cardItem}
                            onPress={() =>
                                Alert.alert('', phone, [
                                    {
                                        text: 'Abbrechen',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Anrufen',
                                        style: 'default',
                                        onPress: () =>
                                            Linking.openURL(
                                                `tel:${phone.replace(
                                                    / /g,
                                                    '',
                                                )}`,
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
                                {phone ? formatPhoneNumber(phone) : ''}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {mobile && (
                        <TouchableOpacity
                            style={s.cardItem}
                            onPress={() =>
                                mobile && Linking.openURL(`tel:${mobile}`)
                            }>
                            <Icon
                                name="tablet"
                                size={25}
                                color={PRIMARY_COLOR}
                                style={s.cardItemIcon}
                            />
                            <Text style={s.cardItemText}>
                                {mobile ? formatPhoneNumber(mobile) : ''}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {email && (
                        <TouchableOpacity
                            style={s.cardItem}
                            onPress={() =>
                                email && Linking.openURL(`mailto:${email}`)
                            }>
                            <Icon
                                name="at-sign"
                                size={25}
                                color={PRIMARY_COLOR}
                                style={s.cardItemIcon}
                            />
                            <Text style={s.cardItemText}>{email}</Text>
                        </TouchableOpacity>
                    )}
                    {!!address && address.length > 0 && (
                        <TouchableOpacity
                            style={[s.cardItem]}
                            onPress={() => {
                                if (Platform.OS == 'android')
                                    Linking.openURL(
                                        `http://maps.google.com/maps?daddr=${address}`,
                                    );
                                else
                                    Linking.openURL(
                                        `http://maps.apple.com/maps?daddr=${address}`,
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
                    {(xing || linkedin || website) && (
                        <View style={s.cardItem}>
                            <Icon
                                name="user"
                                size={25}
                                color={PRIMARY_COLOR}
                                style={s.cardItemIcon}
                            />
                            {xing && (
                                <TouchableOpacity
                                    style={[
                                        s.fillIcon,
                                        xing ? {} : {backgroundColor: 'gray'},
                                    ]}
                                    onPress={() =>
                                        xing && openSocialLink('xing', xing)
                                    }>
                                    <SocialIcon
                                        name="xing"
                                        height={30}
                                        width={30}
                                    />
                                </TouchableOpacity>
                            )}
                            {linkedin && (
                                <TouchableOpacity
                                    style={[
                                        s.fillIcon,
                                        linkedin
                                            ? {}
                                            : {backgroundColor: 'gray'},
                                    ]}
                                    onPress={() =>
                                        linkedin &&
                                        openSocialLink('linkedin', linkedin)
                                    }>
                                    <SocialIcon
                                        name="linkedin"
                                        height={30}
                                        width={30}
                                    />
                                </TouchableOpacity>
                            )}
                            {website && (
                                <TouchableOpacity
                                    style={[s.fillIcon, ,]}
                                    onPress={() =>
                                        website && Linking.openURL(website)
                                    }>
                                    <SocialIcon
                                        name="website"
                                        height={30}
                                        width={30}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    {(twitter || facebook || instagram) && (
                        <View style={s.cardItem}>
                            <Icon
                                name="user"
                                size={25}
                                color={PRIMARY_COLOR}
                                style={[s.cardItemIcon, {opacity: 0}]}
                            />
                            {twitter && (
                                <TouchableOpacity
                                    style={[
                                        s.fillIcon,
                                        twitter
                                            ? {}
                                            : {backgroundColor: 'gray'},
                                    ]}
                                    onPress={() =>
                                        twitter &&
                                        openSocialLink('twitter', twitter)
                                    }>
                                    <SocialIcon
                                        name="twitter"
                                        height={30}
                                        width={30}
                                    />
                                </TouchableOpacity>
                            )}
                            {facebook && (
                                <TouchableOpacity
                                    style={[
                                        s.fillIcon,
                                        facebook
                                            ? {}
                                            : {backgroundColor: 'gray'},
                                    ]}
                                    onPress={() =>
                                        facebook &&
                                        openSocialLink('facebook', facebook)
                                    }>
                                    <SocialIcon
                                        name="facebook"
                                        height={30}
                                        width={30}
                                    />
                                </TouchableOpacity>
                            )}
                            {instagram && (
                                <TouchableOpacity
                                    style={[
                                        s.fillIcon,
                                        instagram
                                            ? {}
                                            : {backgroundColor: 'gray'},
                                    ]}
                                    onPress={() =>
                                        instagram &&
                                        openSocialLink('instagram', instagram)
                                    }>
                                    <SocialIcon
                                        name="instagram"
                                        height={30}
                                        width={30}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </View>
        );
    }
}

export default withTranslation('membercard')(MemberCard1);
