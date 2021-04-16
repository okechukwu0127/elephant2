import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {
    GRAY_COLOR,
    PRIMARY_COLOR,
    PRIMARY_TEXT_COLOR,
} from '../../themes/colors';
import {connect} from 'react-redux';
import {resetPassword} from '../../reducers/user';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {validateEmail} from '../../utils/utils';

class ForgotPassword extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerLeft: (
                <TouchableOpacity
                    style={s.backButton}
                    onPress={async () => {
                        navigation.goBack();
                    }}>
                    <Ionicon
                        name="md-arrow-back"
                        size={25}
                        color={PRIMARY_COLOR}
                    />
                </TouchableOpacity>
            ),
            headerRight: null,
        };
    };
    state = {
        email: undefined,
        focus: null,
    };

    render() {
        const {email, password, focus} = this.state;
        const {t} = this.props;
        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={s.container}
                enableOnAndroid={true}>
                <Text style={s.signuptitle}>{t('title')}</Text>
                <View
                    style={[
                        s.inputContainer,
                        {
                            borderBottomColor:
                                focus == 'email' ? PRIMARY_COLOR : '#C4C4C4',
                        },
                    ]}>
                    <Icon
                        name="user"
                        size={23}
                        color={
                            focus == 'email'
                                ? PRIMARY_COLOR
                                : PRIMARY_TEXT_COLOR
                        }
                        style={s.inputIcon}
                    />
                    <TextInput
                        style={[
                            s.input,
                            {
                                color:
                                    focus == 'email'
                                        ? PRIMARY_COLOR
                                        : PRIMARY_TEXT_COLOR,
                            },
                        ]}
                        placeholder={t('email')}
                        value={email}
                        onChangeText={email => this.setState({email})}
                        keyboardType="email-address"
                        onFocus={() => this.setState({focus: 'email'})}
                        onBlur={() => this.setState({focus: null})}
                        autoCapitalize="none"
                    />
                </View>
                <TouchableOpacity
                    disabled={!validateEmail(email)}
                    style={[
                        s.registerBtn,
                        validateEmail(email)
                            ? {}
                            : {
                                  backgroundColor: GRAY_COLOR,
                              },
                    ]}
                    onPress={() => {
                        if (email && email.length > 0)
                            this.props.resetPassword(email, res => {
                                if (res) this.props.navigation.goBack();
                            });
                    }}>
                    <Text style={s.registerBtnLabel}>{t('reset')}</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        );
    }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = {
    resetPassword,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    hoistStatics(
        withTranslation('forgotpassword')(ForgotPassword),
        ForgotPassword,
    ),
);
