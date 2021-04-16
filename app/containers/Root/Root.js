import React from 'react';
import {StatusBar, View, BackHandler} from 'react-native';
import {RootNavigator} from '../../navigation/AppNavigator';
import {connect} from 'react-redux';
import s from './Styles';
import {loadToken} from '../../reducers/user';
import {goBack} from '../../reducers/nav';
import {withTranslation} from 'react-i18next';

class RootContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid.bind(this),
        );
        this.props.loadToken();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid,
        );
    }

    handleBackButtonPressAndroid = () => {
        try {
            this.props.goBack();
        } catch (err) {}
        return true;
    };

    render() {
        const {user} = this.props;
        return (
            <View style={s.applicationView}>
                <StatusBar barStyle="dark-content" />
                <RootNavigator screenProps={{t: this.props.t, user}} />
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
    nav: state.nav,
});

const mapDispatchToProps = {
    loadToken,
    goBack,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation('common')(RootContainer));
