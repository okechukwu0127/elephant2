import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {PRIMARY_COLOR} from '../../../../themes/colors';
import ClearButton from '../../../../components/ClearButton';
import Icon from 'react-native-vector-icons/Feather';

export default function Field({
    label,
    onChange,
    borderBottom,
    value,
    multiline,
    categoryField,
    onPress,
    closeButton,
    onEdit,
    noCaps,
    inputType,
}) {
    const [editing, setEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const inputRef = useRef(null);

    useEffect(() => {
        if (editing) inputRef.current.focus();
    }, [editing]);

    const shouldShowValue = () =>
        !(
            !value ||
            value.length === 0 ||
            (inputType === 'url' && value === 'https://')
        );

    return (
        <View
            style={{
                flexDirection: 'row',
                borderBottomWidth: borderBottom ? 0.5 : 0,
                borderBottomColor: '#C8C7CC',
                paddingVertical: 12,
                height: multiline ? 150 : 50,
            }}>
            {editing ? (
                <TextInput
                    multiline={multiline}
                    numberOfLines={multiline ? 5 : 1}
                    style={{
                        fontSize: 16,
                        fontFamily: 'Rubik-Regular',
                        textAlign: 'left',
                        color: PRIMARY_COLOR,
                        width: '100%',
                        padding: 0,
                    }}
                    ref={inputRef}
                    onBlur={() => {
                        setEditing(false);
                        onChange(currentValue);
                    }}
                    value={currentValue}
                    onChangeText={val => {
                        setCurrentValue(val);
                        onChange(val);
                    }}
                    placeholder={label}
                    autoCapitalize={noCaps ? 'none' : 'sentences'}
                    keyboardType={inputType || 'default'}
                />
            ) : (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'center',
                    }}>
                    <TouchableOpacity
                        style={{
                            maxWidth: '75%',
                        }}
                        onPress={() => {
                            if (categoryField) {
                                onEdit && onEdit();
                                return;
                            }
                            value && value.length > 0 && setEditing(true);
                        }}>
                        <Text
                            style={{
                                fontFamily: 'Rubik-Regular',
                                fontSize: 16,
                                minHeight: multiline ? 100 : 0,
                            }}>
                            {shouldShowValue() ? value : label}
                        </Text>
                    </TouchableOpacity>

                    {shouldShowValue() ? (
                        <View>
                            <ClearButton
                                onPress={() => {
                                    setEditing(true);
                                    setCurrentValue('');
                                }}
                            />
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => {
                                if (!categoryField) setEditing(true);
                                else onPress();
                            }}>
                            {closeButton ? (
                                <View>
                                    <ClearButton onPress={onPress} />
                                </View>
                            ) : (
                                <Icon
                                    name={'plus'}
                                    size={23}
                                    color={PRIMARY_COLOR}
                                />
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
}
