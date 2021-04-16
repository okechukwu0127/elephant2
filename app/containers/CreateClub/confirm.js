import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import s from './styles';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {PRIMARY_COLOR} from '../../themes/colors';
import {ToggleSwitch} from '../../components';
import {connect} from 'react-redux';
import {updateClub, getClub, getClubProfile} from '../../reducers/club';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';

class ConfirmClub extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerLeft: (
                <TouchableOpacity
                    style={s.backButton}
                    onPress={async () => {
                        navigation.popToTop();
                    }}>
                    <Ionicon
                        name="md-arrow-back"
                        size={25}
                        color={PRIMARY_COLOR}
                    />
                </TouchableOpacity>
            ),
            headerRight: null,
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            visibility:
                props.user && props.user.visibility
                    ? !!props.user.visibility
                    : false,
        };
        const club_id = props.navigation.getParam('club_id');
        const param = props.navigation.getParam('param');
        if (club_id) {
            props.getClub(club_id);
            props.getClubProfile(club_id, param);
        }
    }
    UNSAFE_componentWillReceiveProps(nextprops) {
        if (this.props.club && nextprops.club) {
            this.setState({
                visibility:
                    nextprops.club && nextprops.club.visibility
                        ? !!nextprops.club.visibility
                        : false,
            });
        }
    }
    render() {
        const {t, club, club_profile} = this.props;
        console.log('club', club);
        console.log('club_profile', club_profile);
        return (
            <View style={s.termscontainer}>
                {club && club.name ? (
                    <Text style={s.signuptitle}>{club.name}</Text>
                ) : null}
                {<Text style={s.termsDescriotion}>{t('message')}</Text>}
                <View style={s.termsItem}>
                    <View>
                        <Text style={s.termsItemTitle}>{t('private')}</Text>
                    </View>
                    <View>
                        <ToggleSwitch
                            isOn={this.state.visibility}
                            onColor={PRIMARY_COLOR}
                            offColor={'gray'}
                            label={''}
                            onToggle={isOn => {
                                this.setState({visibility: isOn});
                            }}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={s.confirmBtn}
                    onPress={async () => {
                        if (club) {
                            var param = {
                                name: club.name,
                                taken: club.taken,
                                canton: club.canton,
                                founded: club.founded,
                                location: club.location,
                                abbreviation: club.abbreviation,
                                visibility: this.state.visibility ? 1 : 0,
                                club_category_id:
                                    club.club_category && club.club_category.id,
                                is_user_following_this_club:
                                    club.is_user_following_this_club,
                                is_user_member_of_club:
                                    club.is_user_member_of_club,
                                total_members: club.total_members,
                                total_followers: club.total_followers,
                                active: club.active,
                                lat: club.lat,
                                lng: club.lng,
                                color: club.color,
                            };

                            await this.props.updateClub(club.id, {...param});
                            await this.props.navigation.goBack();
                            await this.props.navigation.navigate(
                                'ClubEditInfo',
                            );
                        }
                    }}>
                    <Text style={s.confirmBtnLabel}>{t('confirm')}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
    club: state.club.club,
    club_profile: state.club.club_profile,
});

const mapDispatchToProps = {
    getClub,
    getClubProfile,
    updateClub,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    hoistStatics(
        withTranslation(['createclubconfirm'])(ConfirmClub),
        ConfirmClub,
    ),
);
