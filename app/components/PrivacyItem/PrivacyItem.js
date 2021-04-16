import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import FASIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_TEXT_COLOR, PRIMARY_COLOR} from '../../themes/colors';

const s = StyleSheet.create({
    sectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    sectionItemLabel: {
        fontSize: 14,
        color: PRIMARY_TEXT_COLOR,
        fontFamily: 'Rubik-Regular',
        paddingVertical: 15,
        marginLeft: 5,
    },
    sectionRightLabel: {
        fontSize: 14,
        color: '#8F8F8F',
        fontFamily: 'Rubik-Regular',
    },
    sectionRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default function PrivacyItem({
    t,
    text,
    name,
    value,
    onPress,
    visible,
    icon,
}) {
    if (visible === false) return <></>;
    const getIcon = icon_name =>
        icon_name === 'xing' ? (
            <FASIcon name="xing" size={16} color={PRIMARY_COLOR} />
        ) : (
            <Icon name={icon_name} size={16} color={PRIMARY_COLOR} />
        );
    return (
        <TouchableOpacity
            style={[s.sectionItem, {borderBottomWidth: 0}]}
            onPress={() => {
                onPress(name);
            }}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                {icon && getIcon(icon)}
                <Text style={s.sectionItemLabel}>{text || t(name)}</Text>
            </View>
            <View style={s.sectionRight}>
                <Text style={s.sectionRightLabel}>{value}</Text>
                <Icon
                    name="chevron-right"
                    size={20}
                    color="#C7C7CC"
                    style={{marginLeft: 10}}
                />
            </View>
        </TouchableOpacity>
    );
}
