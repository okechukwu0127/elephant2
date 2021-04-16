import React from 'react';
import {View, Image} from 'react-native';
import s from './styles';
import SpashImage from '../../assets/splash.png';
import {connect} from 'react-redux';

class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }
    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        setTimeout(() => {
            this.props.navigation.navigate('Auth');
        }, 2000);
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={s.container}>
                <Image style={s.logoImg} source={SpashImage} />
            </View>
        );
    }
}
const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AuthLoadingScreen);
