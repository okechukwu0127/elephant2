import * as React from 'react';
import {View, TouchableOpacity, Text, ScrollView} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import {logout, updateUserProfile} from '../../reducers/user';
import {getClub, getClubProfile} from '../../reducers/club';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import ActionSheet from 'react-native-action-sheet';
import {PRIMARY_COLOR} from '../../themes/colors';
import {AvatarImage} from '../../components';
import {getBoardOfClubs} from '../../reducers/club';
class Clubs extends React.Component {
    state = {
        activeBtn: null,
        canCreate: false,
    };
    buttons = [
        {
            text: 'event',
            icon: 'calendar',
            onPress: () => {
                this.props.navigation.navigate('CreateEvent');
            },
        },
        {
            text: 'news',
            icon: 'bell',
            onPress: () => {
                this.props.navigation.navigate('CreateNews');
            },
        },
        {
            text: 'impression',
            icon: 'calendar',
            onPress: () => {
                this.props.navigation.navigate('CreateImpression');
            },
        },
        {
            text: 'finance',
            icon: 'bar-chart-2',
            onPress: () => {
                const cancelIndex = this.props.clubs_user.length;
                ActionSheet.showActionSheetWithOptions(
                    {
                        options: [
                            ...this.props.clubs_user.map(item => item.name),
                            'Abbrechen',
                        ],
                        tintColor: 'black',
                        cancelButtonIndex: cancelIndex,
                    },
                    index => {
                        if (index !== undefined && index !== cancelIndex) {
                            if (
                                this.props.clubs_user[index]
                                    .has_active_membership_plans
                            ) {
                                // this.onClose();
                                this.props.navigation.navigate(
                                    'Contributions',
                                    {
                                        club_id: this.props.clubs_user[index]
                                            .id,
                                        isZirklpay: this.props.clubs_user[index]
                                            .has_zirklpay,
                                    },
                                );
                            } else {
                                alert(this.props.t('nomembership'));
                            }
                        }
                    },
                );
            },
        },
    ];
    constructor(props) {
        super(props);
        const {user} = props;
        console.log('Clubs -> constructor -> user', user);
        if (!user) this.props.navigation.navigate('DiscoverTab');
        else
            props.getBoardOfClubs(user?.id, res => {
                if (res && res.length > 0) this.setState({canCreate: true});
            });
    }
    componentDidMount() {
        this.unsubsribe = this.props.navigation.addListener('willFocus', () => {
            const {user} = this.props;
            if (!user) return this.props.navigation.navigate('DiscoverTab');
            console.log('Clubs -> componentDidMount -> user', user);
            this.props.getBoardOfClubs(user?.id, res => {
                if (res && res.length > 0) this.setState({canCreate: true});
                else this.setState({canCreate: false});
            });
        });
    }
    componentWillUnmount() {
        if (this.unsubsribe && typeof this.unsubsribe === 'function') {
            this.unsubsribe();
        }
    }

    render() {
        const {t, clubs_user} = this.props;
        const {activeBtn} = this.state;
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <ScrollView>
                        <View style={s.topBar}>
                            <Text style={s.title}>{t('title')}</Text>
                        </View>
                        {this.state.canCreate && (
                            <>
                                <Text style={s.sectionName}>{t('create')}</Text>
                                <View style={[s.section, s.buttonsContainer]}>
                                    {this.buttons.map((button, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                s.btnContainer,
                                                activeBtn === index
                                                    ? {
                                                          backgroundColor: PRIMARY_COLOR,
                                                      }
                                                    : {},
                                            ]}
                                            onPress={button.onPress}
                                            onPressIn={() =>
                                                this.setState({
                                                    activeBtn: index,
                                                })
                                            }
                                            onPressOut={() =>
                                                this.setState({activeBtn: null})
                                            }
                                            activeOpacity={1}>
                                            <Icon
                                                name={button.icon}
                                                size={50}
                                                color={
                                                    activeBtn == index
                                                        ? 'white'
                                                        : PRIMARY_COLOR
                                                }
                                                style={s.btnIcon}
                                            />
                                            <Text
                                                style={[
                                                    s.btnLabel,
                                                    activeBtn == index
                                                        ? {color: 'white'}
                                                        : {},
                                                ]}>
                                                {t(button.text)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}

                        <Text style={s.sectionName}>{t('clubs')}</Text>
                        <View style={[s.section, s.buttonsContainer]}>
                            {clubs_user.length === 0 && (
                                <Text style={s.notFound}>{t('not-found')}</Text>
                            )}
                            {clubs_user.map((club, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[s.btnContainer]}
                                    onPress={() => {
                                        this.props.navigation.navigate(
                                            'ClubDetail',
                                            {
                                                club_id: club.id,
                                                backTo: 'Clubs',
                                            },
                                        );
                                    }}>
                                    <AvatarImage
                                        width={50}
                                        uri={club.photo && club.photo.original}
                                    />
                                    <Text
                                        style={[
                                            s.btnLabel,
                                            {
                                                marginTop: 8,
                                            },
                                        ]}>
                                        {club.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
    user_profile: state.user.user_profile,
    clubs_user: state.club.clubs_user,
    board_of_clubs: state.board_of_clubs,
});

const mapDispatchToProps = {
    logout,
    updateUserProfile,
    getClub,
    getClubProfile,
    getBoardOfClubs,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('clubs')(Clubs), Clubs));
