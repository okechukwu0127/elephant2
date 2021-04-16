import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {withTranslation} from 'react-i18next';
import {getUserName} from '../../utils/utils';
import AvatarImage from '../AvatarImage';

class CardBoardMember extends React.Component {
    render() {
        const {t, board_members, disableShadow} = this.props;

        return (
            <View style={[s.container, disableShadow ? {elevation: 1} : {}]}>
                <View style={s.header}>
                    <Text style={s.headerTitle}>{t('board')}</Text>
                    <Icon name="users" size={30} color="white" />
                </View>
                <View style={s.content}>
                    {board_members.map((item, index) => {
                        const {user, role} = item;
                        const profile = user ? user.profile : null;

                        return (
                            <TouchableOpacity
                                key={user ? user.id + '' : index}
                                style={[
                                    s.sectionItem,
                                    {
                                        borderBottomWidth:
                                            index == board_members.length - 1
                                                ? 0
                                                : 1,
                                    },
                                ]}
                                onPress={() => {
                                    this.props.navigation.navigate(
                                        'MemberProfile',
                                        {member_id: user?.id},
                                    );
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <View style={s.sectionImage}>
                                        <AvatarImage
                                            user_id={user?.id}
                                            width={40}
                                            user={user}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                        }}>
                                        <Text style={[s.memberName]}>
                                            {getUserName(user)}
                                        </Text>
                                        {role ? (
                                            <Text style={[s.memberDescription]}>
                                                {role.name}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    }
}

export default withTranslation('clubcard')(CardBoardMember);
