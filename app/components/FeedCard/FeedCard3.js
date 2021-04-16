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

class FeedCard3 extends React.Component {
    render() {
        const {onPress} = this.props;
        return (
            <TouchableOpacity
                style={s.container}
                onPress={() => onPress && onPress()}>
                <View style={s.header}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View style={s.avatar}></View>
                        <View>
                            <Text style={s.headerTitle}>Vereins-Name</Text>
                            <Text style={s.headerSubTitle}>Rückblick</Text>
                        </View>
                    </View>
                    <Icon name="image" size={35} color="white" />
                </View>
                <View style={s.content}>
                    <View style={s.contentHeader}>
                        <View>
                            <Text style={s.bodyHeaderTitle}>
                                Mitgliederversammlung
                            </Text>
                            <Text style={s.bodyHeaderSubTitle}>
                                Bildergalerie
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={s.publicLabel}>Intern</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={s.imageGroup}>
                        <View style={s.imageRow}>
                            <View style={s.imagebox} />
                            <View style={s.imagebox} />
                        </View>
                        <View style={s.imageRow}>
                            <View style={s.imagebox} />
                            <View style={s.imagebox} />
                        </View>
                    </View>
                    <View style={s.contentFooter}>
                        <TouchableOpacity>
                            <View style={s.iconContainer}>
                                <Icon
                                    name="thumbs-up"
                                    size={27}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.iconlabel}>Gefällt mir</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={s.iconContainer}>
                                <Icon
                                    name="download"
                                    size={27}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.iconlabel}>Speichern</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={s.iconContainer}>
                                <Icon
                                    name="upload"
                                    size={27}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.iconlabel}>Teilen</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={s.iconContainer}>
                                <Icon
                                    name="message-circle"
                                    size={27}
                                    color={PRIMARY_COLOR}
                                />
                                <Text style={s.iconlabel}>Komentare</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default FeedCard3;
