import React from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import s from './styles';
import HomeIcon from '../../assets/icon_home.png';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
class LetsScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
    });
    render() {
        const {t, user} = this.props;
        if (user) this.props.navigation.navigate('App');
        return (
            <View style={s.container}>
                <View style={s.content}>
                    <Image style={s.logoImg} source={HomeIcon} />
                    <View>
                        <Text style={s.title}>{t('title')}</Text>
                        <Text style={s.description}>{t('description')}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={s.btn}
                    onPress={() => this.props.navigation.navigate('Intro')}>
                    <Text style={s.btnLabel}>{t('btn_lets')}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
// export default withTranslation('startpage')(LetsScreen);

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(
    withTranslation('startpage')(LetsScreen),
);
