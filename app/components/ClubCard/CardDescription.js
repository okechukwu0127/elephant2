import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import s from './styles';
import {PRIMARY_COLOR} from '../../themes/colors';
import IconZirkl from '../../assets/icon_zirkl.png';
import {withTranslation} from 'react-i18next';

class CardDescription extends React.Component {
    render() {
        const {t, club, disableShadow} = this.props;
        const profile = club && club.profile;

        return (
            <View style={[s.container, disableShadow ? {elevation: 1} : {}]}>
                <View style={s.header}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                        }}>
                        <View style={s.avatar}>
                            {club && club.photo && club.photo.original && (
                                <Image
                                    source={{uri: club.photo.original}}
                                    style={s.avatarImg}
                                />
                            )}
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={s.headerTitle}>
                                {club && club.name}
                            </Text>
                        </View>
                    </View>
                    <Image
                        style={{
                            width: 50,
                            height: 50,
                            resizeMode: 'contain',
                            borderRadius: 50,
                        }}
                        source={IconZirkl}
                    />
                </View>
                <View style={s.content}>
                    <View style={s.contentHeader}>
                        <View style={{flex: 1}}>
                            {club &&
                                club.categories &&
                                club.categories.map((category, index) => (
                                    <Text key={index} style={s.bodyHeaderTitle}>
                                        {category.name}
                                    </Text>
                                ))}
                            {/*<Text style={s.bodyHeaderSubTitle}>{club && club.location}</Text>*/}
                        </View>
                        <TouchableOpacity>
                            <Text style={s.publicLabel}>
                                {club && !!club.visibility
                                    ? t('public')
                                    : t('private')}
                            </Text>
                            <Text
                                style={[
                                    s.publicLabel,
                                    {
                                        color:
                                            club && !!club.active
                                                ? PRIMARY_COLOR
                                                : '#88919E',
                                    },
                                ]}>
                                {club && !!club.active
                                    ? t('active')
                                    : t('inactive')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={s.body}>
                        <Text style={s.bodyText}>
                            {profile && profile.long_description}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}

export default withTranslation('clubcard')(CardDescription);
