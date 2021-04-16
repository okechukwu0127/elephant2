import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR} from '../../themes/colors';

class FeedCard2 extends React.Component {
    state = {unfold: false};
    render() {
        return (
            <View style={s.container}>
                <TouchableOpacity
                    style={s.header}
                    onPress={() => this.setState({unfold: !this.state.unfold})}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View style={s.avatar} />
                        <View>
                            <Text style={s.headerTitle}>Vereins-Name</Text>
                            <Text style={s.headerSubTitle}>Finanzen</Text>
                        </View>
                    </View>
                    <Icon name="bar-chart-2" size={35} color="white" />
                </TouchableOpacity>
                {this.state.unfold && (
                    <View style={s.content}>
                        <View style={s.contentHeader}>
                            <View>
                                <Text style={s.bodyHeaderTitle}>
                                    Mitgliederbeitrag
                                </Text>
                                <Text style={s.bodyHeaderSubTitle}>
                                    Card Caption
                                </Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={s.publicLabel}>Intern</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={s.body}>
                            <Text style={s.priceTxt}>CHF 100</Text>
                            <Text style={s.priceDescription}>
                                Offener Betrag
                            </Text>
                        </View>
                        <View style={s.dategroup}>
                            <View style={{marginRight: 10}}>
                                <Text style={s.date}>12. Juli 2020</Text>
                                <Text style={s.dateTitle}>Rechnungsdatum</Text>
                            </View>
                            <View>
                                <Text style={s.date}>12. August 2020</Text>
                                <Text style={s.dateTitle}>Zahlbar bis</Text>
                            </View>
                        </View>
                        <View style={s.contentFooter}>
                            <TouchableOpacity>
                                <View style={s.iconContainer}>
                                    <Icon
                                        name="credit-card"
                                        size={27}
                                        color={PRIMARY_COLOR}
                                    />
                                    <Text style={s.iconlabel}>Bezahlen</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={s.iconContainer}>
                                    <Icon
                                        name="bell"
                                        size={27}
                                        color={PRIMARY_COLOR}
                                    />
                                    <Text style={s.iconlabel}>Erinnern</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <View style={s.iconContainer}>
                                    <Icon
                                        name="file"
                                        size={27}
                                        color={'#40DCE4'}
                                    />
                                    <Text style={s.iconlabel}>Rechnung</Text>
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
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

export default FeedCard2;
