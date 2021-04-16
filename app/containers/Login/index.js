import React from 'react';
import s from './styles';
import Modal from 'react-native-modal';
import {appleLogin, googleLogin, updateUser} from '../../reducers/user';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import Auth from './auth';

class AuthModal extends React.Component {
    onClose() {
        this.props.onClose();
    }
    render() {
        return (
            <Modal
                isVisible={this.props.isVisible}
                onBackButtonPress={() => this.onClose()}
                onBackdropPress={() => this.onClose()}
                onSwipeComplete={() => this.onClose()}
                swipeDirection={['down']}
                style={s.modal}
                avoidKeyboard>
                <Auth {...this.props} />
            </Modal>
        );
    }
}
const mapStateToProps = state => ({
    user: state.user.user,
});

const mapDispatchToProps = {
    appleLogin,
    googleLogin,
    updateUser,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation('authmodal')(AuthModal));
