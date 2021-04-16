import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {GRAY_COLOR, PRIMARY_COLOR} from '../../themes/colors';

export default function Button(props) {
    return (
        <TouchableOpacity
            {...props}
            style={[
                {
                    backgroundColor: PRIMARY_COLOR,
                    paddingVertical: 10,
                    borderRadius: 10,
                    borderColor: PRIMARY_COLOR,
                    borderWidth: 1,
                    width: '100%',
                    alignItems: 'center',
                },
                props.style || {},
                props.disabled ? {backgroundColor: 'white'} : {},
                props.shadow
                    ? {
                          shadowColor: '#000',
                          shadowOffset: {
                              width: 0,
                              height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                      }
                    : {},
            ]}>
            <Text
                style={{
                    fontFamily: 'Rubik-Regular',
                    fontSize: 16,
                    color: !props.disabled ? 'white' : PRIMARY_COLOR,
                }}>
                {props.text}
            </Text>
        </TouchableOpacity>
    );
}
