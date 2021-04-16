import React, {useState, useRef, useEffect} from 'react';
import {View, TextInput, Text, TouchableOpacity} from 'react-native';
import FASIcon from 'react-native-vector-icons/FontAwesome';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_COLOR, GRAY_COLOR} from '../../../themes/colors';

export default function SocialProfile({name, value, prefix, domain, onChange}) {
    const inputRef = useRef(null);
    const [editing, setEditing] = useState(false);
    useEffect(() => {
        if (editing) inputRef.current.focus();
    }, [editing]);
    const show_values = value && value.split(prefix);

    return (
        <View
            style={[
                s.sectionItem,
                {
                    minHeight: 50,
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                    ...(editing
                        ? {
                              borderBottomColor: PRIMARY_COLOR,
                          }
                        : {}),
                },
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FASIcon
                    name={name}
                    size={15}
                    color="#642FD0"
                    style={[s.icon, {marginRight: 10}]}
                />
                {!editing && (
                    <Text style={{fontFamily: 'Rubik-Light', fontSize: 14}}>
                        {domain}
                    </Text>
                )}
            </View>

            {editing ? (
                <TextInput
                    style={[
                        s.textInput,
                        {textAlign: 'right', color: PRIMARY_COLOR},
                    ]}
                    value={value}
                    ref={inputRef}
                    multiline={true}
                    defaultValue={prefix}
                    numberOfLines={1}
                    onBlur={() => {
                        if (value && !value.startsWith(prefix)) onChange(null);
                        setEditing(false);
                    }}
                    onChangeText={val => {
                        onChange(val);
                    }}
                />
            ) : (
                <TouchableOpacity
                    style={{alignItems: 'center'}}
                    onPress={() => setEditing(true)}>
                    {show_values && show_values.length > 0 ? (
                        <Text style={{color: GRAY_COLOR, fontSize: 14}}>
                            {show_values.length == 1
                                ? show_values[0]
                                : show_values[1]}
                        </Text>
                    ) : (
                        <Icon name="plus" size={17} color={PRIMARY_COLOR} />
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
}
