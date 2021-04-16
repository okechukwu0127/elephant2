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
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../themes/colors';
import {connect} from 'react-redux';
import {login} from '../../reducers/user';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';

class Login extends React.Component {
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
        password: undefined,
        focus: null,
    };
    render() {
        const {email, password, focus} = this.state;
        const {t} = this.props;
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={s.container}
                enableOnAndroid={true}
                keyboardShouldPersistTaps="handled">
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
                        placeholder={t('emailornumber')}
                        value={email}
                        onChangeText={email => this.setState({email})}
                        keyboardType="email-address"
                        onFocus={() => this.setState({focus: 'email'})}
                        onBlur={() => this.setState({focus: null})}
                        autoCapitalize="none"
                    />
                </View>
                <View
                    style={[
                        s.inputContainer,
                        {
                            borderBottomColor:
                                focus == 'password' ? PRIMARY_COLOR : '#C4C4C4',
                        },
                    ]}>
                    <Icon
                        name="lock"
                        size={21}
                        color={
                            focus == 'password'
                                ? PRIMARY_COLOR
                                : PRIMARY_TEXT_COLOR
                        }
                        style={s.inputIcon}
                    />
                    <TextInput
                        placeholder={t('password')}
                        value={password}
                        onChangeText={password => this.setState({password})}
                        style={[
                            s.input,
                            {
                                color:
                                    focus == 'password'
                                        ? PRIMARY_COLOR
                                        : PRIMARY_TEXT_COLOR,
                            },
                        ]}
                        secureTextEntry={true}
                        onFocus={() => this.setState({focus: 'password'})}
                        onBlur={() => this.setState({focus: null})}
                    />
                </View>
                <TouchableOpacity
                    style={s.forgotBtn}
                    onPress={() => this.props.navigation.navigate('Forgot')}>
                    <Text style={s.forgotLabel}>{t('forgot')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={s.registerBtn}
                    onPress={() => {
                        this.props.login(this.state, res => {
                            if (res) {
                                const nextAfterLogin = this.props.navigation.getParam(
                                    'nextAfterLogin',
                                );
                                this.props.navigation.goBack();
                                if (nextAfterLogin) {
                                    this.props.navigation.navigate(
                                        nextAfterLogin,
                                    );
                                }
                            }
                        });
                    }}>
                    <Text style={s.registerBtnLabel}>{t('login')}</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        );
    }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = {
    login,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('loginform')(Login), Login));
