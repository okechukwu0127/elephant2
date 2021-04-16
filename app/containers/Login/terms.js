import React from 'react';
import {View, Text, TouchableOpacity, BackHandler} from 'react-native';
import s from './styles';
import {PRIMARY_COLOR} from '../../themes/colors';
import {showMessage} from '../../utils/utils';
import {ToggleSwitch} from '../../components';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {connect} from 'react-redux';
import {switchAuth} from '../../reducers/user';
import {
    getPrivacyPolicy,
    getDataProcessing,
    getTermsAndConditions,
    getImpressum,
} from '../../reducers/info';
import AsyncStorage from '@react-native-community/async-storage';

class Terms extends React.Component {
    state = {
        isTerms: true,
        isPolicy: true,
    };

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => true,
        );
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    getTermsItem(title, getData) {
        const {t} = this.props;
        return (
            <View style={s.termsItem}>
                <View style={{flex: 0.85}}>
                    <Text style={s.termsItemTitle}>{t(title)}</Text>
                    <TouchableOpacity
                        onPress={() =>
                            this.props.navigation.navigate('HTMLText', {
                                title: t(title),
                                getData,
                            })
                        }>
                        <Text style={s.termsItemSubTitle}>Mehr erfahren</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 0.15}}>
                    <ToggleSwitch
                        isOn={this.state[title]}
                        onColor={PRIMARY_COLOR}
                        offColor={'gray'}
                        label={''}
                        onToggle={isOn => {
                            this.setState({[title]: isOn});
                        }}
                    />
                </View>
            </View>
        );
    }

    render() {
        const {t, user, user_profile} = this.props;
        return (
            <View style={s.termscontainer}>
                <Text style={s.signuptitle}>
                    {t('title', {first_name: user && user.first_name})}
                </Text>
                <Text style={s.termsDescriotion}>{t('description')}</Text>
                {this.getTermsItem(
                    'terms_title',
                    this.props.getTermsAndConditions,
                )}
                {this.getTermsItem('order_title', this.props.getDataProcessing)}
                {this.getTermsItem('policy_title', this.props.getPrivacyPolicy)}
                <TouchableOpacity
                    style={s.confirmBtn}
                    onPress={async () => {
                        const {
                            order_title,
                            policy_title,
                            terms_title,
                        } = this.state;
                        if (!order_title || !policy_title || !terms_title) {
                            showMessage(
                                'You cannot continue without agreeing to all of the above',
                            );
                            return;
                        }
                        AsyncStorage.setItem('agreed_to_terms', 'true');
                        const nextAfterLogin = this.props.navigation.getParam();
                        await this.props.navigation.goBack();
                        console.log('=======nextAfterLogin', nextAfterLogin);
                        if (nextAfterLogin) {
                            await this.props.navigation.navigate(
                                nextAfterLogin,
                                {
                                    club_id: this.props.navigation.getParam(
                                        'club_id',
                                    ),
                                },
                            );
                        }
                        this.props.switchAuth();
                    }}>
                    <Text style={s.confirmBtnLabel}>{t('done')}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
    user_profile: state.user.user_profile,
});

const mapDispatchToProps = {
    switchAuth,
    getPrivacyPolicy,
    getDataProcessing,
    getTermsAndConditions,
    getImpressum,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('terms')(Terms), Terms));
