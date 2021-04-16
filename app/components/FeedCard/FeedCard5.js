import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR} from '../../themes/colors';

class FeedCard5 extends React.Component {
    render() {
        const {onPress} = this.props;
        return (
            <View style={s.container} onPress={() => onPress && onPress()}>
                <TouchableOpacity style={s.header}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View style={s.avatar} />
                        <View>
                            <Text style={s.headerTitle}>Vereins-Name</Text>
                            <Text style={s.headerSubTitle}>
                                News | Mitglieder
                            </Text>
                        </View>
                    </View>
                    <Icon name="user" size={35} color="white" />
                </TouchableOpacity>
                <View style={s.content}>
                    <View style={s.contentHeader}>
                        <View>
                            <Text style={s.bodyHeaderTitle}>Neuzugang</Text>
                            <Text style={s.bodyHeaderSubTitle}>
                                Card Caption
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={s.publicLabel}>Intern</Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[
                            s.body,
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginVertical: 20,
                            },
                        ]}>
                        <View style={s.memberavatar} />
                        <View>
                            <Text style={s.membername}>Vorname Nachname</Text>
                            <Text style={s.membertext}>Vorstand</Text>
                        </View>
                    </View>
                    <View style={s.contentFooter}>
                        <TouchableOpacity>
                            <View style={s.iconContainer}>
                                <Icon
                                    name="user"
                                    size={27}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.iconlabel}>Kontakt</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={s.iconContainer}>
                                <Icon
                                    name="user-plus"
                                    size={27}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.iconlabel}>Speichern</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={s.iconContainer}>
                                <Icon
                                    name="facebook"
                                    size={27}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.iconlabel}>Facebook</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={[s.iconContainer, {opacity: 0}]}>
                                <Icon
                                    name="bookmark"
                                    size={27}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.iconlabel}>Vormerken</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default FeedCard5;
