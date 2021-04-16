import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import s from './styles';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {BACKGROUND_COLOR, PRIMARY_COLOR} from '../../themes/colors';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {withTranslation} from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';
import {BackButton} from '../../components';

class QRCode extends React.Component {
    static navigationOptions = ({navigation, screenProps}) => {
        return {
            headerLeft: <BackButton navigation={navigation} />,
            headerRight: null,
        };
    };
    state = {
        page: 0,
        activeBtn: null,
    };
    constructor(props) {
        super(props);
        this.onSuccess = this.onSuccess.bind(this);
    }
    renderButton(index, icon, text, callback, hasPlus) {
        const {activeBtn} = this.state;
        return (
            <TouchableOpacity
                style={[
                    s.btnContainer,
                    activeBtn == index ? {backgroundColor: PRIMARY_COLOR} : {},
                ]}
                onPress={() => callback && callback()}
                onPressIn={() => this.setState({activeBtn: index})}
                onPressOut={() => this.setState({activeBtn: null})}
                activeOpacity={1}>
                {icon == 'search' ? (
                    <Icon
                        name={icon}
                        size={50}
                        color={activeBtn == index ? 'white' : PRIMARY_COLOR}
                        style={s.btnIcon}
                    />
                ) : (
                    <FontAwesome
                        name={icon}
                        size={50}
                        color={activeBtn == index ? 'white' : PRIMARY_COLOR}
                        style={s.btnIcon}
                    />
                )}
                <Text
                    style={[
                        s.btnLabel,
                        activeBtn == index ? {color: 'white'} : {},
                    ]}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }
    onSuccess = e => {
        const {t} = this.props;
        this.setState({page: 0});
        console.log('🚀 ~ file: index.js ~ line 69 ~ QRCode ~ e.data ', e.data);
        if (e.data && typeof e.data === 'string') {
            const club_id = this.getClubID(e.data);
            console.log('club_id', club_id);
            if (club_id) {
                this.props.navigation.navigate('ClubDetail', {club_id});
                return;
            }
        }
        alert(t('invalidclub'));
    };
    getClubID(url) {
        if (!url || !url.includes('/')) return null;
        url = url.split('/');
        return parseInt(url[url.length - 1], 10);
    }
    render() {
        const {t} = this.props;
        return (
            <QRCodeScanner
                showMarker
                reactivate
                reactivateTimeout={2000}
                onRead={this.onSuccess}
                topContent={
                    <Text
                        style={[
                            s.BackButtonLabel,
                            {
                                color: PRIMARY_COLOR,
                                paddingHorizontal: 32,
                                paddingVertical: 10,
                                zIndex: 99999,
                                backgroundColor: BACKGROUND_COLOR,
                            },
                        ]}>
                        {t('qrdescription')}
                    </Text>
                }
                bottomContent={
                    <TouchableOpacity
                        style={s.BackButton}
                        onPress={() => this.props.navigation.goBack()}>
                        <Text style={s.BackButtonLabel}>{t('cancel')}</Text>
                    </TouchableOpacity>
                }
                containerStyle={{backgroundColor: BACKGROUND_COLOR}}
            />
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(hoistStatics(withTranslation('qrcodepage')(QRCode), QRCode));
