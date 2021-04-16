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
import {connect} from 'react-redux';
import Contacts from 'react-native-contacts';
import {withTranslation} from 'react-i18next';
import {getUserName} from '../../utils/utils';
import AvatarImage from '../AvatarImage';

class FeedCardPromote extends React.Component {
    render() {
        const {t, unfold, data, navigation, openCard} = this.props;

        const content = data && data.content;
        const user = content && content.user;
        const role = content && content.role;
        const club = content && content.club;
        const user_profile = user && user.profile;
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
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                        }}>
                        <View style={s.avatar}>
                            <AvatarImage
                                uri={club && club.photo && club.photo.original}
                                width={32}
                                user={{first_name: club && club.name}}
                                backgroundColor={'rgba(255,255,255,0.5)'}
                            />
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={s.headerTitle}>
                                {(club && club.name) || t('clubname')}
                            </Text>
                            <Text style={s.headerSubTitle}>
                                {t('newsmembers')}
                            </Text>
                        </View>
                    </View>
                    <Icon name="user" size={35} color="white" />
                </TouchableOpacity>
                {unfold && (
                    <View style={s.content}>
                        <View style={s.contentHeader}>
                            <View>
                                {/*<Text style={s.bodyHeaderTitle}>Mitgliederbeitrag</Text>*/}
                                <Text style={s.bodyHeaderSubTitle}>
                                    {t('promoted')}
                                </Text>
                            </View>
                            {/*
                            <TouchableOpacity>
                                <Text style={s.publicLabel}>Intern</Text>
                            </TouchableOpacity>
                            */}
                        </View>
                        <View
                            style={[
                                s.body,
                                {
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginVertical: 10,
                                },
                            ]}>
                            <View style={s.memberavatar}>
                                <AvatarImage
                                    user_id={user?.id}
                                    width={60}
                                    user={user}
                                    backgroundColor={PRIMARY_COLOR}
                                />
                            </View>
                            <View>
                                <Text style={s.membername}>
                                    {getUserName(user)}
                                </Text>
                                <Text style={s.membertext}>
                                    {role && role.name}
                                </Text>
                            </View>
                        </View>
                        <View style={s.contentFooter}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (
                                        user &&
                                        user.id &&
                                        this.props.user.id == user.id
                                    )
                                        this.props.navigation.navigate(
                                            'UserProfile',
                                        );
                                    else
                                        this.props.navigation.navigate(
                                            'MemberProfile',
                                            {member_id: user?.id},
                                        );
                                }}>
                                <View style={s.iconContainer}>
                                    <Icon
                                        name="user"
                                        size={27}
                                        color={PRIMARY_COLOR}
                                    />
                                    <Text style={s.iconlabel}>
                                        {t('profile')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    const member_profile = user && user.profile;
                                    let newPerson = {
                                        ...(member_profile &&
                                        member_profile.phone
                                            ? {
                                                  phoneNumbers: [
                                                      {
                                                          label: 'mobile',
                                                          number:
                                                              member_profile.phone,
                                                      },
                                                  ],
                                              }
                                            : {}),
                                        emailAddresses: [
                                            {
                                                label: 'work',
                                                email:
                                                    user && user.email
                                                        ? user.email
                                                        : '',
                                            },
                                        ],
                                        ...(Platform.OS == 'ios' &&
                                        user &&
                                        user.first_name
                                            ? {
                                                  givenName:
                                                      user && user.first_name,
                                              }
                                            : {
                                                  displayName:
                                                      user && user.first_name,
                                              }),
                                    };

                                    Contacts.openContactForm(newPerson, err => {
                                        if (err) console.warn(err);
                                        // form is open
                                    });
                                }}>
                                <View style={s.iconContainer}>
                                    <Icon
                                        name="user-plus"
                                        size={27}
                                        color={PRIMARY_COLOR}
                                    />
                                    <Text style={s.iconlabel}>
                                        {t('contact')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={[s.iconContainer, {opacity: 0}]}>
                                <Icon
                                    name="bookmark"
                                    size={27}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.iconlabel}>Vormerken</Text>
                            </View>
                            <View style={[s.iconContainer, {opacity: 0}]}>
                                <Icon
                                    name="bookmark"
                                    size={27}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.iconlabel}>Vormerken</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
});

const mapDispatchToProps = {};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation('feedcard')(FeedCardPromote));
