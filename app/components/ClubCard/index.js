import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../themes/colors';
import {SvgUri} from 'react-native-svg';
import {withTranslation} from 'react-i18next';
import AvatarImage from '../AvatarImage';

class ClubCard extends React.Component {
    isSVGValid(logo) {
        if (!logo) return false;
        return logo.toLowerCase().endsWith('.svg');
    }
    render() {
        const {
            t,
            onPress,
            unfold,
            club,
            disableShadow,
            containerStyle,
            feed,
            openCard,
            castVote,
        } = this.props;
        const profile = club && club.profile;
        const club_category = club && club.club_category;
        const panelcolor =
            club && club.color && club.color != 'null' ? club.color : null;

        const feedid = feed && feed.id;
        const action = feed && feed.action;
        const voted_for_deletion = club && club.voted_for_deletion;
        const deleting_in = club && club.deleting_in;
        return (
            <TouchableOpacity
                style={[
                    s.container,
                    containerStyle,
                    disableShadow ? {elevation: 1} : {},
                ]}
                onPress={() => onPress && onPress(club)}>
                <TouchableOpacity
                    style={[
                        s.header,
                        panelcolor ? {backgroundColor: panelcolor} : {},
                    ]}
                    onPress={() => {
                        if (feedid && openCard) openCard(feedid);
                        else onPress && onPress(club);
                    }}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
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
                                {club && club.name}
                            </Text>
                            {club && club.abbreviation ? (
                                <Text style={s.headerSubTitle}>
                                    {club && club.abbreviation}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    {this.isSVGValid(club_category?.logo_2?.original) ? (
                        <SvgUri
                            width="38"
                            height="38"
                            uri={club_category.logo_2.original}
                            fill="white"
                        />
                    ) : this.isSVGValid(club_category?.logo?.original) ? (
                        <SvgUri
                            width="38"
                            height="38"
                            uri={club_category.logo.original}
                            fill="white"
                        />
                    ) : (
                        <Icon name="calendar" size={35} color="white" />
                    )}
                </TouchableOpacity>
                {unfold && (
                    <View style={s.content}>
                        <View style={s.contentHeader}>
                            <View style={{flex: 1}}>
                                {club?.categories?.map(category => (
                                    <Text style={s.bodyHeaderTitle}>
                                        {category?.name}
                                    </Text>
                                ))}
                                <Text style={s.bodyHeaderSubTitle}>
                                    {club && club.location}
                                </Text>
                            </View>
                            <View>
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
                            </View>
                        </View>
                        <View style={s.body}>
                            <Text style={s.bodyText}>
                                {profile && profile.short_description}
                            </Text>
                            <Text style={s.bodyText}>
                                {profile && profile.long_description}
                            </Text>
                            {action == 'club-marked-for-deletion' && (
                                <View
                                    style={{
                                        alignItems: 'center',
                                        marginTop: 10,
                                    }}>
                                    <Text
                                        style={[
                                            s.showmoreLabel,
                                            {fontSize: 15},
                                        ]}>
                                        Do you agree to delete this club?
                                    </Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity
                                            style={[
                                                s.yesBtn,
                                                voted_for_deletion != null &&
                                                voted_for_deletion
                                                    ? {
                                                          borderColor: PRIMARY_COLOR,
                                                      }
                                                    : {
                                                          borderColor:
                                                              'transparent',
                                                      },
                                            ]}
                                            onPress={() =>
                                                !deleting_in &&
                                                castVote &&
                                                castVote(feed, 1)
                                            }>
                                            <Text style={s.yesBtnLabel}>
                                                Yes
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                s.noBtn,
                                                voted_for_deletion != null &&
                                                !voted_for_deletion
                                                    ? {
                                                          borderColor: PRIMARY_TEXT_COLOR,
                                                      }
                                                    : {
                                                          borderColor:
                                                              'transparent',
                                                      },
                                            ]}
                                            onPress={() =>
                                                !deleting_in &&
                                                castVote &&
                                                castVote(feed, 0)
                                            }>
                                            <Text style={[s.noBtnLabel]}>
                                                No
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                        {/*
                    <View style={s.contentFooter}>
                        <TouchableOpacity onPress={() => onPress && onPress(club)}>
                            <Text style={s.showmoreLabel}>Mehr anzeigen</Text>
                        </TouchableOpacity>
                        {
                            onFollow &&
                            <TouchableOpacity
                                style={[s.followBtn, club && club.is_user_following_this_club ? { backgroundColor: 'white', borderWidth: 1, borderColor: PRIMARY_COLOR } : {}]}
                                onPress={() => onFollow && onFollow(club)}>
                                <Text style={[s.followBtnLabel, club && club.is_user_following_this_club ? { color: PRIMARY_COLOR } : {}]}>{club && club.is_user_following_this_club ? 'Nicht Folgen' : 'Folgen'}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    */}
                    </View>
                )}
            </TouchableOpacity>
        );
    }
}

export default withTranslation('clubcard')(ClubCard);
