import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {PRIMARY_COLOR, PRIMARY_TEXT_COLOR} from '../../themes/colors';
import {connect} from 'react-redux';
import {createUser, createUserProfile} from '../../reducers/user';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showMessage, formatPhoneNumber} from '../../utils/utils';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import * as yup from 'yup';

class Signup extends React.Component {
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
        first_name: undefined,
        last_name: undefined,
        email: undefined,
        phone: null,
        password: undefined,
        focus: null,
        loading: false,
    };
    async createUser() {
        if (this.state.loading) return;
        const {t} = this.props;

        const schema = yup.object().shape({
            first_name: yup.string('AAAA').required(t('field_required')),
            last_name: yup.string().required(t('field_required')),
            email: yup.string().when('phone', {
                is: val => ['+41', '+41 '].includes(val) || !val,
                then: yup
                    .string()
                    .email(t('invalid_email'))
                    .required(t('mail_or_phone')),
                otherwise: yup
                    .string()
                    .email(t('invalid_email'))
                    .nullable(),
            }),
            phone: yup
                .string()
                .matches(/\+41[0-9]*/g)
                .nullable(),
            password: yup
                .string()
                .min(8)
                .required(t('field_required')),
        });

        let {first_name, last_name, phone, email, password} = this.state;
        phone = ['+41 ', '+41'].includes(phone) ? null : phone;

        const isValid = await schema
            .validate({
                first_name: first_name,
                last_name,
                phone,
                email,
                password,
            })
            .catch(reason => {
                console.log(
                    '🚀 ~ file: signup.js ~ line 73 ~ Signup ~ createUser ~ reason',
                    reason,
                );
                showMessage(reason?.message);
            });

        if (!isValid) return;
        this.setState({loading: true});
        console.log('Sending data', {
            phone,
            email,
            password,
            last_name,
            first_name,
        });
        this.props.createUser(
            {
                phone,
                email,
                password,
                last_name,
                first_name,
            },
            user => {
                this.setState({loading: false});
                if (user) {
                    this.props.createUserProfile(user.id, {
                        registered_with_tool: 'email',
                        paypal_email: user.email,
                        phone: this.state.phone,
                        street: null,
                        city: null,
                        region: null,
                        zip: null,
                        push_notifications: true,
                        news_notifications: true,
                        events_notifications: true,
                        members_notifications: true,
                    });
                    const nextAfterSignout = this.props.navigation.getParam(
                        'nextAfterSignout',
                    );
                    this.props.navigation.goBack();
                    this.props.navigation.navigate('Terms', {
                        nextAfterSignout,
                    });
                }
            },
        );
    }
    render() {
        const {
            first_name,
            last_name,
            email,
            phone,
            password,
            focus,
            loading,
        } = this.state;
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
                                focus == 'user' ? PRIMARY_COLOR : '#C4C4C4',
                        },
                    ]}>
                    <Icon
                        name="user"
                        size={23}
                        color={
                            focus == 'user' ? PRIMARY_COLOR : PRIMARY_TEXT_COLOR
                        }
                        style={s.inputIcon}
                    />
                    <View
                        style={{
                            flexDirection: 'row',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <TextInput
                            style={[
                                s.input,
                                {
                                    color:
                                        focus == 'user'
                                            ? PRIMARY_COLOR
                                            : PRIMARY_TEXT_COLOR,
                                    flex: 0.5,
                                },
                            ]}
                            value={first_name}
                            placeholder={t('firstname')}
                            onChangeText={first_name =>
                                this.setState({first_name})
                            }
                            onFocus={() => this.setState({focus: 'user'})}
                            onBlur={() => this.setState({focus: null})}
                        />
                        <TextInput
                            style={[
                                s.input,
                                {
                                    color:
                                        focus == 'user'
                                            ? PRIMARY_COLOR
                                            : PRIMARY_TEXT_COLOR,
                                    flex: 0.5,
                                },
                            ]}
                            value={last_name}
                            placeholder={t('lastname')}
                            onChangeText={last_name =>
                                this.setState({last_name})
                            }
                            onFocus={() => this.setState({focus: 'user'})}
                            onBlur={() => this.setState({focus: null})}
                        />
                    </View>
                </View>
                <View
                    style={[
                        s.inputContainer,
                        {borderBottomWidth: 0, marginBottom: 0},
                    ]}>
                    <Icon
                        name="mail"
                        size={20}
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
                                    focus == 'mail'
                                        ? PRIMARY_COLOR
                                        : PRIMARY_TEXT_COLOR,
                            },
                        ]}
                        value={email}
                        placeholder={t('email')}
                        keyboardType="email-address"
                        onChangeText={email => this.setState({email})}
                        onFocus={() => this.setState({focus: 'email'})}
                        onBlur={() => this.setState({focus: null})}
                        autoCapitalize="none"
                    />
                </View>
                <View style={[s.dividerContainer, {marginTop: -7}]}>
                    <View style={s.divider} />
                    <Text style={[s.order, {marginVertical: 0}]}>
                        {t('or')}
                    </Text>
                    <View style={s.divider} />
                </View>
                <View
                    style={[
                        s.inputContainer,
                        {
                            borderBottomColor:
                                focus == 'phone' ? PRIMARY_COLOR : '#C4C4C4',
                        },
                    ]}>
                    <Icon
                        name="phone"
                        size={20}
                        color={
                            focus == 'phone'
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
                                    focus == 'phone'
                                        ? PRIMARY_COLOR
                                        : PRIMARY_TEXT_COLOR,
                            },
                        ]}
                        value={phone === null ? '+41 ' : phone}
                        placeholder={t('phone')}
                        onChangeText={phone => this.setState({phone})}
                        onFocus={() => this.setState({focus: 'phone'})}
                        onBlur={() =>
                            this.setState({
                                focus: null,
                                phone: formatPhoneNumber(phone),
                            })
                        }
                        keyboardType="phone-pad"
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
                        size={20}
                        color={
                            focus == 'password'
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
                                    focus == 'password'
                                        ? PRIMARY_COLOR
                                        : PRIMARY_TEXT_COLOR,
                            },
                        ]}
                        secureTextEntry={true}
                        value={password}
                        placeholder={t('password')}
                        onChangeText={password => this.setState({password})}
                        onFocus={() => this.setState({focus: 'password'})}
                        onBlur={() => this.setState({focus: null})}
                        returnKeyType="done"
                        onEndEditing={() => {
                            //this.createUser()
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={s.registerBtn}
                    onPress={() => this.createUser()}>
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={s.registerBtnLabel}>{t('register')}</Text>
                    )}
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        );
    }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = {
    createUser,
    createUserProfile,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('signupform')(Signup), Signup));
