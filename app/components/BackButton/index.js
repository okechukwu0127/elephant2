import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {PRIMARY_TEXT_COLOR} from '../../themes/colors';

class BackButton extends React.Component {
    render() {
        return (
            <TouchableOpacity
                style={[{paddingHorizontal: 10}, this.props.style]}
                onPress={() =>
                    this.props.onPress
                        ? this.props.onPress()
                        : this.props.navigation.goBack &&
                          this.props.navigation.goBack()
                }>
                <Icon name="arrow-left" size={25} color={PRIMARY_TEXT_COLOR} />
            </TouchableOpacity>
        );
    }
}

export default BackButton;
