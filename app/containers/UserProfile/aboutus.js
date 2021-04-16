import * as React from 'react';
import {View, TouchableOpacity, Text, ScrollView} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_TEXT_COLOR} from '../../themes/colors';
import {connect} from 'react-redux';
import {logout, updateUserProfile} from '../../reducers/user';
import AppConfig from '../../config/AppConfig';
import FASIcon from 'react-native-vector-icons/FontAwesome';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {openSocialLink, getUserName} from '../../utils/utils';
import {AvatarImage} from '../../components';

class AboutUs extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            header: null,
        };
    };
    state = {
        avatar: null,
    };
    constructor(props) {
        super(props);
    }
    render() {
        const {t, user, user_profile} = this.props;
        return (
            <View style={s.container}>
                <View style={s.wrapper}>
                    <ScrollView>
                        <View style={s.topBar}>
                            <Text style={s.title}>{t('title')}</Text>
                            <TouchableOpacity
                                style={{borderRadius: 30, overflow: 'hidden'}}
                                onPress={() => this.props.navigation.goBack()}>
                                <Icon
                                    name="x"
                                    color="white"
                                    size={17}
                                    style={{
                                        fontWeight: '100',
                                        backgroundColor: PRIMARY_TEXT_COLOR,
                                        width: 35,
                                        height: 35,
                                        textAlign: 'center',
                                        paddingTop: 8,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={s.header}>
                            <View style={s.avatar}>
                                <AvatarImage
                                    uri={
                                        user_profile &&
                                        user_profile.avatar &&
                                        user_profile.avatar.original
                                    }
                                    width={80}
                                    user={user}
                                />
                            </View>
                            <Text style={s.name}>{getUserName(user)}</Text>
                        </View>
                        <View style={s.section}>
                            <Text style={s.sectionName}>{t('aboutus')}</Text>
                            <TouchableOpacity
                                style={s.sectionItem}
                                onPress={() =>
                                    user_profile &&
                                    user_profile.website &&
                                    openSocialLink(
                                        'website',
                                        user_profile.website,
                                    )
                                }>
                                <Icon
                                    name="globe"
                                    size={15}
                                    color="#642FD0"
                                    style={s.icon}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {user_profile && user_profile.website}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={s.sectionItem}
                                onPress={() =>
                                    user_profile &&
                                    user_profile.facebook &&
                                    openSocialLink(
                                        'facebook',
                                        user_profile.facebook,
                                    )
                                }>
                                <Icon
                                    name="facebook"
                                    size={15}
                                    color="#642FD0"
                                    style={s.icon}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {user_profile && user_profile.facebook}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={s.sectionItem}
                                onPress={() =>
                                    user_profile &&
                                    user_profile.instagram &&
                                    openSocialLink(
                                        'instagram',
                                        user_profile.instagram,
                                    )
                                }>
                                <Icon
                                    name="instagram"
                                    size={15}
                                    color="#642FD0"
                                    style={s.icon}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {user_profile && user_profile.instagram}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={s.sectionItem}
                                onPress={() =>
                                    user_profile &&
                                    user_profile.linkedin &&
                                    openSocialLink(
                                        'linkedin',
                                        user_profile.linkedin,
                                    )
                                }>
                                <Icon
                                    name="linkedin"
                                    size={15}
                                    color="#642FD0"
                                    style={s.icon}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {user_profile && user_profile.linkedin}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={s.sectionItem}
                                onPress={() =>
                                    user_profile &&
                                    user_profile.twitter &&
                                    openSocialLink(
                                        'twitter',
                                        user_profile.twitter,
                                    )
                                }>
                                <Icon
                                    name="twitter"
                                    size={15}
                                    color="#642FD0"
                                    style={s.icon}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {user_profile && user_profile.twitter}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={s.sectionItem}
                                onPress={() =>
                                    user_profile &&
                                    user_profile.xing &&
                                    openSocialLink('xing', user_profile.xing)
                                }>
                                <FASIcon
                                    name="xing"
                                    size={15}
                                    color="#642FD0"
                                    style={s.icon}
                                />
                                <Text style={s.sectionItemLabel}>
                                    {user_profile && user_profile.xing}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={s.version}>{t('version')} 1.0</Text>
                        <Text style={[s.version, {marginTop: 0}]}>
                            {AppConfig.developMode ? 'Test App' : 'Staging App'}
                        </Text>
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
});

const mapDispatchToProps = {
    logout,
    updateUserProfile,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('aboutus')(AboutUs), AboutUs));
