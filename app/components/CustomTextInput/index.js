import React from 'react';
import {View, TouchableOpacity, TextInput} from 'react-native';

export default class CustomTextInput extends React.Component {
    render() {
        const {touchStyle} = this.props;
        return (
            <TouchableOpacity
                onPress={() => this.input.focus()}
                style={[touchStyle, {flex: 1}]}>
                <View>
                    <TextInput
                        ref={input => (this.input = input)}
                        {...this.props}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}
